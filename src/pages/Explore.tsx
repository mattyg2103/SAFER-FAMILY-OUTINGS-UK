import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { PLACES } from '../data/locations'
import { TopBar } from '../components/layout/TopBar'
import { MapView } from '../components/map/MapView'
import { PlaceCard } from '../components/home/PlaceCard'
import { FilterSheet } from '../components/filters/FilterSheet'
import type { FilterState } from '../types'
import { placeMatchesFilters, suggestedFiltersForNeeds } from '../lib/filters'
import { DEFAULT_CENTER, DEFAULT_ZOOM, LOCATED_ZOOM, useUserLocation } from '../lib/geo'
import { haversineMiles } from '../lib/distance'
import { useFamily } from '../context/FamilyContext'

export function Explore() {
  const [params, setParams] = useSearchParams()
  const view = (params.get('view') as 'map' | 'list') ?? 'list'
  const [query, setQuery] = useState(params.get('q') ?? '')
  const [filterOpen, setFilterOpen] = useState(false)
  const { combinedNeeds } = useFamily()
  const [filters, setFilters] = useState<FilterState>(() => suggestedFiltersForNeeds(combinedNeeds))
  const { location } = useUserLocation()

  const filtered = useMemo(() => {
    return PLACES.filter((p) => placeMatchesFilters(p, filters)).filter((p) =>
      query ? `${p.name} ${p.town} ${p.postcode ?? ''}`.toLowerCase().includes(query.toLowerCase()) : true,
    )
  }, [filters, query])

  // Centre on the user's real location when known; otherwise, if they've
  // searched for somewhere, jump to the first match; otherwise show the
  // whole of the UK so it's obvious there's nationwide coverage.
  const center: [number, number] = location
    ? location
    : query && filtered.length > 0
      ? [filtered[0].lat, filtered[0].lng]
      : DEFAULT_CENTER
  const zoom = location ? LOCATED_ZOOM : query && filtered.length > 0 ? 12 : DEFAULT_ZOOM

  const withDistance = filtered
    .map((p) => ({ place: p, distance: haversineMiles(center, [p.lat, p.lng]) }))
    .sort((a, b) => a.distance - b.distance)

  const activeCount = Object.values(filters).filter(Boolean).length

  return (
    <div className="flex flex-1 flex-col">
      <TopBar title="Explore" showBack={false} />
      <div className="flex items-center gap-2 border-b border-brand-100 bg-white px-4 py-2.5">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search town, city or postcode"
          className="flex-1 rounded-full bg-brand-50 px-3 py-2 text-[13px] outline-none"
        />
        <button
          onClick={() => setFilterOpen(true)}
          className="relative shrink-0 rounded-full bg-brand-600 px-3 py-2 text-[12px] font-bold text-white"
        >
          Filters {activeCount > 0 && `(${activeCount})`}
        </button>
      </div>

      <div className="flex gap-2 border-b border-brand-100 bg-white px-4 py-2">
        <button
          onClick={() => setParams({ view: 'list' })}
          className={`flex-1 rounded-full py-1.5 text-[12px] font-bold ${view === 'list' ? 'bg-brand-600 text-white' : 'bg-brand-50 text-brand-700'}`}
        >
          List
        </button>
        <button
          onClick={() => setParams({ view: 'map' })}
          className={`flex-1 rounded-full py-1.5 text-[12px] font-bold ${view === 'map' ? 'bg-brand-600 text-white' : 'bg-brand-50 text-brand-700'}`}
        >
          Map
        </button>
      </div>

      {view === 'map' ? (
        <div className="h-[60vh] min-h-[360px]">
          <MapView places={filtered} center={center} zoom={zoom} userLocation={location ?? undefined} />
        </div>
      ) : (
        <div className="flex-1 p-4">
          {withDistance.length === 0 && (
            <p className="mt-8 text-center text-sm text-slate-400">No places match your filters yet. Try clearing some filters.</p>
          )}
          <div className="grid grid-cols-2 gap-3">
            {withDistance.map(({ place, distance }) => (
              <PlaceCard key={place.id} place={place} distanceMiles={distance} />
            ))}
          </div>
        </div>
      )}

      <FilterSheet open={filterOpen} onClose={() => setFilterOpen(false)} filters={filters} setFilters={setFilters} />
    </div>
  )
}
