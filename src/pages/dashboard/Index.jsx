import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { Settings, BarChart3, Users, Shield, ExternalLink, Plus } from 'lucide-react'
import { validateEnvVars } from '../../utils'
import { OnboardingWizard } from '../../components/dashboard/OnboardingWizard'

export default function DashboardIndex() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showOnboarding, setShowOnboarding] = useState(false)
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
        const u = data?.user ?? data
        setUser(u)
      } catch {
        navigate('/auth/login', { replace: true })
      } finally {
        setLoading(false)
      }
    }
    run()
  }, [navigate])

  useEffect(() => {
    // Check if user should see onboarding
    if (user) {
      const dismissed = localStorage.getItem('botspot_onboarding_dismissed')
      const role = user?.user_metadata?.role || user?.app_metadata?.role || 'Daily User'
      
      // Show onboarding for Daily Users who haven't dismissed it
      if (String(role).toLowerCase() === 'daily user' && !dismissed) {
        setShowOnboarding(true)
      }
    }
  }, [user])

  if (loading) {
    return (
      <div className="grid place-items-center min-h-[40vh] text-gray-600 dark:text-gray-300">Loading…</div>
    )
  }

  const email = user?.email || 'User'
  const roleRaw = user?.user_metadata?.role || user?.app_metadata?.role || 'Daily User'
  const role = typeof roleRaw === 'string' ? roleRaw : 'Daily User'
  const isAdmin = String(role).toLowerCase() === 'admin'
  const isDailyUser = String(role).toLowerCase() === 'daily user'
  const isManager = String(role).toLowerCase() === 'manager'
  const isDeveloper = String(role).toLowerCase() === 'developer'

  const sampleApps = [
    {
      name: 'Reddit',
      description: 'Automate posts and comments on Reddit communities',
      icon: '🔥',
      color: 'from-orange-500 to-red-500',
      connected: false
    },
    {
      name: 'LinkedIn',
      description: 'Professional networking and content automation',
      icon: '💼',
      color: 'from-blue-600 to-blue-700',
      connected: false
    },
    {
      name: 'Spotify',
      description: 'Music playlist management and discovery',
      icon: '🎵',
      color: 'from-green-500 to-green-600',
      connected: false
    },
    {
      name: 'X (Twitter)',
      description: 'Tweet scheduling and engagement automation',
      icon: '🐦',
      color: 'from-gray-600 to-gray-700',
      connected: false
    }
  ]

  const handleConnectApp = (appName) => {
    // Placeholder for app connection logic
    alert(`Connecting to ${appName} - Feature coming soon!`)
  }

  const handleOnboardingDismiss = () => {
    setShowOnboarding(false)
  }

  const handleOnboardingStepComplete = (stepId) => {
    console.log(`Onboarding step completed: ${stepId}`)
  }

  return (
    <div className="space-y-6">
      {/* Onboarding Wizard for Daily Users */}
      {showOnboarding && isDailyUser && (
        <OnboardingWizard
          user={user}
          onDismiss={handleOnboardingDismiss}
          onStepComplete={handleOnboardingStepComplete}
        />
      )}

      {/* Email verification warning */}
      {user?.email_confirmed_at == null && (
        <motion.div
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-frosted rounded-2xl p-4 border-l-4 border-amber-500"
        >
          <div className="flex items-center gap-2">
            <span className="text-amber-500">⚠️</span>
            <p className="text-sm text-amber-800 dark:text-amber-200">
              Your email isn't verified yet. Check your inbox or{' '}
              <Link to="/auth/login" className="underline hover:no-underline">
                resend verification
              </Link>
              .
            </p>
          </div>
        </motion.div>
      )}

      {/* Welcome Section */}
      <motion.section
        initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: shouldReduceMotion ? 0 : 0.25 }}
        className="glass-liquid rounded-2xl p-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold mb-1 text-gray-900 dark:text-white">
              Welcome, {email.split('@')[0]}
            </h2>
            <p className="text-gray-600 dark:text-gray-300">Role: {role}</p>
            {user?.email_confirmed_at && (
              <p className="text-sm text-green-600 dark:text-green-400 mt-1 flex items-center gap-1">
                ✅ Email verified
              </p>
            )}
          </div>
          <div className="flex items-center gap-2">
            {isAdmin && (
              <Link
                to="/admin"
                className="flex items-center gap-2 px-3 py-2 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/30 transition-colors ring-focus"
              >
                <Shield className="w-4 h-4" />
                <span className="text-sm font-medium">Admin</span>
              </Link>
            )}
            {isManager && (
              <Link
                to="/manager"
                className="flex items-center gap-2 px-3 py-2 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/30 transition-colors ring-focus"
              >
                <Users className="w-4 h-4" />
                <span className="text-sm font-medium">Team</span>
              </Link>
            )}
            {isDeveloper && (
              <Link
                to="/developer"
                className="flex items-center gap-2 px-3 py-2 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-lg hover:bg-green-200 dark:hover:bg-green-900/30 transition-colors ring-focus"
              >
                <BarChart3 className="w-4 h-4" />
                <span className="text-sm font-medium">Dev Tools</span>
              </Link>
            )}
          </div>
        </div>
      </motion.section>

      {/* Connected Apps Section */}
      <motion.section
        initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: shouldReduceMotion ? 0 : 0.25, delay: 0.1 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Connected Apps
          </h3>
          <button className="flex items-center gap-2 text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 ring-focus rounded">
            <Plus className="w-4 h-4" />
            Add App
          </button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {sampleApps.map((app, index) => (
            <motion.div
              key={app.name}
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: shouldReduceMotion ? 0 : 0.25, delay: 0.1 + index * 0.05 }}
              className="glass-frosted rounded-xl p-4 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${app.color} flex items-center justify-center text-white text-lg`}>
                  {app.icon}
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    {app.name}
                  </h4>
                  {app.connected && (
                    <span className="text-xs text-green-600 dark:text-green-400">
                      Connected
                    </span>
                  )}
                </div>
              </div>
              
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                {app.description}
              </p>
              
              <button
                onClick={() => handleConnectApp(app.name)}
                disabled={app.connected}
                className={`w-full py-2 px-3 rounded-lg text-sm font-medium transition-colors ring-focus ${
                  app.connected
                    ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 cursor-default'
                    : 'bg-primary-100 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 hover:bg-primary-200 dark:hover:bg-primary-900/30'
                }`}
              >
                {app.connected ? 'Connected' : 'Connect'}
              </button>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.25, delay: 0.2 }}
          className="glass rounded-2xl p-5"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="font-medium text-gray-900 dark:text-white">Features</h3>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">Explore what you can do.</p>
          <Link to="/features" className="btn-primary inline-flex items-center gap-2">
            <span>Explore</span>
            <ExternalLink className="w-3 h-3" />
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.25, delay: 0.25 }}
          className="glass rounded-2xl p-5"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
              <Settings className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            </div>
            <h3 className="font-medium text-gray-900 dark:text-white">Settings</h3>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">Manage your profile and preferences.</p>
          <button className="btn-secondary inline-flex items-center gap-2">
            <span>Configure</span>
            <Settings className="w-3 h-3" />
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.25, delay: 0.3 }}
          className="glass rounded-2xl p-5"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
              <Users className="w-4 h-4 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="font-medium text-gray-900 dark:text-white">Support</h3>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">Get help and documentation.</p>
          <Link to="/about" className="btn-secondary inline-flex items-center gap-2">
            <span>Contact</span>
            <ExternalLink className="w-3 h-3" />
          </Link>
        </motion.div>
      </div>

      {/* Role-specific Section */}
      <motion.section
        initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: shouldReduceMotion ? 0 : 0.25, delay: 0.35 }}
        className="glass-frosted rounded-2xl p-6"
      >
        {isAdmin && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <Shield className="w-5 h-5 text-red-500" />
              Admin Dashboard
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Manage users, system settings, and monitor platform health.
            </p>
            <div className="flex gap-3">
              <Link to="/admin" className="btn-primary">
                Admin Panel
              </Link>
              <Link to="/admin/users" className="btn-secondary">
                User Management
              </Link>
            </div>
          </div>
        )}
        
        {isManager && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-500" />
              Manager Dashboard
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Oversee team performance and manage automation workflows.
            </p>
            <div className="flex gap-3">
              <Link to="/manager" className="btn-primary">
                Team Overview
              </Link>
              <Link to="/manager/team" className="btn-secondary">
                Team Management
              </Link>
            </div>
          </div>
        )}
        
        {isDeveloper && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-green-500" />
              Developer Dashboard
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Access API documentation, bot development tools, and analytics.
            </p>
            <div className="flex gap-3">
              <Link to="/developer" className="btn-primary">
                Dev Console
              </Link>
              <Link to="/developer/api" className="btn-secondary">
                API Docs
              </Link>
            </div>
          </div>
        )}
        
        {isDailyUser && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              Your BotSpot Experience
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Connect your social accounts and start automating your online presence.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-primary-50 dark:bg-primary-900/20 rounded-lg p-3">
                <h4 className="text-sm font-medium text-primary-700 dark:text-primary-300 mb-1">
                  Getting Started
                </h4>
                <p className="text-xs text-primary-600 dark:text-primary-400">
                  Follow the onboarding wizard to set up your first automation.
                </p>
              </div>
              <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3">
                <h4 className="text-sm font-medium text-green-700 dark:text-green-300 mb-1">
                  Next Steps
                </h4>
                <p className="text-xs text-green-600 dark:text-green-400">
                  Connect apps and explore automation templates.
                </p>
              </div>
            </div>
          </div>
        )}
      </motion.section>
    </div>
  )
}
