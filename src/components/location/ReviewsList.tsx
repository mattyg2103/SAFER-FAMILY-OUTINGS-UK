import type { Review } from '../../types'

function Stars({ rating }: { rating: number }) {
  return (
    <span className="text-sun-400 text-sm">
      {'★'.repeat(rating)}
      <span className="text-slate-200">{'★'.repeat(5 - rating)}</span>
    </span>
  )
}

export function ReviewsList({ reviews }: { reviews: Review[] }) {
  if (reviews.length === 0) {
    return <p className="text-[13px] text-slate-400">No family reviews yet. Be the first to share what you found.</p>
  }
  return (
    <div className="flex flex-col gap-3">
      {reviews.map((r) => (
        <div key={r.id} className="rounded-2xl bg-white p-3.5 ring-1 ring-brand-100">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-bold text-slate-700">{r.authorLabel}</span>
            <Stars rating={r.rating} />
          </div>
          {r.visitedWith && <p className="mt-0.5 text-[11px] italic text-slate-400">Visited with: {r.visitedWith}</p>}
          <p className="mt-1.5 text-[13px] leading-snug text-slate-700">{r.text}</p>
          <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
            <span>{new Date(r.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
            <span>👍 Helpful ({r.helpfulCount})</span>
          </div>
        </div>
      ))}
    </div>
  )
}
