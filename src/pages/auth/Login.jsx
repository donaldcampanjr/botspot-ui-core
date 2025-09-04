import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { AuthForm } from '../../components/auth/AuthForm'
import { apiFetch } from '../../utils/api'

export function Login() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async ({ email, password }) => {
    setLoading(true)
    setError('')
    try {
      const res = await apiFetch('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      })
      if (res && res.ok) {
        navigate('/dashboard')
      } else {
        setError(res?.error || 'Login failed')
      }
    } catch (e) {
      setError('Unable to login. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-4">
      <AuthForm mode="login" onSubmit={handleSubmit} loading={loading} error={error} />
      <p className="mt-4 text-sm text-gray-600 dark:text-gray-300">
        Don't have an account?{' '}
        <Link to="/auth/register" className="text-primary-600 dark:text-primary-400 underline">Sign up</Link>
      </p>
    </div>
  )
}
