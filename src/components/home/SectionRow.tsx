import type { ReactNode } from 'react'
import type { Place } from '../../types'
import { PlaceCard } from './PlaceCard'

export function SectionRow({ title, places, emptyText }: { title: string; places: Place[]; emptyText?: string }) {
  if (places.length === 0 && !emptyText) return null
  return (
    <section className="mt-5">
      <div className="mb-2 flex items-center justify-between px-4">
        <h2 className="text-[15px] font-extrabold text-brand-900">{title}</h2>
      </div>
      {places.length === 0 ? (
        <p className="px-4 text-[13px] text-slate-400">{emptyText}</p>
      ) : (
        <div className="no-scrollbar flex gap-3 overflow-x-auto px-4 pb-1">
          {places.map((p) => (
            <PlaceCard key={p.id} place={p} />
          ))}
        </div>
      )}
    </section>
  )
}

export function SectionShell({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mt-5 px-4">
      <h2 className="mb-2 text-[15px] font-extrabold text-brand-900">{title}</h2>
      {children}
    </section>
  )
}
