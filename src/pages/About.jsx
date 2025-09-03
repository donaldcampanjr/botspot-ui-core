import { motion } from 'framer-motion'
import { Users, Target, Award, Globe } from 'lucide-react'

export function About() {
  const stats = [
    { label: 'Active Users', value: '10,000+' },
    { label: 'Bots Created', value: '500K+' },
    { label: 'Tasks Automated', value: '10M+' },
    { label: 'Countries', value: '50+' },
  ]

  const values = [
    {
      icon: Users,
      title: 'People First',
      description: 'We believe technology should empower people, not replace them. Our tools are designed to augment human capabilities.'
    },
    {
      icon: Target,
      title: 'Innovation Driven',
      description: 'We constantly push the boundaries of what\'s possible with AI and automation to deliver cutting-edge solutions.'
    },
    {
      icon: Award,
      title: 'Excellence Standard',
      description: 'We maintain the highest standards of quality, security, and performance in everything we build.'
    },
    {
      icon: Globe,
      title: 'Global Impact',
      description: 'Our platform serves organizations worldwide, making automation accessible to teams of all sizes.'
    }
  ]

  const team = [
    {
      name: 'Sarah Johnson',
      role: 'CEO & Founder',
      bio: 'Former VP of Engineering at TechCorp with 15+ years in AI and automation.',
    },
    {
      name: 'Michael Chen',
      role: 'CTO',
      bio: 'Ex-Google engineer specializing in machine learning and distributed systems.',
    },
    {
      name: 'Emily Rodriguez',
      role: 'Head of Product',
      bio: 'Product leader with expertise in user experience and automation workflows.',
    },
    {
      name: 'David Kim',
      role: 'Head of Security',
      bio: 'Cybersecurity expert ensuring enterprise-grade protection for all users.',
    },
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
            Building the Future of
            <span className="bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
              {' '}Automation
            </span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
            We're on a mission to democratize AI automation and make intelligent 
            workflow management accessible to organizations of all sizes.
          </p>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="bg-gray-50 dark:bg-gray-800 py-20">
        <div className="container-app">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl lg:text-5xl font-bold text-primary-600 mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600 dark:text-gray-300 font-medium">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="container-app py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Our Story
            </h2>
            <div className="space-y-4 text-gray-600 dark:text-gray-300 leading-relaxed">
              <p>
                BotSpot was born from a simple observation: while AI and automation 
                technologies were advancing rapidly, they remained difficult to implement 
                and manage for most organizations.
              </p>
              <p>
                Founded in 2020 by a team of engineers and product experts from leading 
                tech companies, we set out to bridge this gap. Our goal was to create 
                a platform that would make advanced automation accessible without 
                requiring deep technical expertise.
              </p>
              <p>
                Today, BotSpot serves thousands of organizations worldwide, from 
                startups to Fortune 500 companies, helping them streamline operations 
                and unlock new levels of productivity.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="glass-liquid rounded-2xl p-8">
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                  <span className="text-sm font-medium">Company Founded</span>
                  <span className="text-primary-600 font-bold">2020</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                  <span className="text-sm font-medium">Team Members</span>
                  <span className="text-primary-600 font-bold">150+</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                  <span className="text-sm font-medium">Funding Raised</span>
                  <span className="text-primary-600 font-bold">$50M</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                  <span className="text-sm font-medium">Patents Filed</span>
                  <span className="text-primary-600 font-bold">12</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Values Section */}
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
              Our Values
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              These core principles guide everything we do, from product development 
              to customer relationships.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="glass-frosted rounded-xl p-8"
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/20 rounded-lg flex items-center justify-center">
                      <value.icon className="w-6 h-6 text-primary-600" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                      {value.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                      {value.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="container-app py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Leadership Team
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Meet the experienced leaders driving our mission to democratize 
            AI automation and empower teams worldwide.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {team.map((member, index) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="text-center"
            >
              <div className="w-32 h-32 bg-gradient-to-br from-primary-400 to-purple-400 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-3xl font-bold text-white">
                  {member.name.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                {member.name}
              </h3>
              <p className="text-primary-600 dark:text-primary-400 font-medium mb-3">
                {member.role}
              </p>
              <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                {member.bio}
              </p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  )
}
