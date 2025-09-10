import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { Eye, EyeOff } from 'lucide-react'
import { validateEnvVars } from '../../utils'
import { PasswordStrength } from './PasswordStrength'
import { useToast } from '../../contexts/ToastContext'

export function AuthForm({ mode = 'login' }) {
  const navigate = useNavigate()
  const location = useLocation()
  const { success, error, info } = useToast()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const shouldReduceMotion = useReducedMotion()

  validateEnvVars(['VITE_API_BASE'])

  const onSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    const base = import.meta.env.VITE_API_BASE
    const endpoint = mode === 'register' ? `${base}/auth/register` : `${base}/auth/login`

    try {
      // basic client validation
      const emailOk = /.+@.+\..+/.test(email)
      if (!emailOk) {
        error('Please enter a valid email address')
        setLoading(false)
        return
      }
      if (password.length < 6) {
        error('Password must be at least 6 characters')
        setLoading(false)
        return
      }

      // Show loading toast
      const loadingToast = info(
        mode === 'register' ? 'Creating your account...' : 'Signing you in...',
        { autoHide: false, title: 'Please wait' }
      )

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({ error: 'Authentication failed' }))
        let errorMsg = data.error || data.message || 'Authentication failed'

        // Handle specific Supabase error codes
        if (errorMsg.includes('email_already_registered') || errorMsg.includes('User already registered')) {
          errorMsg = 'An account with this email already exists. Try logging in instead.'
        } else if (errorMsg.includes('weak_password')) {
          errorMsg = 'Password is too weak. Please use a stronger password.'
        } else if (errorMsg.includes('signup_disabled')) {
          errorMsg = 'Registration is currently disabled.'
        } else if (errorMsg.includes('Invalid login credentials')) {
          errorMsg = 'Invalid email or password. Please check your credentials.'
        } else if (errorMsg.includes('email_not_confirmed')) {
          errorMsg = 'Please check your email and confirm your account before signing in.'
        }

        error(errorMsg)
      } else {
        // Success!
        const actionText = mode === 'register' ? 'Account created successfully!' : 'Welcome back!'
        success(actionText, {
          title: mode === 'register' ? 'Registration Complete' : 'Sign In Successful'
        })

        const to = location.state?.from?.pathname || '/dashboard'
        navigate(to, { replace: true })
      }
    } catch (err) {
      error('Network error. Please check your connection and try again.')
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
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete={mode === 'register' ? 'new-password' : 'current-password'}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pr-10 px-4 py-2 rounded-lg bg-white/60 dark:bg-gray-800/60 border border-white/30 dark:border-gray-700/30 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 ring-focus"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-md hover:bg-white/40 dark:hover:bg-gray-700/40 ring-focus"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          <PasswordStrength value={password} />
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
