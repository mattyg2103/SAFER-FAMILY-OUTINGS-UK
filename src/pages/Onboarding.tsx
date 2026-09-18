import { useNavigate } from 'react-router-dom'
import { useFamily } from '../context/FamilyContext'

export function Onboarding() {
  const navigate = useNavigate()
  const { completeOnboarding } = useFamily()

  const finish = (path: string) => {
    completeOnboarding()
    navigate(path)
  }

  return (
    <div className="flex flex-1 flex-col justify-between bg-gradient-to-b from-brand-500 to-brand-700 px-6 py-10 text-white">
      <div>
        <p className="text-sm font-bold uppercase tracking-widest text-brand-100">Safer Family Outings UK</p>
        <h1 className="mt-3 text-3xl font-extrabold leading-tight">Find it. Explore it.<br />Know before you go.</h1>
        <p className="mt-6 text-[15px] leading-relaxed text-brand-50">
          Every family is different. Tell us the things that matter to yours and we'll help you find outings that
          could work for you.
        </p>
        <ul className="mt-6 flex flex-col gap-3 text-[14px] text-brand-50">
          <li className="flex items-start gap-2"><span>🗺️</span> Discover free and affordable outings nearby</li>
          <li className="flex items-start gap-2"><span>🧩</span> See how well a place could match your family</li>
          <li className="flex items-start gap-2"><span>💧</span> Understand water, roads and enclosure before you leave</li>
          <li className="flex items-start gap-2"><span>🤝</span> Find specialist and inclusive activities</li>
        </ul>
      </div>

      <div className="flex flex-col gap-3">
        <button
          onClick={() => finish('/family/child/new')}
          className="rounded-full bg-white py-3.5 text-center text-[15px] font-extrabold text-brand-700 shadow"
        >
          Create a child profile
        </button>
        <button
          onClick={() => finish('/')}
          className="rounded-full border border-white/60 py-3.5 text-center text-[15px] font-bold text-white"
        >
          Continue without a profile
        </button>
        <p className="text-center text-[12px] text-brand-100">
          Child profiles are optional — you can always add one later from the Family tab.
        </p>
      </div>
    </div>
  )
}
