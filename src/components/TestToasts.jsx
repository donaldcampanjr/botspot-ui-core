import { useToast } from '../contexts/ToastContext'

export function TestToasts() {
  const { success, error, warning, info } = useToast()

  const testNotifications = () => {
    // Test different types with various options
    success('This is a success message!', { title: 'Success' })
    
    setTimeout(() => {
      error('This is an error message!', { title: 'Error' })
    }, 500)
    
    setTimeout(() => {
      warning('This is a warning message!', { title: 'Warning' })
    }, 1000)
    
    setTimeout(() => {
      info('This is an info message!', { title: 'Information' })
    }, 1500)
    
    setTimeout(() => {
      success('Registration completed successfully! Welcome to BotSpot.', {
        title: 'Account Created',
        duration: 7000
      })
    }, 2000)
  }

  return (
    <div className="p-4">
      <button
        onClick={testNotifications}
        className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
      >
        Test Toast Notifications
      </button>
    </div>
  )
}
