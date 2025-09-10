import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { validateEnvVars } from '../../utils'

export function ProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true)
  const [authorized, setAuthorized] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const shouldReduceMotion = useReducedMotion()

  useEffect(() => {
    validateEnvVars(['VITE_API_BASE'])

    const verify = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE}/auth/verify`, {
          credentials: 'include',
        })
        const data = await res.json().catch(() => ({}))
        if (res.ok && data && data.loggedIn) {
          setAuthorized(true)
        } else {
          navigate('/auth/login', { replace: true, state: { from: location } })
        }
      } catch (e) {
        navigate('/auth/login', { replace: true, state: { from: location } })
      } finally {
        setLoading(false)
      }
    }

    verify()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (loading) {
    return (
      <div className="min-h-[60vh] grid place-items-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.3 }}
          className="text-gray-600 dark:text-gray-300"
          role="status"
          aria-live="polite"
        >
          Checking session…
        </motion.div>
      </div>
    )
  }

  if (!authorized) return null

  return children
}
