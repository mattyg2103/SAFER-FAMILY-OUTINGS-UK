import { useState } from 'react'
import { useNavigate, useParams, Navigate } from 'react-router-dom'
import { TopBar } from '../components/layout/TopBar'
import { NeedsPicker } from '../components/profile/NeedsPicker'
import { useFamily } from '../context/FamilyContext'
import { ROUTE_DISTANCE_OPTIONS } from '../data/needsOptions'

const AVATARS = ['🧒', '👦', '👧', '🧑', '👶', '🐻', '🦊', '🐸', '🦄', '🐢']

export function ChildProfileForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { children, addChild, updateChild, removeChild } = useFamily()
  const existing = id ? children.find((c) => c.id === id) : undefined

  const [displayName, setDisplayName] = useState(existing?.displayName ?? '')
  const [avatar, setAvatar] = useState(existing?.avatar ?? AVATARS[0])
  const [needs, setNeeds] = useState<string[]>(existing?.needs ?? [])
  const [maxDistance, setMaxDistance] = useState<number | null>(existing?.maxRouteDistanceMiles ?? null)

  if (id && !existing) return <Navigate to="/family" replace />

  const toggleNeed = (key: string) => setNeeds((n) => (n.includes(key) ? n.filter((k) => k !== key) : [...n, key]))

  const save = () => {
    if (!displayName.trim()) return
    if (existing) {
      updateChild(existing.id, { displayName, avatar, needs, maxRouteDistanceMiles: maxDistance })
    } else {
      addChild({ displayName, avatar, needs, maxRouteDistanceMiles: maxDistance })
    }
    navigate('/family')
  }

  return (
    <div className="flex flex-1 flex-col">
      <TopBar title={existing ? 'Edit profile' : 'New child profile'} />
      <div className="flex-1 overflow-y-auto p-4">
        <p className="mb-4 rounded-2xl bg-brand-50 p-3 text-[12px] text-brand-800">
          No need for a full name or photo — a first name, initials or nickname is fine. This helps us find outings
          that could work well.
        </p>

        <label className="mb-1 block text-[12px] font-bold text-slate-600">What would help us find outings that work for them?</label>
        <input
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          placeholder="First name, initials or nickname"
          className="mb-4 w-full rounded-xl border border-brand-100 px-3 py-2.5 text-[14px] outline-none focus:border-brand-400"
        />

        <p className="mb-2 text-[12px] font-bold text-slate-600">Choose an avatar</p>
        <div className="mb-5 flex flex-wrap gap-2">
          {AVATARS.map((a) => (
            <button
              key={a}
              onClick={() => setAvatar(a)}
              className={`flex h-11 w-11 items-center justify-center rounded-full text-xl ${
                avatar === a ? 'bg-brand-600 ring-2 ring-brand-300' : 'bg-brand-50'
              }`}
            >
              {a}
            </button>
          ))}
        </div>

        <NeedsPicker selected={needs} onToggle={toggleNeed} />

        {needs.includes('limitedWalkingDistance') && (
          <div className="mt-5">
            <p className="mb-2 text-[13px] font-extrabold text-brand-900">Maximum preferred route distance</p>
            <div className="flex flex-wrap gap-2">
              {ROUTE_DISTANCE_OPTIONS.map((opt) => (
                <button
                  key={opt.key}
                  onClick={() => setMaxDistance(opt.value)}
                  className={`rounded-full px-3 py-1.5 text-[12px] font-semibold ${
                    maxDistance === opt.value ? 'bg-brand-600 text-white' : 'bg-brand-50 text-brand-700'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        )}

        <button onClick={save} className="mt-6 w-full rounded-full bg-brand-600 py-3 text-[15px] font-extrabold text-white shadow-sm">
          {existing ? 'Save changes' : 'Create profile'}
        </button>

        {existing && (
          <button
            onClick={() => {
              removeChild(existing.id)
              navigate('/family')
            }}
            className="mt-3 w-full rounded-full border border-coral-500 py-3 text-[13px] font-bold text-coral-500"
          >
            Remove this profile
          </button>
        )}
      </div>
    </div>
  )
}
