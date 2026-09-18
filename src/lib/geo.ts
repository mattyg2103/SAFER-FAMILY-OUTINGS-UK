import { useState } from 'react'

export const DEFAULT_CENTER: [number, number] = [53.385, -1.47] // Millbrook town centre (sample data area)

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
