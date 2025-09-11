import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { Loader2, Shield } from 'lucide-react'
import { validateEnvVars } from '../../utils'

export function AdminRoute({ children }) {
  const [ok, setOk] = useState(false)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const location = useLocation()
  const shouldReduceMotion = useReducedMotion()

  useEffect(() => {
    validateEnvVars(['VITE_API_BASE'])
    const run = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE}/auth/verify`, { credentials: 'include' })
        const data = await res.json().catch(() => ({}))
        const role = data?.user?.role || data?.user?.user_metadata?.role || data?.user?.app_metadata?.role
        if (res.ok && data?.loggedIn && String(role).toLowerCase() === 'admin') {
          setOk(true)
        } else if (res.ok && data?.loggedIn) {
          // User is logged in but not admin, redirect to dashboard
          navigate('/dashboard', {
            replace: true,
            state: {
              message: 'Access denied. Admin privileges required.'
            }
          })
        } else {
          // User not logged in, redirect to login
          navigate('/auth/login', {
            replace: true,
            state: {
              from: location,
              message: 'Please sign in with an admin account to access this page.'
            }
          })
        }
      } catch (error) {
        console.error('Admin auth verification error:', error)
        navigate('/auth/login', {
          replace: true,
          state: {
            from: location,
            message: 'Authentication error. Please sign in again.'
          }
        })
      } finally {
        setLoading(false)
      }
    }
    run()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (loading) {
    return (
      <div className="min-h-[60vh] grid place-items-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.3 }}
          className="flex items-center gap-3 text-gray-600 dark:text-gray-300"
          role="status"
          aria-live="polite"
        >
          <div className="relative">
            <Shield className="w-5 h-5" />
            <Loader2 className="w-3 h-3 animate-spin absolute -top-1 -right-1" />
          </div>
          <span>Verifying admin access…</span>
        </motion.div>
      </div>
    )
  }

  if (!ok) return null
  return children
}
