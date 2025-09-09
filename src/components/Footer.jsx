import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Bot, Github, Twitter, Linkedin, Mail } from 'lucide-react'

export function Footer() {
  const currentYear = new Date().getFullYear()

  const footerLinks = {
    product: [
      { name: 'Features', href: '/features' },
      { name: 'Pricing', href: '/pricing' },
      { name: 'Documentation', href: '/docs' },
      { name: 'API', href: '/api' },
    ],
    company: [
      { name: 'About', href: '/about' },
      { name: 'Blog', href: '/blog' },
      { name: 'Careers', href: '/careers' },
      { name: 'Contact', href: '/contact' },
    ],
    legal: [
      { name: 'Privacy Policy', href: '/privacy' },
      { name: 'Terms of Service', href: '/terms' },
      { name: 'Cookie Policy', href: '/cookies' },
      { name: 'Security', href: '/security' },
    ],
  }

  const socialLinks = [
    { name: 'GitHub', icon: Github, href: '#' },
    { name: 'Twitter', icon: Twitter, href: '#' },
    { name: 'LinkedIn', icon: Linkedin, href: '#' },
    { name: 'Email', icon: Mail, href: 'mailto:hello@botspot.com' },
  ]

  return (
    <footer className="bg-surface-light dark:bg-surface-dark border-t border-gray-200 dark:border-gray-700">
      <div className="container-app py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand section */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-4"
            >
              <Link to="/" className="flex items-center space-x-2 ring-focus rounded-lg p-1 inline-flex">
                <Bot className="w-8 h-8 text-primary-600" />
                <span className="text-xl font-bold text-gray-900 dark:text-white">
                  BotSpot
                </span>
              </Link>
            </motion.div>
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md">
              The ultimate platform for AI-powered automation and bot management. 
              Build, deploy, and scale your intelligent solutions with ease.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={social.name}
                  href={social.href}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.1 }}
                  className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200 ring-focus"
                  aria-label={social.name}
                >
                  <social.icon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Links sections */}
          {Object.entries(footerLinks).map(([category, links], categoryIndex) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: categoryIndex * 0.1 }}
            >
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
                {category}
              </h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200 ring-focus rounded"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Bottom section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700 flex flex-col md:flex-row justify-between items-center"
        >
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            © {currentYear} BotSpot. All rights reserved.
          </p>
          <p className="text-gray-600 dark:text-gray-400 text-sm mt-2 md:mt-0">
            Built with React, Tailwind CSS, and Framer Motion
          </p>
        </motion.div>
      </div>
    </footer>
  )
}
