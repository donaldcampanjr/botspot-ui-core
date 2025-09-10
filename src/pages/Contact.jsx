import { motion } from 'framer-motion'
import { Mail, Phone, MapPin } from 'lucide-react'

export function Contact() {
  return (
    <div className="min-h-[70vh] py-20">
      <div className="container-app">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Contact Us
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Get in touch with our team. We're here to help you succeed.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="glass-frosted rounded-xl p-8"
          >
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Send us a message</h2>
            <form className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 rounded-lg bg-white/60 dark:bg-gray-800/60 border border-white/30 dark:border-gray-700/30"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  className="w-full px-4 py-3 rounded-lg bg-white/60 dark:bg-gray-800/60 border border-white/30 dark:border-gray-700/30"
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Message
                </label>
                <textarea
                  rows={4}
                  className="w-full px-4 py-3 rounded-lg bg-white/60 dark:bg-gray-800/60 border border-white/30 dark:border-gray-700/30"
                  placeholder="How can we help you?"
                />
              </div>
              <button type="submit" className="w-full btn-primary">
                Send Message
              </button>
            </form>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-8"
          >
            <div className="glass-frosted rounded-xl p-6">
              <div className="flex items-center space-x-4">
                <Mail className="w-8 h-8 text-primary-600" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Email</h3>
                  <p className="text-gray-600 dark:text-gray-300">hello@botspot.com</p>
                </div>
              </div>
            </div>

            <div className="glass-frosted rounded-xl p-6">
              <div className="flex items-center space-x-4">
                <Phone className="w-8 h-8 text-primary-600" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Phone</h3>
                  <p className="text-gray-600 dark:text-gray-300">+1 (555) 123-4567</p>
                </div>
              </div>
            </div>

            <div className="glass-frosted rounded-xl p-6">
              <div className="flex items-center space-x-4">
                <MapPin className="w-8 h-8 text-primary-600" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Office</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    123 Innovation Drive<br />
                    San Francisco, CA 94105
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
