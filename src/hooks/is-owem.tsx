import { useMemo } from 'react'

export function useIsOwem(): boolean {
  return useMemo(() => {
    if (typeof window === 'undefined') {
      return false
    }

    const hostname = window.location.hostname
    return hostname.includes('distritopay.com') || hostname.includes('localhost')
  }, [])
}
