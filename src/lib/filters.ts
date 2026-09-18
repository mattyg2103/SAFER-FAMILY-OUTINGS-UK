import type { FilterState, Place, PlaceCategory } from '../types'

const INDOOR_CATEGORIES: PlaceCategory[] = ['indoor-activity', 'sensory-activity']
const OUTDOOR_CATEGORIES: PlaceCategory[] = [
  'playground',
  'park',
  'walk',
  'trail',
  'beach',
  'woodland',
  'nature-reserve',
  'picnic-spot',
]

export function placeMatchesFilters(place: Place, f: FilterState): boolean {
  if (f.category && place.category !== f.category) return false
  if (f.fullyEnclosed && place.attributes.enclosure !== 'full') return false
  if (f.wheelchairAccessible && place.attributes.wheelchairAccessible !== true) return false
  if (f.buggyFriendly && place.attributes.buggyFriendly !== true) return false
  if (f.stepFree && place.attributes.stepFree !== true) return false
  if (f.changingPlaces && place.facilities.changingPlaces !== true) return false
  if (f.accessibleToilet && place.facilities.accessibleToilet !== true) return false
  if (f.avoidOpenWater && !(place.attributes.water === 'none' || place.attributes.waterBarrier === true)) return false
  if (f.waterBarrierPreferred && place.attributes.waterBarrier !== true) return false
  if (f.avoidBusyRoads && place.attributes.roads === 'busy-road') return false
  if (f.avoidRoadCrossings && place.attributes.roadCrossings !== 0) return false
  if (f.quiet && place.attributes.quiet !== true) return false
  if (f.sensoryFriendly && place.attributes.sensoryFriendly !== true) return false
  if (f.flatRoute && place.attributes.flatRoute !== true) return false
  if (f.surfacedRoute && place.attributes.surfacedRoute !== true) return false
  if (f.seating && place.attributes.seating !== true) return false
  if (f.parking && place.facilities.parking !== true) return false
  if (f.free && !place.free) return false
  if (f.indoor && !INDOOR_CATEGORIES.includes(place.category)) return false
  if (f.outdoor && !OUTDOOR_CATEGORIES.includes(place.category)) return false
  if (f.underThirtyMinutes && place.routes.length > 0 && !place.routes.some((r) => r.estimatedMinutes <= 30))
    return false
  if (f.underOneMile && place.routes.length > 0 && !place.routes.some((r) => r.distanceMiles <= 1)) return false
  return true
}

export const FILTER_CHIPS: { key: keyof FilterState; label: string }[] = [
  { key: 'fullyEnclosed', label: 'Fully enclosed' },
  { key: 'wheelchairAccessible', label: 'Wheelchair accessible' },
  { key: 'buggyFriendly', label: 'Buggy friendly' },
  { key: 'stepFree', label: 'Step-free' },
  { key: 'changingPlaces', label: 'Changing Places' },
  { key: 'accessibleToilet', label: 'Accessible toilets' },
  { key: 'avoidOpenWater', label: 'Avoid open water' },
  { key: 'waterBarrierPreferred', label: 'Water barrier preferred' },
  { key: 'avoidBusyRoads', label: 'Avoid busy roads' },
  { key: 'avoidRoadCrossings', label: 'Avoid road crossings' },
  { key: 'quiet', label: 'Quiet location' },
  { key: 'sensoryFriendly', label: 'Sensory-friendly' },
  { key: 'underThirtyMinutes', label: 'Under 30 minutes' },
  { key: 'underOneMile', label: 'Under 1 mile' },
  { key: 'flatRoute', label: 'Flat route' },
  { key: 'surfacedRoute', label: 'Surfaced route' },
  { key: 'seating', label: 'Seating' },
  { key: 'parking', label: 'Parking' },
  { key: 'free', label: 'Free' },
  { key: 'indoor', label: 'Indoor' },
  { key: 'outdoor', label: 'Outdoor' },
]

export function suggestedFiltersForNeeds(needs: Set<string>): Partial<FilterState> {
  const suggestion: Partial<FilterState> = {}
  if (needs.has('enclosedPreferred') || needs.has('gatedPlaygroundPreferred') || needs.has('fencedPlayAreaPreferred'))
    suggestion.fullyEnclosed = true
  if (needs.has('wheelchairUser')) suggestion.wheelchairAccessible = true
  if (needs.has('buggyRequired')) suggestion.buggyFriendly = true
  if (needs.has('stepFreeRequired')) suggestion.stepFree = true
  if (needs.has('changingPlacesRequired')) suggestion.changingPlaces = true
  if (needs.has('accessibleToiletRequired')) suggestion.accessibleToilet = true
  if (needs.has('avoidOpenWater')) suggestion.avoidOpenWater = true
  if (needs.has('waterBarrierPreferred')) suggestion.waterBarrierPreferred = true
  if (needs.has('avoidBusyRoads')) suggestion.avoidBusyRoads = true
  if (needs.has('avoidRoadCrossings')) suggestion.avoidRoadCrossings = true
  if (needs.has('quietEnvironmentsPreferred')) suggestion.quiet = true
  if (needs.has('sensoryFriendlyPreferred')) suggestion.sensoryFriendly = true
  if (needs.has('flatRoutePreferred')) suggestion.flatRoute = true
  if (needs.has('surfacedRoutePreferred')) suggestion.surfacedRoute = true
  if (needs.has('seatingRequired')) suggestion.seating = true
  return suggestion
}
