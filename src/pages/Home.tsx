import { useMemo, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { PLACES } from '../data/locations'
import { SectionRow } from '../components/home/SectionRow'
import { useFamily } from '../context/FamilyContext'
import { computeFamilyMatch } from '../lib/familyMatch'
import { haversineMiles } from '../lib/distance'
import { DEFAULT_CENTER, useUserLocation } from '../lib/geo'
import { EVENTS } from '../data/events'
import { getPlaceById } from '../data/locations'

export function Home() {
  const navigate = useNavigate()
  const { children, activeChildIds, toggleActiveChild, combinedNeeds, maxRouteDistanceMiles } = useFamily()
  const { location, request } = useUserLocation()
  const [query, setQuery] = useState('')
  const center = location ?? DEFAULT_CENTER

  const placesWithDistance = useMemo(
    () => PLACES.map((p) => ({ place: p, distance: haversineMiles(center, [p.lat, p.lng]) })).sort((a, b) => a.distance - b.distance),
    [center],
  )

  const freeNearYou = placesWithDistance.filter((p) => p.place.free).slice(0, 6).map((p) => p.place)
  const greatMatches = combinedNeeds.size
    ? placesWithDistance
        .map((p) => ({ ...p, match: computeFamilyMatch(p.place, combinedNeeds, maxRouteDistanceMiles) }))
        .filter((p) => p.match.consider.length === 0 && p.match.good.length > 0)
        .slice(0, 6)
        .map((p) => p.place)
    : []
  const enclosedPlaygrounds = placesWithDistance
    .filter((p) => p.place.category === 'playground' && p.place.attributes.enclosure === 'full')
    .map((p) => p.place)
  const accessibleWalks = placesWithDistance
    .filter((p) => p.place.routes.length > 0 && p.place.attributes.wheelchairAccessible === true)
    .map((p) => p.place)
  const quieterActivities = placesWithDistance.filter((p) => p.place.attributes.quiet === true).map((p) => p.place)
  const wheelchairFriendly = placesWithDistance.filter((p) => p.place.attributes.wheelchairAccessible === true).map((p) => p.place)
  const shortWalks = placesWithDistance
    .filter((p) => p.place.routes.some((r) => r.distanceMiles <= 1))
    .map((p) => p.place)
  const todaysEvents = EVENTS.filter((e) => e.frequency.includes('today'))
    .map((e) => getPlaceById(e.placeId))
    .filter((p): p is NonNullable<typeof p> => !!p)
  const recentlyAdded = [...PLACES].reverse().slice(0, 6)
  const familyFavourites = [...PLACES].sort((a, b) => b.reviews.length - a.reviews.length).slice(0, 6)

  const activeChildren = children.filter((c) => activeChildIds.includes(c.id))

  return (
    <div className="flex-1 pb-4">
      <div className="bg-brand-600 px-4 pb-6 pt-5 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[12px] font-semibold text-brand-100">Safer Family Outings UK</p>
            <h1 className="text-xl font-extrabold">Where shall we go today?</h1>
          </div>
          <Link to="/family" className="text-2xl">👪</Link>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault()
            navigate(`/explore?q=${encodeURIComponent(query)}`)
          }}
          className="mt-4 flex items-center gap-2 rounded-full bg-white px-4 py-2.5 shadow-sm"
        >
          <span>🔍</span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search town, city or postcode"
            className="flex-1 text-[14px] text-slate-700 outline-none"
          />
        </form>

        <div className="mt-3 flex gap-2">
          <button onClick={request} className="flex-1 rounded-full bg-white/15 py-2 text-[12px] font-bold">
            📍 Use my location
          </button>
          <button onClick={() => navigate('/explore?view=map')} className="flex-1 rounded-full bg-white/15 py-2 text-[12px] font-bold">
            🗺️ Map
          </button>
          <button onClick={() => navigate('/explore?view=list')} className="flex-1 rounded-full bg-white/15 py-2 text-[12px] font-bold">
            📋 List
          </button>
        </div>

        {children.length > 0 && (
          <div className="no-scrollbar mt-4 flex gap-2 overflow-x-auto">
            {children.map((c) => (
              <button
                key={c.id}
                onClick={() => toggleActiveChild(c.id)}
                className={`flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] font-bold ${
                  activeChildIds.includes(c.id) ? 'bg-white text-brand-700' : 'bg-white/15 text-white'
                }`}
              >
                <span>{c.avatar}</span> {c.displayName}
                {activeChildIds.includes(c.id) && ' ✓'}
              </button>
            ))}
            <Link to="/family/child/new" className="flex shrink-0 items-center rounded-full bg-white/15 px-3 py-1.5 text-[12px] font-bold text-white">
              + Add child
            </Link>
          </div>
        )}
        {activeChildren.length > 0 && (
          <p className="mt-2 text-[11px] text-brand-100">Showing matches for {activeChildren.map((c) => c.displayName).join(', ')}</p>
        )}
      </div>

      <SectionRow title="FREE NEAR YOU" places={freeNearYou} />
      {combinedNeeds.size > 0 && (
        <SectionRow title="GREAT MATCHES FOR YOUR FAMILY" places={greatMatches} emptyText="No strong matches nearby yet — try adjusting filters." />
      )}
      <SectionRow title="ENCLOSED PLAYGROUNDS" places={enclosedPlaygrounds} />
      <SectionRow title="ACCESSIBLE WALKS" places={accessibleWalks} />
      <SectionRow title="WHAT'S ON TODAY" places={todaysEvents} emptyText="Nothing scheduled today — check What's On for upcoming activities." />
      <SectionRow title="QUIETER ACTIVITIES" places={quieterActivities} />
      <SectionRow title="WHEELCHAIR-FRIENDLY OUTINGS" places={wheelchairFriendly} />
      <SectionRow title="SHORT FAMILY WALKS" places={shortWalks} />
      <SectionRow title="RECENTLY ADDED" places={recentlyAdded} />
      <SectionRow title="FAMILY FAVOURITES" places={familyFavourites} />

      <div className="mx-4 mt-6 rounded-2xl bg-sun-50 p-4 text-center">
        <p className="text-[13px] font-bold text-sun-500">Looking for specialist or inclusive activities?</p>
        <Link to="/additional-needs" className="mt-2 inline-block rounded-full bg-sun-400 px-4 py-2 text-[12px] font-extrabold text-white">
          Explore additional needs activities
        </Link>
      </div>
    </div>
  )
}
