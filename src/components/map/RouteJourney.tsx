import type { RouteWaypoint, WalkingRoute } from '../../types'

const WAYPOINT_EMOJI: Record<RouteWaypoint['kind'], string> = {
  start: '🚩',
  finish: '🏁',
  parking: '🅿️',
  entrance: '🚪',
  playground: '🛝',
  woodland: '🌲',
  riverside: '💧',
  picnic: '🧺',
  toilets: '🚻',
  viewpoint: '👀',
  poi: '📍',
}

export function RouteJourney({
  route,
  selectedId,
  onSelect,
}: {
  route: WalkingRoute
  selectedId?: string
  onSelect: (id: string) => void
}) {
  return (
    <div className="flex flex-col">
      {route.waypoints.map((wp, i) => (
        <div key={wp.id}>
          <button
            onClick={() => onSelect(wp.id)}
            className={`flex w-full items-center gap-3 rounded-xl px-2 py-2 text-left transition ${
              selectedId === wp.id ? 'bg-brand-50 ring-1 ring-brand-300' : ''
            }`}
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-base ring-1 ring-brand-200">
              {WAYPOINT_EMOJI[wp.kind]}
            </span>
            <span>
              <span className="block text-[13px] font-bold text-slate-800">{wp.label}</span>
              {wp.note && <span className="block text-[11px] text-slate-500">{wp.note}</span>}
            </span>
          </button>
          {i < route.waypoints.length - 1 && <div className="ml-6 h-3 w-px bg-brand-200" />}
        </div>
      ))}
    </div>
  )
}
