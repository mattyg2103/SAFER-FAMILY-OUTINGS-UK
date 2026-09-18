import { useState } from 'react'

// Geographic centre of Great Britain (near Dunsop Bridge, Lancashire), used
// as a whole-country fallback view when we don't know where the family is.
export const DEFAULT_CENTER: [number, number] = [54.0, -2.9]
export const DEFAULT_ZOOM = 6
export const LOCATED_ZOOM = 13

export function useUserLocation() {
  const [location, setLocation] = useState<[number, number] | null>(null)
  const [status, setStatus] = useState<'idle' | 'locating' | 'granted' | 'denied'>('idle')

  const request = () => {
    if (!navigator.geolocation) {
      setStatus('denied')
      return
    }
    setStatus('locating')
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation([pos.coords.latitude, pos.coords.longitude])
        setStatus('granted')
      },
      () => setStatus('denied'),
      { timeout: 8000 },
    )
  }

  return { location, status, request }
}
