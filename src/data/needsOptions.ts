import type { NeedCategory, NeedOption } from '../types'

export const NEED_CATEGORY_LABELS: Record<NeedCategory, string> = {
  mobility: 'Mobility & physical access',
  wandering: 'Enclosure & wandering considerations',
  vision: 'Vision',
  hearing: 'Hearing',
  sensory: 'Sensory & environment',
  communication: 'Communication & cognitive support',
}

export const NEED_CATEGORY_INTRO: Record<NeedCategory, string> = {
  mobility: 'Wheels, walking distance and step-free access.',
  wandering: 'Enclosure, water and roads near a location.',
  vision: 'Support for children who are blind or partially sighted.',
  hearing: 'Support for children who are deaf or hard of hearing.',
  sensory: 'Noise, light, crowds and quieter spaces.',
  communication: 'Visual supports, simple instructions and staff support.',
}

export const NEED_OPTIONS: NeedOption[] = [
  // 6. Mobility & physical access
  { key: 'wheelchairUser', label: 'Wheelchair user', category: 'mobility' },
  { key: 'mobilityAid', label: 'Uses a mobility aid', category: 'mobility' },
  { key: 'buggyRequired', label: 'Buggy required', category: 'mobility' },
  { key: 'stepFreeRequired', label: 'Step-free access required', category: 'mobility' },
  { key: 'accessibleParkingRequired', label: 'Accessible parking required', category: 'mobility' },
  { key: 'accessibleToiletRequired', label: 'Accessible toilet required', category: 'mobility' },
  { key: 'changingPlacesRequired', label: 'Changing Places required', category: 'mobility' },
  { key: 'flatRoutePreferred', label: 'Flat routes preferred', category: 'mobility' },
  { key: 'surfacedRoutePreferred', label: 'Surfaced routes preferred', category: 'mobility' },
  { key: 'seatingRequired', label: 'Regular seating required', category: 'mobility' },
  { key: 'restPointsRequired', label: 'Rest points required', category: 'mobility' },
  { key: 'limitedWalkingDistance', label: 'Limited walking distance', category: 'mobility' },

  // 7. Wandering / elopement considerations
  { key: 'enclosedPreferred', label: 'Enclosed locations preferred', category: 'wandering' },
  { key: 'gatedPlaygroundPreferred', label: 'Fully gated playground preferred', category: 'wandering' },
  { key: 'fencedPlayAreaPreferred', label: 'Fenced play areas preferred', category: 'wandering' },
  { key: 'avoidOpenWater', label: 'Avoid open access to water', category: 'wandering' },
  { key: 'waterBarrierPreferred', label: 'Water barriers preferred', category: 'wandering' },
  { key: 'avoidBusyRoads', label: 'Avoid busy roads', category: 'wandering' },
  { key: 'avoidRoadCrossings', label: 'Avoid road crossings', category: 'wandering' },
  { key: 'carFreePreferred', label: 'Car-free locations preferred', category: 'wandering' },
  { key: 'limitedExitsPreferred', label: 'Locations with limited exits preferred', category: 'wandering' },

  // 8. Vision requirements
  { key: 'blind', label: 'Blind', category: 'vision' },
  { key: 'partiallySighted', label: 'Partially sighted', category: 'vision' },
  { key: 'clearPathsPreferred', label: 'Clear paths preferred', category: 'vision' },
  { key: 'stepsInfoRequired', label: 'Information about steps required', category: 'vision' },
  { key: 'terrainInfoRequired', label: 'Information about uneven terrain required', category: 'vision' },
  { key: 'sensoryActivitiesPreferred', label: 'Sensory activities preferred', category: 'vision' },
  { key: 'guidedActivitiesPreferred', label: 'Guided activities preferred', category: 'vision' },
  { key: 'audioInfoPreferred', label: 'Audio information available', category: 'vision' },
  { key: 'tactileActivitiesPreferred', label: 'Tactile activities available', category: 'vision' },

  // 9. Hearing requirements
  { key: 'deaf', label: 'Deaf', category: 'hearing' },
  { key: 'hardOfHearing', label: 'Hard of hearing', category: 'hearing' },
  { key: 'visualInfoPreferred', label: 'Visual information preferred', category: 'hearing' },
  { key: 'writtenInstructionsPreferred', label: 'Written instructions available', category: 'hearing' },
  { key: 'bslPreferred', label: 'BSL-supported sessions where available', category: 'hearing' },
  { key: 'visualCommunicationSupport', label: 'Visual communication support', category: 'hearing' },
  { key: 'nonAudioActivitiesPreferred', label: 'Activities that do not rely solely on audio instructions', category: 'hearing' },

  // 10. Sensory & environmental requirements
  { key: 'quietEnvironmentsPreferred', label: 'Quiet environments preferred', category: 'sensory' },
  { key: 'sensoryFriendlyPreferred', label: 'Sensory-friendly activities', category: 'sensory' },
  { key: 'reducedNoiseSessionsPreferred', label: 'Reduced-noise sessions', category: 'sensory' },
  { key: 'reducedLightSessionsPreferred', label: 'Reduced-light sessions', category: 'sensory' },
  { key: 'sensoryRoomsPreferred', label: 'Sensory rooms', category: 'sensory' },
  { key: 'quietBreakoutSpacePreferred', label: 'Quiet/breakout spaces', category: 'sensory' },
  { key: 'smallerGroupsPreferred', label: 'Smaller groups', category: 'sensory' },
  { key: 'avoidCrowdsPreferred', label: 'Avoid large crowds', category: 'sensory' },
  { key: 'predictableEnvironmentPreferred', label: 'Predictable environments', category: 'sensory' },
  { key: 'outdoorSpacePreferred', label: 'Outdoor space available', category: 'sensory' },
  { key: 'indoorQuietAreaPreferred', label: 'Indoor quiet area available', category: 'sensory' },

  // 11. Communication & cognitive support
  { key: 'visualCommunicationPreferred', label: 'Visual communication', category: 'communication' },
  { key: 'communicationBoardsPreferred', label: 'Communication boards', category: 'communication' },
  { key: 'visualSchedulesPreferred', label: 'Visual schedules', category: 'communication' },
  { key: 'simpleInstructionsPreferred', label: 'Simple instructions', category: 'communication' },
  { key: 'predictableRoutesPreferred', label: 'Predictable routes', category: 'communication' },
  { key: 'staffSupportPreferred', label: 'Staff support', category: 'communication' },
  { key: 'smallerGroupsCommunicationPreferred', label: 'Smaller groups', category: 'communication' },
  { key: 'quietSpacesCommunicationPreferred', label: 'Quiet spaces', category: 'communication' },
  { key: 'sensorySupportPreferred', label: 'Sensory support', category: 'communication' },
]

export const NEED_OPTIONS_BY_CATEGORY: Record<NeedCategory, NeedOption[]> = NEED_OPTIONS.reduce(
  (acc, opt) => {
    acc[opt.category] = acc[opt.category] || []
    acc[opt.category].push(opt)
    return acc
  },
  {} as Record<NeedCategory, NeedOption[]>,
)

export const NEED_OPTION_MAP: Record<string, NeedOption> = Object.fromEntries(
  NEED_OPTIONS.map((o) => [o.key, o]),
)

export const ROUTE_DISTANCE_OPTIONS = [
  { key: 'under-0.5', label: 'Under 0.5 mile', value: 0.5 },
  { key: 'under-1', label: 'Under 1 mile', value: 1 },
  { key: 'under-2', label: 'Under 2 miles', value: 2 },
  { key: 'no-preference', label: 'No preference', value: null },
]
