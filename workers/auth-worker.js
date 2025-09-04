/**** Cloudflare Worker: Auth API backed by Supabase ****/
// Expected Environment Variables (set in Worker env):
// - SUPABASE_URL
// - SUPABASE_ANON_KEY
// - SUPABASE_SERVICE_ROLE_KEY
// - APP_BASE_URL (e.g. https://yourapp.com)
// - RESEND_API_KEY (optional)
// - RESEND_FROM (optional, e.g. "BotSpot <no-reply@yourdomain>")

const JSON_HEADERS = { 'content-type': 'application/json; charset=utf-8' }

function json(data, init = {}) { return new Response(JSON.stringify(data), { ...init, headers: { ...(init.headers || {}), ...JSON_HEADERS } }) }

function redirect(url, status = 302) { return Response.redirect(url, status) }

function requiredEnv(env, keys) {
  const missing = keys.filter((k) => !env[k])
  if (missing.length) {
    return { ok: false, error: `Missing environment variables: ${missing.join(', ')}` }
  }
  return { ok: true }
}

function setCookie(name, value, opts = {}) {
  const parts = [`${name}=${value}`]
  if (opts.maxAge !== undefined) parts.push(`Max-Age=${opts.maxAge}`)
  if (opts.path) parts.push(`Path=${opts.path}`)
  if (opts.domain) parts.push(`Domain=${opts.domain}`)
  if (opts.secure !== false) parts.push('Secure')
  if (opts.httpOnly !== false) parts.push('HttpOnly')
  parts.push(`SameSite=${opts.sameSite || 'Lax'}`)
  return parts.join('; ')
}

function clearCookie(name) {
  return `${name}=; Max-Age=0; Path=/; HttpOnly; Secure; SameSite=Lax`
}

async function supabaseLogin(env, { email, password }) {
  const res = await fetch(`${env.SUPABASE_URL}/auth/v1/token?grant_type=password`, {
    method: 'POST',
    headers: { ...JSON_HEADERS, apikey: env.SUPABASE_ANON_KEY },
    body: JSON.stringify({ email, password })
  })
  const data = await res.json().catch(() => null)
  if (!res.ok) return { ok: false, status: res.status, error: data?.error_description || data?.error || 'Login failed' }
  return { ok: true, data }
}

async function supabaseCreateUser(env, { email, password, username, verification_token }) {
  const res = await fetch(`${env.SUPABASE_URL}/auth/v1/admin/users`, {
    method: 'POST',
    headers: { ...JSON_HEADERS, Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}` },
    body: JSON.stringify({
      email,
      password,
      user_metadata: { username, email_verified: false, verification_token },
    })
  })
  const data = await res.json().catch(() => null)
  if (!res.ok) return { ok: false, status: res.status, error: data?.message || 'Signup failed' }
  return { ok: true, data }
}

async function supabaseGetAdminUser(env, userId) {
  const res = await fetch(`${env.SUPABASE_URL}/auth/v1/admin/users/${userId}`, {
    headers: { Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}` }
  })
  const data = await res.json().catch(() => null)
  if (!res.ok) return { ok: false, status: res.status, error: data?.message || 'User fetch failed' }
  return { ok: true, data }
}

