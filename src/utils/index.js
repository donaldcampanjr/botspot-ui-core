// Utility functions for BotSpot application

/**
 * Format a number with commas for better readability
 * @param {number} num - The number to format
 * @returns {string} - Formatted number string
 */
export function formatNumber(num) {
  return new Intl.NumberFormat().format(num)
}

/**
 * Format a date to a human-readable string
 * @param {Date|string} date - The date to format
 * @returns {string} - Formatted date string
 */
export function formatDate(date) {
  const d = new Date(date)
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

/**
 * Format a relative time (e.g., "2 minutes ago")
 * @param {Date|string} date - The date to format
 * @returns {string} - Relative time string
 */
export function formatRelativeTime(date) {
  const now = new Date()
  const past = new Date(date)
  const diff = now - past
  
  const minutes = Math.floor(diff / (1000 * 60))
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  
  if (minutes < 1) return 'just now'
  if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`
  return `${days} day${days > 1 ? 's' : ''} ago`
}

/**
 * Generate a random ID string
 * @param {number} length - Length of the ID (default: 8)
 * @returns {string} - Random ID string
 */
export function generateId(length = 8) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

/**
 * Debounce function to limit the rate of function calls
 * @param {Function} func - Function to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} - Debounced function
 */
export function debounce(func, delay) {
  let timeoutId
  return function (...args) {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func.apply(this, args), delay)
  }
}

/**
 * Validate environment variables and warn if missing
 * @param {string[]} requiredVars - Array of required environment variable names
 */
export function validateEnvVars(requiredVars) {
  const missing = requiredVars.filter(varName => !import.meta.env[varName])
  
  if (missing.length > 0 && import.meta.env.DEV) {
    console.warn(
      `Missing environment variables: ${missing.join(', ')}\n` +
      'Please check your .env file and ensure all required variables are set.'
    )
  }
  
  return missing.length === 0
}

/**
 * Safely parse JSON with error handling
 * @param {string} jsonString - JSON string to parse
 * @param {any} fallback - Fallback value if parsing fails
 * @returns {any} - Parsed object or fallback
 */
export function safeParseJSON(jsonString, fallback = null) {
  try {
    return JSON.parse(jsonString)
  } catch (error) {
    if (import.meta.env.DEV) {
      console.warn('Failed to parse JSON:', error)
    }
    return fallback
  }
}

/**
 * Check if the user prefers reduced motion
 * @returns {boolean} - True if reduced motion is preferred
 */
export function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/**
 * Clamp a number between min and max values
 * @param {number} value - Value to clamp
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} - Clamped value
 */
export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max)
}

/**
 * Truncate text to a specific length with ellipsis
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} - Truncated text
 */
export function truncateText(text, maxLength) {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength).trim() + '...'
}
