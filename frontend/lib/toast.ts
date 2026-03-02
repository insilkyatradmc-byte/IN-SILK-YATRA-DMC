import toast from 'react-hot-toast'

/**
 * Modern toast notifications with consistent styling
 */

export const showToast = {
  /**
   * Success notification
   */
  success: (message: string, duration?: number) => {
    return toast.success(message, {
      duration: duration || 4000,
      ariaProps: {
        role: 'status',
        'aria-live': 'polite',
      },
    })
  },

  /**
   * Error notification
   */
  error: (message: string, duration?: number) => {
    return toast.error(message, {
      duration: duration || 5000,
      ariaProps: {
        role: 'alert',
        'aria-live': 'assertive',
      },
    })
  },

  /**
   * Info notification
   */
  info: (message: string, duration?: number) => {
    return toast(message, {
      duration: duration || 4000,
      icon: 'ℹ️',
      ariaProps: {
        role: 'status',
        'aria-live': 'polite',
      },
    })
  },

  /**
   * Loading notification
   */
  loading: (message: string) => {
    return toast.loading(message)
  },

  /**
   * Promise-based notification with loading, success, and error states
   */
  promise: <T,>(
    promise: Promise<T>,
    msgs: {
      loading: string
      success: string | ((data: T) => string)
      error: string | ((err: any) => string)
    }
  ) => {
    return toast.promise(promise, msgs, {
      loading: {
        duration: Infinity,
      },
      success: {
        duration: 4000,
      },
      error: {
        duration: 5000,
      },
    })
  },

  /**
   * Custom notification with custom styling
   */
  custom: (message: string, options?: any) => {
    return toast(message, options)
  },

  /**
   * Dismiss a specific toast
   */
  dismiss: (toastId?: string) => {
    toast.dismiss(toastId)
  },

  /**
   * Dismiss all toasts
   */
  dismissAll: () => {
    toast.dismiss()
  },
}

export default showToast
