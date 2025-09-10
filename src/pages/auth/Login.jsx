import { Link } from 'react-router-dom'
import { AuthForm } from '../../components/auth/AuthForm'

export default function Login() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-4">
        <AuthForm mode="login" />
        <p className="text-center text-sm text-gray-600 dark:text-gray-300">
          No account? <Link to="/auth/register" className="text-primary-600 dark:text-primary-400 underline">Register</Link>
        </p>
      </div>
    </div>
  )
}
