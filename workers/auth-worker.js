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
        return new Response(JSON.stringify({ error: data?.msg || data?.error_description || 'Registration failed' }), {
          status: res.status,
          headers: withHeaders({ 'Content-Type': 'application/json' }),
        })
      }

      // Assign default role in DB (service role bypasses RLS)
      try {
        if (env.SUPABASE_SERVICE_ROLE_KEY && data?.user?.id) {
          await fetch(`${env.SUPABASE_URL}/rest/v1/user_roles`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              apikey: env.SUPABASE_SERVICE_ROLE_KEY,
              Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
              Prefer: 'return=minimal',
            },
            body: JSON.stringify({ user_id: data.user.id, role: 'Daily User' }),
          })
        }
      } catch {}

      // Auto-login after successful signup
      const loginRes = await supabaseFetch('/auth/v1/token?grant_type=password', 'POST', { email, password })
      const loginData = await loginRes.json().catch(() => ({}))

      // Fire-and-forget welcome email
      await sendWelcomeEmail(email)

      if (loginRes.ok && loginData?.access_token) {
        return new Response(JSON.stringify({ success: true }), {
          headers: withHeaders({
            'Content-Type': 'application/json',
            'Set-Cookie': `sb:token=${loginData.access_token}; HttpOnly; Path=/; SameSite=Lax${env.APP_BASE_URL && env.APP_BASE_URL.startsWith('https') ? '; Secure' : ''}`,
          }),
        })
      }

      // If cannot auto-login, still return success
      return new Response(JSON.stringify({ success: true }), {
        headers: withHeaders({ 'Content-Type': 'application/json' }),
      })
    }

    // LOGIN
    if (pathname === '/api/auth/login' && request.method === 'POST') {
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

    // ME
    if (pathname === '/api/auth/me') {
      const cookie = request.headers.get('Cookie') || ''
      const token = cookie.split('sb:token=')[1]?.split(';')[0]

      if (!token) {
        return new Response(JSON.stringify({ error: 'Not authenticated' }), {
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
      return new Response(JSON.stringify(data), {
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
