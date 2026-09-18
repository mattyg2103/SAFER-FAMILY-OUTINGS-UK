import type { MatchStatus } from '../types'

const ICON: Record<MatchStatus, string> = {
  good: '✓',
  consider: '!',
  unknown: '?',
}

const STYLE: Record<MatchStatus, string> = {
  good: 'text-brand-700 bg-brand-50',
  consider: 'text-sun-500 bg-sun-50',
  unknown: 'text-sky-500 bg-sky-50',
}

export function StatusLine({ status, text }: { status: MatchStatus; text: string }) {
  return (
    <div className="flex items-start gap-2 py-1.5 text-sm">
      <span
        className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-bold ${STYLE[status]}`}
        aria-hidden
      >
        {ICON[status]}
      </span>
      <span className="text-[13px] leading-snug text-slate-700">{text}</span>
    </div>
  )
}
