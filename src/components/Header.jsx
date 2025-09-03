import { motion } from 'framer-motion'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, Bot } from 'lucide-react'
import { useState } from 'react'
import { ThemeToggle } from './ThemeToggle'

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const location = useLocation()

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Features', href: '/features' },
    { name: 'About', href: '/about' },
  ]

  const isActive = (href) => location.pathname === href

  return (
    <header className="sticky top-0 z-50 glass-frosted">
      <nav className="container-app" aria-label="Main navigation">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-2"
          >
            <Link to="/" className="flex items-center space-x-2 ring-focus rounded-lg p-1">
              <Bot className="w-8 h-8 text-primary-600" />
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                BotSpot
              </span>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navigation.map((item, index) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  to={item.href}
                  className={`nav-link ${isActive(item.href) ? 'nav-link-active' : ''}`}
                >
                  {item.name}
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <ThemeToggle />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-primary"
            >
              Get Started
            </motion.button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <ThemeToggle />
            <motion.button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 ring-focus"
              aria-label="Toggle mobile menu"
              whileTap={{ scale: 0.95 }}
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </motion.button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{
            opacity: isMenuOpen ? 1 : 0,
            height: isMenuOpen ? 'auto' : 0,
          }}
          transition={{ duration: 0.2, ease: 'easeInOut' }}
          className="md:hidden overflow-hidden border-t border-gray-200 dark:border-gray-700"
        >
          <div className="py-4 space-y-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setIsMenuOpen(false)}
                className={`block nav-link ${isActive(item.href) ? 'nav-link-active' : ''}`}
              >
                {item.name}
              </Link>
            ))}
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <button className="btn-primary w-full">
                Get Started
              </button>
            </div>
          </div>
        </motion.div>
      </nav>
    </header>
  )
}
