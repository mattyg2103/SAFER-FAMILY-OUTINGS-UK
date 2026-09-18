import type { WalkingRoute } from '../../types'
import { StatusLine } from '../StatusLine'
import type { MatchStatus } from '../../types'

function tri(value: boolean | 'unknown', trueText: string, falseText: string, positiveIsGood = true): { status: MatchStatus; text: string } {
  if (value === 'unknown') return { status: 'unknown', text: `${trueText.replace(/^./, (c) => c.toLowerCase())} — unconfirmed` }
  const good = value === positiveIsGood
  return { status: good ? 'good' : 'consider', text: value ? trueText : falseText }
}

export function RouteSummary({ route }: { route: WalkingRoute }) {
  const rows = [
    tri(route.surfacedRoute, 'Mostly surfaced', 'Unsurfaced sections'),
    tri(route.flatRoute, 'Flat route', 'Not a flat route'),
    tri(route.waterAlongside, 'River or water alongside part of route', 'No water reported alongside route', false),
    tri(route.waterBarrier, 'Barrier reported alongside water', 'No barrier reported alongside water'),
    tri(route.steps, 'Steps on route', 'No steps reported', false),
    tri(route.unevenTerrain, 'Uneven terrain reported', 'No uneven terrain reported', false),
  ]

  return (
    <div className="rounded-2xl bg-white p-4 ring-1 ring-brand-100">
      <div className="flex items-center gap-4 border-b border-brand-50 pb-3">
        <div>
          <p className="text-2xl font-extrabold text-brand-900">{route.distanceMiles} miles</p>
          <p className="text-[12px] text-slate-500">Approximately {route.estimatedMinutes} minutes</p>
        </div>
        <span className="ml-auto rounded-full bg-brand-50 px-3 py-1 text-[11px] font-bold text-brand-700">
          {route.shape === 'circular' ? 'Circular route' : 'Point-to-point'}
        </span>
      </div>
      <div className="pt-2">
        {rows.map((r, i) => (
          <StatusLine key={i} status={r.status} text={r.text} />
        ))}
        {route.roadCrossings === 'unknown' ? (
          <StatusLine status="unknown" text="Road crossings unconfirmed" />
        ) : (
          <StatusLine
            status={route.roadCrossings === 0 ? 'good' : 'consider'}
            text={route.roadCrossings === 0 ? 'No road crossings' : `${route.roadCrossings} road crossing${route.roadCrossings === 1 ? '' : 's'}`}
          />
        )}
      </div>
      <p className="mt-2 text-[11px] text-slate-400">Last checked: {new Date(route.lastChecked).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
    </div>
  )
}
