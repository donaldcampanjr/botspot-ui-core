import { motion } from 'framer-motion'
import { Users, BarChart3, Target, TrendingUp } from 'lucide-react'

export function ManagerDashboard() {
  const teamMetrics = [
    { label: 'Team Members', value: '24', icon: Users },
    { label: 'Active Projects', value: '8', icon: Target },
    { label: 'Productivity', value: '+15%', icon: TrendingUp },
    { label: 'Bot Efficiency', value: '94%', icon: BarChart3 },
  ]

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Manager Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Team performance overview and management tools.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {teamMetrics.map((metric, index) => (
          <div
            key={metric.label}
            className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {metric.label}
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  {metric.value}
                </p>
              </div>
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <metric.icon className="w-6 h-6 text-blue-600" />
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
          Management Tools
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="btn-primary text-center">
            Team Overview
          </button>
          <button className="btn-secondary text-center">
            Performance Reports
          </button>
          <button className="btn-secondary text-center">
            Resource Allocation
          </button>
        </div>
      </motion.div>
    </div>
  )
}
