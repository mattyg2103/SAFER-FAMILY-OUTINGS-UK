import express from 'express'
import cors from 'cors'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { sql, newId } from './db.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const distDir = path.join(__dirname, '..', 'dist')

const app = express()
app.use(cors())
app.use(express.json())

function childRow(r) {
  return {
    id: r.id,
    displayName: r.display_name,
    avatar: r.avatar,
    needs: r.needs ?? [],
    maxRouteDistanceMiles: r.max_route_distance_miles == null ? null : Number(r.max_route_distance_miles),
    active: r.active,
    createdAt: r.created_at,
  }
}

function reviewRow(r) {
  return {
    id: r.id,
    placeId: r.place_id,
    authorLabel: r.author_label,
    rating: r.rating,
    text: r.body,
    visitedWith: r.visited_with ?? undefined,
    helpfulCount: r.helpful_count,
    createdAt: r.created_at,
  }
}

function reportRow(r) {
  return {
    id: r.id,
    placeId: r.place_id,
    kind: r.kind,
    summary: r.summary,
    createdAt: r.created_at,
  }
}

// Get (or lazily create) a family by id, along with children and saved places.
app.post('/api/families/:id', async (req, res, next) => {
  try {
    const { id } = req.params
    const { email } = req.body ?? {}
    await sql`insert into families (id, email) values (${id}, ${email ?? null}) on conflict (id) do nothing`
    if (email) {
      await sql`update families set email = ${email} where id = ${id}`
    }
    const [family] = await sql`select * from families where id = ${id}`
    const children = await sql`select * from children where family_id = ${id} order by created_at`
    const saved = await sql`select place_id from saved_places where family_id = ${id}`
    res.json({
      account: family.email ? { id: family.id, email: family.email, createdAt: family.created_at } : null,
      children: children.map(childRow),
      savedPlaceIds: saved.map((r) => r.place_id),
    })
  } catch (err) {
    next(err)
  }
})

app.post('/api/families/:id/signout', async (req, res, next) => {
  try {
    await sql`update families set email = null where id = ${req.params.id}`
    res.json({ ok: true })
  } catch (err) {
    next(err)
  }
})

app.post('/api/families/:id/children', async (req, res, next) => {
  try {
    const { id: familyId } = req.params
    const { displayName, avatar, needs, maxRouteDistanceMiles } = req.body
    const id = newId('child')
    const [row] = await sql`
      insert into children (id, family_id, display_name, avatar, needs, max_route_distance_miles, active)
      values (${id}, ${familyId}, ${displayName}, ${avatar}, ${needs ?? []}, ${maxRouteDistanceMiles ?? null}, true)
      returning *`
    res.json(childRow(row))
  } catch (err) {
    next(err)
  }
})

app.patch('/api/children/:id', async (req, res, next) => {
  try {
    const { id } = req.params
    const { displayName, avatar, needs, maxRouteDistanceMiles, active } = req.body
    const [row] = await sql`
      update children set
        display_name = coalesce(${displayName ?? null}, display_name),
        avatar = coalesce(${avatar ?? null}, avatar),
        needs = coalesce(${needs ?? null}, needs),
        max_route_distance_miles = ${maxRouteDistanceMiles === undefined ? null : maxRouteDistanceMiles},
        active = coalesce(${active ?? null}, active)
      where id = ${id} returning *`
    res.json(childRow(row))
  } catch (err) {
    next(err)
  }
})

app.delete('/api/children/:id', async (req, res, next) => {
  try {
    await sql`delete from children where id = ${req.params.id}`
    res.json({ ok: true })
  } catch (err) {
    next(err)
  }
})

app.put('/api/families/:familyId/saved/:placeId', async (req, res, next) => {
  try {
    const { familyId, placeId } = req.params
    await sql`insert into saved_places (family_id, place_id) values (${familyId}, ${placeId}) on conflict do nothing`
    res.json({ ok: true })
  } catch (err) {
    next(err)
  }
})

app.delete('/api/families/:familyId/saved/:placeId', async (req, res, next) => {
  try {
    const { familyId, placeId } = req.params
    await sql`delete from saved_places where family_id = ${familyId} and place_id = ${placeId}`
    res.json({ ok: true })
  } catch (err) {
    next(err)
  }
})

app.get('/api/places/:placeId/reviews', async (req, res, next) => {
  try {
    const rows = await sql`select * from reviews where place_id = ${req.params.placeId} order by created_at desc`
    res.json(rows.map(reviewRow))
  } catch (err) {
    next(err)
  }
})

app.post('/api/places/:placeId/reviews', async (req, res, next) => {
  try {
    const { placeId } = req.params
    const { authorLabel, rating, text, visitedWith } = req.body
    const id = newId('review')
    const [row] = await sql`
      insert into reviews (id, place_id, author_label, rating, body, visited_with)
      values (${id}, ${placeId}, ${authorLabel ?? 'A family who visited'}, ${rating}, ${text}, ${visitedWith ?? null})
      returning *`
    res.json(reviewRow(row))
  } catch (err) {
    next(err)
  }
})

app.post('/api/reports', async (req, res, next) => {
  try {
    const { placeId, kind, summary } = req.body
    const id = newId('report')
    const [row] = await sql`
      insert into reports (id, place_id, kind, summary) values (${id}, ${placeId}, ${kind}, ${summary}) returning *`
    res.json(reportRow(row))
  } catch (err) {
    next(err)
  }
})

app.get('/api/health', async (_req, res, next) => {
  try {
    await sql`select 1`
    res.json({ ok: true })
  } catch (err) {
    next(err)
  }
})

// Serve the built frontend.
app.use(express.static(distDir))
app.get(/.*/, (_req, res) => {
  res.sendFile(path.join(distDir, 'index.html'))
})

app.use((err, _req, res, _next) => {
  console.error(err)
  res.status(500).json({ error: 'Internal server error' })
})

const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log(`Server listening on port ${port}`)
})
