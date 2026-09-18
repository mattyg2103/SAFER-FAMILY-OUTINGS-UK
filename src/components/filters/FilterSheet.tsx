import type { FilterState } from '../../types'
import { FILTER_CHIPS } from '../../lib/filters'
import { CATEGORIES, CATEGORY_META } from '../../lib/categoryMeta'

export function FilterSheet({
  open,
  onClose,
  filters,
  setFilters,
}: {
  open: boolean
  onClose: () => void
  filters: FilterState
  setFilters: (f: FilterState) => void
}) {
  if (!open) return null

  const toggle = (key: keyof FilterState) => {
    setFilters({ ...filters, [key]: filters[key] ? undefined : true })
  }

  const activeCount = Object.values(filters).filter(Boolean).length

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/40" onClick={onClose}>
      <div
        className="max-h-[85vh] overflow-y-auto rounded-t-3xl bg-white p-4 pb-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-slate-200" />
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-extrabold text-brand-900">Filters</h2>
          {activeCount > 0 && (
            <button onClick={() => setFilters({})} className="text-sm font-semibold text-brand-600">
              Clear all
            </button>
          )}
        </div>

        <p className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-400">Category</p>
        <div className="mb-4 flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilters({ ...filters, category: filters.category === cat ? undefined : cat })}
              className={`rounded-full px-3 py-1.5 text-[12px] font-semibold ${
                filters.category === cat ? 'bg-brand-600 text-white' : 'bg-brand-50 text-brand-700'
              }`}
            >
              {CATEGORY_META[cat].icon} {CATEGORY_META[cat].label}
            </button>
          ))}
        </div>

        <p className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-400">Your family's needs</p>
        <div className="mb-4 flex flex-wrap gap-2">
          {FILTER_CHIPS.map((chip) => (
            <button
              key={chip.key}
              onClick={() => toggle(chip.key)}
              className={`rounded-full px-3 py-1.5 text-[12px] font-semibold ${
                filters[chip.key] ? 'bg-brand-600 text-white' : 'bg-brand-50 text-brand-700'
              }`}
            >
              {chip.label}
            </button>
          ))}
        </div>

        <button
          onClick={onClose}
          className="w-full rounded-full bg-brand-600 py-3 text-sm font-extrabold text-white shadow-sm"
        >
          Show results
        </button>
      </div>
    </div>
  )
}
