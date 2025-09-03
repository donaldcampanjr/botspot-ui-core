import { motion } from 'framer-motion'
import { Bot, Zap, Shield, Users, BarChart3, Settings, Cloud, Lock } from 'lucide-react'

export function Features() {
  const features = [
    {
      icon: Bot,
      title: 'Intelligent Bot Creation',
      description: 'Build sophisticated AI bots with our intuitive drag-and-drop interface. No coding required.',
      highlights: ['Visual bot builder', 'Pre-built templates', 'Custom logic flows', 'API integrations']
    },
    {
      icon: Zap,
      title: 'Lightning-Fast Performance',
      description: 'Optimized for speed and efficiency with modern infrastructure and smart caching.',
      highlights: ['Sub-second response times', 'Auto-scaling', 'Global CDN', 'Edge computing']
    },
    {
      icon: Shield,
      title: 'Enterprise Security',
      description: 'Bank-grade security with comprehensive compliance and data protection.',
      highlights: ['SOC 2 compliant', 'End-to-end encryption', 'GDPR ready', 'Regular audits']
    },
    {
      icon: Users,
      title: 'Team Collaboration',
      description: 'Work together seamlessly with role-based access and real-time collaboration tools.',
      highlights: ['Role-based permissions', 'Real-time editing', 'Version control', 'Team analytics']
    },
    {
      icon: BarChart3,
      title: 'Advanced Analytics',
      description: 'Deep insights into bot performance and user interactions with customizable dashboards.',
      highlights: ['Real-time metrics', 'Custom reports', 'Performance alerts', 'Export data']
    },
    {
      icon: Settings,
      title: 'Flexible Integration',
      description: 'Connect with your existing tools and workflows through our comprehensive API.',
      highlights: ['REST API', 'Webhooks', '500+ integrations', 'Custom connectors']
    },
    {
      icon: Cloud,
      title: 'Cloud-Native Architecture',
      description: 'Built for the cloud with automatic scaling, high availability, and global reach.',
      highlights: ['99.9% uptime SLA', 'Multi-region deployment', 'Auto-scaling', 'Disaster recovery']
    },
    {
      icon: Lock,
      title: 'Data Privacy & Compliance',
      description: 'Your data stays secure with industry-leading privacy controls and compliance features.',
      highlights: ['Data encryption', 'Privacy controls', 'Audit logs', 'Compliance reporting']
    }
  ]

  return (
    <div className="min-h-screen py-12">
      {/* Hero Section */}
      <section className="container-app py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-4xl mx-auto"
        >
          <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight mb-6">
            Powerful Features for
            <span className="bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
              {' '}Modern Teams
            </span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
            Discover the comprehensive suite of tools and capabilities that make BotSpot 
            the leading choice for AI automation and bot management.
          </p>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section className="container-app pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="glass-frosted rounded-2xl p-8"
            >
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/20 rounded-xl flex items-center justify-center">
                    <feature.icon className="w-8 h-8 text-primary-600" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    {feature.description}
                  </p>
                  <ul className="space-y-2">
                    {feature.highlights.map((highlight, idx) => (
                      <li key={idx} className="flex items-center space-x-2">
                        <div className="w-1.5 h-1.5 bg-primary-500 rounded-full" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          {highlight}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Feature Comparison */}
      <section className="bg-gray-50 dark:bg-gray-800 py-20">
        <div className="container-app">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Compare Our Plans
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Choose the perfect plan for your team size and automation needs. 
              All plans include our core features with different usage limits.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {['Starter', 'Professional', 'Enterprise'].map((plan, index) => (
              <motion.div
                key={plan}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`glass-liquid rounded-2xl p-8 relative ${
                  index === 1 ? 'ring-2 ring-primary-500' : ''
                }`}
              >
                {index === 1 && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-primary-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {plan}
                  </h3>
                  <div className="text-4xl font-bold text-primary-600 mb-6">
                    ${index === 0 ? '29' : index === 1 ? '99' : '299'}
                    <span className="text-lg text-gray-500 dark:text-gray-400">/month</span>
                  </div>
                  <button className={`w-full py-3 px-6 rounded-lg font-medium transition-colors duration-200 ${
                    index === 1 
                      ? 'bg-primary-500 hover:bg-primary-600 text-white' 
                      : 'bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100'
                  }`}>
                    Get Started
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
