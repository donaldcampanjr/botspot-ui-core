import { useMemo } from 'react'

export function PasswordStrength({ value }) {
  const { label, percent, color } = useMemo(() => {
    let score = 0
    if (value.length >= 8) score++
    if (/[A-Z]/.test(value)) score++
    if (/[a-z]/.test(value)) score++
    if (/[0-9]/.test(value)) score++
    if (/[^A-Za-z0-9]/.test(value)) score++
    const percent = Math.min((score / 5) * 100, 100)
    const label = score <= 2 ? 'Weak' : score === 3 ? 'Medium' : 'Strong'
    const color = score <= 2 ? 'bg-red-500' : score === 3 ? 'bg-yellow-500' : 'bg-green-500'
    return { label, percent, color }
  }, [value])

  if (!value) return null

  return (
    <div className="mt-2" aria-live="polite">
      <div className="h-1 w-full bg-gray-200 dark:bg-gray-700 rounded">
        <div className={`h-1 rounded ${color}`} style={{ width: `${percent}%` }} />
      </div>
      <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">Strength: {label}</p>
    </div>
  )
}
