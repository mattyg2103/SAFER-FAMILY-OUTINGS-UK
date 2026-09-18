# Safer Family Outings UK

**Find it. Explore it. Know before you go.**

A mobile-first web app that helps parents and carers find free and affordable
outings, activities and outdoor experiences that work for their family's
practical needs — with a particular focus on families whose children have
additional needs, disabilities, accessibility requirements or environmental
considerations.

The app never labels a place "safe" or "unsafe". It surfaces factual,
last-checked information (enclosure, water, roads, accessibility, sensory
considerations) and a **Family Match** summary — good match / things to
consider / information needed — so parents and carers always make the final
call.

## Tech stack

- **React + TypeScript + Vite**
- **Tailwind CSS v4** for a mobile-first, non-clinical visual design
- **React Router** for navigation
- **Leaflet + OpenStreetMap** for interactive maps and walking routes (no API
  key required)
- **React Context + localStorage** — this prototype has no backend. Family
  accounts, child profiles, saved places and community contributions all live
  on-device.

## Key features implemented

- Onboarding that makes child profiles explicitly optional
- Child profiles built from practical needs (mobility, wandering/elopement,
  vision, hearing, sensory, communication) rather than diagnoses, with no
  name or photo required
- "Who's coming today?" — combines multiple children's needs into one family
  view
- Home screen with curated sections (Free near you, Great matches, Enclosed
  playgrounds, Accessible walks, What's On, Quieter activities, etc.)
- Explore screen with map/list toggle, smart filters, and filter suggestions
  based on family needs
- Location profiles with: Know Before You Go (enclosure, water, roads,
  accessibility, environment, facilities), Family Match, interactive map,
  visual walking routes with a step-by-step route journey, family reviews
- Dedicated "Additional Needs Activities" discovery showing specific
  adjustments (BSL sessions, sensory rooms, quiet sessions, Changing Places)
  rather than generic claims
- What's On Near Me with date/accessibility filters
- Community contribution flows: reviews, structured accessibility
  confirmations, closure reports, and suggesting new locations/routes
- Saved places and a lightweight mock sign-in

## Running locally

```bash
npm install
npm run dev
```

Then open the printed local URL in a mobile-width browser window (or your
phone) to see the mobile-first layout.

## Building

```bash
npm run build
```

## Sample data

All locations, routes, events and reviews are illustrative sample data set in
a fictional town ("Millbrook") — see `src/data/locations.ts` and
`src/data/events.ts`. Replacing this with real, verified venue data (ideally
via a proper backend and venue-claim workflow) is the natural next step
before this becomes a production product.
