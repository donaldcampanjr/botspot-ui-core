import { Link } from 'react-router-dom'
import { AuthForm } from '../../components/auth/AuthForm'

export function Login() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-4">
      <AuthForm mode="login" />
      <p className="mt-4 text-sm text-gray-600 dark:text-gray-300">
        Don't have an account?{' '}
        <Link to="/auth/register" className="text-primary-600 dark:text-primary-400 underline">Sign up</Link>
      </p>
    </div>
  )
}
