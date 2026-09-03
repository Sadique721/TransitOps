import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const pinIcon = (color) =>
  new L.DivIcon({
    className: '',
    html: `<div style="width:24px;height:36px;position:relative"><svg viewBox="0 0 24 36" fill="${color}" xmlns="http://www.w3.org/2000/svg"><path d="M12 0C5.373 0 0 5.373 0 12c0 9 12 24 12 24s12-15 12-24C24 5.373 18.627 0 12 0z"/></svg><div style="position:absolute;top:5px;left:50%;transform:translateX(-50%);width:8px;height:8px;border-radius:50%;background:#fff"></div></div>`,
    iconAnchor: [12, 36],
  });

const vehicleImgs = {
  'Noah Fleet': 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=60&q=60',
  'Jeep Wrangler': 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=60&q=60',
  'Peterbilt Hauler': 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=60&q=60',
  'Heavy Cargo Truck': 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=60&q=60',
};

const trackingList = [
  { name: 'Noah Fleet', status: 'Active Dispatch', fuel: '80%', km: '486 KM' },
  { name: 'Jeep Wrangler', status: 'Field Patrol', fuel: '65%', km: '312 KM' },
  { name: 'Peterbilt Hauler', status: 'Interstate Bulk', fuel: '92%', km: '1,240 KM' },
  { name: 'Heavy Cargo Truck', status: 'Port Transfer', fuel: '44%', km: '780 KM' },
];

const rentalTrips = [
  { t1: '08:24 AM', loc1: 'Terminal 1 Port Gate', t2: '11:34 AM', loc2: 'Industrial Park Hub B', name: 'Polestar 520', km: '486 KM' },
  { t1: '12:15 PM', loc1: 'Logistics Depot 4', t2: '03:40 PM', loc2: 'North Logistics Zone', name: 'Volvo FH16', km: '320 KM' },
  { t1: '04:10 PM', loc1: 'South Distribution Yard', t2: '07:20 PM', loc2: 'Central Retail Warehouses', name: 'Scania R500', km: '215 KM' },
];

const pathCoords = [
  [59.451, 24.72],
  [59.448, 24.732],
  [59.444, 24.738],
  [59.44, 24.745],
  [59.439, 24.755],
  [59.437, 24.76],
  [59.435, 24.762],
  [59.433, 24.752],
  [59.431, 24.745],
  [59.429, 24.74],
  [59.427, 24.735],
];

export default function RentCoDashboard() {
  const navigate = useNavigate();
  const [selectedVehicle, setSelectedVehicle] = useState('Peterbilt Hauler');

  return (
    <div className="space-y-5 pb-10">
      {/* ── HEADER ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/80 border border-slate-800 rounded-2xl p-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl">🚗</span>
            <h1 className="text-xl font-black text-slate-100">Rent Co. Asset Leasing & Costing</h1>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/20">
              COMMERCIAL LEASE
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">Asset utilization, lease contracts, and commercial dispatch telemetry</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/vehicles')}
            className="px-3.5 py-2 text-xs font-bold rounded-lg bg-orange-500/15 border border-orange-500/30 text-orange-300 hover:bg-orange-500/25 transition"
          >
            🚚 Vehicle Assets
          </button>
        </div>
      </div>

      {/* ── MAP + ASSET ROSTER ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Active Asset Roster */}
        <div className="lg:col-span-4 bg-slate-900/80 border border-slate-800 rounded-2xl p-4 space-y-3">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">Leased Fleet Assets</div>
          <div className="space-y-2">
            {trackingList.map((item) => {
              const isSel = selectedVehicle === item.name;
              return (
                <div
                  key={item.name}
                  onClick={() => setSelectedVehicle(item.name)}
                  className={`p-3 rounded-xl cursor-pointer border transition flex items-center gap-3 ${
                    isSel
                      ? 'bg-orange-950/40 border-orange-500/40 text-orange-100'
                      : 'bg-slate-950/50 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <img src={vehicleImgs[item.name] || vehicleImgs['Noah Fleet']} className="w-10 h-10 rounded-lg object-cover flex-shrink-0" alt="" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold truncate">{item.name}</span>
                      <span className="text-[10px] font-mono text-emerald-400 font-bold">{item.fuel} Fuel</span>
                    </div>
                    <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                      <span>{item.status}</span>
                      <span className="font-mono">{item.km}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Live Route Map */}
        <div className="lg:col-span-8 bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden relative h-80 sm:h-96">
          <MapContainer center={[59.438, 24.745]} zoom={13} style={{ height: '100%', width: '100%' }} zoomControl={false}>
            <TileLayer
              attribution="&copy; OpenStreetMap &copy; CARTO"
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            />
            <Polyline positions={pathCoords} color="#F97316" weight={4} />
            <Marker position={[59.451, 24.72]} icon={pinIcon('#F97316')} />
            <Marker position={[59.427, 24.735]} icon={pinIcon('#10B981')} />
          </MapContainer>

          <div className="absolute top-4 left-4 z-[1000] bg-slate-950/90 border border-slate-800 rounded-xl p-3 backdrop-blur">
            <div className="text-[10px] text-orange-400 font-bold uppercase">Active Lease Route</div>
            <div className="text-sm font-black text-slate-100 font-mono mt-0.5">{selectedVehicle}</div>
            <div className="text-xs text-slate-400 mt-1">Trip Distance: 486 KM · 92% Efficiency</div>
          </div>
        </div>
      </div>

      {/* ── RECENT COMMERCIAL TRIPS ── */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-3">
        <div className="flex justify-between items-center border-b border-slate-800 pb-3">
          <span className="text-sm font-bold text-slate-100">Recent Commercial Rental Dispatches</span>
          <span className="text-xs text-orange-400 font-mono font-semibold">3 LOGGED TODAY</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {rentalTrips.map((t, idx) => (
            <div key={idx} className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl text-xs space-y-2">
              <div className="flex justify-between font-bold text-slate-200">
                <span>{t.name}</span>
                <span className="font-mono text-orange-400">{t.km}</span>
              </div>
              <div className="text-slate-400 space-y-1">
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>{t.t1} · {t.loc1}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-400" />
                  <span>{t.t2} · {t.loc2}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
