import { motion } from 'framer-motion'
import { BarChart3, TrendingUp, Activity } from 'lucide-react'

export function ChartShell({ 
  title = 'Chart', 
  type = 'bar',
  loading = false,
  error = null,
  children 
}) {
  const getChartIcon = () => {
    switch (type) {
      case 'line':
        return TrendingUp
      case 'activity':
        return Activity
      default:
        return BarChart3
    }
  }

  const ChartIcon = getChartIcon()

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6"
      >
        <div className="flex items-center justify-center h-64 text-center">
          <div>
            <ChartIcon className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Error Loading Chart
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm max-w-sm">
              {error}
            </p>
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm"
    >
      {/* Chart Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
            <ChartIcon className="w-5 h-5 text-primary-600 dark:text-primary-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {title}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Chart data visualization
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 ring-focus rounded">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zM12 13a1 1 0 110-2 1 1 0 010 2zM12 20a1 1 0 110-2 1 1 0 010 2z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Chart Content */}
      <div className="p-6">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="w-8 h-8 border-2 border-primary-200 border-t-primary-600 rounded-full"
            />
          </div>
        ) : children ? (
          children
        ) : (
          <div className="flex items-center justify-center h-64 text-center">
            <div>
              <ChartIcon className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <h4 className="text-lg font-medium text-gray-500 dark:text-gray-400 mb-2">
                Chart Ready
              </h4>
              <p className="text-gray-400 dark:text-gray-500 text-sm max-w-sm">
                This component is ready for Chart.js, Recharts, or any other charting library integration.
              </p>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  )
}

// Example usage components for different chart types
export function BarChartShell(props) {
  return <ChartShell {...props} type="bar" />
}

export function LineChartShell(props) {
  return <ChartShell {...props} type="line" />
}

export function ActivityChartShell(props) {
  return <ChartShell {...props} type="activity" />
}
