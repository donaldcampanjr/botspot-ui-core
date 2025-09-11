import { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { CheckCircle, AlertCircle, Loader2, Mail } from 'lucide-react'
import { validateEnvVars } from '../../utils'

export default function VerifyEmail() {
  const [status, setStatus] = useState('processing') // processing, success, error
  const [message, setMessage] = useState('Verifying your email...')
  const navigate = useNavigate()
  const location = useLocation()
  const shouldReduceMotion = useReducedMotion()

  useEffect(() => {
    validateEnvVars(['VITE_API_BASE'])
    
    const verifyEmail = async () => {
      try {
        // Parse hash parameters from URL
        const hash = window.location.hash.substring(1)
        const params = new URLSearchParams(hash)
        const token = params.get('token') || params.get('token_hash')
        const type = params.get('type')
        
        // Also check URL search params as fallback
        const searchParams = new URLSearchParams(location.search)
        const tokenFromSearch = searchParams.get('token') || searchParams.get('token_hash')
        const finalToken = token || tokenFromSearch

        if (!finalToken) {
          setStatus('error')
          setMessage('Invalid verification link. The verification token is missing.')
          return
        }

        if (type && type !== 'signup' && type !== 'email_confirmation') {
          setStatus('error')
          setMessage('Invalid verification type. This link may not be for email verification.')
          return
        }

        // Call our auth worker to verify the email
        const response = await fetch(`${import.meta.env.VITE_API_BASE}/auth/verify-email?token=${encodeURIComponent(finalToken)}`, {
          method: 'GET',
          credentials: 'include'
        })

        const data = await response.json()

        if (response.ok && data.success) {
          setStatus('success')
          setMessage('Email verified successfully! You can now log in to your account.')
        } else {
          setStatus('error')
          setMessage(data.error || 'Email verification failed. The link may have expired or already been used.')
        }
      } catch (error) {
        console.error('Email verification error:', error)
        setStatus('error')
        setMessage('Network error occurred. Please check your connection and try again.')
      }
    }

    verifyEmail()
  }, [location])

  const handleGoToLogin = () => {
    navigate('/auth/login', { 
      replace: true,
      state: { message: 'Email verified! Please log in to continue.' }
    })
  }

  const handleResendVerification = () => {
    navigate('/auth/login', { 
      replace: true, 
      state: { showResendVerification: true } 
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-primary-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: shouldReduceMotion ? 0 : 0.3 }}
        className="w-full max-w-md"
      >
        <div className="glass-frosted rounded-2xl p-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.4, delay: 0.1 }}
            className="mb-6"
          >
            {status === 'processing' && (
              <div className="flex flex-col items-center">
                <Loader2 className="w-12 h-12 text-primary-500 animate-spin mb-4" />
                <h1 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Verifying Email
                </h1>
              </div>
            )}
            
            {status === 'success' && (
              <div className="flex flex-col items-center">
                <div className="relative mb-4">
                  <Mail className="w-12 h-12 text-green-500" />
                  <CheckCircle className="w-6 h-6 text-green-600 absolute -top-1 -right-1 bg-white dark:bg-gray-800 rounded-full" />
                </div>
                <h1 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Email Verified!
                </h1>
              </div>
            )}
            
            {status === 'error' && (
              <div className="flex flex-col items-center">
                <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
                <h1 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Verification Failed
                </h1>
              </div>
            )}
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.4, delay: 0.2 }}
            className="text-gray-600 dark:text-gray-300 mb-6"
          >
            {message}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.4, delay: 0.3 }}
            className="space-y-3"
          >
            {status === 'success' && (
              <motion.button
                onClick={handleGoToLogin}
                whileHover={{ scale: shouldReduceMotion ? 1 : 1.02 }}
                whileTap={{ scale: shouldReduceMotion ? 1 : 0.98 }}
                className="w-full btn-primary"
              >
                Continue to Login
              </motion.button>
            )}

            {status === 'error' && (
              <>
                <motion.button
                  onClick={handleGoToLogin}
                  whileHover={{ scale: shouldReduceMotion ? 1 : 1.02 }}
                  whileTap={{ scale: shouldReduceMotion ? 1 : 0.98 }}
                  className="w-full btn-primary"
                >
                  Go to Login
                </motion.button>
                
                <motion.button
                  onClick={handleResendVerification}
                  whileHover={{ scale: shouldReduceMotion ? 1 : 1.02 }}
                  whileTap={{ scale: shouldReduceMotion ? 1 : 0.98 }}
                  className="w-full btn-secondary"
                >
                  Resend Verification
                </motion.button>
              </>
            )}

            {status === 'processing' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: shouldReduceMotion ? 0 : 0.4, delay: 0.4 }}
                className="mt-4"
              >
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <motion.div
                    className="bg-primary-500 h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 2, ease: 'easeInOut' }}
                  />
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.4, delay: 0.5 }}
          className="text-center mt-6"
        >
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Having trouble?{' '}
            <button
              onClick={() => navigate('/about')}
              className="text-primary-600 dark:text-primary-400 hover:underline ring-focus rounded"
            >
              Contact Support
            </button>
          </p>
        </motion.div>
      </motion.div>
    </div>
  )
}
