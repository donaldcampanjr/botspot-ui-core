export default {
  async fetch(request, env) {
    const url = new URL(request.url)
    const { pathname } = url

    const corsHeaders = {
      'Access-Control-Allow-Origin': env.APP_BASE_URL,
      'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, apikey',
      'Access-Control-Allow-Credentials': 'true',
    }

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders })
    }

    // Helpers
    const RATE = { windowMs: 5 * 60 * 1000, max: 10 }
    const ip = request.headers.get('CF-Connecting-IP') || request.headers.get('x-forwarded-for') || 'anon'
    // @ts-ignore - global scope persistence within instance
    self.__ipHits = self.__ipHits || new Map()
    function isRateLimited(bucket) {
      const key = `${ip}:${bucket}`
      const now = Date.now()
      const arr = self.__ipHits.get(key) || []
      const fresh = arr.filter((t) => now - t < RATE.windowMs)
      if (fresh.length >= RATE.max) return true
      fresh.push(now)
      self.__ipHits.set(key, fresh)
      return false
    }

    async function parseBody(req) {
      try { return await req.json() } catch { return {} }
    }
    function withHeaders(extra = {}) {
      return { ...corsHeaders, ...extra }
    }
    async function supabaseFetch(endpoint, method, body, key = env.SUPABASE_ANON_KEY) {
      return fetch(`${env.SUPABASE_URL}${endpoint}`, {
        method,
        headers: {
          'Content-Type': 'application/json',
          apikey: key,
          Authorization: `Bearer ${key}`,
        },
        body: body ? JSON.stringify(body) : undefined,
      })
    }
    async function sendWelcomeEmail(email) {
      if (!env.RESEND_API_KEY || !env.RESEND_FROM) return
      try {
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${env.RESEND_API_KEY}`,
          },
          body: JSON.stringify({
            from: env.RESEND_FROM,
            to: email,
            subject: 'Welcome to BotSpot 🎉',
            html: `<p>Hi ${email}, welcome to BotSpot! Your account is ready.</p>`
          }),
        })
      } catch {}
    }

    // Health check
    if (pathname === '/api/auth/hello') {
      return new Response(JSON.stringify({ message: 'Worker is live ✅' }), {
        headers: withHeaders({ 'Content-Type': 'application/json' }),
      })
    }

    // REGISTER
    if (pathname === '/api/auth/register' && request.method === 'POST') {
      if (isRateLimited('register')) {
        return new Response(JSON.stringify({ error: 'Too many requests' }), {
          status: 429,
          headers: withHeaders({ 'Content-Type': 'application/json' }),
        })
      }
      const { email, password } = await parseBody(request)
      if (!email || !password) {
        return new Response(JSON.stringify({ error: 'Email and password required' }), {
          status: 400,
          headers: withHeaders({ 'Content-Type': 'application/json' }),
        })
      }

      const res = await supabaseFetch('/auth/v1/signup', 'POST', { email, password })
      const data = await res.json().catch(() => ({}))

      if (!res.ok) {
        const errorMsg = data?.msg || data?.error_description || 'Registration failed'
        return new Response(JSON.stringify({
          error: errorMsg,
          debug: {
            status: res.status,
            response: data,
            timestamp: new Date().toISOString()
          }
        }), {
          status: res.status,
          headers: withHeaders({ 'Content-Type': 'application/json' }),
        })
      }

      // Ensure we have user data from Supabase response
      let user = data?.user || null
      const debugInfo = {
        roleEnrichmentAttempts: [],
        emailSent: false,
        autoLogin: false
      }

      // Assign default role in DB (service role bypasses RLS)
      // If this fails, log but do not block user creation
      if (env.SUPABASE_SERVICE_ROLE_KEY && user?.id) {
        try {
          const roleRes = await fetch(`${env.SUPABASE_URL}/rest/v1/user_roles`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              apikey: env.SUPABASE_SERVICE_ROLE_KEY,
              Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
              Prefer: 'return=minimal',
            },
            body: JSON.stringify({ user_id: user.id, role: 'Daily User' }),
          })
          debugInfo.roleEnrichmentAttempts.push({
            type: 'role_table_insert',
            success: roleRes.ok,
            status: roleRes.status
          })
        } catch (error) {
          debugInfo.roleEnrichmentAttempts.push({
            type: 'role_table_insert',
            success: false,
            error: error.message || 'Unknown error'
          })
        }

        try {
          const metadataRes = await fetch(`${env.SUPABASE_URL}/auth/v1/admin/users/${user.id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              apikey: env.SUPABASE_SERVICE_ROLE_KEY,
              Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
            },
            body: JSON.stringify({ user_metadata: { ...(user.user_metadata || {}), role: 'Daily User' } }),
          })
          debugInfo.roleEnrichmentAttempts.push({
            type: 'user_metadata_update',
            success: metadataRes.ok,
            status: metadataRes.status
          })

          // Update user object with role for consistent response
          if (metadataRes.ok) {
            user.user_metadata = { ...(user.user_metadata || {}), role: 'Daily User' }
            user.role = 'Daily User'
          }
        } catch (error) {
          debugInfo.roleEnrichmentAttempts.push({
            type: 'user_metadata_update',
            success: false,
            error: error.message || 'Unknown error'
          })
        }
      } else {
        debugInfo.roleEnrichmentAttempts.push({
          type: 'skipped',
          reason: !env.SUPABASE_SERVICE_ROLE_KEY ? 'No service role key' : 'No user ID'
        })
      }

      // Auto-login after successful signup
      const loginRes = await supabaseFetch('/auth/v1/token?grant_type=password', 'POST', { email, password })
      const loginData = await loginRes.json().catch(() => ({}))

      // Fire-and-forget welcome email (works even without RESEND_API_KEY)
      try {
        await sendWelcomeEmail(email)
        debugInfo.emailSent = !!env.RESEND_API_KEY
      } catch (error) {
        debugInfo.emailSent = false
      }

      if (loginRes.ok && loginData?.access_token) {
        debugInfo.autoLogin = true
        return new Response(JSON.stringify({
          success: true,
          user,
          debug: debugInfo
        }), {
          headers: withHeaders({
            'Content-Type': 'application/json',
            'Set-Cookie': `sb:token=${loginData.access_token}; HttpOnly; Path=/; SameSite=Lax${env.APP_BASE_URL && env.APP_BASE_URL.startsWith('https') ? '; Secure' : ''}`,
          }),
        })
      }

      // If cannot auto-login, still return success with user data
      debugInfo.autoLogin = false
      return new Response(JSON.stringify({
        success: true,
        user,
        debug: debugInfo
      }), {
        headers: withHeaders({ 'Content-Type': 'application/json' }),
      })
    }

    // LOGIN
    if (pathname === '/api/auth/login' && request.method === 'POST') {
      if (isRateLimited('login')) {
        return new Response(JSON.stringify({ error: 'Too many requests' }), {
          status: 429,
          headers: withHeaders({ 'Content-Type': 'application/json' }),
        })
      }
      const { email, password } = await parseBody(request)
      if (!email || !password) {
        return new Response(JSON.stringify({ error: 'Email and password required' }), {
          status: 400,
          headers: withHeaders({ 'Content-Type': 'application/json' }),
        })
      }

      const res = await supabaseFetch('/auth/v1/token?grant_type=password', 'POST', { email, password })
      const data = await res.json().catch(() => ({}))

      if (res.ok && data?.access_token) {
        return new Response(JSON.stringify({ success: true }), {
          headers: withHeaders({
            'Content-Type': 'application/json',
            'Set-Cookie': `sb:token=${data.access_token}; HttpOnly; Path=/; Secure; SameSite=Lax`,
          }),
        })
      }

      return new Response(JSON.stringify({ error: data?.error_description || 'Invalid credentials' }), {
        status: res.status,
        headers: withHeaders({ 'Content-Type': 'application/json' }),
      })
    }

    // LOGOUT
    if (pathname === '/api/auth/logout' && request.method === 'POST') {
      return new Response(JSON.stringify({ success: true }), {
        headers: withHeaders({
          'Content-Type': 'application/json',
          'Set-Cookie': `sb:token=; HttpOnly; Path=/; SameSite=Lax${env.APP_BASE_URL && env.APP_BASE_URL.startsWith('https') ? '; Secure' : ''}; Max-Age=0`,
        }),
      })
    }

    // VERIFY
    if (pathname === '/api/auth/verify') {
      const cookie = request.headers.get('Cookie') || ''
      const token = cookie.split('sb:token=')[1]?.split(';')[0]

      if (!token) {
        return new Response(JSON.stringify({ loggedIn: false }), {
          headers: withHeaders({ 'Content-Type': 'application/json' }),
        })
      }

      const res = await fetch(`${env.SUPABASE_URL}/auth/v1/user`, {
        headers: {
          apikey: env.SUPABASE_ANON_KEY,
          Authorization: `Bearer ${token}`,
        },
      })

      if (res.ok) {
        const user = await res.json()
        try {
          if (env.SUPABASE_SERVICE_ROLE_KEY && user?.id) {
            const r = await fetch(`${env.SUPABASE_URL}/rest/v1/user_roles?user_id=eq.${user.id}&select=role`, {
              headers: {
                apikey: env.SUPABASE_SERVICE_ROLE_KEY,
                Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
              },
            })
            const roles = await r.json().catch(() => [])
            const role = roles?.[0]?.role || 'Daily User'
            user.user_metadata = { ...(user.user_metadata || {}), role }
            user.role = role
          }
        } catch {}
        return new Response(JSON.stringify({ loggedIn: true, user }), {
          headers: withHeaders({ 'Content-Type': 'application/json' }),
        })
      }

      return new Response(JSON.stringify({ loggedIn: false }), {
        headers: withHeaders({ 'Content-Type': 'application/json' }),
      })
    }

    // RESEND VERIFICATION (optional)
    if (pathname === '/api/auth/resend-verification' && request.method === 'POST') {
      if (isRateLimited('resend')) {
        return new Response(JSON.stringify({ error: 'Too many requests' }), {
          status: 429,
          headers: withHeaders({ 'Content-Type': 'application/json' }),
        })
      }
      const { email } = await parseBody(request)
      if (!email) {
        return new Response(JSON.stringify({ error: 'Email required' }), {
          status: 400,
          headers: withHeaders({ 'Content-Type': 'application/json' }),
        })
      }
      try {
        if (env.RESEND_API_KEY && env.RESEND_FROM) {
          await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${env.RESEND_API_KEY}`,
            },
            body: JSON.stringify({
              from: env.RESEND_FROM,
              to: email,
              subject: 'Verify your BotSpot email',
              html: `<p>Hi ${email}, if your account requires verification, please check your inbox for the confirmation link. If you didn't request this, ignore this email.</p>`,
            }),
          })
        }
      } catch {}
      return new Response(JSON.stringify({ success: true }), {
        headers: withHeaders({ 'Content-Type': 'application/json' }),
      })
    }

    // VERIFY EMAIL (proxy to Supabase)
    if (pathname.startsWith('/api/auth/verify-email')) {
      const params = new URL(request.url).searchParams
      const token = params.get('token') || params.get('token_hash')
      if (!token) {
        return new Response(JSON.stringify({ error: 'Missing token' }), {
          status: 400,
          headers: withHeaders({ 'Content-Type': 'application/json' }),
        })
      }
      // Try both variants for compatibility
      let ok = false
      try {
        const r1 = await fetch(`${env.SUPABASE_URL}/auth/v1/verify?type=signup&token_hash=${encodeURIComponent(token)}`, {
          headers: { apikey: env.SUPABASE_ANON_KEY },
        })
        ok = r1.ok
      } catch {}
      if (!ok) {
        try {
          const r2 = await fetch(`${env.SUPABASE_URL}/auth/v1/verify`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', apikey: env.SUPABASE_ANON_KEY },
            body: JSON.stringify({ type: 'signup', token }),
          })
          ok = r2.ok
        } catch {}
      }
      return new Response(JSON.stringify({ success: ok }), {
        status: ok ? 200 : 400,
        headers: withHeaders({ 'Content-Type': 'application/json' }),
      })
    }

    // ME
    if (pathname === '/api/auth/me') {
      const cookie = request.headers.get('Cookie') || ''
      const token = cookie.split('sb:token=')[1]?.split(';')[0]

      if (!token) {
        return new Response(JSON.stringify({ loggedIn: false }), {
          status: 401,
          headers: withHeaders({ 'Content-Type': 'application/json' }),
        })
      }

      const res = await fetch(`${env.SUPABASE_URL}/auth/v1/user`, {
        headers: {
          apikey: env.SUPABASE_ANON_KEY,
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await res.json().catch(() => ({}))
      try {
        if (env.SUPABASE_SERVICE_ROLE_KEY && data?.id) {
          const r = await fetch(`${env.SUPABASE_URL}/rest/v1/user_roles?user_id=eq.${data.id}&select=role`, {
            headers: {
              apikey: env.SUPABASE_SERVICE_ROLE_KEY,
              Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
            },
          })
          const roles = await r.json().catch(() => [])
          const role = roles?.[0]?.role || 'Daily User'
          data.user_metadata = { ...(data.user_metadata || {}), role }
          data.role = role
        }
      } catch {}
      return new Response(JSON.stringify({ loggedIn: res.ok, user: data }), {
        status: res.status,
        headers: withHeaders({ 'Content-Type': 'application/json' }),
      })
    }

    // Default 404
    return new Response(JSON.stringify({ error: 'Not Found' }), {
      status: 404,
      headers: withHeaders({ 'Content-Type': 'application/json' }),
    })
  },
}