async function supabaseUpdateAdminUser(env, userId, payload) {
  const res = await fetch(`${env.SUPABASE_URL}/auth/v1/admin/users/${userId}`, {
    method: 'PUT',
    headers: { ...JSON_HEADERS, Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}` },
    body: JSON.stringify(payload),
  })
  const data = await res.json().catch(() => null)
  if (!res.ok) return { ok: false, status: res.status, error: data?.message || 'User update failed' }
  return { ok: true, data }
}

async function insertDefaultRole(env, userId) {
  const res = await fetch(`${env.SUPABASE_URL}/rest/v1/user_roles`, {
    method: 'POST',
    headers: {
      ...JSON_HEADERS,
      apikey: env.SUPABASE_SERVICE_ROLE_KEY,
      Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
      Prefer: 'return=minimal'
    },
    body: JSON.stringify({ user_id: userId, role: 'Daily User' })
  })
  if (!res.ok) {
    return { ok: false, status: res.status, error: 'Failed to assign role (ensure user_roles table exists)' }
  }
  return { ok: true }
}

async function getUserWithRole(env, accessToken) {
  const ures = await fetch(`${env.SUPABASE_URL}/auth/v1/user`, {
    headers: { apikey: env.SUPABASE_ANON_KEY, Authorization: `Bearer ${accessToken}` }
  })
  const user = await ures.json().catch(() => null)
  if (!ures.ok) return { ok: false, status: ures.status, error: user?.error || 'Unauthorized' }

  const rres = await fetch(`${env.SUPABASE_URL}/rest/v1/user_roles?user_id=eq.${user.id}&select=role`, {
    headers: {
      apikey: env.SUPABASE_SERVICE_ROLE_KEY,
      Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`
    }
  })
  let role = 'Daily User'
  if (rres.ok) {
    const arr = await rres.json().catch(() => [])
    if (Array.isArray(arr) && arr[0]?.role) role = arr[0].role
  }
  return { ok: true, data: { user: { ...user, role } } }
}

function htmlFrosted(content) {
  const body = `<!doctype html><html><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width, initial-scale=1"/><title>Auth</title>
  <style>
  :root{color-scheme: light dark}
  body{margin:0;min-height:100vh;display:grid;place-items:center;background:#f3f4f6}
  @media (prefers-color-scheme: dark){body{background:#0f172a}}
  .card{max-width:28rem;margin:2rem;padding:1.25rem 1.5rem;border-radius:0.75rem;background:rgba(255,255,255,.2);backdrop-filter:blur(16px);border:1px solid rgba(255,255,255,.35);box-shadow:0 10px 40px rgba(0,0,0,.15);color:#111}
  @media (prefers-color-scheme: dark){.card{background:rgba(2,6,23,.2);border-color:rgba(30,41,59,.5);color:#e5e7eb}}
  .err{background:rgba(239,68,68,.18);border-color:rgba(239,68,68,.35);color:#7f1d1d}
  @media (prefers-color-scheme: dark){.err{color:#fecaca}}
  a{color:#2563eb}
  </style></head><body><div class="card">${content}</div></body></html>`
  return new Response(body, { headers: { 'content-type': 'text/html; charset=utf-8' } })
}

async function sendVerificationEmail(env, { to, username, token, userId }) {
  if (!env.RESEND_API_KEY || !env.RESEND_FROM) return { ok: false, skipped: true }
  const verifyUrl = `${env.APP_BASE_URL}/api/auth/verify?token=${encodeURIComponent(token)}&uid=${encodeURIComponent(userId)}`
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { ...JSON_HEADERS, Authorization: `Bearer ${env.RESEND_API_KEY}` },
    body: JSON.stringify({ from: env.RESEND_FROM, to, subject: 'Verify your BotSpot account', html: `<p>Hi ${username || ''},</p><p>Please verify your email by clicking the link below:</p><p><a href="${verifyUrl}">Verify Email</a></p>` })
  })
  if (!res.ok) return { ok: false, status: res.status }
  return { ok: true }
}

