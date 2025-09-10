import { useState } from 'react'
import { Link } from 'react-router-dom'
import { AuthForm } from '../../components/auth/AuthForm'

export default function Login() {
  const [sent, setSent] = useState(false)

  const resend = async () => {
    try {
      const email = window.prompt('Enter your email to resend verification:')
      if (!email) return
      await fetch(`${import.meta.env.VITE_API_BASE}/auth/resend-verification`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email }),
      })
      setSent(true)
    } catch {}
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-4">
        <AuthForm mode="login" />
        <div className="text-center space-y-2">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            No account? <Link to="/auth/register" className="text-primary-600 dark:text-primary-400 underline">Register</Link>
          </p>
          <button onClick={resend} className="text-xs text-gray-500 underline hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
            Resend verification email
          </button>
          {sent && <p className="text-xs text-green-600">If your account requires verification, check your inbox.</p>}
        </div>
      </div>
    </div>
  )
}
