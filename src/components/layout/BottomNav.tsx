import { NavLink } from 'react-router-dom'

const ITEMS = [
  { to: '/', label: 'Home', icon: '🏠', end: true },
  { to: '/explore', label: 'Explore', icon: '🗺️' },
  { to: '/whats-on', label: "What's On", icon: '🎉' },
  { to: '/saved', label: 'Saved', icon: '❤️' },
  { to: '/family', label: 'Family', icon: '👪' },
]

export function BottomNav() {
  return (
    <nav className="sticky bottom-0 z-30 flex justify-around border-t border-brand-100 bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur">
      {ITEMS.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
          className={({ isActive }) =>
            `flex flex-1 flex-col items-center gap-0.5 py-2 text-[11px] font-semibold ${
              isActive ? 'text-brand-600' : 'text-slate-400'
            }`
          }
        >
          <span className="text-lg leading-none">{item.icon}</span>
          {item.label}
        </NavLink>
      ))}
    </nav>
  )
}
