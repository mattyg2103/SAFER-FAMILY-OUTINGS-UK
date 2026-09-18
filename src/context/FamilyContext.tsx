import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { ChildProfile, FamilyAccount } from '../types'
import { loadJSON, saveJSON } from '../lib/storage'
import { api } from '../lib/api'

const DEVICE_ID_KEY = 'sfo:deviceId'
const ONBOARDED_KEY = 'sfo:onboarded'

function getDeviceId(): string {
  let id = window.localStorage.getItem(DEVICE_ID_KEY)
  if (!id) {
    id = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `dev-${Math.random().toString(36).slice(2)}`
    window.localStorage.setItem(DEVICE_ID_KEY, id)
  }
  return id
}

type ServerChild = ChildProfile & { active: boolean }

interface FamilyContextValue {
  account: FamilyAccount | null
  children: ChildProfile[]
  activeChildIds: string[]
  savedPlaceIds: string[]
  onboarded: boolean
  ready: boolean
  signIn: (email: string) => void
  signOut: () => void
  completeOnboarding: () => void
  addChild: (child: Omit<ChildProfile, 'id' | 'createdAt'>) => void
  updateChild: (id: string, patch: Partial<Omit<ChildProfile, 'id' | 'createdAt'>>) => void
  removeChild: (id: string) => void
  toggleActiveChild: (id: string) => void
  toggleSaved: (placeId: string) => void
  isSaved: (placeId: string) => boolean
  addReport: (report: { placeId: string; kind: string; summary: string }) => void
  combinedNeeds: Set<string>
  maxRouteDistanceMiles: number | null
}

const FamilyContext = createContext<FamilyContextValue | null>(null)

export function FamilyProvider({ children: reactChildren }: { children: ReactNode }) {
  const deviceId = useMemo(getDeviceId, [])
  const [account, setAccount] = useState<FamilyAccount | null>(null)
  const [serverChildren, setServerChildren] = useState<ServerChild[]>([])
  const [savedPlaceIds, setSavedPlaceIds] = useState<string[]>([])
  const [onboarded, setOnboarded] = useState(() => loadJSON(ONBOARDED_KEY, false))
  const [ready, setReady] = useState(false)

  useEffect(() => {
    api
      .getOrCreateFamily(deviceId)
      .then((snapshot) => {
        setAccount(snapshot.account)
        setServerChildren(snapshot.children)
        setSavedPlaceIds(snapshot.savedPlaceIds)
      })
      .catch(() => {
        // Offline or API unreachable — the app still works with an empty family.
      })
      .finally(() => setReady(true))
  }, [deviceId])

  useEffect(() => {
    saveJSON(ONBOARDED_KEY, onboarded)
  }, [onboarded])

  const value = useMemo<FamilyContextValue>(() => {
    const activeChildren = serverChildren.filter((c) => c.active)
    const combinedNeeds = new Set<string>()
    for (const child of activeChildren) {
      for (const need of child.needs) combinedNeeds.add(need)
    }
    const distances = activeChildren
      .filter((c) => c.needs.includes('limitedWalkingDistance') && c.maxRouteDistanceMiles != null)
      .map((c) => c.maxRouteDistanceMiles as number)
    const maxRouteDistanceMiles = distances.length ? Math.min(...distances) : null

    return {
      account,
      children: serverChildren,
      activeChildIds: activeChildren.map((c) => c.id),
      savedPlaceIds,
      onboarded,
      ready,
      combinedNeeds,
      maxRouteDistanceMiles,
      signIn: (email: string) => {
        api.getOrCreateFamily(deviceId, email).then((snapshot) => setAccount(snapshot.account))
      },
      signOut: () => {
        setAccount(null)
        api.signOut(deviceId).catch(() => {})
      },
      completeOnboarding: () => setOnboarded(true),
      addChild: (child) => {
        api.addChild(deviceId, child).then((created) => setServerChildren((cs) => [...cs, created]))
      },
      updateChild: (id, patch) => {
        setServerChildren((cs) => cs.map((c) => (c.id === id ? { ...c, ...patch } : c)))
        api.updateChild(id, patch).catch(() => {})
      },
      removeChild: (id) => {
        setServerChildren((cs) => cs.filter((c) => c.id !== id))
        api.removeChild(id).catch(() => {})
      },
      toggleActiveChild: (id) => {
        setServerChildren((cs) => cs.map((c) => (c.id === id ? { ...c, active: !c.active } : c)))
        const child = serverChildren.find((c) => c.id === id)
        if (child) api.updateChild(id, { active: !child.active }).catch(() => {})
      },
      toggleSaved: (placeId) => {
        const isCurrentlySaved = savedPlaceIds.includes(placeId)
        setSavedPlaceIds((ids) => (isCurrentlySaved ? ids.filter((id) => id !== placeId) : [...ids, placeId]))
        const call = isCurrentlySaved ? api.unsavePlace(deviceId, placeId) : api.saveplace(deviceId, placeId)
        call.catch(() => {})
      },
      isSaved: (placeId) => savedPlaceIds.includes(placeId),
      addReport: (report) => {
        api.addReport(report).catch(() => {})
      },
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, serverChildren, savedPlaceIds, onboarded, ready, deviceId])

  return <FamilyContext.Provider value={value}>{reactChildren}</FamilyContext.Provider>
}

export function useFamily(): FamilyContextValue {
  const ctx = useContext(FamilyContext)
  if (!ctx) throw new Error('useFamily must be used within FamilyProvider')
  return ctx
}
