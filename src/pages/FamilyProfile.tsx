import { Link, useNavigate } from 'react-router-dom'
import { TopBar } from '../components/layout/TopBar'
import { useFamily } from '../context/FamilyContext'

export function FamilyProfile() {
  const { account, children, activeChildIds, toggleActiveChild, signOut } = useFamily()
  const navigate = useNavigate()

  return (
    <div className="flex flex-1 flex-col">
      <TopBar title="Family" showBack={false} />
      <div className="flex-1 overflow-y-auto p-4">
        <div className="mb-5 rounded-2xl bg-white p-4 ring-1 ring-brand-100">
          {account ? (
            <>
              <p className="text-[12px] text-slate-400">Signed in as</p>
              <p className="text-[14px] font-bold text-slate-800">{account.email}</p>
              <button onClick={signOut} className="mt-2 text-[12px] font-bold text-coral-500">
                Sign out
              </button>
            </>
          ) : (
            <>
              <p className="text-[13px] text-slate-600">Sign in to save your family profile across devices.</p>
              <button
                onClick={() => navigate('/auth')}
                className="mt-2 rounded-full bg-brand-600 px-4 py-2 text-[12px] font-bold text-white"
              >
                Sign in / Register
              </button>
            </>
          )}
        </div>

        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-[15px] font-extrabold text-brand-900">Who's coming?</h2>
          <Link to="/family/child/new" className="text-[12px] font-bold text-brand-600">
            + Add child
          </Link>
        </div>
        <p className="mb-3 text-[12px] text-slate-500">
          Select which children are coming today — we'll combine their needs so you can see if an outing could work
          for all of you.
        </p>

        {children.length === 0 ? (
          <div className="rounded-2xl bg-brand-50 p-4 text-center">
            <p className="text-[13px] text-brand-800">No child profiles yet. They're optional, but help us personalise matches.</p>
            <Link to="/family/child/new" className="mt-3 inline-block rounded-full bg-brand-600 px-4 py-2 text-[12px] font-bold text-white">
              Create a child profile
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {children.map((c) => (
              <div key={c.id} className="flex items-center gap-3 rounded-2xl bg-white p-3 ring-1 ring-brand-100">
                <button
                  onClick={() => toggleActiveChild(c.id)}
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 text-[12px] font-bold ${
                    activeChildIds.includes(c.id) ? 'border-brand-600 bg-brand-600 text-white' : 'border-brand-200 text-transparent'
                  }`}
                  aria-label={`Toggle ${c.displayName} coming today`}
                >
                  ✓
                </button>
                <span className="text-2xl">{c.avatar}</span>
                <div className="flex-1">
                  <p className="text-[14px] font-bold text-slate-800">{c.displayName}</p>
                  <p className="text-[11px] text-slate-400">{c.needs.length} need{c.needs.length === 1 ? '' : 's'} selected</p>
                </div>
                <Link to={`/family/child/${c.id}`} className="text-[12px] font-bold text-brand-600">
                  Edit
                </Link>
              </div>
            ))}
          </div>
        )}

        <Link to="/saved" className="mt-6 block rounded-2xl bg-white p-4 ring-1 ring-brand-100">
          <p className="text-[14px] font-bold text-slate-800">❤️ Saved places</p>
        </Link>
        <Link to="/contribute" className="mt-3 block rounded-2xl bg-white p-4 ring-1 ring-brand-100">
          <p className="text-[14px] font-bold text-slate-800">✏️ Add a location, route or update</p>
        </Link>
      </div>
    </div>
  )
}
