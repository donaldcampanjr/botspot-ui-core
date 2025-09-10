import { motion } from 'framer-motion'
import { Check } from 'lucide-react'

export function Pricing() {
  return (
    <div className="min-h-[70vh] py-20">
      <div className="container-app">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Pricing Plans
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-12 max-w-3xl mx-auto">
            Choose the perfect plan for your automation needs
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Starter Plan */}
            <div className="glass-frosted rounded-xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Starter</h3>
              <div className="text-4xl font-bold text-primary-600 mb-6">Free</div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-3" />
                  <span>Up to 5 bots</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-3" />
                  <span>Basic automation</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-3" />
                  <span>Community support</span>
                </li>
              </ul>
              <button className="w-full btn-secondary">Get Started</button>
            </div>

            {/* Pro Plan */}
            <div className="glass-frosted rounded-xl p-8 ring-2 ring-primary-500">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Pro</h3>
              <div className="text-4xl font-bold text-primary-600 mb-6">$29<span className="text-lg">/mo</span></div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-3" />
                  <span>Unlimited bots</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-3" />
                  <span>Advanced automation</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-3" />
                  <span>Priority support</span>
                </li>
              </ul>
              <button className="w-full btn-primary">Start Free Trial</button>
            </div>

            {/* Enterprise Plan */}
            <div className="glass-frosted rounded-xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Enterprise</h3>
              <div className="text-4xl font-bold text-primary-600 mb-6">Custom</div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-3" />
                  <span>Custom integrations</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-3" />
                  <span>Dedicated support</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-3" />
                  <span>SLA guarantee</span>
                </li>
              </ul>
              <button className="w-full btn-secondary">Contact Sales</button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
