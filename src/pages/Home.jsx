import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Bot, Zap, Shield, Gauge, ArrowRight, CheckCircle } from 'lucide-react'

export function Home() {
  const features = [
    {
      icon: Bot,
      title: 'AI-Powered Automation',
      description: 'Create intelligent bots that learn and adapt to your workflow needs.',
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Built with modern tech stack for optimal performance and speed.',
    },
    {
      icon: Shield,
      title: 'Enterprise Security',
      description: 'Bank-grade security with end-to-end encryption and compliance.',
    },
    {
      icon: Gauge,
      title: 'Real-time Analytics',
      description: 'Monitor performance and get insights with comprehensive dashboards.',
    },
  ]

  const benefits = [
    'Automated workflow management',
    'Multi-role dashboard system',
    'Real-time collaboration tools',
    'Advanced analytics and reporting',
    'Scalable architecture',
    '24/7 customer support',
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900/20">
        <div className="container-app py-20 lg:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight mb-6">
                The Future of
                <span className="bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
                  {' '}AI Automation
                </span>
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                Build, deploy, and scale intelligent automation solutions with BotSpot. 
                Transform your business operations with our enterprise-grade AI platform.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    to="/dashboard"
                    className="btn-primary flex items-center justify-center space-x-2 px-8 py-4 text-lg"
                  >
                    <span>Get Started</span>
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    to="/features"
                    className="btn-secondary flex items-center justify-center space-x-2 px-8 py-4 text-lg"
                  >
                    <span>Learn More</span>
                  </Link>
                </motion.div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="glass-liquid rounded-2xl p-8 relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary-400/20 to-purple-400/20 rounded-2xl" />
                <div className="relative">
                  <Bot className="w-24 h-24 text-primary-600 mx-auto mb-6" />
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <motion.div
                        key={i}
                        initial={{ width: 0 }}
                        animate={{ width: '100%' }}
                        transition={{ delay: 0.5 + i * 0.2, duration: 0.8 }}
                        className="h-3 bg-gradient-to-r from-primary-200 to-purple-200 rounded-full overflow-hidden"
                      >
                        <motion.div
                          initial={{ x: '-100%' }}
                          animate={{ x: '0%' }}
                          transition={{ delay: 1 + i * 0.2, duration: 1 }}
                          className="h-full bg-gradient-to-r from-primary-500 to-purple-500 rounded-full"
                        />
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="container-app">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Why Choose BotSpot?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Our platform combines cutting-edge AI technology with enterprise-grade reliability 
              to deliver unmatched automation solutions.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="glass-frosted rounded-xl p-6 text-center"
              >
                <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-8 h-8 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container-app">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                Everything You Need to Succeed
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
                From small teams to enterprise organizations, BotSpot scales with your needs 
                and provides the tools to drive innovation.
              </p>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={benefit}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="flex items-center space-x-3"
                  >
                    <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300">{benefit}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="glass rounded-2xl p-8 space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-green-400 rounded-full" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      System Status: Operational
                    </span>
                  </div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    99.9% Uptime
                  </span>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Active Bots</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">1,247</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Tasks Processed</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">892K</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Time Saved</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">15,623 hrs</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-purple-600">
        <div className="container-app text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
              Ready to Transform Your Workflow?
            </h2>
            <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
              Join thousands of organizations already using BotSpot to automate 
              their processes and drive innovation.
            </p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/dashboard"
                className="inline-flex items-center space-x-2 bg-white text-primary-600 font-semibold px-8 py-4 rounded-lg hover:bg-gray-50 transition-colors duration-200 ring-focus"
              >
                <span>Start Your Free Trial</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
