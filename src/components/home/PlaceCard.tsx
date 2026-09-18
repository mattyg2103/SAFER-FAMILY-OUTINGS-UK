import { Link } from 'react-router-dom'
import type { Place } from '../../types'
import { CATEGORY_META } from '../../lib/categoryMeta'
import { useFamily } from '../../context/FamilyContext'
import { computeFamilyMatch } from '../../lib/familyMatch'

export function PlaceCard({ place, distanceMiles }: { place: Place; distanceMiles?: number }) {
  const { combinedNeeds, maxRouteDistanceMiles, isSaved, toggleSaved } = useFamily()
  const match = computeFamilyMatch(place, combinedNeeds, maxRouteDistanceMiles)
  const showMatch = combinedNeeds.size > 0

  return (
    <Link
      to={`/place/${place.id}`}
      className="relative flex w-44 shrink-0 flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-brand-100"
    >
      <div className="flex h-24 items-center justify-center bg-brand-50 text-4xl">{place.heroImage}</div>
      <button
        onClick={(e) => {
          e.preventDefault()
          toggleSaved(place.id)
        }}
        aria-label="Save"
        className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-sm shadow"
      >
        {isSaved(place.id) ? '❤️' : '🤍'}
      </button>
      <div className="flex flex-1 flex-col gap-1 p-2.5">
        <span className="text-[10px] font-bold uppercase tracking-wide text-brand-500">
          {CATEGORY_META[place.category].icon} {CATEGORY_META[place.category].label}
        </span>
        <span className="text-[13px] font-bold leading-tight text-slate-800">{place.name}</span>
        <div className="mt-auto flex items-center justify-between text-[11px] text-slate-500">
          <span>{place.free ? 'Free' : place.priceNote ?? 'Paid'}</span>
          {distanceMiles != null && <span>{distanceMiles.toFixed(1)} mi</span>}
        </div>
        {showMatch && (
          <span
            className={`mt-1 inline-block w-fit rounded-full px-2 py-0.5 text-[10px] font-bold ${
              match.consider.length === 0 && match.good.length > 0
                ? 'bg-brand-100 text-brand-700'
                : 'bg-sun-100 text-sun-500'
            }`}
          >
            {match.consider.length === 0 && match.good.length > 0 ? 'Great match' : 'Things to consider'}
          </span>
        )}
      </div>
    </Link>
  )
}
