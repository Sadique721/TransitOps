import React, { useEffect, useRef } from 'react';

export default function TelemetryMap({ vehicles }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef({});

  useEffect(() => {
    // Dynamic import Leaflet to prevent SSR issues
    import('leaflet').then((L) => {
      // Load Leaflet CSS dynamically if not present
      if (!document.getElementById('leaflet-css')) {
        const link = document.createElement('link');
        link.id = 'leaflet-css';
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(link);
      }

      if (!mapInstanceRef.current && mapRef.current) {
        const map = L.map(mapRef.current).setView([20.5937, 78.9629], 5); // India center coordinates
        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
          attribution: '&copy; OpenStreetMap contributors &copy; CARTO'
        }).addTo(map);
        mapInstanceRef.current = map;
      }

      // Update markers
      const map = mapInstanceRef.current;
      if (map && vehicles) {
        // Clear old markers
        Object.keys(markersRef.current).forEach((key) => {
          markersRef.current[key].remove();
        });
        markersRef.current = {};

        // Add new markers
        vehicles.forEach((veh) => {
          if (veh.lat && veh.lng) {
            const marker = L.marker([veh.lat, veh.lng])
              .addTo(map)
              .bindPopup(`<b>${veh.registrationNumber}</b><br>Status: ${veh.status}`);
            markersRef.current[veh.id] = marker;
          }
        });
      }
    });

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [vehicles]);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 flex flex-col h-[400px]">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-sm text-slate-300 font-semibold flex items-center">
          <span className="h-2 w-2 bg-green-500 rounded-full inline-block mr-2 animate-pulse"></span>
          Live Fleet Telemetry (TimescaleDB + WebSockets)
        </span>
      </div>
      <div ref={mapRef} className="flex-1 rounded bg-slate-950 z-0 h-full w-full"></div>
    </div>
  );
}
