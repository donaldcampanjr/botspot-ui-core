import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react'
import { validateEnvVars } from '../../utils'

export default function Recovery() {
  const [status, setStatus] = useState('processing') // processing, success, error
  const [message, setMessage] = useState('Processing password reset...')
  const navigate = useNavigate()
  const shouldReduceMotion = useReducedMotion()

  useEffect(() => {
    validateEnvVars(['VITE_API_BASE'])
    
    const processRecovery = async () => {
      try {
        // Parse hash parameters from URL
        const hash = window.location.hash.substring(1)
        const params = new URLSearchParams(hash)
        const accessToken = params.get('access_token')
        const type = params.get('type')
        
        if (!accessToken) {
          setStatus('error')
          setMessage('Invalid recovery link. Please request a new password reset.')
          return
        }

        if (type !== 'recovery') {
          setStatus('error')
          setMessage('Invalid recovery type. This link may have expired.')
          return
        }

        // Verify the token with our auth worker
        const response = await fetch(`${import.meta.env.VITE_API_BASE}/auth/verify`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          },
          credentials: 'include'
        })

        if (response.ok) {
          const data = await response.json()
          
          if (data.loggedIn) {
            // Set the auth cookie by making a direct call to login with the token
            // This ensures the httpOnly cookie is set properly
            const cookieResponse = await fetch(`${import.meta.env.VITE_API_BASE}/auth/verify`, {
              method: 'GET',
              headers: {
                'Cookie': `sb:token=${accessToken}`
              },
              credentials: 'include'
            })

            if (cookieResponse.ok) {
              setStatus('success')
              setMessage('Password reset successful! Redirecting to dashboard...')
              
              // Redirect after a short delay
              setTimeout(() => {
                navigate('/dashboard', { replace: true })
              }, 2000)
            } else {
              setStatus('error')
              setMessage('Failed to establish session. Please try logging in manually.')
            }
          } else {
            setStatus('error')
            setMessage('Invalid or expired recovery token. Please request a new password reset.')
          }
        } else {
          setStatus('error')
          setMessage('Recovery verification failed. Please try requesting a new password reset.')
        }
      } catch (error) {
        console.error('Recovery error:', error)
        setStatus('error')
        setMessage('Network error occurred. Please check your connection and try again.')
      }
    }

    processRecovery()
  }, [navigate])

  const handleRetryLogin = () => {
    navigate('/auth/login', { replace: true })
  }

  const handleRequestReset = () => {
    navigate('/auth/login', { 
      replace: true, 
      state: { showPasswordReset: true } 
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
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
                  Processing Recovery
                </h1>
              </div>
            )}
            
            {status === 'success' && (
              <div className="flex flex-col items-center">
                <CheckCircle className="w-12 h-12 text-green-500 mb-4" />
                <h1 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Recovery Successful
                </h1>
              </div>
            )}
            
            {status === 'error' && (
              <div className="flex flex-col items-center">
                <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
                <h1 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Recovery Failed
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

          {status === 'error' && (
            <motion.div
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: shouldReduceMotion ? 0 : 0.4, delay: 0.3 }}
              className="space-y-3"
            >
              <motion.button
                onClick={handleRetryLogin}
                whileHover={{ scale: shouldReduceMotion ? 1 : 1.02 }}
                whileTap={{ scale: shouldReduceMotion ? 1 : 0.98 }}
                className="w-full btn-primary"
              >
                Go to Login
              </motion.button>
              
              <motion.button
                onClick={handleRequestReset}
                whileHover={{ scale: shouldReduceMotion ? 1 : 1.02 }}
                whileTap={{ scale: shouldReduceMotion ? 1 : 0.98 }}
                className="w-full btn-secondary"
              >
                Request New Reset
              </motion.button>
            </motion.div>
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
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.4, delay: 0.5 }}
          className="text-center mt-6"
        >
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Need help?{' '}
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
