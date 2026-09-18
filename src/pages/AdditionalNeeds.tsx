import { Link } from 'react-router-dom'
import { TopBar } from '../components/layout/TopBar'
import { PLACES } from '../data/locations'
import { CATEGORY_META } from '../lib/categoryMeta'

export function AdditionalNeeds() {
  const places = PLACES.filter((p) => p.inclusiveAdjustments.length > 0)

  return (
    <div className="flex flex-1 flex-col">
      <TopBar title="Additional Needs Activities" />
      <div className="flex-1 overflow-y-auto p-4">
        <p className="mb-4 rounded-2xl bg-brand-50 p-3.5 text-[13px] text-brand-800">
          Rather than a general claim like "we are autism friendly", every place here lists the specific adjustments
          and facilities on offer — so you can decide if they'll help your family.
        </p>

        <div className="flex flex-col gap-3">
          {places.map((place) => (
            <Link key={place.id} to={`/place/${place.id}`} className="rounded-2xl bg-white p-4 ring-1 ring-brand-100">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{place.heroImage}</span>
                <div>
                  <p className="text-[14px] font-bold text-slate-800">{place.name}</p>
                  <p className="text-[11px] text-brand-500">
                    {CATEGORY_META[place.category].icon} {CATEGORY_META[place.category].label} · {place.town}
                  </p>
                </div>
              </div>
              <ul className="mt-2 flex flex-col gap-1">
                {place.inclusiveAdjustments.map((a) => (
                  <li key={a.key} className="text-[12px] text-slate-700">
                    ✓ {a.label}
                  </li>
                ))}
              </ul>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
