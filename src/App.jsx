import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import clsx from 'clsx'

function App() {
  const [darkMode, setDarkMode] = useState(false)

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
  }

  // Apply dark mode class to html element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  return (
    <div className={clsx(
      'min-h-screen flex items-center justify-center p-4',
      'bg-gradient-to-br from-blue-50 to-indigo-100',
      'dark:from-gray-900 dark:to-gray-800'
    )}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-2xl mx-auto"
      >
        {/* Header */}
        <motion.h1
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
        >
          🤖 BotSpot
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed"
        >
          Welcome to BotSpot! Your React + Vite + Tailwind CSS app is now running successfully.
        </motion.p>

        {/* Feature Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8"
        >
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="text-2xl mb-2">⚡</div>
            <h3 className="font-semibold mb-2">Vite</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Lightning fast development</p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="text-2xl mb-2">⚛️</div>
            <h3 className="font-semibold mb-2">React</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Modern component library</p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="text-2xl mb-2">🎨</div>
            <h3 className="font-semibold mb-2">Tailwind CSS</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Utility-first styling</p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="text-2xl mb-2">🎭</div>
            <h3 className="font-semibold mb-2">Framer Motion</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Smooth animations</p>
          </div>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <button
            onClick={toggleDarkMode}
            className={clsx(
              'btn-primary flex items-center gap-2',
              'px-6 py-3 rounded-lg font-medium transition-all duration-200',
              'bg-primary-500 hover:bg-primary-600 text-white',
              'shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
            )}
          >
            {darkMode ? '☀️' : '🌙'}
            {darkMode ? 'Light Mode' : 'Dark Mode'}
          </button>
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="text-sm text-gray-500 dark:text-gray-400"
          >
            Built with ❤️ using Builder.io
          </motion.div>
        </motion.div>

        {/* Status Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-center gap-2 text-green-600 dark:text-green-400">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium">All systems operational</span>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default App
