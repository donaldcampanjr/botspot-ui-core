import { motion, AnimatePresence } from 'framer-motion'
import { Outlet } from 'react-router-dom'
import { Header } from '../components/Header'
import { Footer } from '../components/Footer'

export function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Subtle frosted background glow */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-primary-400/20 dark:bg-primary-600/15 blur-3xl" />
        <div className="absolute bottom-[-6rem] left-[-6rem] w-80 h-80 rounded-full bg-blue-300/20 dark:bg-blue-700/15 blur-3xl" />
      </div>
      <Header />
      <main className="flex-1" role="main">
        <AnimatePresence mode="wait">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{
              duration: 0.3,
              ease: 'easeInOut',
            }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  )
}
