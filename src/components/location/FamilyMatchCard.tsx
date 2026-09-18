import { Link } from 'react-router-dom'
import type { Place } from '../../types'
import { useFamily } from '../../context/FamilyContext'
import { computeFamilyMatch } from '../../lib/familyMatch'
import { StatusLine } from '../StatusLine'

export function FamilyMatchCard({ place }: { place: Place }) {
  const { combinedNeeds, maxRouteDistanceMiles, children, activeChildIds } = useFamily()

  if (children.length === 0) {
    return (
      <div className="rounded-2xl bg-brand-50 p-4 text-center ring-1 ring-brand-100">
        <p className="text-sm font-bold text-brand-800">See how well this could work for your family</p>
        <p className="mt-1 text-[12px] text-brand-700">
          Add a child profile and we'll compare their needs against what's known about this place.
        </p>
        <Link
          to="/family/child/new"
          className="mt-3 inline-block rounded-full bg-brand-600 px-4 py-2 text-[13px] font-bold text-white"
        >
          Add a child profile
        </Link>
      </div>
    )
  }

  if (activeChildIds.length === 0 || combinedNeeds.size === 0) {
    return (
      <div className="rounded-2xl bg-brand-50 p-4 text-center ring-1 ring-brand-100">
        <p className="text-sm font-bold text-brand-800">Who's coming today?</p>
        <p className="mt-1 text-[12px] text-brand-700">
          Select which children are coming on the family profile screen to see a personalised match.
        </p>
        <Link to="/family" className="mt-3 inline-block rounded-full bg-brand-600 px-4 py-2 text-[13px] font-bold text-white">
          Choose who's coming
        </Link>
      </div>
    )
  }

  const match = computeFamilyMatch(place, combinedNeeds, maxRouteDistanceMiles)
  const overall = match.consider.length === 0 ? 'good' : match.consider.length <= 1 ? 'ok' : 'consider'

  return (
    <div className="flex flex-col gap-3">
      <div
        className={`rounded-2xl p-4 text-center ${
          overall === 'good' ? 'bg-brand-100' : overall === 'ok' ? 'bg-sun-50' : 'bg-sun-100'
        }`}
      >
        <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500">Family match</p>
        <p className="text-lg font-extrabold text-brand-900">
          {overall === 'good' ? 'Looks like a good match' : overall === 'ok' ? 'Could be a good match' : 'Some things to think about'}
        </p>
        <p className="mt-1 text-[12px] text-slate-600">You always make the final call — never a guarantee of safety.</p>
      </div>

      {match.good.length > 0 && (
        <div className="rounded-2xl bg-white p-3.5 ring-1 ring-brand-100">
          <p className="mb-1 text-[11px] font-extrabold uppercase tracking-wide text-brand-600">Good match</p>
          {match.good.map((f, i) => (
            <StatusLine key={i} status={f.status} text={f.text} />
          ))}
        </div>
      )}

      {match.consider.length > 0 && (
        <div className="rounded-2xl bg-white p-3.5 ring-1 ring-brand-100">
          <p className="mb-1 text-[11px] font-extrabold uppercase tracking-wide text-sun-500">Things to consider</p>
          {match.consider.map((f, i) => (
            <StatusLine key={i} status={f.status} text={f.text} />
          ))}
        </div>
      )}

      {match.unknown.length > 0 && (
        <div className="rounded-2xl bg-white p-3.5 ring-1 ring-brand-100">
          <p className="mb-1 text-[11px] font-extrabold uppercase tracking-wide text-sky-500">Information needed</p>
          {match.unknown.map((f, i) => (
            <StatusLine key={i} status={f.status} text={f.text} />
          ))}
          <Link to={`/contribute?place=${place.id}`} className="mt-1 inline-block text-[12px] font-bold text-brand-600 underline">
            Help other families by confirming this
          </Link>
        </div>
      )}
    </div>
  )
}
