import { validateEnvVars } from './index'

const hasEnv = validateEnvVars(['VITE_API_BASE'])
const API_BASE = import.meta.env.VITE_API_BASE || '/api'

export async function apiFetch(path, init = {}) {
  const headers = new Headers(init.headers || {})
  if (!headers.has('Content-Type')) headers.set('Content-Type', 'application/json')

  const res = await fetch(path.startsWith('http') ? path : `${API_BASE}${path.replace(/^\//, '') ? '/' + path.replace(/^\//, '') : ''}` , {
    credentials: 'include',
    ...init,
    headers,
  })

  const contentType = res.headers.get('content-type') || ''
  const isJSON = contentType.includes('application/json')
  const data = isJSON ? await res.json().catch(() => null) : null

  if (!res.ok) {
    return { ok: false, status: res.status, error: data?.error || data?.message || res.statusText }
  }

  return { ok: true, status: res.status, data }
}
