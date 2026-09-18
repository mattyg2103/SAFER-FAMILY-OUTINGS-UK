import { useNavigate } from 'react-router-dom'
import type { ReactNode } from 'react'

export function TopBar({
  title,
  showBack = true,
  right,
}: {
  title: string
  showBack?: boolean
  right?: ReactNode
}) {
  const navigate = useNavigate()
  return (
    <header className="sticky top-0 z-30 flex items-center gap-2 border-b border-brand-100 bg-white/95 px-3 py-3 backdrop-blur">
      {showBack ? (
        <button
          onClick={() => navigate(-1)}
          aria-label="Back"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-700"
        >
          ←
        </button>
      ) : (
        <span className="w-9 shrink-0" />
      )}
      <h1 className="flex-1 truncate text-[17px] font-extrabold text-brand-900">{title}</h1>
      {right ?? <span className="w-9 shrink-0" />}
    </header>
  )
}
