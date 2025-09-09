import { useState, useMemo } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { validateEnvVars } from '../../utils/index.js'
import clsx from 'clsx'

const hasEnv = validateEnvVars(['VITE_API_BASE'])
const API_BASE = (import.meta.env.VITE_API_BASE || '').replace(/\/$/, '')

export function AuthForm({ mode = 'login', defaultValues = {} }) {
  const [form, setForm] = useState({
    username: defaultValues.username || '',
    email: defaultValues.email || '',
    password: defaultValues.password || '',
  })
  const prefersReduced = useReducedMotion()
  const navigate = useNavigate()

  const [submitting, setSubmitting] = useState(false)
  const [errMsg, setErrMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  const isRegister = mode === 'register'

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
  }

  const canSubmit = useMemo(() => {
    if (isRegister) return form.username && form.email && form.password
    return form.email && form.password
  }, [form, isRegister])

  const variants = {
    initial: { opacity: 0, y: prefersReduced ? 0 : 16 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: prefersReduced ? 0 : -16 },
  }

  const doSubmit = async () => {
    setErrMsg('')
    setSuccessMsg('')

    if (!API_BASE) {
      setErrMsg('Missing VITE_API_BASE environment variable')
      return
    }

    const endpoint = `${API_BASE}/auth/${isRegister ? 'register' : 'login'}`
    const payload = isRegister ? { username: form.username, email: form.email, password: form.password } : { email: form.email, password: form.password }

    setSubmitting(true)
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const contentType = res.headers.get('content-type') || ''
      const data = contentType.includes('application/json') ? await res.json().catch(() => null) : null
      if (!res.ok || (data && data.ok === false)) {
        setErrMsg(data?.error || data?.message || 'Request failed')
        return
      }
      if (isRegister) setSuccessMsg('Account created. Check your email to verify.')
      navigate('/dashboard')
    } catch (e) {
      setErrMsg('Network error. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="min-h-[60vh] flex items-center justify-center px-4 py-12">
      <motion.div
        initial="initial"
        animate="animate"
        exit="exit"
        variants={variants}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className={clsx(
          'w-full max-w-md glass-frosted rounded-xl p-6 sm:p-8',
          'bg-white/30 dark:bg-gray-900/30'
        )}
        role="form"
        aria-labelledby="auth-title"
      >
        <div className="mb-6 text-center">
          <h1 id="auth-title" className="text-2xl font-bold">{isRegister ? 'Create your account' : 'Welcome back'}</h1>
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
            {isRegister ? 'Sign up to start using BotSpot' : 'Sign in to continue to BotSpot'}
          </p>
        </div>

        <form
          onSubmit={(e) => { e.preventDefault(); if (canSubmit) doSubmit() }}
          className="space-y-4"
        >
          <AnimatePresence initial={false}>
            {isRegister && (
              <motion.div key="username" initial={{ opacity: 0, y: prefersReduced ? 0 : 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: prefersReduced ? 0 : -10 }} transition={{ duration: 0.2 }}>
                <label htmlFor="username" className="block text-sm font-medium mb-1">Username</label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  aria-label="Username"
                  required={isRegister}
                  value={form.username}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white/70 dark:bg-gray-800/70 backdrop-blur placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white ring-focus"
                />
              </motion.div>
            )}
          </AnimatePresence>

          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              aria-label="Email"
              required
              value={form.email}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white/70 dark:bg-gray-800/70 backdrop-blur placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white ring-focus"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-1">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete={isRegister ? 'new-password' : 'current-password'}
              aria-label="Password"
              required
              value={form.password}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white/70 dark:bg-gray-800/70 backdrop-blur placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white ring-focus"
            />
          </div>

          <button
            type="submit"
            disabled={!canSubmit || submitting}
            className={clsx(
              'w-full btn-primary',
              'disabled:opacity-60 disabled:cursor-not-allowed'
            )}
            aria-busy={submitting}
          >
            {submitting ? (isRegister ? 'Creating account...' : 'Signing in...') : (isRegister ? 'Sign up' : 'Sign in')}
          </button>
        </form>

        <div className="mt-4 space-y-2" aria-live="polite" aria-atomic="true">
          <AnimatePresence>
            {errMsg && (
              <motion.div
                key="error"
                initial={{ opacity: 0, y: prefersReduced ? 0 : 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: prefersReduced ? 0 : -8 }}
                transition={{ duration: 0.2 }}
                className="rounded-lg p-3 bg-red-500/20 border border-red-500/40 text-red-900 dark:text-red-100"
                role="alert"
              >
                {errMsg}
              </motion.div>
            )}
          </AnimatePresence>
          <AnimatePresence>
            {successMsg && (
              <motion.div
                key="success"
                initial={{ opacity: 0, y: prefersReduced ? 0 : 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: prefersReduced ? 0 : -8 }}
                transition={{ duration: 0.2 }}
                className="rounded-lg p-3 bg-green-500/20 border border-green-500/40 text-green-900 dark:text-green-100"
                role="status"
              >
                {successMsg}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </section>
  )
}
