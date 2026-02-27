import React, { useEffect, useState } from "react";

export default function MapWidget({ items = [] }) {
  const [Comps, setComps] = useState(null);

  useEffect(() => {
    Promise.all([import("react-leaflet"), import("leaflet")]).then(
      ([rl, L]) => {
        delete L.default.Icon.Default.prototype._getIconUrl;
        L.default.Icon.Default.mergeOptions({
          iconUrl:
            "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
          iconRetinaUrl:
            "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
          shadowUrl:
            "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
        });
        setComps(rl);
      },
    );
  }, []);

  const locs = items.filter((i) => i.latitude && i.longitude);
  const center = locs.length
    ? [+locs[0].latitude, +locs[0].longitude]
    : [20, 0];

  if (!Comps)
    return (
      <div className="card h-72 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-2 animate-bounce">🗺️</div>
          <p className="text-surface-400 text-sm">Loading map…</p>
        </div>
      </div>
    );

  const { MapContainer, TileLayer, Marker, Popup } = Comps;

  return (
    <div className="card overflow-hidden">
      <div className="p-4 border-b border-surface-100 flex items-center justify-between">
        <span className="font-semibold text-dark-900 text-sm">
          📍 Locations on Map
        </span>
        <span className="text-xs text-surface-400">
          {locs.length} pin{locs.length !== 1 ? "s" : ""}
        </span>
      </div>
      <MapContainer
        center={center}
        zoom={locs.length ? 12 : 2}
        style={{ height: "300px" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="© OpenStreetMap"
        />
        {locs.map((l) => (
          <Marker key={l.id} position={[+l.latitude, +l.longitude]}>
            <Popup>
              <strong>{l.title}</strong>
              {l.location && <p>{l.location}</p>}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
