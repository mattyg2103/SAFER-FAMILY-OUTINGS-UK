import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { TopBar } from '../components/layout/TopBar'
import { EVENTS } from '../data/events'
import { getPlaceById } from '../data/locations'
import type { EventFrequency } from '../types'
import { CATEGORY_META } from '../lib/categoryMeta'

const FREQ_CHIPS: { key: EventFrequency; label: string }[] = [
  { key: 'today', label: 'Today' },
  { key: 'tomorrow', label: 'Tomorrow' },
  { key: 'weekend', label: 'This weekend' },
  { key: 'holidays', label: 'School holidays' },
]

const TOGGLES: { key: 'free' | 'send' | 'sensory' | 'quiet' | 'wheelchairAccessible' | 'indoor' | 'outdoor' | 'enclosed' | 'changingPlaces' | 'accessibleToilet'; label: string }[] = [
  { key: 'free', label: 'Free' },
  { key: 'send', label: 'SEND sessions' },
  { key: 'sensory', label: 'Sensory sessions' },
  { key: 'quiet', label: 'Quiet sessions' },
  { key: 'wheelchairAccessible', label: 'Wheelchair accessible' },
  { key: 'indoor', label: 'Indoor' },
  { key: 'outdoor', label: 'Outdoor' },
  { key: 'enclosed', label: 'Enclosed' },
  { key: 'changingPlaces', label: 'Changing Places' },
  { key: 'accessibleToilet', label: 'Accessible toilets' },
]

export function WhatsOn() {
  const [freq, setFreq] = useState<EventFrequency | null>(null)
  const [toggles, setToggles] = useState<Record<string, boolean>>({})

  const toggle = (key: string) => setToggles((t) => ({ ...t, [key]: !t[key] }))

  const filtered = useMemo(() => {
    return EVENTS.filter((e) => {
      if (freq && !e.frequency.includes(freq)) return false
      for (const t of TOGGLES) {
        if (toggles[t.key] && !(e as unknown as Record<string, boolean>)[t.key]) return false
      }
      return true
    })
  }, [freq, toggles])

  return (
    <div className="flex flex-1 flex-col">
      <TopBar title="What's On Near Me?" showBack={false} />
      <div className="border-b border-brand-100 bg-white p-4">
        <div className="mb-3 flex flex-wrap gap-2">
          {FREQ_CHIPS.map((c) => (
            <button
              key={c.key}
              onClick={() => setFreq(freq === c.key ? null : c.key)}
              className={`rounded-full px-3 py-1.5 text-[12px] font-bold ${freq === c.key ? 'bg-brand-600 text-white' : 'bg-brand-50 text-brand-700'}`}
            >
              {c.label}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          {TOGGLES.map((t) => (
            <button
              key={t.key}
              onClick={() => toggle(t.key)}
              className={`rounded-full px-3 py-1.5 text-[11px] font-semibold ${toggles[t.key] ? 'bg-sun-400 text-white' : 'bg-sun-50 text-sun-500'}`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {filtered.length === 0 && <p className="mt-8 text-center text-sm text-slate-400">No activities match right now — try different filters.</p>}
        <div className="flex flex-col gap-3">
          {filtered.map((e) => {
            const place = getPlaceById(e.placeId)
            if (!place) return null
            return (
              <Link key={e.id} to={`/place/${place.id}`} className="flex gap-3 rounded-2xl bg-white p-3.5 ring-1 ring-brand-100">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-2xl">
                  {CATEGORY_META[place.category].icon}
                </div>
                <div className="flex-1">
                  <p className="text-[13px] font-bold text-slate-800">{e.title}</p>
                  <p className="text-[11px] text-slate-500">{place.name} · {place.town}</p>
                  <p className="mt-1 text-[12px] text-slate-600">{e.description}</p>
                  <p className="mt-1 text-[11px] font-semibold text-brand-600">{e.dateLabel}</p>
                  <p className="text-[11px] text-slate-400">{e.free ? 'Free' : e.priceNote}</p>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
