import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { validateEnvVars } from '../../utils'

export default function DashboardIndex() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const shouldReduceMotion = useReducedMotion()

  useEffect(() => {
    validateEnvVars(['VITE_API_BASE'])
    const run = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE}/auth/me`, { credentials: 'include' })
        if (res.status === 401) {
          navigate('/auth/login', { replace: true })
          return
        }
        const data = await res.json()
        setUser(data)
      } catch {
        navigate('/auth/login', { replace: true })
      } finally {
        setLoading(false)
      }
    }
    run()
  }, [navigate])

  if (loading) {
    return (
      <div className="grid place-items-center min-h-[40vh] text-gray-600 dark:text-gray-300">Loading…</div>
    )
  }

  const email = user?.email || 'User'
  const roleRaw = user?.user_metadata?.role || user?.app_metadata?.role || 'Daily User'
  const role = typeof roleRaw === 'string' ? roleRaw : 'Daily User'
  const isAdmin = String(role).toLowerCase() === 'admin'

  return (
    <div className="space-y-6">
      <motion.section
        initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: shouldReduceMotion ? 0 : 0.25 }}
        className="glass-liquid rounded-2xl p-6"
      >
        <h2 className="text-xl font-semibold mb-1">Welcome, {email}</h2>
        <p className="text-gray-600 dark:text-gray-300">Role: {role}</p>
      </motion.section>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.25, delay: 0.05 }}
          className="glass rounded-2xl p-5"
        >
          <h3 className="font-medium mb-2">Features</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">Explore what you can do.</p>
          <Link to="/features" className="btn-primary inline-flex">Open Features</Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.25, delay: 0.1 }}
          className="glass rounded-2xl p-5"
        >
          <h3 className="font-medium mb-2">Account Settings</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">Manage your profile and preferences.</p>
          <Link to="/dashboard/settings" className="btn-secondary inline-flex">Open Settings</Link>
        </motion.div>
      </div>

      <motion.section
        initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: shouldReduceMotion ? 0 : 0.25, delay: 0.15 }}
        className="glass-frosted rounded-2xl p-6"
      >
        {isAdmin ? (
          <p className="text-gray-800 dark:text-gray-200">Admin Tools coming soon</p>
        ) : (
          <p className="text-gray-800 dark:text-gray-200">Basic Dashboard</p>
        )}
      </motion.section>
    </div>
  )
}
