/**
 * Get user-friendly error message from API error (Laravel format).
 * Laravel returns { message: "...", errors: { field: ["msg"] } } for validation.
 */
export function getApiErrorMessage(error: any, fallback = 'Something went wrong'): string {
  if (!error?.response?.data) return fallback
  const data = error.response.data
  if (typeof data.message === 'string') return data.message
  if (data.errors && typeof data.errors === 'object') {
    const firstKey = Object.keys(data.errors)[0]
    const messages = firstKey ? data.errors[firstKey] : null
    if (Array.isArray(messages) && messages[0]) return messages[0]
  }
  return fallback
}
