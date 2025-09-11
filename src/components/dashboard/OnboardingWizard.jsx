import { useState, useEffect } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { CheckCircle, Circle, User, Mail, Link, Sparkles, X, ArrowRight, ArrowLeft } from 'lucide-react'

const WIZARD_STEPS = [
  {
    id: 'profile',
    title: 'Complete your profile',
    description: 'Add your basic information to personalize your experience',
    icon: User,
    completed: false
  },
  {
    id: 'email',
    title: 'Verify your email',
    description: 'Confirm your email address to secure your account',
    icon: Mail,
    completed: false
  },
  {
    id: 'connect',
    title: 'Connect a social app',
    description: 'Link your first social media account to get started',
    icon: Link,
    completed: false
  },
  {
    id: 'explore',
    title: 'Explore dashboard features',
    description: 'Learn about the tools and features available to you',
    icon: Sparkles,
    completed: false
  }
]

export function OnboardingWizard({ user, onDismiss, onStepComplete }) {
  const [currentStep, setCurrentStep] = useState(0)
  const [steps, setSteps] = useState(WIZARD_STEPS)
  const [isMinimized, setIsMinimized] = useState(false)
  const shouldReduceMotion = useReducedMotion()

  useEffect(() => {
    // Load wizard state from localStorage
    const savedState = localStorage.getItem('botspot_onboarding_state')
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState)
        setSteps(parsed.steps || WIZARD_STEPS)
        setCurrentStep(parsed.currentStep || 0)
        setIsMinimized(parsed.isMinimized || false)
      } catch (e) {
        // Ignore parsing errors, use defaults
      }
    }

    // Auto-mark email step as completed if user email is verified
    if (user?.email_confirmed_at) {
      setSteps(prev => prev.map(step => 
        step.id === 'email' ? { ...step, completed: true } : step
      ))
    }
  }, [user])

  useEffect(() => {
    // Save wizard state to localStorage
    const state = {
      steps,
      currentStep,
      isMinimized
    }
    localStorage.setItem('botspot_onboarding_state', JSON.stringify(state))
  }, [steps, currentStep, isMinimized])

  const completedSteps = steps.filter(step => step.completed).length
  const isCompleted = completedSteps === steps.length

  const handleStepComplete = (stepId) => {
    const updatedSteps = steps.map(step =>
      step.id === stepId ? { ...step, completed: true } : step
    )
    setSteps(updatedSteps)
    
    if (onStepComplete) {
      onStepComplete(stepId)
    }

    // Move to next uncompleted step
    const nextIncompleteIndex = updatedSteps.findIndex(step => !step.completed)
    if (nextIncompleteIndex !== -1) {
      setCurrentStep(nextIncompleteIndex)
    }
  }

  const handleDismiss = () => {
    localStorage.setItem('botspot_onboarding_dismissed', 'true')
    if (onDismiss) {
      onDismiss()
    }
  }

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const currentStepData = steps[currentStep]

  if (isCompleted) {
    return (
      <motion.div
        initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: shouldReduceMotion ? 0 : -10 }}
        className="glass-frosted rounded-2xl p-6 mb-6"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Welcome to BotSpot! 🎉
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                You've completed the onboarding process.
              </p>
            </div>
          </div>
          <button
            onClick={handleDismiss}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg ring-focus"
            aria-label="Dismiss welcome message"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    )
  }

  if (isMinimized) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="fixed bottom-4 right-4 z-50"
      >
        <motion.button
          onClick={() => setIsMinimized(false)}
          whileHover={{ scale: shouldReduceMotion ? 1 : 1.05 }}
          whileTap={{ scale: shouldReduceMotion ? 1 : 0.95 }}
          className="glass-frosted rounded-full p-3 shadow-lg hover:shadow-xl transition-shadow"
        >
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary-500" />
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              {completedSteps}/{steps.length}
            </span>
          </div>
        </motion.button>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-frosted rounded-2xl p-6 mb-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">
              Welcome to BotSpot!
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Let's get you set up ({completedSteps}/{steps.length} complete)
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsMinimized(true)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg ring-focus"
            aria-label="Minimize wizard"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={handleDismiss}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg ring-focus"
            aria-label="Dismiss wizard"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Progress
          </span>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {Math.round((completedSteps / steps.length) * 100)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <motion.div
            className="bg-primary-500 h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${(completedSteps / steps.length) * 100}%` }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.5, ease: 'easeOut' }}
          />
        </div>
      </div>

      {/* Step indicators */}
      <div className="flex items-center justify-between mb-6">
        {steps.map((step, index) => {
          const StepIcon = step.icon
          const isCurrent = index === currentStep
          const isCompleted = step.completed
          
          return (
            <motion.button
              key={step.id}
              onClick={() => setCurrentStep(index)}
              whileHover={{ scale: shouldReduceMotion ? 1 : 1.05 }}
              whileTap={{ scale: shouldReduceMotion ? 1 : 0.95 }}
              className={`flex flex-col items-center gap-2 p-2 rounded-lg ring-focus ${
                isCurrent ? 'bg-primary-50 dark:bg-primary-900/20' : ''
              }`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                isCompleted 
                  ? 'bg-green-500 text-white' 
                  : isCurrent 
                    ? 'bg-primary-500 text-white' 
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
              }`}>
                {isCompleted ? (
                  <CheckCircle className="w-4 h-4" />
                ) : (
                  <StepIcon className="w-4 h-4" />
                )}
              </div>
              <span className={`text-xs font-medium ${
                isCurrent ? 'text-primary-600 dark:text-primary-400' : 'text-gray-500 dark:text-gray-400'
              }`}>
                {step.title.split(' ')[0]}
              </span>
            </motion.button>
          )
        })}
      </div>

      {/* Current step content */}
      <motion.div
        key={currentStep}
        initial={{ opacity: 0, x: shouldReduceMotion ? 0 : 10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: shouldReduceMotion ? 0 : 0.3 }}
        className="mb-6"
      >
        <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
          {currentStepData.title}
        </h4>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          {currentStepData.description}
        </p>

        {/* Step-specific content */}
        {currentStepData.id === 'profile' && (
          <div className="space-y-3">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Your profile shows as: {user?.email || 'Not set'}
            </p>
            <button
              onClick={() => handleStepComplete('profile')}
              className="btn-primary"
            >
              Mark as Complete
            </button>
          </div>
        )}

        {currentStepData.id === 'email' && (
          <div className="space-y-3">
            {user?.email_confirmed_at ? (
              <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                <CheckCircle className="w-4 h-4" />
                <span className="text-sm">Email verified!</span>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-sm text-amber-600 dark:text-amber-400">
                  Please check your email and click the verification link.
                </p>
                <button
                  onClick={() => handleStepComplete('email')}
                  className="btn-secondary text-sm"
                >
                  I've verified my email
                </button>
              </div>
            )}
          </div>
        )}

        {currentStepData.id === 'connect' && (
          <div className="space-y-3">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Connect your first social media account to start automating your content.
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button className="btn-secondary text-sm">Reddit</button>
              <button className="btn-secondary text-sm">Twitter</button>
              <button className="btn-secondary text-sm">LinkedIn</button>
              <button className="btn-secondary text-sm">Spotify</button>
            </div>
            <button
              onClick={() => handleStepComplete('connect')}
              className="btn-primary text-sm"
            >
              Skip for now
            </button>
          </div>
        )}

        {currentStepData.id === 'explore' && (
          <div className="space-y-3">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Take a look around your dashboard to see what's available.
            </p>
            <button
              onClick={() => handleStepComplete('explore')}
              className="btn-primary"
            >
              I'm ready to explore!
            </button>
          </div>
        )}
      </motion.div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={prevStep}
          disabled={currentStep === 0}
          className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 disabled:opacity-50 ring-focus rounded"
        >
          <ArrowLeft className="w-4 h-4" />
          Previous
        </button>
        
        <button
          onClick={nextStep}
          disabled={currentStep === steps.length - 1}
          className="flex items-center gap-2 text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 disabled:opacity-50 ring-focus rounded"
        >
          Next
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  )
}
