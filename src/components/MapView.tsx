import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Business } from '../constants';

// Fix Leaflet marker icons by using CDN URLs
const DefaultIcon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

interface MapViewProps {
  prospects: Business[];
  selectedId?: number;
  onSelect: (b: Business) => void;
  center: [number, number];
  zoom: number;
}

function ChangeView({ center, zoom }: { center: [number, number], zoom: number }) {
  const map = useMap();
  map.setView(center, zoom);
  return null;
}

export default function MapView({ prospects, selectedId, onSelect, center, zoom }: MapViewProps) {
  const selectedProspect = prospects.find(p => p.id === selectedId);
  const mapCenter: [number, number] = selectedProspect 
    ? [selectedProspect.coordonnees.lat, selectedProspect.coordonnees.lng]
    : center;
  const mapZoom = selectedProspect ? 17 : zoom;

  return (
    <div className="h-full w-full relative z-0">
      <MapContainer 
        center={center} 
        zoom={zoom} 
        className="h-full w-full"
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ChangeView center={mapCenter} zoom={mapZoom} />
        {prospects.map(prospect => (
          <Marker 
            key={prospect.id} 
            position={[prospect.coordonnees.lat, prospect.coordonnees.lng]}
            eventHandlers={{
              click: () => onSelect(prospect),
            }}
          >
            <Popup>
              <div className="p-1">
                <h3 className="font-bold text-sm mb-1">{prospect.nomEntreprise}</h3>
                <p className="text-xs text-gray-500 mb-2">{prospect.secteur}</p>
                <button 
                  onClick={() => onSelect(prospect)}
                  className="text-[10px] bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700 transition-colors w-full"
                >
                  Voir détails
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
