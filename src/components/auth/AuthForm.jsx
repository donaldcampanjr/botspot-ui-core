import { useState, useMemo } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import clsx from 'clsx'

export function AuthForm({ mode = 'login', onSubmit, loading = false, error = '', success = '', defaultValues = {} }) {
  const [form, setForm] = useState({
    username: defaultValues.username || '',
    email: defaultValues.email || '',
    password: defaultValues.password || '',
  })
  const prefersReduced = useReducedMotion()

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
          onSubmit={(e) => { e.preventDefault(); if (canSubmit && onSubmit) onSubmit({ ...form }) }}
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
            disabled={!canSubmit || loading}
            className={clsx(
              'w-full btn-primary',
              'disabled:opacity-60 disabled:cursor-not-allowed'
            )}
            aria-busy={loading}
          >
            {loading ? (isRegister ? 'Creating account...' : 'Signing in...') : (isRegister ? 'Sign up' : 'Sign in')}
          </button>
        </form>

        <div className="mt-4 space-y-2" aria-live="polite" aria-atomic="true">
          <AnimatePresence>
            {error && (
              <motion.div
                key="error"
                initial={{ opacity: 0, y: prefersReduced ? 0 : 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: prefersReduced ? 0 : -8 }}
                transition={{ duration: 0.2 }}
                className="rounded-lg p-3 bg-red-500/20 border border-red-500/40 text-red-900 dark:text-red-100"
                role="alert"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>
          <AnimatePresence>
            {success && (
              <motion.div
                key="success"
                initial={{ opacity: 0, y: prefersReduced ? 0 : 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: prefersReduced ? 0 : -8 }}
                transition={{ duration: 0.2 }}
                className="rounded-lg p-3 bg-green-500/20 border border-green-500/40 text-green-900 dark:text-green-100"
                role="status"
              >
                {success}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </section>
  )
}
