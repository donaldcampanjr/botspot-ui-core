import { createContext, useContext, useState, useCallback } from 'react'
import { ToastContainer } from '../components/Toast'

const ToastContext = createContext(null)

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const addToast = useCallback((toast) => {
    const id = Date.now() + Math.random()
    const newToast = {
      id,
      type: 'info',
      autoHide: true,
      duration: 5000,
      ...toast,
    }

    setToasts(prev => [...prev, newToast])

    // Auto-hide toast after duration
    if (newToast.autoHide) {
      setTimeout(() => {
        removeToast(id)
      }, newToast.duration)
    }

    return id
  }, [])

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }, [])

  const clearAllToasts = useCallback(() => {
    setToasts([])
  }, [])

  // Helper methods for different toast types
  const success = useCallback((message, options = {}) => {
    return addToast({
      type: 'success',
      title: options.title || 'Success',
      message,
      ...options,
    })
  }, [addToast])

  const error = useCallback((message, options = {}) => {
    return addToast({
      type: 'error',
      title: options.title || 'Error',
      message,
      autoHide: false, // Errors should not auto-hide by default
      ...options,
    })
  }, [addToast])

  const warning = useCallback((message, options = {}) => {
    return addToast({
      type: 'warning',
      title: options.title || 'Warning',
      message,
      ...options,
    })
  }, [addToast])

  const info = useCallback((message, options = {}) => {
    return addToast({
      type: 'info',
      title: options.title || 'Info',
      message,
      ...options,
    })
  }, [addToast])

  const value = {
    toasts,
    addToast,
    removeToast,
    clearAllToasts,
    success,
    error,
    warning,
    info,
  }

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}
