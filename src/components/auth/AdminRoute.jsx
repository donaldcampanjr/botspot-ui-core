import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { validateEnvVars } from '../../utils'

export function AdminRoute({ children }) {
  const [ok, setOk] = useState(false)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    validateEnvVars(['VITE_API_BASE'])
    const run = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE}/auth/verify`, { credentials: 'include' })
        const data = await res.json().catch(() => ({}))
        const role = data?.user?.role || data?.user?.user_metadata?.role
        if (res.ok && data?.loggedIn && String(role).toLowerCase() === 'admin') {
          setOk(true)
        } else if (res.ok && data?.loggedIn) {
          navigate('/dashboard', { replace: true })
        } else {
          navigate('/auth/login', { replace: true, state: { from: location } })
        }
      } catch {
        navigate('/auth/login', { replace: true, state: { from: location } })
      } finally {
        setLoading(false)
      }
    }
    run()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (loading) return null
  if (!ok) return null
  return children
}
