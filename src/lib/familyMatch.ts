import type {
  FamilyMatchResult,
  LocationAttributes,
  MatchFinding,
  MatchStatus,
  Place,
  Tri,
} from '../types'

// The Family Match engine never declares a place "safe" or "unsafe". It only
// surfaces factual information relevant to the practical needs a family has
// selected, grouped as: good match / things to consider / information needed.
// The parent or carer always makes the final call.

function triStatus(value: Tri, wantTrue = true): MatchStatus {
  if (value === 'unknown') return 'unknown'
  return value === wantTrue ? 'good' : 'consider'
}

interface TriRule {
  needKeys: string[]
  attribute: keyof LocationAttributes
  wantTrue?: boolean
  goodText: string
  considerText: string
  unknownText: string
}

const TRI_RULES: TriRule[] = [
  {
    needKeys: ['wheelchairUser', 'mobilityAid'],
    attribute: 'wheelchairAccessible',
    goodText: 'Reported as wheelchair accessible',
    considerText: 'Not reported as wheelchair accessible',
    unknownText: 'Wheelchair accessibility not confirmed',
  },
  {
    needKeys: ['wheelchairUser', 'mobilityAid', 'stepFreeRequired'],
    attribute: 'stepFree',
    goodText: 'Step-free access reported',
    considerText: 'Steps reported — may not be step-free',
    unknownText: 'Step-free access not confirmed',
  },
  {
    needKeys: ['buggyRequired'],
    attribute: 'buggyFriendly',
    goodText: 'Reported as buggy friendly',
    considerText: 'Not reported as buggy friendly',
    unknownText: 'Buggy access not confirmed',
  },
  {
    needKeys: ['accessibleParkingRequired'],
    attribute: 'accessibleParking',
    goodText: 'Accessible parking reported',
    considerText: 'No accessible parking reported',
    unknownText: 'Accessible parking not confirmed',
  },
  {
    needKeys: ['accessibleToiletRequired'],
    attribute: 'accessibleToilet',
    goodText: 'Accessible toilet reported',
    considerText: 'No accessible toilet reported',
    unknownText: 'Accessible toilet not confirmed',
  },
  {
    needKeys: ['changingPlacesRequired'],
    attribute: 'changingPlaces',
    goodText: 'Changing Places facility reported',
    considerText: 'No Changing Places facility reported',
    unknownText: 'Changing Places availability not confirmed',
  },
  {
    needKeys: ['flatRoutePreferred'],
    attribute: 'flatRoute',
    goodText: 'Reported as a flat route',
    considerText: 'Route reported as not flat',
    unknownText: 'Route gradient not confirmed',
  },
  {
    needKeys: ['surfacedRoutePreferred'],
    attribute: 'surfacedRoute',
    goodText: 'Mostly surfaced route reported',
    considerText: 'Route reported as unsurfaced in places',
    unknownText: 'Route surface not confirmed',
  },
  {
    needKeys: ['seatingRequired'],
    attribute: 'seating',
    goodText: 'Regular seating reported',
    considerText: 'Limited seating reported',
    unknownText: 'Seating not confirmed',
  },
  {
    needKeys: ['restPointsRequired'],
    attribute: 'restPoints',
    goodText: 'Rest points reported along the route',
    considerText: 'Few or no rest points reported',
    unknownText: 'Rest points not confirmed',
  },
  {
    needKeys: ['gatedPlaygroundPreferred'],
    attribute: 'gatedPlayground',
    goodText: 'Playground reported as fully gated',
    considerText: 'Playground not reported as fully gated',
    unknownText: 'Gate information has not been confirmed',
  },
  {
    needKeys: ['fencedPlayAreaPreferred'],
    attribute: 'fencedPlayArea',
    goodText: 'Play area reported as fenced',
    considerText: 'Play area not reported as fenced',
    unknownText: 'Fencing information has not been confirmed',
  },
  {
    needKeys: ['carFreePreferred'],
    attribute: 'carFree',
    goodText: 'Car-free environment reported',
    considerText: 'Vehicles reported in or near this location',
    unknownText: 'Whether this location is car-free is unconfirmed',
  },
  {
    needKeys: ['clearPathsPreferred', 'blind', 'partiallySighted'],
    attribute: 'clearPaths',
    goodText: 'Clear, well-defined paths reported',
    considerText: 'Paths not reported as clear or well-defined',
    unknownText: 'Path clarity not confirmed',
  },
  {
    needKeys: ['stepsInfoRequired', 'blind', 'partiallySighted'],
    attribute: 'steps',
    wantTrue: false,
    goodText: 'No steps reported',
    considerText: 'Steps reported',
    unknownText: 'Step information not confirmed',
  },
  {
    needKeys: ['terrainInfoRequired', 'blind', 'partiallySighted'],
    attribute: 'unevenTerrain',
    wantTrue: false,
    goodText: 'No uneven terrain reported',
    considerText: 'Uneven terrain reported',
    unknownText: 'Terrain has not been confirmed',
  },
  {
    needKeys: ['audioInfoPreferred'],
    attribute: 'audioInfo',
    goodText: 'Audio information available',
    considerText: 'No audio information reported',
    unknownText: 'Audio information not confirmed',
  },
  {
    needKeys: ['tactileActivitiesPreferred'],
    attribute: 'tactileActivities',
    goodText: 'Tactile activities available',
    considerText: 'No tactile activities reported',
    unknownText: 'Tactile activities not confirmed',
  },
  {
    needKeys: ['guidedActivitiesPreferred'],
    attribute: 'guidedActivities',
    goodText: 'Guided activities available',
    considerText: 'No guided activities reported',
    unknownText: 'Guided activities not confirmed',
  },
  {
    needKeys: ['sensoryActivitiesPreferred', 'sensoryFriendlyPreferred'],
    attribute: 'sensoryFriendly',
    goodText: 'Sensory-friendly activities reported',
    considerText: 'Not reported as offering sensory-friendly activities',
    unknownText: 'Sensory-friendly activities not confirmed',
  },
  {
    needKeys: ['visualInfoPreferred', 'visualCommunicationPreferred', 'deaf', 'hardOfHearing'],
    attribute: 'visualInfo',
    goodText: 'Visual information reported',
    considerText: 'No visual information reported',
    unknownText: 'Visual information not confirmed',
  },
  {
    needKeys: ['writtenInstructionsPreferred', 'deaf', 'hardOfHearing'],
    attribute: 'writtenInstructions',
    goodText: 'Written instructions available',
    considerText: 'No written instructions reported',
    unknownText: 'Written instructions not confirmed',
  },
  {
    needKeys: ['bslPreferred', 'deaf', 'hardOfHearing'],
    attribute: 'bslSupport',
    goodText: 'BSL-supported sessions reported',
    considerText: 'No BSL-supported sessions reported',
    unknownText: 'BSL support not confirmed',
  },
  {
    needKeys: ['quietEnvironmentsPreferred', 'avoidCrowdsPreferred'],
    attribute: 'quiet',
    goodText: 'Reported as generally quiet',
    considerText: 'Reported as busy or lively',
    unknownText: 'Noise levels not confirmed',
  },
  {
    needKeys: ['reducedNoiseSessionsPreferred'],
    attribute: 'reducedNoiseSessions',
    goodText: 'Reduced-noise sessions reported',
    considerText: 'No reduced-noise sessions reported',
    unknownText: 'Reduced-noise sessions not confirmed',
  },
  {
    needKeys: ['reducedLightSessionsPreferred'],
    attribute: 'reducedLightSessions',
    goodText: 'Reduced-light sessions reported',
    considerText: 'No reduced-light sessions reported',
    unknownText: 'Reduced-light sessions not confirmed',
  },
  {
    needKeys: ['sensoryRoomsPreferred', 'sensorySupportPreferred'],
    attribute: 'sensoryRoom',
    goodText: 'Sensory room reported',
    considerText: 'No sensory room reported',
    unknownText: 'Sensory room availability not confirmed',
  },
  {
    needKeys: ['quietBreakoutSpacePreferred', 'quietSpacesCommunicationPreferred'],
    attribute: 'quietBreakoutSpace',
    goodText: 'Quiet/breakout space reported',
    considerText: 'No quiet/breakout space reported',
    unknownText: 'Quiet/breakout space not confirmed',
  },
  {
    needKeys: ['smallerGroupsPreferred', 'smallerGroupsCommunicationPreferred'],
    attribute: 'smallerGroups',
    goodText: 'Smaller group sessions reported',
    considerText: 'Not reported as offering smaller groups',
    unknownText: 'Group sizes not confirmed',
  },
  {
    needKeys: ['outdoorSpacePreferred'],
    attribute: 'outdoorSpace',
    goodText: 'Outdoor space available',
    considerText: 'No outdoor space reported',
    unknownText: 'Outdoor space not confirmed',
  },
  {
    needKeys: ['indoorQuietAreaPreferred'],
    attribute: 'indoorQuietArea',
    goodText: 'Indoor quiet area available',
    considerText: 'No indoor quiet area reported',
    unknownText: 'Indoor quiet area not confirmed',
  },
  {
    needKeys: ['communicationBoardsPreferred'],
    attribute: 'communicationBoards',
    goodText: 'Communication boards reported',
    considerText: 'No communication boards reported',
    unknownText: 'Communication boards not confirmed',
  },
  {
    needKeys: ['visualSchedulesPreferred'],
    attribute: 'visualSchedules',
    goodText: 'Visual schedules reported',
    considerText: 'No visual schedules reported',
    unknownText: 'Visual schedules not confirmed',
  },
  {
    needKeys: ['simpleInstructionsPreferred'],
    attribute: 'simpleInstructions',
    goodText: 'Simple instructions reported',
    considerText: 'Not reported as offering simplified instructions',
    unknownText: 'Instruction style not confirmed',
  },
  {
    needKeys: ['staffSupportPreferred'],
    attribute: 'staffSupport',
    goodText: 'Staff support reported',
    considerText: 'No dedicated staff support reported',
    unknownText: 'Staff support not confirmed',
  },
]

