import { neon } from '@neondatabase/serverless'

// Neon's HTTP driver talks Postgres over HTTPS, so it works from any
// environment that only allows outbound HTTPS (no raw TCP required).
export const sql = neon(process.env.DATABASE_URL)

export function newId(prefix) {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36)}`
}
