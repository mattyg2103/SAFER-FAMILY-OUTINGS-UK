import type { MatchStatus, Place, Tri } from '../../types'
import { StatusLine } from '../StatusLine'

function triToStatus(value: Tri, positiveIsGood = true): MatchStatus {
  if (value === 'unknown') return 'unknown'
  return value === positiveIsGood ? 'good' : 'consider'
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl bg-white p-3.5 ring-1 ring-brand-100">
      <p className="mb-1 text-[11px] font-extrabold uppercase tracking-wide text-brand-500">{title}</p>
      {children}
    </div>
  )
}

export function KnowBeforeYouGo({ place }: { place: Place }) {
  const a = place.attributes
  const f = place.facilities

  const enclosureText =
    a.enclosure === 'full'
      ? 'Fully enclosed'
      : a.enclosure === 'partial'
        ? 'Partially enclosed'
        : a.enclosure === 'open'
          ? 'Open, no enclosure reported'
          : 'Enclosure not confirmed'
  const enclosureStatus: MatchStatus = a.enclosure === 'full' ? 'good' : a.enclosure === 'unknown' ? 'unknown' : 'consider'

  const waterText =
    a.water === 'none'
      ? 'No water reported nearby'
      : a.water === 'nearby-with-barrier'
        ? 'Water nearby — barrier reported'
        : a.water === 'nearby-open'
          ? 'Water nearby — open access, no barrier reported'
          : 'Water nearby not confirmed'
  const waterStatus: MatchStatus = a.water === 'none' || a.water === 'nearby-with-barrier' ? 'good' : a.water === 'unknown' ? 'unknown' : 'consider'

  const roadsText =
    a.roads === 'car-free'
      ? 'Car-free environment'
      : a.roads === 'quiet-road'
        ? 'Quiet road nearby'
        : a.roads === 'busy-road'
          ? 'Busy road reported nearby'
          : 'Roads nearby not confirmed'
  const roadsStatus: MatchStatus = a.roads === 'busy-road' ? 'consider' : a.roads === 'unknown' ? 'unknown' : 'good'

  const crossingsText =
    a.roadCrossings === 'unknown'
      ? 'Road crossings not confirmed'
      : a.roadCrossings === 0
        ? 'No road crossings reported'
        : `${a.roadCrossings} road crossing${a.roadCrossings === 1 ? '' : 's'} reported`
  const crossingsStatus: MatchStatus = a.roadCrossings === 'unknown' ? 'unknown' : a.roadCrossings === 0 ? 'good' : 'consider'

  return (
    <div className="flex flex-col gap-3">
      <Group title="Enclosure">
        <StatusLine status={enclosureStatus} text={enclosureText} />
      </Group>

      <Group title="Water">
        <StatusLine status={waterStatus} text={waterText} />
      </Group>

      <Group title="Roads">
        <StatusLine status={roadsStatus} text={roadsText} />
        <StatusLine status={crossingsStatus} text={crossingsText} />
      </Group>

      <Group title="Accessibility">
        <StatusLine status={triToStatus(a.wheelchairAccessible)} text={a.wheelchairAccessible === 'unknown' ? 'Wheelchair accessibility not confirmed' : a.wheelchairAccessible ? 'Wheelchair accessible' : 'Not reported as wheelchair accessible'} />
        <StatusLine status={triToStatus(a.buggyFriendly)} text={a.buggyFriendly === 'unknown' ? 'Buggy access not confirmed' : a.buggyFriendly ? 'Buggy friendly' : 'Not reported as buggy friendly'} />
        <StatusLine status={triToStatus(a.stepFree)} text={a.stepFree === 'unknown' ? 'Step-free access not confirmed' : a.stepFree ? 'Step-free access' : 'Steps reported'} />
        <StatusLine status={triToStatus(f.accessibleParking)} text={f.accessibleParking === 'unknown' ? 'Accessible parking not confirmed' : f.accessibleParking ? 'Accessible parking' : 'No accessible parking reported'} />
        <StatusLine status={triToStatus(f.accessibleToilet)} text={f.accessibleToilet === 'unknown' ? 'Accessible toilet not confirmed' : f.accessibleToilet ? 'Accessible toilet' : 'No accessible toilet reported'} />
        <StatusLine status={triToStatus(f.changingPlaces)} text={f.changingPlaces === 'unknown' ? 'Changing Places not confirmed' : f.changingPlaces ? 'Changing Places facility' : 'No Changing Places facility reported'} />
      </Group>

      <Group title="Environment">
        <StatusLine status={triToStatus(a.unevenTerrain, false)} text={a.unevenTerrain === 'unknown' ? 'Terrain not confirmed' : a.unevenTerrain ? 'Uneven terrain reported' : 'No uneven terrain reported'} />
        <StatusLine status={triToStatus(a.steps, false)} text={a.steps === 'unknown' ? 'Steps not confirmed' : a.steps ? 'Steps reported' : 'No steps reported'} />
        <StatusLine status={triToStatus(a.steepSections, false)} text={a.steepSections === 'unknown' ? 'Steep sections not confirmed' : a.steepSections ? 'Steep sections reported' : 'No steep sections reported'} />
        <StatusLine status={triToStatus(a.quiet)} text={a.quiet === 'unknown' ? 'Typical crowd levels not confirmed' : a.quiet ? 'Reported as generally quiet' : 'Can get busy at peak times'} />
      </Group>

      <Group title="Facilities">
        <StatusLine status={triToStatus(f.toilets)} text={f.toilets === 'unknown' ? 'Toilets not confirmed' : f.toilets ? 'Toilets on site' : 'No toilets reported'} />
        <StatusLine status={triToStatus(f.cafe)} text={f.cafe === 'unknown' ? 'Café not confirmed' : f.cafe ? 'Café on site' : 'No café reported'} />
        <StatusLine status={triToStatus(f.picnicTables)} text={f.picnicTables === 'unknown' ? 'Picnic tables not confirmed' : f.picnicTables ? 'Picnic tables' : 'No picnic tables reported'} />
        <StatusLine status={triToStatus(f.playAreas)} text={f.playAreas === 'unknown' ? 'Play area not confirmed' : f.playAreas ? 'Play area on site' : 'No play area reported'} />
        <StatusLine status={triToStatus(f.seating)} text={f.seating === 'unknown' ? 'Seating not confirmed' : f.seating ? 'Seating available' : 'Limited seating reported'} />
        <StatusLine status={triToStatus(f.babyChanging)} text={f.babyChanging === 'unknown' ? 'Baby changing not confirmed' : f.babyChanging ? 'Baby changing available' : 'No baby changing reported'} />
        <StatusLine status={triToStatus(f.shelter)} text={f.shelter === 'unknown' ? 'Shelter not confirmed' : f.shelter ? 'Shelter available' : 'No shelter reported'} />
      </Group>
    </div>
  )
}
