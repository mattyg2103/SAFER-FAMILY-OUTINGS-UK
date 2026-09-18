import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { TopBar } from '../components/layout/TopBar'
import { useFamily } from '../context/FamilyContext'

export function Auth() {
  const { signIn } = useFamily()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [mode, setMode] = useState<'signin' | 'register'>('register')

  const submit = () => {
    if (!email.trim()) return
    signIn(email.trim())
    navigate('/family')
  }

  return (
    <div className="flex flex-1 flex-col">
      <TopBar title={mode === 'register' ? 'Register' : 'Sign in'} />
      <div className="flex-1 p-4">
        <div className="mb-4 flex rounded-full bg-brand-50 p-1">
          <button
            onClick={() => setMode('register')}
            className={`flex-1 rounded-full py-2 text-[12px] font-bold ${mode === 'register' ? 'bg-white text-brand-700 shadow-sm' : 'text-brand-500'}`}
          >
            Register
          </button>
          <button
            onClick={() => setMode('signin')}
            className={`flex-1 rounded-full py-2 text-[12px] font-bold ${mode === 'signin' ? 'bg-white text-brand-700 shadow-sm' : 'text-brand-500'}`}
          >
            Sign in
          </button>
        </div>

        <label className="mb-1 block text-[12px] font-bold text-slate-600">Email address</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="mb-4 w-full rounded-xl border border-brand-100 px-3 py-2.5 text-[14px] outline-none focus:border-brand-400"
        />

        <p className="mb-4 text-[11px] text-slate-400">
          This demo uses a simplified sign-in with no password, so your family profile stays on this device.
        </p>

        <button onClick={submit} className="w-full rounded-full bg-brand-600 py-3 text-[15px] font-extrabold text-white shadow-sm">
          {mode === 'register' ? 'Create family account' : 'Sign in'}
        </button>
      </div>
    </div>
  )
}
