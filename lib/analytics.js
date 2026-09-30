import { track } from '@vercel/analytics'

/**
 * Safe client-side analytics event tracker
 * @param {string} eventName
 * @param {Record<string, string | number | boolean>} [properties]
 */
export function trackEvent(eventName, properties = {}) {
  try {
    if (typeof window !== 'undefined') {
      track(eventName, properties)
      if (process.env.NODE_ENV === 'development') {
        console.log(`[Analytics Event] ${eventName}:`, properties)
      }
    }
  } catch (err) {
    // Fail silently so user interactions are never blocked
    console.debug('Analytics track error:', err)
  }
}
