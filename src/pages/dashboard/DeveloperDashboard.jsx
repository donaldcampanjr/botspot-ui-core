import { motion } from 'framer-motion'
import { Code, Terminal, GitBranch, Database } from 'lucide-react'

export function DeveloperDashboard() {
  const devMetrics = [
    { label: 'API Calls', value: '1.2M', icon: Code },
    { label: 'Active APIs', value: '15', icon: Terminal },
    { label: 'Deployments', value: '43', icon: GitBranch },
    { label: 'Data Processed', value: '2.4TB', icon: Database },
  ]

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Developer Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          API management, development tools, and system metrics.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {devMetrics.map((metric, index) => (
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
              <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <metric.icon className="w-6 h-6 text-green-600" />
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
          Developer Tools
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="btn-primary text-center">
            API Console
          </button>
          <button className="btn-secondary text-center">
            Documentation
          </button>
          <button className="btn-secondary text-center">
            Debug Logs
          </button>
        </div>
      </motion.div>
    </div>
  )
}
