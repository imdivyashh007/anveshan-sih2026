'use client';

import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const createPinIcon = (color: 'emerald' | 'amber') => {
  const bg = color === 'emerald' ? '#047857' : '#d97706';
  return L.divIcon({
    className: 'custom-gis-pin',
    html: `
      <div style="
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <span style="
          position: absolute;
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: ${color === 'emerald' ? 'rgba(4,120,87,0.35)' : 'rgba(217,119,6,0.35)'};
          animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;
        "></span>
        <span style="
          position: relative;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: ${bg};
          border: 2px solid #ffffff;
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        "></span>
      </div>
    `,
    iconSize: [22, 22],
    iconAnchor: [11, 11],
    popupAnchor: [0, -10]
  });
};

interface MapProps {
  onSelectDistrict: (district: string) => void;
  selectedDistrict: string;
}

const DISTRICT_COORDINATES = [
  { name: 'Sahebganj', lat: 25.2425, lng: 87.6417, status: 'Adopted', domain: 'Arsenic Water Contamination' },
  { name: 'Dumka', lat: 24.2676, lng: 87.2486, status: 'Reported', domain: 'Solar Microgrid Battery Decay' },
  { name: 'Ranchi', lat: 23.3441, lng: 85.3096, status: 'Reported', domain: 'Agri Cold-Chain & Sensors' },
  { name: 'Chaibasa (West Singhbhum)', lat: 22.5540, lng: 85.8080, status: 'Reported', domain: 'Lac Post-Harvest Cold-Chain' },
  { name: 'Dhanbad', lat: 23.7957, lng: 86.4304, status: 'Reported', domain: 'Coal Runoff & Particulates' },
  { name: 'Bokaro', lat: 23.6693, lng: 86.1511, status: 'Reported', domain: 'Thermal Ash Dispersion' },
  { name: 'Hazaribagh', lat: 23.9925, lng: 85.3637, status: 'Reported', domain: 'Rural Micro-Irrigation Tech' },
  { name: 'Jamshedpur (East Singhbhum)', lat: 22.8046, lng: 86.2029, status: 'Reported', domain: 'Industrial Slag Reutilization' }
];

export default function JharkhandMap({ onSelectDistrict }: MapProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    return () => {
      setIsMounted(false);
    };
  }, []);

  if (!isMounted) {
    return (
      <div className="w-full h-[460px] bg-slate-100 rounded-lg border border-slate-300 flex items-center justify-center text-slate-500 text-xs">
        Initializing Geospatial Canvas...
      </div>
    );
  }

  return (
    <div className="w-full h-[460px] rounded-lg overflow-hidden border border-slate-300 shadow-sm relative z-0">
      <MapContainer
        key="gis-national-canvas-v1"
        center={[22.5937, 82.9629]}
        zoom={5}
        scrollWheelZoom={true}
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {DISTRICT_COORDINATES.map((dist) => {
          const isAdopted = dist.status === 'Adopted';
          return (
            <Marker
              key={dist.name}
              position={[dist.lat, dist.lng]}
              icon={createPinIcon(isAdopted ? 'emerald' : 'amber')}
              eventHandlers={{
                click: () => onSelectDistrict(dist.name)
              }}
            >
              <Popup>
                <div className="p-1 font-sans">
                  <p className="font-bold text-slate-900 text-sm">{dist.name}</p>
                  <p className="text-xs text-slate-600 mt-0.5">{dist.domain}</p>
                  <div className="mt-2 flex items-center justify-between gap-2 border-t pt-1.5 text-[11px]">
                    <span className={isAdopted ? 'text-emerald-700 font-bold' : 'text-amber-700 font-bold'}>
                      {dist.status}
                    </span>
                    <button
                      onClick={() => onSelectDistrict(dist.name)}
                      className="text-emerald-700 underline font-semibold cursor-pointer"
                    >
                      Filter Feed
                    </button>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}