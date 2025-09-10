import { motion } from 'framer-motion'
import { Clock, ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'

export function ComingSoon({ title = "Coming Soon", description = "This feature is currently in development." }) {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <div className="w-20 h-20 bg-primary-100 dark:bg-primary-900/20 rounded-full flex items-center justify-center mx-auto mb-8">
          <Clock className="w-10 h-10 text-primary-600" />
        </div>
        
        <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
          {title}
        </h1>
        
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
          {description}
        </p>
        
        <p className="text-gray-500 dark:text-gray-400 mb-8">
          We're working hard to bring you this feature. Stay tuned for updates!
        </p>

        <Link
          to="/"
          className="inline-flex items-center space-x-2 btn-primary"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>
      </motion.div>
    </div>
  )
}
