import { motion } from 'framer-motion'
import { Bot, Play, Pause, Settings } from 'lucide-react'

export function DailyUserDashboard() {
  const myBots = [
    { id: 1, name: 'Email Organizer', status: 'active', tasks: 42 },
    { id: 2, name: 'Calendar Sync', status: 'paused', tasks: 18 },
    { id: 3, name: 'File Backup', status: 'active', tasks: 156 },
  ]

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          My Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage your personal automation and track your bot performance.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          My Bots
        </h3>
        <div className="space-y-4">
          {myBots.map((bot) => (
            <div
              key={bot.id}
              className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <Bot className="w-6 h-6 text-primary-600" />
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    {bot.name}
                  </h4>
                  <p className="text-sm text-gray-500">
                    {bot.tasks} tasks completed
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span
                  className={`px-2 py-1 text-xs rounded-full ${
                    bot.status === 'active'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                      : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                  }`}
                >
                  {bot.status}
                </span>
                <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                  {bot.status === 'active' ? (
                    <Pause className="w-4 h-4" />
                  ) : (
                    <Play className="w-4 h-4" />
                  )}
                </button>
                <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                  <Settings className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
