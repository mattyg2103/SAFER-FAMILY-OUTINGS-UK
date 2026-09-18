import type { PlaceCategory } from '../types'

export const CATEGORY_META: Record<PlaceCategory, { label: string; icon: string }> = {
  playground: { label: 'Playground', icon: '🛝' },
  park: { label: 'Park', icon: '🌳' },
  walk: { label: 'Walk', icon: '🚶' },
  trail: { label: 'Trail', icon: '🥾' },
  beach: { label: 'Beach', icon: '🏖️' },
  woodland: { label: 'Woodland', icon: '🌲' },
  'nature-reserve': { label: 'Nature reserve', icon: '🦉' },
  'picnic-spot': { label: 'Picnic spot', icon: '🧺' },
  'free-attraction': { label: 'Free attraction', icon: '🎈' },
  'indoor-activity': { label: 'Indoor activity', icon: '🏛️' },
  'outdoor-activity': { label: 'Outdoor activity', icon: '🌤️' },
  'accessible-day-out': { label: 'Accessible day out', icon: '🎡' },
  'sensory-activity': { label: 'Sensory activity', icon: '✨' },
  'send-activity': { label: 'SEND activity', icon: '🧩' },
  'inclusive-activity': { label: 'Inclusive activity', icon: '🤝' },
}

export const CATEGORIES: PlaceCategory[] = Object.keys(CATEGORY_META) as PlaceCategory[]