function dedupe(findings: MatchFinding[]): MatchFinding[] {
  const seen = new Set<string>()
  return findings.filter((f) => {
    if (seen.has(f.text)) return false
    seen.add(f.text)
    return true
  })
}

export function computeFamilyMatch(
  place: Place,
  combinedNeeds: Set<string>,
  maxRouteDistanceMiles: number | null,
): FamilyMatchResult {
  const good: MatchFinding[] = []
  const consider: MatchFinding[] = []
  const unknown: MatchFinding[] = []

  if (combinedNeeds.size === 0) {
    return { good: [], consider: [], unknown: [], score: 100 }
  }

  for (const rule of TRI_RULES) {
    if (!rule.needKeys.some((k) => combinedNeeds.has(k))) continue
    const value = place.attributes[rule.attribute] as Tri
    const status = triStatus(value, rule.wantTrue ?? true)
    const text =
      status === 'good' ? rule.goodText : status === 'consider' ? rule.considerText : rule.unknownText
    ;(status === 'good' ? good : status === 'consider' ? consider : unknown).push({ status, text })
  }

  // Enclosure (string enum)
  if (combinedNeeds.has('enclosedPreferred')) {
    if (place.attributes.enclosure === 'full') {
      good.push({ status: 'good', text: 'Location reported as fully enclosed' })
    } else if (place.attributes.enclosure === 'partial') {
      consider.push({ status: 'consider', text: 'Location reported as only partially enclosed' })
    } else if (place.attributes.enclosure === 'open') {
      consider.push({ status: 'consider', text: 'Location reported as open, with no enclosure' })
    } else {
      unknown.push({ status: 'unknown', text: 'Enclosure has not been confirmed' })
    }
  }

  // Water
  if (
    combinedNeeds.has('avoidOpenWater') ||
    combinedNeeds.has('waterBarrierPreferred')
  ) {
    if (place.attributes.water === 'none') {
      good.push({ status: 'good', text: 'No water reported nearby' })
    } else if (place.attributes.water === 'nearby-with-barrier') {
      good.push({ status: 'good', text: 'Water nearby, barrier reported' })
    } else if (place.attributes.water === 'nearby-open') {
      consider.push({ status: 'consider', text: 'Water nearby with open access, no barrier reported' })
    } else {
      unknown.push({ status: 'unknown', text: 'Water nearby has not been confirmed' })
    }
  }

  // Roads
  if (combinedNeeds.has('avoidBusyRoads')) {
    if (place.attributes.roads === 'car-free') {
      good.push({ status: 'good', text: 'Car-free environment reported' })
    } else if (place.attributes.roads === 'quiet-road') {
      good.push({ status: 'good', text: 'Only quiet roads reported nearby' })
    } else if (place.attributes.roads === 'busy-road') {
      consider.push({ status: 'consider', text: 'Busy road reported near this location' })
    } else {
      unknown.push({ status: 'unknown', text: 'Roads nearby have not been confirmed' })
    }
  }

  if (combinedNeeds.has('avoidRoadCrossings')) {
    if (place.attributes.roadCrossings === 'unknown') {
      unknown.push({ status: 'unknown', text: 'Number of road crossings not confirmed' })
    } else if (place.attributes.roadCrossings === 0) {
      good.push({ status: 'good', text: 'No road crossings reported' })
    } else {
      consider.push({
        status: 'consider',
        text: `${place.attributes.roadCrossings} road crossing${place.attributes.roadCrossings === 1 ? '' : 's'} reported`,
      })
    }
  }

  // Route distance
  if (combinedNeeds.has('limitedWalkingDistance')) {
    if (maxRouteDistanceMiles == null) {
      unknown.push({ status: 'unknown', text: 'No maximum distance was set for this family' })
    } else if (place.routes.length === 0) {
      unknown.push({ status: 'unknown', text: 'Route distance is not available for this location' })
    } else {
      const shortest = Math.min(...place.routes.map((r) => r.distanceMiles))
      if (shortest <= maxRouteDistanceMiles) {
        good.push({ status: 'good', text: `Shortest route (${shortest} miles) fits within your preferred distance` })
      } else {
        consider.push({
          status: 'consider',
          text: `Shortest route (${shortest} miles) is longer than your preferred distance`,
        })
      }
    }
  }

  const dedupedGood = dedupe(good)
  const dedupedConsider = dedupe(consider)
  const dedupedUnknown = dedupe(unknown)

  const totalWeighted = dedupedGood.length + dedupedConsider.length + dedupedUnknown.length * 0.5
  const score = totalWeighted === 0 ? 100 : Math.round((dedupedGood.length / totalWeighted) * 100)

  return { good: dedupedGood, consider: dedupedConsider, unknown: dedupedUnknown, score }
}
