import { useEffect, useMemo, useState } from 'react'
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { Bot, Home, PanelsTopLeft, Info, Shield, LogOut } from 'lucide-react'
import { ThemeToggle } from '../components/ThemeToggle'
import { validateEnvVars } from '../utils'

export function DashboardLayout() {
  const [scrolled, setScrolled] = useState(false)
  const [role, setRole] = useState('Daily User')
  const navigate = useNavigate()
  const location = useLocation()
  const shouldReduceMotion = useReducedMotion()

  useEffect(() => {
    validateEnvVars(['VITE_API_BASE'])
  }, [])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    let isMounted = true
    const loadRole = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE}/auth/me`, {
          credentials: 'include',
        })
        if (!res.ok) return
        const user = await res.json()
        const raw = user?.user_metadata?.role || user?.app_metadata?.role || 'Daily User'
        if (isMounted) setRole(typeof raw === 'string' ? raw : 'Daily User')
      } catch {}
    }
    loadRole()
    return () => {
      isMounted = false
    }
  }, [])

  const isAdmin = useMemo(() => String(role || '').toLowerCase() === 'admin', [role])

  const navItems = useMemo(
    () => [
      { name: 'Dashboard', to: '/dashboard', icon: Home },
      { name: 'Features', to: '/features', icon: PanelsTopLeft },
      { name: 'About', to: '/about', icon: Info },
      ...(isAdmin ? [{ name: 'Admin', to: '/admin', icon: Shield }] : []),
    ],
    [isAdmin]
  )

  const handleLogout = async () => {
    try {
      await fetch(`${import.meta.env.VITE_API_BASE}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      })
    } catch {}
    navigate('/auth/login', { replace: true })
  }

  return (
    <div className="min-h-screen grid grid-rows-[auto_1fr] bg-surface-light dark:bg-surface-dark relative overflow-hidden">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-16 right-0 w-96 h-96 rounded-full bg-primary-400/15 dark:bg-primary-700/15 blur-3xl" />
      </div>
      {/* HUD top bar */}
      <motion.header
        initial={false}
        animate={{
          boxShadow: scrolled ? '0 10px 30px rgba(0,0,0,0.1)' : '0 0 0 rgba(0,0,0,0)',
          y: scrolled && !shouldReduceMotion ? -2 : 0,
        }}
        transition={{ duration: shouldReduceMotion ? 0 : 0.2 }}
        className="sticky top-0 z-40 glass-frosted"
        aria-label="Dashboard HUD"
      >
        <div className="container-app flex items-center justify-between py-3">
          <Link to="/dashboard" className="flex items-center gap-2 ring-focus rounded-lg px-1 py-1">
            <Bot className="w-7 h-7 text-primary-600" />
            <span className="text-lg font-semibold text-gray-900 dark:text-white">BotSpot</span>
          </Link>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <motion.button
              whileHover={{ scale: shouldReduceMotion ? 1 : 1.03 }}
              whileTap={{ scale: shouldReduceMotion ? 1 : 0.97 }}
              onClick={handleLogout}
              className="btn-secondary flex items-center gap-2"
              aria-label="Logout"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </motion.button>
          </div>
        </div>
      </motion.header>

      <div className="container-app grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-6 py-6 w-full">
        {/* Side navigation */}
        <nav aria-label="Dashboard navigation" className="hidden lg:block">
          <div className="glass rounded-2xl p-3 shadow-lg">
            <ul className="space-y-1">
              {navItems.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2 rounded-xl transition-colors duration-200 ring-focus ${
                        isActive || location.pathname === item.to
                          ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-white/20 dark:hover:bg-gray-800/40'
                      }`
                    }
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="font-medium">{item.name}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        {/* Content */}
        <main className="min-h-[60vh]">
          <motion.div
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.25 }}
            className="space-y-6"
          >
            <Outlet />
          </motion.div>
        </main>
      </div>

      {/* Bottom nav for small screens */}
      <nav aria-label="Mobile navigation" className="fixed bottom-4 inset-x-0 px-4 lg:hidden">
        <div className="mx-auto max-w-md glass-frosted rounded-2xl shadow-lg">
          <ul className="grid grid-cols-3 divide-x divide-white/10 dark:divide-gray-700/20">
            {navItems.slice(0, 3).map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center justify-center gap-2 py-3 ${
                      isActive || location.pathname === item.to
                        ? 'text-primary-600 dark:text-primary-400'
                        : 'text-gray-700 dark:text-gray-300'
                    }`
                  }
                >
                  <item.icon className="w-5 h-5" />
                  <span className="sr-only">{item.name}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </div>
  )
}
