import { motion } from 'framer-motion'
import { BarChart3, Users, Bot, TrendingUp, Activity, AlertCircle } from 'lucide-react'
import { ChartShell, BarChartShell, LineChartShell } from '../../components/ChartShell'

export function DashboardOverview() {
  const stats = [
    {
      title: 'Active Bots',
      value: '24',
      change: '+12%',
      trend: 'up',
      icon: Bot,
    },
    {
      title: 'Tasks Completed',
      value: '1,247',
      change: '+8.2%',
      trend: 'up',
      icon: Activity,
    },
    {
      title: 'Success Rate',
      value: '98.5%',
      change: '+2.1%',
      trend: 'up',
      icon: TrendingUp,
    },
    {
      title: 'Active Users',
      value: '156',
      change: '-2.3%',
      trend: 'down',
      icon: Users,
    },
  ]

  const recentActivity = [
    {
      id: 1,
      action: 'Bot "Customer Support" completed 15 tasks',
      time: '2 minutes ago',
      status: 'success',
    },
    {
      id: 2,
      action: 'New user "John Doe" joined the team',
      time: '5 minutes ago',
      status: 'info',
    },
    {
      id: 3,
      action: 'Bot "Data Processor" encountered an error',
      time: '12 minutes ago',
      status: 'error',
    },
    {
      id: 4,
      action: 'Weekly automation report generated',
      time: '1 hour ago',
      status: 'success',
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Dashboard Overview
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Welcome back! Here's what's happening with your automation.
        </p>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            whileHover={{ y: -2 }}
            className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {stat.title}
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  {stat.value}
                </p>
                <div className="flex items-center mt-2">
                  <span
                    className={`text-sm font-medium ${
                      stat.trend === 'up'
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-red-600 dark:text-red-400'
                    }`}
                  >
                    {stat.change}
                  </span>
                  <span className="text-gray-500 dark:text-gray-400 text-sm ml-1">
                    vs last month
                  </span>
                </div>
              </div>
              <div className="p-3 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
                <stat.icon className="w-6 h-6 text-primary-600" />
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <BarChartShell title="Bot Performance" />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <LineChartShell title="Task Completion Trends" />
        </motion.div>
      </div>

      {/* Activity Feed */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700"
      >
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Recent Activity
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Latest updates from your automation workflows
          </p>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200"
              >
                <div
                  className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                    activity.status === 'success'
                      ? 'bg-green-400'
                      : activity.status === 'error'
                      ? 'bg-red-400'
                      : 'bg-blue-400'
                  }`}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900 dark:text-white">
                    {activity.action}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {activity.time}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="mt-6 text-center">
            <button className="text-primary-600 dark:text-primary-400 text-sm font-medium hover:text-primary-700 dark:hover:text-primary-300 transition-colors duration-200">
              View all activity
            </button>
          </div>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="btn-primary text-center">
            Create New Bot
          </button>
          <button className="btn-secondary text-center">
            View Analytics
          </button>
          <button className="btn-secondary text-center">
            Manage Team
          </button>
        </div>
      </motion.div>
    </div>
  )
}
