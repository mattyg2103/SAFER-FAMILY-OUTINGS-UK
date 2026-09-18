import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { FamilyProvider, useFamily } from './context/FamilyContext'
import { BottomNav } from './components/layout/BottomNav'
import { Onboarding } from './pages/Onboarding'
import { Home } from './pages/Home'
import { Explore } from './pages/Explore'
import { LocationDetail } from './pages/LocationDetail'
import { WhatsOn } from './pages/WhatsOn'
import { AdditionalNeeds } from './pages/AdditionalNeeds'
import { Saved } from './pages/Saved'
import { FamilyProfile } from './pages/FamilyProfile'
import { ChildProfileForm } from './pages/ChildProfileForm'
import { Auth } from './pages/Auth'
import { Contribute } from './pages/Contribute'

const NO_NAV_PATHS = ['/onboarding']

function Shell() {
  const { onboarded } = useFamily()
  const location = useLocation()

  if (!onboarded && location.pathname !== '/onboarding') {
    return <Navigate to="/onboarding" replace />
  }

  const showNav = !NO_NAV_PATHS.includes(location.pathname)

  return (
    <div className="flex min-h-dvh flex-1 flex-col">
      <div className="flex flex-1 flex-col">
        <Routes>
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/" element={<Home />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/place/:id" element={<LocationDetail />} />
          <Route path="/whats-on" element={<WhatsOn />} />
          <Route path="/additional-needs" element={<AdditionalNeeds />} />
          <Route path="/saved" element={<Saved />} />
          <Route path="/family" element={<FamilyProfile />} />
          <Route path="/family/child/new" element={<ChildProfileForm />} />
          <Route path="/family/child/:id" element={<ChildProfileForm />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/contribute" element={<Contribute />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
      {showNav && <BottomNav />}
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <FamilyProvider>
        <Shell />
      </FamilyProvider>
    </BrowserRouter>
  )
}

export default App
