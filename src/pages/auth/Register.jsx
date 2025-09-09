import { Link } from 'react-router-dom'
import { AuthForm } from '../../components/auth/AuthForm'

export function Register() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-4">
      <AuthForm mode="register" />
      <p className="mt-4 text-sm text-gray-600 dark:text-gray-300">
        Already have an account?{' '}
        <Link to="/auth/login" className="text-primary-600 dark:text-primary-400 underline">Sign in</Link>
      </p>
    </div>
  )
}
