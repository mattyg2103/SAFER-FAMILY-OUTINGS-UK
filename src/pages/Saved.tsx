import { TopBar } from '../components/layout/TopBar'
import { PlaceCard } from '../components/home/PlaceCard'
import { getPlaceById } from '../data/locations'
import { useFamily } from '../context/FamilyContext'

export function Saved() {
  const { savedPlaceIds } = useFamily()
  const places = savedPlaceIds.map(getPlaceById).filter((p): p is NonNullable<typeof p> => !!p)

  return (
    <div className="flex flex-1 flex-col">
      <TopBar title="Saved places" showBack={false} />
      <div className="flex-1 overflow-y-auto p-4">
        {places.length === 0 ? (
          <p className="mt-10 text-center text-sm text-slate-400">
            Nothing saved yet. Tap the heart on any place to save it here for later.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {places.map((p) => (
              <PlaceCard key={p.id} place={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
