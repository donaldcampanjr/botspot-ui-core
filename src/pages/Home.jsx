import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Bot, Zap, Shield, Gauge, ArrowRight, CheckCircle, MessageCircle, ThumbsUp, Share, AlertTriangle, CheckCircle2 } from 'lucide-react'

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
      {/* Test Toast Notifications - Remove after testing */}
      <div className="fixed top-20 left-4 z-50">
        <TestToasts />
      </div>

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
                <div className="relative space-y-5" aria-label="Live social thread preview">
                  {/* Post header */}
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 rounded-full bg-primary-500 flex items-center justify-center text-white font-semibold" aria-hidden>
                      JM
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold text-gray-900 dark:text-white">Jordan Miles</span>
                        <CheckCircle2 className="w-4 h-4 text-primary-500" aria-hidden />
                        <span className="text-xs text-gray-500 dark:text-gray-400">2m</span>
                      </div>
                      <p className="mt-1 text-gray-700 dark:text-gray-300">
                        Just launched our new customer support bot — already resolving tickets in seconds! #AI #automation
                      </p>
                    </div>
                  </div>

                  {/* Post actions */}
                  <div className="flex items-center space-x-6 text-gray-600 dark:text-gray-400">
                    <button className="flex items-center space-x-1 hover:text-primary-600 dark:hover:text-primary-400 transition-colors ring-focus rounded" aria-label="Like">
                      <ThumbsUp className="w-4 h-4" />
                      <span className="text-sm">128</span>
                    </button>
                    <button className="flex items-center space-x-1 hover:text-primary-600 dark:hover:text-primary-400 transition-colors ring-focus rounded" aria-label="Comment">
                      <MessageCircle className="w-4 h-4" />
                      <span className="text-sm">34</span>
                    </button>
                    <button className="flex items-center space-x-1 hover:text-primary-600 dark:hover:text-primary-400 transition-colors ring-focus rounded" aria-label="Share">
                      <Share className="w-4 h-4" />
                      <span className="text-sm">12</span>
                    </button>
                  </div>

                  {/* Comments */}
                  <div className="space-y-4" role="list" aria-label="Comments">
                    {/* Genuine comment */}
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4 }}
                      className="flex items-start space-x-3"
                      role="listitem"
                    >
                      <div className="w-9 h-9 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-700 dark:text-gray-200 text-sm font-semibold" aria-hidden>
                        MP
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium text-gray-900 dark:text-white">Maya Patel</span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">1m</span>
                        </div>
                        <div className="mt-1 p-3 rounded-lg bg-white/70 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700">
                          <p className="text-sm text-gray-700 dark:text-gray-300">This is awesome! Our response time dropped by 60% after enabling it.</p>
                        </div>
                      </div>
                    </motion.div>

                    {/* Bot comment (caught) */}
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: 0.1 }}
                      className="flex items-start space-x-3"
                      role="listitem"
                    >
                      <div className="w-9 h-9 rounded-full bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 flex items-center justify-center text-sm font-semibold" aria-hidden>
                        AD
                      </div>
                      <div className="flex-1 relative">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium text-gray-900 dark:text-white">AutoDeals 24/7</span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">Just now</span>
                        </div>
                        <div className="mt-1 p-3 rounded-lg border border-red-300 dark:border-red-800 bg-red-50/60 dark:bg-red-900/10 relative">
                          <div className="absolute -top-3 right-2">
                            <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 text-xs font-medium">
                              <AlertTriangle className="w-3.5 h-3.5" aria-hidden />
                              <span>Bot detected</span>
                            </span>
                          </div>
                          <p className="text-sm text-gray-700 dark:text-gray-300">
                            Get 10k followers instantly — no password needed! Click here: bit.ly/zz-boost
                          </p>
                          <div className="mt-2 text-xs text-gray-600 dark:text-gray-400">
                            Auto-moderated by BotSpot
                          </div>
                        </div>
                      </div>
                    </motion.div>

                    {/* Genuine comment 2 */}
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: 0.2 }}
                      className="flex items-start space-x-3"
                      role="listitem"
                    >
                      <div className="w-9 h-9 rounded-full bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 flex items-center justify-center text-sm font-semibold" aria-hidden>
                        LC
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium text-gray-900 dark:text-white">Leo Chang</span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">Just now</span>
                        </div>
                        <div className="mt-1 p-3 rounded-lg bg-white/70 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700">
                          <p className="text-sm text-gray-700 dark:text-gray-300">Love seeing the bot catch spam in real time 👏</p>
                        </div>
                      </div>
                    </motion.div>
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
