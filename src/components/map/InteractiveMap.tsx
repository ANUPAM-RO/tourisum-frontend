'use client';

import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const createCustomIcon = (color: string, iconHtml: string) => {
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="
      background: ${color};
      width: 36px;
      height: 36px;
      border-radius: 50% 50% 50% 0;
      transform: rotate(-45deg);
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      border: 2px solid white;
    ">
      <span style="transform: rotate(45deg); font-size: 16px;">${iconHtml}</span>
    </div>`,
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -36],
  });
};

const markerIcons = {
  place: createCustomIcon('#3b82f6', '📍'),
  hotel: createCustomIcon('#8b5cf6', '🏨'),
  restaurant: createCustomIcon('#f59e0b', '🍽️'),
  nearby: createCustomIcon('#10b981', '🗺️'),
  city: createCustomIcon('#ef4444', '🏙️'),
};

export interface MapMarker {
  id: string;
  name: string;
  lat: number;
  lng: number;
  type: 'place' | 'hotel' | 'restaurant' | 'nearby' | 'city';
  description?: string;
  extraInfo?: Record<string, string>;
  link?: string;
}

function ChangeView({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
}

function FitBounds({ markers }: { markers: MapMarker[] }) {
  const map = useMap();
  useEffect(() => {
    if (markers.length > 0) {
      const bounds = L.latLngBounds(markers.map((m) => [m.lat, m.lng]));
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [markers, map]);
  return null;
}

interface InteractiveMapProps {
  center?: [number, number];
  zoom?: number;
  markers: MapMarker[];
  height?: string;
  showLegend?: boolean;
  fitBounds?: boolean;
}

export default function InteractiveMap({
  center = [20.5937, 78.9629],
  zoom = 5,
  markers,
  height = '400px',
  showLegend = true,
  fitBounds: shouldFitBounds = true,
}: InteractiveMapProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div
        className="rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800 flex items-center justify-center"
        style={{ height }}
      >
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-gray-500">Loading map...</p>
        </div>
      </div>
    );
  }

  const legendItems = [
    { type: 'place' as const, label: 'Tourist Place', icon: '📍' },
    { type: 'nearby' as const, label: 'Nearby Spot', icon: '🗺️' },
    { type: 'hotel' as const, label: 'Hotel/Resort', icon: '🏨' },
    { type: 'restaurant' as const, label: 'Restaurant', icon: '🍽️' },
    { type: 'city' as const, label: 'City', icon: '🏙️' },
  ].filter((item) => markers.some((m) => m.type === item.type));

  return (
    <div className="space-y-4">
      <div className="rounded-2xl overflow-hidden shadow-lg" style={{ height }}>
        <MapContainer center={center} zoom={zoom} className="w-full h-full" zoomControl={true}>
          <ChangeView center={center} zoom={zoom} />
          {shouldFitBounds && markers.length > 1 && <FitBounds markers={markers} />}

          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {markers.map((marker) => (
            <Marker
              key={marker.id}
              position={[marker.lat, marker.lng]}
              icon={markerIcons[marker.type]}
            >
              <Popup>
                <div className="min-w-[200px]">
                  <h3 className="font-bold text-base mb-1">{marker.name}</h3>
                  {marker.description && (
                    <p className="text-sm text-gray-600 mb-2">{marker.description}</p>
                  )}
                  {marker.extraInfo && (
                    <div className="space-y-1 text-sm">
                      {Object.entries(marker.extraInfo).map(([key, value]) => (
                        <div key={key} className="flex justify-between">
                          <span className="text-gray-500">{key}:</span>
                          <span className="font-medium">{value}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  {marker.link && (
                    <a
                      href={marker.link}
                      className="inline-block mt-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View Details →
                    </a>
                  )}
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {showLegend && legendItems.length > 0 && (
        <div className="flex flex-wrap gap-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
          {legendItems.map((item) => (
            <div key={item.type} className="flex items-center gap-2">
              <span className="text-lg">{item.icon}</span>
              <span className="text-sm text-gray-600 dark:text-gray-400">{item.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