function randomToken(len = 32) {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let s = ''
  for (let i = 0; i < len; i++) s += chars[Math.floor(Math.random() * chars.length)]
  return s
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url)
    const path = url.pathname.replace(/\/$/, '')

    // Base env validation
    const check = requiredEnv(env, ['SUPABASE_URL', 'SUPABASE_ANON_KEY', 'SUPABASE_SERVICE_ROLE_KEY'])
    if (!check.ok) return json({ error: check.error }, { status: 500 })

    // Router
    if (request.method === 'POST' && path === '/api/auth/register') {
      const body = await request.json().catch(() => null)
      if (!body?.email || !body?.password || !body?.username) return json({ error: 'Missing fields' }, { status: 400 })

      const token = randomToken(40)
      const created = await supabaseCreateUser(env, { email: body.email, password: body.password, username: body.username, verification_token: token })
      if (!created.ok) return json({ error: created.error }, { status: 400 })
      const userId = created.data?.id

      // Assign default role (best-effort)
      await insertDefaultRole(env, userId)

      // Send verification email (best-effort)
      if (env.APP_BASE_URL) {
        await sendVerificationEmail(env, { to: body.email, username: body.username, token, userId })
      }

      // Login immediately to create a session cookies
      const login = await supabaseLogin(env, { email: body.email, password: body.password })
      const headers = new Headers(JSON_HEADERS)
      if (login.ok) {
        const { access_token, refresh_token, expires_in } = login.data
        headers.append('Set-Cookie', setCookie('sb_access_token', access_token, { path: '/', httpOnly: true, secure: true, sameSite: 'Lax', maxAge: expires_in || 3600 }))
        headers.append('Set-Cookie', setCookie('sb_refresh_token', refresh_token, { path: '/', httpOnly: true, secure: true, sameSite: 'Lax', maxAge: 60 * 60 * 24 * 30 }))
      }

      return new Response(JSON.stringify({ ok: true }), { status: 200, headers })
    }

    if (request.method === 'POST' && path === '/api/auth/login') {
      const body = await request.json().catch(() => null)
      if (!body?.email || !body?.password) return json({ error: 'Missing credentials' }, { status: 400 })
      const out = await supabaseLogin(env, { email: body.email, password: body.password })
      if (!out.ok) return json({ error: out.error }, { status: 401 })
      const { access_token, refresh_token, expires_in } = out.data
      const headers = new Headers(JSON_HEADERS)
      headers.append('Set-Cookie', setCookie('sb_access_token', access_token, { path: '/', httpOnly: true, secure: true, sameSite: 'Lax', maxAge: expires_in || 3600 }))
      headers.append('Set-Cookie', setCookie('sb_refresh_token', refresh_token, { path: '/', httpOnly: true, secure: true, sameSite: 'Lax', maxAge: 60 * 60 * 24 * 30 }))
      return new Response(JSON.stringify({ ok: true }), { status: 200, headers })
    }

    if (request.method === 'POST' && path === '/api/auth/logout') {
      const headers = new Headers(JSON_HEADERS)
      headers.append('Set-Cookie', clearCookie('sb_access_token'))
      headers.append('Set-Cookie', clearCookie('sb_refresh_token'))
      return new Response(JSON.stringify({ ok: true }), { status: 200, headers })
    }

    if (request.method === 'GET' && path === '/api/auth/me') {
      const cookies = request.headers.get('Cookie') || ''
      const match = cookies.match(/sb_access_token=([^;]+)/)
      if (!match) return json({ error: 'Unauthorized' }, { status: 401 })
      const access = decodeURIComponent(match[1])
      const me = await getUserWithRole(env, access)
      if (!me.ok) return json({ error: me.error }, { status: me.status || 401 })
      return json({ ok: true, user: me.data.user })
    }

    if (request.method === 'GET' && path === '/api/auth/verify') {
      const token = url.searchParams.get('token')
      const uid = url.searchParams.get('uid')
      if (!token || !uid) return htmlFrosted('<div class="card err"><h2>Invalid verification link</h2><p>Missing parameters.</p></div>')
      const u = await supabaseGetAdminUser(env, uid)
      if (!u.ok) return htmlFrosted('<div class="card err"><h2>Invalid or expired link</h2></div>')
      const meta = u.data?.user_metadata || {}
      if (!meta.verification_token || meta.verification_token !== token) {
        return htmlFrosted('<div class="card err"><h2>Invalid or expired link</h2></div>')
      }
      const updated = await supabaseUpdateAdminUser(env, uid, { user_metadata: { ...meta, email_verified: true, verification_token: null } })
      if (!updated.ok) return htmlFrosted('<div class="card err"><h2>Verification failed</h2></div>')
      if (env.APP_BASE_URL) return redirect(`${env.APP_BASE_URL}/dashboard?verified=true`, 302)
      return htmlFrosted('<div><h2>Verified!</h2><p>You can close this window and return to the app.</p></div>')
    }

    return json({ error: 'Not found' }, { status: 404 })
  }
}
