import type { ChildProfile, Review } from '../types'

// In production the API is served from the same origin (the Express server
// serves both the built frontend and /api/*). In local dev (vite dev server)
// it falls back to localhost:3000 where `npm start` runs the API server.
const BASE = import.meta.env.DEV ? 'http://localhost:3000' : ''

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options?.headers },
  })
  if (!res.ok) throw new Error(`API request failed: ${path}`)
  return res.json() as Promise<T>
}

export interface FamilySnapshot {
  account: { id: string; email: string; createdAt: string } | null
  children: (ChildProfile & { active: boolean })[]
  savedPlaceIds: string[]
}

export const api = {
  getOrCreateFamily: (deviceId: string, email?: string) =>
    request<FamilySnapshot>(`/api/families/${deviceId}`, { method: 'POST', body: JSON.stringify({ email }) }),

  signOut: (deviceId: string) => request<{ ok: true }>(`/api/families/${deviceId}/signout`, { method: 'POST' }),

  addChild: (deviceId: string, child: Omit<ChildProfile, 'id' | 'createdAt'>) =>
    request<ChildProfile & { active: boolean }>(`/api/families/${deviceId}/children`, {
      method: 'POST',
      body: JSON.stringify(child),
    }),

  updateChild: (
    childId: string,
    patch: Partial<Omit<ChildProfile, 'id' | 'createdAt'>> & { active?: boolean },
  ) => request<ChildProfile & { active: boolean }>(`/api/children/${childId}`, { method: 'PATCH', body: JSON.stringify(patch) }),

  removeChild: (childId: string) => request<{ ok: true }>(`/api/children/${childId}`, { method: 'DELETE' }),

  saveplace: (deviceId: string, placeId: string) =>
    request<{ ok: true }>(`/api/families/${deviceId}/saved/${placeId}`, { method: 'PUT' }),

  unsavePlace: (deviceId: string, placeId: string) =>
    request<{ ok: true }>(`/api/families/${deviceId}/saved/${placeId}`, { method: 'DELETE' }),

  getReviews: (placeId: string) => request<Review[]>(`/api/places/${placeId}/reviews`),

  addReview: (placeId: string, review: Omit<Review, 'id' | 'createdAt' | 'helpfulCount'>) =>
    request<Review>(`/api/places/${placeId}/reviews`, { method: 'POST', body: JSON.stringify(review) }),

  addReport: (report: { placeId: string; kind: string; summary: string }) =>
    request<{ id: string }>('/api/reports', { method: 'POST', body: JSON.stringify(report) }),
}
