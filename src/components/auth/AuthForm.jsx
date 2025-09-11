import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { Eye, EyeOff, Mail, AlertTriangle, CheckCircle, RefreshCw, User } from 'lucide-react'
import { validateEnvVars } from '../../utils'
import { PasswordStrength } from './PasswordStrength'

export function AuthForm({ mode = 'login' }) {
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const [resendLoading, setResendLoading] = useState(false)
  const [showResendVerification, setShowResendVerification] = useState(false)
  const [showPasswordReset, setShowPasswordReset] = useState(false)
  const shouldReduceMotion = useReducedMotion()

  validateEnvVars(['VITE_API_BASE'])

  // Check for initial states from navigation
  useEffect(() => {
    if (location.state?.message) {
      // Check if message should be shown as error or success
      const message = location.state.message
      if (message.includes('Access denied') || message.includes('expired') || message.includes('error')) {
        setError(message)
      } else {
        setSuccess(message)
      }
    }
    if (location.state?.showResendVerification) {
      setShowResendVerification(true)
    }
    if (location.state?.showPasswordReset) {
      setShowPasswordReset(true)
    }
  }, [location.state])

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    const base = import.meta.env.VITE_API_BASE
    const endpoint = mode === 'register' ? `${base}/auth/register` : `${base}/auth/login`

    try {
      // basic client validation
      const emailOk = /.+@.+\..+/.test(email)
      if (!emailOk) {
        setError('Please enter a valid email address')
        setLoading(false)
        return
      }
      if (password.length < 6) {
        setError('Password must be at least 6 characters')
        setLoading(false)
        return
      }

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json().catch(() => ({ error: 'Authentication failed' }))

      if (!res.ok) {
        // Handle specific error cases
        const errorMsg = data.error || data.message || 'Authentication failed'

        if (mode === 'login' && errorMsg.toLowerCase().includes('email not confirmed')) {
          setError('Please verify your email address before signing in.')
          setShowResendVerification(true)
        } else if (mode === 'login' && errorMsg.toLowerCase().includes('invalid login')) {
          setError('Invalid email or password. Please check your credentials.')
        } else if (mode === 'register' && errorMsg.toLowerCase().includes('already registered')) {
          setError('An account with this email already exists. Please sign in instead.')
        } else {
          setError(errorMsg)
        }
      } else {
        if (mode === 'register') {
          setSuccess('Account created successfully! Please check your email to verify your account.')
          // Don't navigate immediately for register, let user verify email
        } else {
          const to = location.state?.from?.pathname || '/dashboard'
          navigate(to, { replace: true })
        }
      }
    } catch (err) {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleResendVerification = async () => {
    if (!email || !/.+@.+\..+/.test(email)) {
      setError('Please enter a valid email address first')
      return
    }

    setResendLoading(true)
    setError('')

    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE}/auth/resend-verification`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email }),
      })

      if (res.ok) {
        setSuccess('Verification email sent! Please check your inbox.')
        setShowResendVerification(false)
      } else {
        setError('Failed to send verification email. Please try again.')
      }
    } catch (err) {
      setError('Network error. Please try again.')
    } finally {
      setResendLoading(false)
    }
  }

  const handlePasswordReset = async () => {
    if (!email || !/.+@.+\..+/.test(email)) {
      setError('Please enter a valid email address first')
      return
    }

    // This would typically call a password reset endpoint
    // For now, show a message that the feature is coming soon
    setSuccess('Password reset functionality coming soon. Please contact support for assistance.')
    setShowPasswordReset(false)
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
          <motion.div
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : -5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.2 }}
            role="alert"
            className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 flex items-start gap-2"
          >
            <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
            <span className="text-sm text-red-600 dark:text-red-400">{error}</span>
          </motion.div>
        )}

        {success && (
          <motion.div
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : -5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.2 }}
            role="alert"
            className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3 flex items-start gap-2"
          >
            <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
            <span className="text-sm text-green-600 dark:text-green-400">{success}</span>
          </motion.div>
        )}

        {showResendVerification && (
          <motion.div
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : -5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.2 }}
            className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 flex items-start gap-2"
          >
            <Mail className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
            <div className="flex-1 text-sm text-blue-600 dark:text-blue-400">
              <p className="mb-2">Need to verify your email?</p>
              <button
                onClick={handleResendVerification}
                disabled={resendLoading}
                className="inline-flex items-center gap-1 text-blue-700 dark:text-blue-300 hover:underline ring-focus rounded disabled:opacity-50"
              >
                {resendLoading ? (
                  <RefreshCw className="w-3 h-3 animate-spin" />
                ) : (
                  <Mail className="w-3 h-3" />
                )}
                {resendLoading ? 'Sending...' : 'Resend verification email'}
              </button>
            </div>
          </motion.div>
        )}

        {showPasswordReset && (
          <motion.div
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : -5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.2 }}
            className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3 flex items-start gap-2"
          >
            <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
            <div className="flex-1 text-sm text-amber-600 dark:text-amber-400">
              <p className="mb-2">Forgot your password?</p>
              <button
                onClick={handlePasswordReset}
                className="text-amber-700 dark:text-amber-300 hover:underline ring-focus rounded"
              >
                Reset password
              </button>
            </div>
          </motion.div>
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

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600 dark:text-gray-300">
          {mode === 'register' ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button
            onClick={() => navigate(mode === 'register' ? '/auth/login' : '/auth/register')}
            className="text-primary-600 dark:text-primary-400 hover:underline ring-focus rounded"
          >
            {mode === 'register' ? 'Sign in' : 'Create account'}
          </button>
        </p>

        {mode === 'login' && (
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
            <button
              onClick={() => setShowPasswordReset(true)}
              className="text-primary-600 dark:text-primary-400 hover:underline ring-focus rounded"
            >
              Forgot your password?
            </button>
          </p>
        )}
      </div>
    </div>
  )
}
