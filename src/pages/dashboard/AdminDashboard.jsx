import { motion } from 'framer-motion'
import { Users, Shield, Server, AlertTriangle } from 'lucide-react'

export function AdminDashboard() {
  const systemStats = [
    { label: 'Total Users', value: '1,247', icon: Users },
    { label: 'Active Bots', value: '342', icon: Server },
    { label: 'Security Events', value: '12', icon: Shield },
    { label: 'System Alerts', value: '3', icon: AlertTriangle },
  ]

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Admin Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          System administration and user management controls.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {systemStats.map((stat, index) => (
          <div
            key={stat.label}
            className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {stat.label}
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  {stat.value}
                </p>
              </div>
              <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <stat.icon className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Admin Controls
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="btn-primary text-center">
            User Management
          </button>
          <button className="btn-secondary text-center">
            System Settings
          </button>
          <button className="btn-secondary text-center">
            Security Audit
          </button>
        </div>
      </motion.div>
    </div>
  )
}
