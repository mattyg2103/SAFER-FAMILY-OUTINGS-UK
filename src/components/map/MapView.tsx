import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet'
import L from 'leaflet'
import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import type { Place, RouteWaypoint, WalkingRoute } from '../../types'
import { CATEGORY_META } from '../../lib/categoryMeta'

function emojiIcon(emoji: string, highlighted = false) {
  return L.divIcon({
    html: `<div style="
      display:flex;align-items:center;justify-content:center;
      width:${highlighted ? 40 : 32}px;height:${highlighted ? 40 : 32}px;
      background:${highlighted ? '#2a9d6f' : '#ffffff'};
      border:2px solid #2a9d6f;border-radius:9999px;
      font-size:${highlighted ? 20 : 16}px;
      box-shadow:0 2px 6px rgba(0,0,0,0.25);
    ">${emoji}</div>`,
    className: '',
    iconSize: [highlighted ? 40 : 32, highlighted ? 40 : 32],
    iconAnchor: [highlighted ? 20 : 16, highlighted ? 20 : 16],
  })
}

const WAYPOINT_EMOJI: Record<RouteWaypoint['kind'], string> = {
  start: '🚩',
  finish: '🏁',
  parking: '🅿️',
  entrance: '🚪',
  playground: '🛝',
  woodland: '🌲',
  riverside: '💧',
  picnic: '🧺',
  toilets: '🚻',
  viewpoint: '👀',
  poi: '📍',
}

function Recenter({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap()
  useEffect(() => {
    map.setView(center, zoom)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [center[0], center[1], zoom])
  return null
}

export function MapView({
  places,
  route,
  center,
  zoom = 14,
  highlightedWaypointId,
  userLocation,
}: {
  places?: Place[]
  route?: WalkingRoute
  center: [number, number]
  zoom?: number
  highlightedWaypointId?: string
  userLocation?: [number, number]
}) {
  return (
    <MapContainer center={center} zoom={zoom} scrollWheelZoom className="h-full w-full" attributionControl={false}>
      <Recenter center={center} zoom={zoom} />
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />

      {userLocation && (
        <Marker position={userLocation} icon={emojiIcon('📍', true)}>
          <Popup>You are here</Popup>
        </Marker>
      )}

      {places?.map((place) => (
        <Marker key={place.id} position={[place.lat, place.lng]} icon={emojiIcon(CATEGORY_META[place.category].icon)}>
          <Popup>
            <div className="text-sm">
              <strong>{place.name}</strong>
              <br />
              <Link to={`/place/${place.id}`} className="text-brand-600 underline">
                View details
              </Link>
            </div>
          </Popup>
        </Marker>
      ))}

      {route && (
        <>
          <Polyline positions={route.path} pathOptions={{ color: '#2a9d6f', weight: 4, opacity: 0.85 }} />
          {route.waypoints.map((wp) => (
            <Marker
              key={wp.id}
              position={[wp.lat, wp.lng]}
              icon={emojiIcon(WAYPOINT_EMOJI[wp.kind], wp.id === highlightedWaypointId)}
            >
              <Popup>
                <div className="text-sm">
                  <strong>{wp.label}</strong>
                  {wp.note && (
                    <>
                      <br />
                      {wp.note}
                    </>
                  )}
                </div>
              </Popup>
            </Marker>
          ))}
        </>
      )}
    </MapContainer>
  )
}
