import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { validateEnvVars } from '../../utils'

export function AuthForm({ mode = 'login' }) {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const shouldReduceMotion = useReducedMotion()

  validateEnvVars(['VITE_API_BASE'])

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const base = import.meta.env.VITE_API_BASE
    const endpoint = mode === 'register' ? `${base}/auth/register` : `${base}/auth/login`

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({ error: 'Authentication failed' }))
        setError(data.error || data.message || 'Authentication failed')
      } else {
        navigate('/dashboard', { replace: true })
      }
    } catch (err) {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md w-full mx-auto p-6 sm:p-8 glass-frosted rounded-2xl shadow-lg">
      <motion.h1
        initial={{ opacity: 0, y: shouldReduceMotion ? 0 : -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: shouldReduceMotion ? 0 : 0.3 }}
        className="text-2xl font-semibold text-gray-900 dark:text-white mb-6 text-center"
      >
        {mode === 'register' ? 'Create your account' : 'Welcome back'}
      </motion.h1>

      <form onSubmit={onSubmit} className="space-y-4" aria-label={mode === 'register' ? 'Register form' : 'Login form'}>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 rounded-lg bg-white/60 dark:bg-gray-800/60 border border-white/30 dark:border-gray-700/30 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 ring-focus"
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete={mode === 'register' ? 'new-password' : 'current-password'}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 rounded-lg bg-white/60 dark:bg-gray-800/60 border border-white/30 dark:border-gray-700/30 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 ring-focus"
            placeholder="••••••••"
          />
        </div>

        {error && (
          <div role="alert" className="text-sm text-red-600 dark:text-red-400">
            {error}
          </div>
        )}

        <motion.button
          type="submit"
          disabled={loading}
          whileHover={{ scale: loading || shouldReduceMotion ? 1 : 1.02 }}
          whileTap={{ scale: loading || shouldReduceMotion ? 1 : 0.98 }}
          className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-70"
          aria-busy={loading}
        >
          {loading && (
            <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" aria-hidden="true">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
            </svg>
          )}
          <span>{loading ? 'Please wait…' : mode === 'register' ? 'Create account' : 'Sign in'}</span>
        </motion.button>
      </form>
    </div>
  )
}
