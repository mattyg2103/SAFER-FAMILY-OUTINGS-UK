import { useState } from 'react'
import { useParams, Link, Navigate } from 'react-router-dom'
import { getPlaceById } from '../data/locations'
import { TopBar } from '../components/layout/TopBar'
import { CATEGORY_META } from '../lib/categoryMeta'
import { KnowBeforeYouGo } from '../components/location/KnowBeforeYouGo'
import { FamilyMatchCard } from '../components/location/FamilyMatchCard'
import { ReviewsList } from '../components/location/ReviewsList'
import { RouteSummary } from '../components/location/RouteSummary'
import { RouteJourney } from '../components/map/RouteJourney'
import { MapView } from '../components/map/MapView'
import { useFamily } from '../context/FamilyContext'
import { EVENTS } from '../data/events'

type Tab = 'overview' | 'match' | 'route' | 'reviews'

export function LocationDetail() {
  const { id } = useParams()
  const place = id ? getPlaceById(id) : undefined
  const { isSaved, toggleSaved, contributedReviews } = useFamily()
  const [tab, setTab] = useState<Tab>('overview')
  const [selectedWaypoint, setSelectedWaypoint] = useState<string | undefined>(undefined)
  const [routeIndex, setRouteIndex] = useState(0)

  if (!place) return <Navigate to="/explore" replace />

  const route = place.routes[routeIndex]
  const events = EVENTS.filter((e) => e.placeId === place.id)
  const allReviews = [...place.reviews, ...contributedReviews.filter((r) => r.placeId === place.id)]

  return (
    <div className="flex flex-1 flex-col">
      <TopBar
        title={place.name}
        right={
          <button onClick={() => toggleSaved(place.id)} aria-label="Save" className="text-xl">
            {isSaved(place.id) ? '❤️' : '🤍'}
          </button>
        }
      />

      <div className="flex h-40 items-center justify-center bg-brand-50 text-6xl">{place.heroImage}</div>
      <div className="no-scrollbar flex gap-2 overflow-x-auto bg-brand-50 px-4 pb-3">
        {place.gallery.map((g, i) => (
          <div key={i} className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-white text-2xl ring-1 ring-brand-100">
            {g}
          </div>
        ))}
      </div>

      <div className="px-4 pt-3">
        <span className="text-[11px] font-bold uppercase tracking-wide text-brand-500">
          {CATEGORY_META[place.category].icon} {CATEGORY_META[place.category].label} · {place.town}
        </span>
        <h1 className="text-xl font-extrabold text-brand-900">{place.name}</h1>
        <p className="mt-1 text-[13px] text-slate-500">
          {place.free ? 'Free' : place.priceNote} · {place.postcode}
        </p>
        <p className="mt-2 text-[13px] leading-relaxed text-slate-700">{place.description}</p>
        <p className="mt-2 text-[11px] text-slate-400">
          Information provided by {place.infoSource === 'venue' ? 'the venue' : 'the community'} · Last checked{' '}
          {new Date(place.lastChecked).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
        </p>
        <div className="mt-2 flex gap-2">
          <a
            href={`https://www.openstreetmap.org/directions?to=${place.lat}%2C${place.lng}`}
            target="_blank"
            rel="noreferrer"
            className="rounded-full bg-brand-600 px-4 py-2 text-[12px] font-bold text-white"
          >
            Directions
          </a>
          <Link to={`/contribute?place=${place.id}`} className="rounded-full bg-brand-50 px-4 py-2 text-[12px] font-bold text-brand-700">
            Report or update info
          </Link>
        </div>
      </div>

      {place.inclusiveAdjustments.length > 0 && (
        <div className="mx-4 mt-3 rounded-2xl bg-sun-50 p-3.5">
          <p className="mb-1 text-[11px] font-extrabold uppercase tracking-wide text-sun-500">Inclusive adjustments</p>
          <ul className="flex flex-col gap-1">
            {place.inclusiveAdjustments.map((a) => (
              <li key={a.key} className="text-[13px] text-slate-700">• {a.label}</li>
            ))}
          </ul>
        </div>
      )}

      {events.length > 0 && (
        <div className="mx-4 mt-3 rounded-2xl bg-white p-3.5 ring-1 ring-brand-100">
          <p className="mb-1 text-[11px] font-extrabold uppercase tracking-wide text-brand-500">What's on here</p>
          {events.map((e) => (
            <div key={e.id} className="border-b border-brand-50 py-1.5 last:border-none">
              <p className="text-[13px] font-bold text-slate-800">{e.title}</p>
              <p className="text-[12px] text-slate-500">{e.dateLabel}</p>
            </div>
          ))}
        </div>
      )}

      <div className="sticky top-[52px] z-20 mt-4 flex gap-1 border-b border-brand-100 bg-white px-4">
        {(['overview', 'match', 'route', 'reviews'] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 border-b-2 py-2.5 text-[12px] font-bold capitalize ${
              tab === t ? 'border-brand-600 text-brand-700' : 'border-transparent text-slate-400'
            }`}
          >
            {t === 'match' ? 'Family match' : t === 'route' ? 'Route' : t}
          </button>
        ))}
      </div>

      <div className="flex-1 p-4">
        {tab === 'overview' && (
          <>
            <div className="mb-4 h-48 overflow-hidden rounded-2xl ring-1 ring-brand-100">
              <MapView places={[place]} center={[place.lat, place.lng]} zoom={15} />
            </div>
            <KnowBeforeYouGo place={place} />
          </>
        )}

        {tab === 'match' && <FamilyMatchCard place={place} />}

        {tab === 'route' && (
          <>
            {place.routes.length === 0 ? (
              <p className="text-sm text-slate-400">No walking route has been added for this location yet.</p>
            ) : (
              <div className="flex flex-col gap-4">
                {place.routes.length > 1 && (
                  <div className="flex gap-2">
                    {place.routes.map((r, i) => (
                      <button
                        key={r.id}
                        onClick={() => setRouteIndex(i)}
                        className={`rounded-full px-3 py-1.5 text-[12px] font-bold ${
                          i === routeIndex ? 'bg-brand-600 text-white' : 'bg-brand-50 text-brand-700'
                        }`}
                      >
                        {r.name}
                      </button>
                    ))}
                  </div>
                )}
                <RouteSummary route={route} />
                <div className="h-56 overflow-hidden rounded-2xl ring-1 ring-brand-100">
                  <MapView
                    places={[]}
                    route={route}
                    center={[route.waypoints[0]?.lat ?? place.lat, route.waypoints[0]?.lng ?? place.lng]}
                    zoom={15}
                    highlightedWaypointId={selectedWaypoint}
                  />
                </div>
                <div>
                  <p className="mb-2 text-[11px] font-extrabold uppercase tracking-wide text-brand-500">Route journey</p>
                  <RouteJourney route={route} selectedId={selectedWaypoint} onSelect={setSelectedWaypoint} />
                </div>
              </div>
            )}
          </>
        )}

        {tab === 'reviews' && (
          <>
            <Link
              to={`/contribute?place=${place.id}&type=review`}
              className="mb-3 block rounded-full bg-brand-600 py-2.5 text-center text-[13px] font-extrabold text-white"
            >
              Leave a review
            </Link>
            <ReviewsList reviews={allReviews} />
          </>
        )}
      </div>
    </div>
  )
}
