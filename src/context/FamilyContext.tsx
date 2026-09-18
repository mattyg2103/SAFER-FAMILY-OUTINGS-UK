import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { ChildProfile, FamilyAccount, Review } from '../types'
import { loadJSON, newId, saveJSON } from '../lib/storage'

export interface ContributedReview extends Review {
  placeId: string
}

export interface CommunityReport {
  id: string
  placeId: string
  kind: 'update' | 'closure' | 'new-location' | 'new-route'
  summary: string
  createdAt: string
}

interface FamilyState {
  account: FamilyAccount | null
  children: ChildProfile[]
  activeChildIds: string[]
  savedPlaceIds: string[]
  contributedReviews: ContributedReview[]
  reports: CommunityReport[]
  onboarded: boolean
}

interface FamilyContextValue extends FamilyState {
  signIn: (email: string) => void
  signOut: () => void
  completeOnboarding: () => void
  addChild: (child: Omit<ChildProfile, 'id' | 'createdAt'>) => string
  updateChild: (id: string, patch: Partial<Omit<ChildProfile, 'id' | 'createdAt'>>) => void
  removeChild: (id: string) => void
  toggleActiveChild: (id: string) => void
  toggleSaved: (placeId: string) => void
  isSaved: (placeId: string) => boolean
  addReview: (placeId: string, review: Omit<Review, 'id' | 'createdAt' | 'helpfulCount'>) => void
  addReport: (report: Omit<CommunityReport, 'id' | 'createdAt'>) => void
  combinedNeeds: Set<string>
  maxRouteDistanceMiles: number | null
}

const STORAGE_KEY = 'family-state'

const defaultState: FamilyState = {
  account: null,
  children: [],
  activeChildIds: [],
  savedPlaceIds: [],
  contributedReviews: [],
  reports: [],
  onboarded: false,
}

const FamilyContext = createContext<FamilyContextValue | null>(null)

export function FamilyProvider({ children: reactChildren }: { children: ReactNode }) {
  const [state, setState] = useState<FamilyState>(() => loadJSON(STORAGE_KEY, defaultState))

  useEffect(() => {
    saveJSON(STORAGE_KEY, state)
  }, [state])

  const value = useMemo<FamilyContextValue>(() => {
    const activeChildren = state.children.filter((c) => state.activeChildIds.includes(c.id))
    const combinedNeeds = new Set<string>()
    for (const child of activeChildren) {
      for (const need of child.needs) combinedNeeds.add(need)
    }
    const distances = activeChildren
      .filter((c) => c.needs.includes('limitedWalkingDistance') && c.maxRouteDistanceMiles != null)
      .map((c) => c.maxRouteDistanceMiles as number)
    const maxRouteDistanceMiles = distances.length ? Math.min(...distances) : null

    return {
      ...state,
      combinedNeeds,
      maxRouteDistanceMiles,
      signIn: (email: string) => {
        setState((s) => ({
          ...s,
          account: s.account?.email === email ? s.account : { id: newId('fam'), email, createdAt: new Date().toISOString() },
        }))
      },
      signOut: () => setState((s) => ({ ...s, account: null })),
      completeOnboarding: () => setState((s) => ({ ...s, onboarded: true })),
      addChild: (child) => {
        const id = newId('child')
        setState((s) => ({
          ...s,
          children: [...s.children, { ...child, id, createdAt: new Date().toISOString() }],
          activeChildIds: [...s.activeChildIds, id],
        }))
        return id
      },
      updateChild: (id, patch) => {
        setState((s) => ({
          ...s,
          children: s.children.map((c) => (c.id === id ? { ...c, ...patch } : c)),
        }))
      },
      removeChild: (id) => {
        setState((s) => ({
          ...s,
          children: s.children.filter((c) => c.id !== id),
          activeChildIds: s.activeChildIds.filter((cid) => cid !== id),
        }))
      },
      toggleActiveChild: (id) => {
        setState((s) => ({
          ...s,
          activeChildIds: s.activeChildIds.includes(id)
            ? s.activeChildIds.filter((cid) => cid !== id)
            : [...s.activeChildIds, id],
        }))
      },
      toggleSaved: (placeId) => {
        setState((s) => ({
          ...s,
          savedPlaceIds: s.savedPlaceIds.includes(placeId)
            ? s.savedPlaceIds.filter((id) => id !== placeId)
            : [...s.savedPlaceIds, placeId],
        }))
      },
      isSaved: (placeId) => state.savedPlaceIds.includes(placeId),
      addReview: (placeId, review) => {
        setState((s) => ({
          ...s,
          contributedReviews: [
            ...s.contributedReviews,
            { ...review, id: newId('review'), placeId, createdAt: new Date().toISOString(), helpfulCount: 0 },
          ],
        }))
      },
      addReport: (report) => {
        setState((s) => ({
          ...s,
          reports: [...s.reports, { ...report, id: newId('report'), createdAt: new Date().toISOString() }],
        }))
      },
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state])

  return <FamilyContext.Provider value={value}>{reactChildren}</FamilyContext.Provider>
}

export function useFamily(): FamilyContextValue {
  const ctx = useContext(FamilyContext)
  if (!ctx) throw new Error('useFamily must be used within FamilyProvider')
  return ctx
}
