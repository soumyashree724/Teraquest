import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { MapPin, Navigation, Compass, Building2, Landmark, Globe2 } from 'lucide-react';

// Custom clean DivIcons for Leaflet
const createCustomIcon = (bgColor, iconHtml) => {
  return L.divIcon({
    className: 'custom-leaflet-marker',
    html: `
      <div style="
        background-color: ${bgColor};
        width: 32px;
        height: 32px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #030712;
        box-shadow: 0 4px 12px rgba(0,0,0,0.5);
        border: 2px solid #ffffff;
        font-weight: bold;
      ">
        ${iconHtml}
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
};

const destinationIcon = createCustomIcon(
  '#10b981',
  '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>'
);

const hotelIcon = createCustomIcon(
  '#38bdf8',
  '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/><path d="M10 6h4"/><path d="M10 10h4"/><path d="M10 14h4"/><path d="M10 18h4"/></svg>'
);

const attractionIcon = createCustomIcon(
  '#f59e0b',
  '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>'
);

// Helper component to center map on destination changes
const ChangeMapView = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, 12, { animate: true });
  }, [center, map]);
  return null;
};

export const MapPanel = ({ destination, nearby = [] }) => {
  const position = [destination.latitude, destination.longitude];

  return (
    <div className="bg-slate-900/80 backdrop-blur-md rounded-3xl p-6 border border-slate-800 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Compass className="w-4 h-4" />
            <span>Interactive Route & Geo Coordinates</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-display font-bold text-white">
            Location Map & Landmark Proximity
          </h2>
        </div>

        <div className="flex items-center space-x-3 text-xs bg-slate-950/80 px-4 py-2 rounded-2xl border border-slate-800">
          <div className="flex items-center space-x-1.5 text-emerald-400">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block"></span>
            <span>Center</span>
          </div>
          <div className="flex items-center space-x-1.5 text-sky-400">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-400 inline-block"></span>
            <span>Hotels</span>
          </div>
          <div className="flex items-center space-x-1.5 text-amber-400">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block"></span>
            <span>Attractions</span>
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="relative h-[380px] sm:h-[420px] w-full rounded-2xl overflow-hidden border border-slate-700/60 shadow-xl">
        <MapContainer
          center={position}
          zoom={12}
          scrollWheelZoom={false}
          className="h-full w-full"
        >
          <ChangeMapView center={position} />
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Primary Destination Pin */}
          <Marker position={position} icon={destinationIcon}>
            <Popup>
              <div className="p-1 text-slate-100">
                <p className="font-bold text-sm text-emerald-400">{destination.name}</p>
                <p className="text-xs text-slate-300">{destination.country}</p>
                <p className="text-[11px] text-slate-400 mt-1">
                  Lat: {destination.latitude.toFixed(4)}, Lon: {destination.longitude.toFixed(4)}
                </p>
              </div>
            </Popup>
          </Marker>

          {/* Hotel Pins */}
          {destination.hotels?.map((hotel) => {
            const hLat = hotel.latitude || destination.latitude + (Math.random() - 0.5) * 0.04;
            const hLng = hotel.longitude || destination.longitude + (Math.random() - 0.5) * 0.04;
            return (
              <Marker key={hotel.id} position={[hLat, hLng]} icon={hotelIcon}>
                <Popup>
                  <div className="p-1 text-slate-100">
                    <p className="font-bold text-xs text-sky-400">🏨 {hotel.name}</p>
                    <p className="text-[11px] text-slate-300 font-semibold">${hotel.pricePerNight}/night · ★ {hotel.rating}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">{hotel.address}</p>
                  </div>
                </Popup>
              </Marker>
            );
          })}

          {/* Attraction Pins */}
          {destination.attractions?.map((attraction) => {
            const aLat = attraction.latitude || destination.latitude + (Math.random() - 0.5) * 0.05;
            const aLng = attraction.longitude || destination.longitude + (Math.random() - 0.5) * 0.05;
            return (
              <Marker key={attraction.id} position={[aLat, aLng]} icon={attractionIcon}>
                <Popup>
                  <div className="p-1 text-slate-100">
                    <p className="font-bold text-xs text-amber-400">📍 {attraction.name}</p>
                    <p className="text-[11px] text-slate-300 font-medium">{attraction.category} · ★ {attraction.rating}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">{attraction.bestTimeOfDay}</p>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>

      {/* Coordinate & Distance Reference Footer */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
        <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800 flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 shrink-0">
            <Navigation className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">Exact Coordinates</p>
            <p className="text-sm font-semibold text-white">
              {destination.latitude}° N, {destination.longitude}° E
            </p>
          </div>
        </div>

        {nearby && nearby.length > 0 && (
          <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
            <p className="text-xs text-slate-400 font-medium mb-1.5 flex items-center space-x-1">
              <Globe2 className="w-3.5 h-3.5 text-cyan-400" />
              <span>Proximity to Other Key Destinations:</span>
            </p>
            <div className="flex flex-wrap gap-2">
              {nearby.slice(0, 3).map((item) => (
                <span
                  key={item.id}
                  className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-[11px] font-medium text-slate-300"
                >
                  {item.name}: <strong className="text-emerald-400 font-semibold">{item.distanceKm.toLocaleString()} km</strong>
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
