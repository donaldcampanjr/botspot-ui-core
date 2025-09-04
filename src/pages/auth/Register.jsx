import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { AuthForm } from '../../components/auth/AuthForm'
import { apiFetch } from '../../utils/api'

export function Register() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async ({ username, email, password }) => {
    setLoading(true)
    setError('')
    setSuccess('')
    try {
      const res = await apiFetch('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ username, email, password }),
      })
      if (res && res.ok) {
        setSuccess('Account created. Please check your email to verify your account.')
        setTimeout(() => navigate('/dashboard'), 800)
      } else {
        setError(res?.error || 'Registration failed')
      }
    } catch (e) {
      setError('Unable to register. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-4">
      <AuthForm mode="register" onSubmit={handleSubmit} loading={loading} error={error} success={success} />
      <p className="mt-4 text-sm text-gray-600 dark:text-gray-300">
        Already have an account?{' '}
        <Link to="/auth/login" className="text-primary-600 dark:text-primary-400 underline">Sign in</Link>
      </p>
    </div>
  )
}
