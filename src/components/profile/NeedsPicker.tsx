import { NEED_CATEGORY_INTRO, NEED_CATEGORY_LABELS, NEED_OPTIONS_BY_CATEGORY } from '../../data/needsOptions'
import type { NeedCategory } from '../../types'

const CATEGORY_ORDER: NeedCategory[] = ['mobility', 'wandering', 'vision', 'hearing', 'sensory', 'communication']

export function NeedsPicker({ selected, onToggle }: { selected: string[]; onToggle: (key: string) => void }) {
  return (
    <div className="flex flex-col gap-5">
      {CATEGORY_ORDER.map((cat) => (
        <div key={cat}>
          <p className="text-[13px] font-extrabold text-brand-900">{NEED_CATEGORY_LABELS[cat]}</p>
          <p className="mb-2 text-[11px] text-slate-400">{NEED_CATEGORY_INTRO[cat]}</p>
          <div className="flex flex-wrap gap-2">
            {NEED_OPTIONS_BY_CATEGORY[cat].map((opt) => (
              <button
                key={opt.key}
                type="button"
                onClick={() => onToggle(opt.key)}
                className={`rounded-full px-3 py-1.5 text-[12px] font-semibold ${
                  selected.includes(opt.key) ? 'bg-brand-600 text-white' : 'bg-brand-50 text-brand-700'
                }`}
              >
                {selected.includes(opt.key) ? '✓ ' : ''}
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
