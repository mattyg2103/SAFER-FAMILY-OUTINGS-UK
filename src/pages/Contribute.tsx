import { useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { TopBar } from '../components/layout/TopBar'
import { PLACES, getPlaceById } from '../data/locations'
import { useFamily } from '../context/FamilyContext'
import { api } from '../lib/api'

type ContributionType = 'review' | 'update' | 'report' | 'new-location'

const TYPES: { key: ContributionType; label: string; icon: string }[] = [
  { key: 'review', label: 'Leave a review', icon: '⭐' },
  { key: 'update', label: 'Confirm or update accessibility info', icon: '✏️' },
  { key: 'report', label: 'Report outdated info or a closure', icon: '⚠️' },
  { key: 'new-location', label: 'Suggest a new location or route', icon: '📍' },
]

export function Contribute() {
  const [params] = useSearchParams()
  const { addReport } = useFamily()
  const [type, setType] = useState<ContributionType>((params.get('type') as ContributionType) ?? 'update')
  const [placeId, setPlaceId] = useState(params.get('place') ?? PLACES[0].id)
  const [submitted, setSubmitted] = useState(false)

  // Review fields
  const [rating, setRating] = useState(5)
  const [text, setText] = useState('')
  const [visitedWith, setVisitedWith] = useState('')

  // Structured update fields
  const [enclosed, setEnclosed] = useState<'Fully' | 'Partially' | 'No' | 'Unsure' | ''>('')
  const [water, setWater] = useState<'Yes' | 'No' | 'Unsure' | ''>('')
  const [barrier, setBarrier] = useState<'Continuous' | 'Partial' | 'No' | 'Unsure' | ''>('')
  const [freeText, setFreeText] = useState('')

  const place = getPlaceById(placeId)

  const submit = () => {
    if (type === 'review') {
      api
        .addReview(placeId, { authorLabel: 'A family who visited', rating, text, visitedWith: visitedWith || undefined })
        .catch(() => {})
    } else if (type === 'update') {
      const parts = []
      if (enclosed) parts.push(`Enclosed: ${enclosed}`)
      if (water) parts.push(`Water nearby: ${water}`)
      if (barrier) parts.push(`Barrier: ${barrier}`)
      if (freeText) parts.push(freeText)
      addReport({ placeId, kind: 'update', summary: parts.join(' · ') })
    } else if (type === 'report') {
      addReport({ placeId, kind: 'closure', summary: freeText })
    } else {
      addReport({ placeId: 'new', kind: type === 'new-location' ? 'new-location' : 'new-route', summary: freeText })
    }
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="flex flex-1 flex-col">
        <TopBar title="Thank you" />
        <div className="flex flex-1 flex-col items-center justify-center gap-3 p-6 text-center">
          <span className="text-4xl">🙏</span>
          <p className="text-[16px] font-extrabold text-brand-900">Thanks for helping the next family</p>
          <p className="text-[13px] text-slate-500">
            Your contribution has been added. Community information helps every family make a more informed decision.
          </p>
          <Link to={place ? `/place/${place.id}` : '/'} className="mt-3 rounded-full bg-brand-600 px-5 py-2.5 text-[13px] font-bold text-white">
            Back to place
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col">
      <TopBar title="Contribute" />
      <div className="flex-1 overflow-y-auto p-4">
        <div className="mb-4 flex flex-col gap-2">
          {TYPES.map((t) => (
            <button
              key={t.key}
              onClick={() => setType(t.key)}
              className={`flex items-center gap-3 rounded-2xl p-3.5 text-left ring-1 ${
                type === t.key ? 'bg-brand-600 text-white ring-brand-600' : 'bg-white text-slate-700 ring-brand-100'
              }`}
            >
              <span className="text-xl">{t.icon}</span>
              <span className="text-[13px] font-bold">{t.label}</span>
            </button>
          ))}
        </div>

        {type !== 'new-location' && (
          <div className="mb-4">
            <label className="mb-1 block text-[12px] font-bold text-slate-600">Which location?</label>
            <select
              value={placeId}
              onChange={(e) => setPlaceId(e.target.value)}
              className="w-full rounded-xl border border-brand-100 px-3 py-2.5 text-[14px]"
            >
              {PLACES.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {type === 'review' && (
          <>
            <label className="mb-1 block text-[12px] font-bold text-slate-600">Rating</label>
            <div className="mb-3 flex gap-1">
              {[1, 2, 3, 4, 5].map((n) => (
                <button key={n} onClick={() => setRating(n)} className={`text-2xl ${n <= rating ? 'text-sun-400' : 'text-slate-200'}`}>
                  ★
                </button>
              ))}
            </div>
            <label className="mb-1 block text-[12px] font-bold text-slate-600">Who did you visit with? (optional)</label>
            <input
              value={visitedWith}
              onChange={(e) => setVisitedWith(e.target.value)}
              placeholder="e.g. Wheelchair user, age 6"
              className="mb-3 w-full rounded-xl border border-brand-100 px-3 py-2.5 text-[14px]"
            />
            <label className="mb-1 block text-[12px] font-bold text-slate-600">Tell other families what you found</label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={4}
              className="w-full rounded-xl border border-brand-100 px-3 py-2.5 text-[14px]"
              placeholder="What worked well? Anything to know before you go?"
            />
          </>
        )}

        {type === 'update' && (
          <>
            <p className="mb-1 text-[13px] font-bold text-slate-700">Is the playground enclosed?</p>
            <div className="mb-3 flex flex-wrap gap-2">
              {(['Fully', 'Partially', 'No', 'Unsure'] as const).map((opt) => (
                <button
                  key={opt}
                  onClick={() => setEnclosed(opt)}
                  className={`rounded-full px-3 py-1.5 text-[12px] font-semibold ${enclosed === opt ? 'bg-brand-600 text-white' : 'bg-brand-50 text-brand-700'}`}
                >
                  {opt}
                </button>
              ))}
            </div>

            <p className="mb-1 text-[13px] font-bold text-slate-700">Is there water nearby?</p>
            <div className="mb-3 flex flex-wrap gap-2">
              {(['Yes', 'No', 'Unsure'] as const).map((opt) => (
                <button
                  key={opt}
                  onClick={() => setWater(opt)}
                  className={`rounded-full px-3 py-1.5 text-[12px] font-semibold ${water === opt ? 'bg-brand-600 text-white' : 'bg-brand-50 text-brand-700'}`}
                >
                  {opt}
                </button>
              ))}
            </div>

            {water === 'Yes' && (
              <>
                <p className="mb-1 text-[13px] font-bold text-slate-700">Is there a barrier?</p>
                <div className="mb-3 flex flex-wrap gap-2">
                  {(['Continuous', 'Partial', 'No', 'Unsure'] as const).map((opt) => (
                    <button
                      key={opt}
                      onClick={() => setBarrier(opt)}
                      className={`rounded-full px-3 py-1.5 text-[12px] font-semibold ${barrier === opt ? 'bg-brand-600 text-white' : 'bg-brand-50 text-brand-700'}`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </>
            )}

            <label className="mb-1 block text-[12px] font-bold text-slate-600">Anything else to add?</label>
            <textarea
              value={freeText}
              onChange={(e) => setFreeText(e.target.value)}
              rows={3}
              className="w-full rounded-xl border border-brand-100 px-3 py-2.5 text-[14px]"
            />
          </>
        )}

        {type === 'report' && (
          <>
            <label className="mb-1 block text-[12px] font-bold text-slate-600">What's changed or out of date?</label>
            <textarea
              value={freeText}
              onChange={(e) => setFreeText(e.target.value)}
              rows={4}
              className="w-full rounded-xl border border-brand-100 px-3 py-2.5 text-[14px]"
              placeholder="e.g. Playground closed for repairs until October"
            />
          </>
        )}

        {type === 'new-location' && (
          <>
            <label className="mb-1 block text-[12px] font-bold text-slate-600">Tell us about the place or route</label>
            <textarea
              value={freeText}
              onChange={(e) => setFreeText(e.target.value)}
              rows={5}
              className="w-full rounded-xl border border-brand-100 px-3 py-2.5 text-[14px]"
              placeholder="Name, location, and anything you think other families should know"
            />
          </>
        )}

        <button onClick={submit} className="mt-5 w-full rounded-full bg-brand-600 py-3 text-[15px] font-extrabold text-white shadow-sm">
          Submit
        </button>
      </div>
    </div>
  )
}
