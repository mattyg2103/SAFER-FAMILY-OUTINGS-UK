// Core domain types for Safer Family Outings UK

export type Tri = boolean | 'unknown'

export type NeedCategory =
  | 'mobility'
  | 'wandering'
  | 'vision'
  | 'hearing'
  | 'sensory'
  | 'communication'

export interface NeedOption {
  key: string
  label: string
  category: NeedCategory
  helpText?: string
}

export interface ChildProfile {
  id: string
  displayName: string // first name / initials / nickname — never a full legal name
  avatar: string // emoji avatar, no photo required
  needs: string[] // NeedOption keys selected for this child
  maxRouteDistanceMiles?: number | null // null/undefined = no preference
  createdAt: string
}

export interface FamilyAccount {
  id: string
  email: string
  createdAt: string
}

export type EnclosureLevel = 'full' | 'partial' | 'open' | 'unknown'
export type WaterLevel = 'none' | 'nearby-with-barrier' | 'nearby-open' | 'unknown'
export type RoadLevel = 'car-free' | 'quiet-road' | 'busy-road' | 'unknown'

export interface LocationAttributes {
  enclosure: EnclosureLevel
  gatedPlayground: Tri
  fencedPlayArea: Tri
  water: WaterLevel
  waterBarrier: Tri
  roads: RoadLevel
  roadCrossings: number | 'unknown'
  carFree: Tri
  wheelchairAccessible: Tri
  buggyFriendly: Tri
  stepFree: Tri
  accessibleParking: Tri
  accessibleToilet: Tri
  changingPlaces: Tri
  flatRoute: Tri
  surfacedRoute: Tri
  seating: Tri
  restPoints: Tri
  unevenTerrain: Tri
  steps: Tri
  steepSections: Tri
  quiet: Tri
  sensoryFriendly: Tri
  reducedNoiseSessions: Tri
  reducedLightSessions: Tri
  sensoryRoom: Tri
  quietBreakoutSpace: Tri
  smallerGroups: Tri
  clearPaths: Tri
  audioInfo: Tri
  tactileActivities: Tri
  guidedActivities: Tri
  visualInfo: Tri
  writtenInstructions: Tri
  bslSupport: Tri
  communicationBoards: Tri
  visualSchedules: Tri
  simpleInstructions: Tri
  staffSupport: Tri
  indoorQuietArea: Tri
  outdoorSpace: Tri
}

export interface Facilities {
  toilets: Tri
  accessibleToilet: Tri
  cafe: Tri
  picnicTables: Tri
  playAreas: Tri
  seating: Tri
  babyChanging: Tri
  shelter: Tri
  parking: Tri
  accessibleParking: Tri
  changingPlaces: Tri
}

export type RouteWaypointKind =
  | 'start'
  | 'finish'
  | 'parking'
  | 'entrance'
  | 'playground'
  | 'woodland'
  | 'riverside'
  | 'picnic'
  | 'toilets'
  | 'viewpoint'
  | 'poi'

export interface RouteWaypoint {
  id: string
  kind: RouteWaypointKind
  label: string
  lat: number
  lng: number
  note?: string
}

export interface WalkingRoute {
  id: string
  name: string
  distanceMiles: number
  estimatedMinutes: number
  shape: 'circular' | 'point-to-point'
  path: [number, number][] // lat,lng polyline
  waypoints: RouteWaypoint[]
  surfacedRoute: Tri
  flatRoute: Tri
  waterAlongside: Tri
  waterBarrier: Tri
  roadCrossings: number | 'unknown'
  steps: Tri
  unevenTerrain: Tri
  lastChecked: string
}

export type PlaceCategory =
  | 'playground'
  | 'park'
  | 'walk'
  | 'trail'
  | 'beach'
  | 'woodland'
  | 'nature-reserve'
  | 'picnic-spot'
  | 'free-attraction'
  | 'indoor-activity'
  | 'outdoor-activity'
  | 'accessible-day-out'
  | 'sensory-activity'
  | 'send-activity'
  | 'inclusive-activity'

export interface Review {
  id: string
  authorLabel: string // e.g. "A family who visited" — never exposes identity
  rating: number // 1-5
  text: string
  visitedWith?: string // e.g. "Wheelchair user, age 6"
  createdAt: string
  helpfulCount: number
}

export interface InclusiveAdjustment {
  key: string
  label: string
}

export interface Place {
  id: string
  name: string
  category: PlaceCategory
  lat: number
  lng: number
  town: string
  postcode?: string
  free: boolean
  priceNote?: string
  heroImage: string // emoji used as a lightweight illustrative placeholder
  gallery: string[]
  description: string
  attributes: LocationAttributes
  facilities: Facilities
  routes: WalkingRoute[]
  inclusiveAdjustments: InclusiveAdjustment[]
  reviews: Review[]
  venueManaged: boolean
  lastChecked: string
  infoSource: 'community' | 'venue'
}

export type EventFrequency = 'today' | 'tomorrow' | 'weekend' | 'holidays'

export interface WhatsOnEvent {
  id: string
  placeId: string
  title: string
  description: string
  dateLabel: string
  frequency: EventFrequency[]
  free: boolean
  priceNote?: string
  send: boolean
  sensory: boolean
  quiet: boolean
  wheelchairAccessible: boolean
  indoor: boolean
  enclosed: boolean
  changingPlaces: boolean
  accessibleToilet: boolean
}

export interface FilterState {
  category?: PlaceCategory
  fullyEnclosed?: boolean
  wheelchairAccessible?: boolean
  buggyFriendly?: boolean
  stepFree?: boolean
  changingPlaces?: boolean
  accessibleToilet?: boolean
  avoidOpenWater?: boolean
  waterBarrierPreferred?: boolean
  avoidBusyRoads?: boolean
  avoidRoadCrossings?: boolean
  quiet?: boolean
  sensoryFriendly?: boolean
  underThirtyMinutes?: boolean
  underOneMile?: boolean
  flatRoute?: boolean
  surfacedRoute?: boolean
  seating?: boolean
  parking?: boolean
  free?: boolean
  indoor?: boolean
  outdoor?: boolean
}

export type MatchStatus = 'good' | 'consider' | 'unknown'

export interface MatchFinding {
  status: MatchStatus
  text: string
}

export interface FamilyMatchResult {
  good: MatchFinding[]
  consider: MatchFinding[]
  unknown: MatchFinding[]
  score: number // 0-100, rough proportion of good vs total relevant findings
}
