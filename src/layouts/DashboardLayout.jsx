import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { 
  Home, 
  BarChart3, 
  Settings, 
  Users, 
  Bot, 
  Menu, 
  X,
  ChevronLeft,
  Bell,
  Search
} from 'lucide-react'
import { ThemeToggle } from '../components/ThemeToggle'
import { useNavigate } from 'react-router-dom'
import { apiFetch } from '../utils/api'

export function DashboardLayout({ children, userRole = 'Daily User' }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const location = useLocation()

  // Define navigation based on user role
  const getDashboardNavigation = (role) => {
    const baseNav = [
      { name: 'Overview', href: '/dashboard', icon: Home },
      { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
    ]

    const roleSpecificNav = {
      'Daily User': [
        { name: 'My Bots', href: '/dashboard/bots', icon: Bot },
        { name: 'Settings', href: '/dashboard/settings', icon: Settings },
      ],
      'Admin': [
        { name: 'User Management', href: '/dashboard/users', icon: Users },
        { name: 'System Settings', href: '/dashboard/system', icon: Settings },
        { name: 'Bot Management', href: '/dashboard/bots', icon: Bot },
      ],
      'Manager': [
        { name: 'Team Overview', href: '/dashboard/team', icon: Users },
        { name: 'Bot Management', href: '/dashboard/bots', icon: Bot },
        { name: 'Settings', href: '/dashboard/settings', icon: Settings },
      ],
      'Developer': [
        { name: 'API Console', href: '/dashboard/api', icon: Settings },
        { name: 'Bot Development', href: '/dashboard/dev-bots', icon: Bot },
        { name: 'Documentation', href: '/dashboard/docs', icon: BarChart3 },
      ],
    }

    return [...baseNav, ...(roleSpecificNav[role] || roleSpecificNav['Daily User'])]
  }

  const navigation = getDashboardNavigation(userRole)
  const isActive = (href) => location.pathname === href

  return (
    <div className="h-screen flex bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{
          width: sidebarCollapsed ? 64 : 256,
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className={`relative flex flex-col bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 ${
          sidebarOpen ? 'fixed inset-y-0 left-0 z-50 w-64 lg:static lg:z-auto' : 'hidden lg:flex'
        }`}
      >
        {/* Sidebar header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200 dark:border-gray-700">
          {!sidebarCollapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center space-x-2"
            >
              <Bot className="w-8 h-8 text-primary-600" />
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                BotSpot
              </span>
            </motion.div>
          )}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 ring-focus hidden lg:flex"
            aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <ChevronLeft 
              className={`w-5 h-5 transition-transform duration-200 ${
                sidebarCollapsed ? 'rotate-180' : ''
              }`} 
            />
          </button>
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 ring-focus lg:hidden"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User info */}
        {!sidebarCollapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="px-4 py-3 border-b border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">U</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  User Name
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {userRole}
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Navigation */}
        <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto scrollbar-thin">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors duration-200 ring-focus ${
                isActive(item.href)
                  ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
              title={sidebarCollapsed ? item.name : undefined}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {!sidebarCollapsed && (
                <span className="font-medium">{item.name}</span>
              )}
            </Link>
          ))}
        </nav>
      </motion.aside>

      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-gray-600 bg-opacity-75 z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="flex items-center justify-between px-6 py-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 ring-focus lg:hidden"
              aria-label="Open sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 ring-focus"
              />
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 ring-focus relative"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <ThemeToggle />
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto bg-gray-50 dark:bg-gray-900" role="main">
          <AnimatePresence mode="wait">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{
                duration: 0.3,
                ease: 'easeInOut',
              }}
              className="p-6"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}
