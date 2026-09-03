import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Polyline, Marker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const redIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [20, 33],
  iconAnchor: [10, 33],
  shadowSize: [33, 33],
});

const trucks = [
  { id: 'TRK-74ER453', status: 'On Route', time: '02:47:24', left: '58 min. left', model: 'Volvo FH16 Globetrotter', speed: '78 km/h', driver: 'Arun V.', img: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=200&q=60' },
  { id: 'TRK-34DFR73', status: 'On Route', time: '01:38:47', left: '57 min. left', model: 'Scania R500 V8', speed: '82 km/h', driver: 'George D.', img: 'https://images.unsplash.com/photo-1519003300449-424ad0405076?w=200&q=60' },
  { id: 'TRK-847DE74', status: 'On Route', time: '03:29:58', left: '78 min. left', model: 'Mercedes Actros 2645', speed: '65 km/h', driver: 'Ramesh K.', img: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=200&q=60' },
  { id: 'TRK-2S7DRE1', status: 'Waiting', time: '03:29:58', left: '20 min. left', model: 'MAN TGX 18.500', speed: '0 km/h', driver: 'Suresh P.', img: 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=200&q=60' },
  { id: 'TRK-ER74R69', status: 'On Route', time: '00:28:38', left: '88 min. left', model: 'DAF XF 530 Super', speed: '74 km/h', driver: 'Michael J.', img: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=200&q=60' },
];

const tabs = ['Telemetry', 'Cargo Spec', 'Waybill Docs', 'Driver Vitals'];

export default function TrackingDashboard() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(trucks[1]);
  const [activeTab, setActiveTab] = useState('Telemetry');

  return (
    <div className="space-y-5 pb-10">
      {/* ── HEADER ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/80 border border-slate-800 rounded-2xl p-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl">📍</span>
            <h1 className="text-xl font-black text-slate-100">Live GPS Fleet Tracking Deck</h1>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              5 VEHICLES MONITORED
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">Real-time coordinates, speed sensors, and telemetry feeds</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/live-ops')}
            className="px-3.5 py-2 text-xs font-bold rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/25 transition"
          >
            🗺️ Full Radar
          </button>
        </div>
      </div>

      {/* ── MAIN CONTENT: LIST + MAP + DETAIL CARD ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Active Trucks List */}
        <div className="lg:col-span-4 bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex flex-col space-y-3">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">Active GPS Transponders</div>
          <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
            {trucks.map((t) => {
              const isSel = selected.id === t.id;
              return (
                <div
                  key={t.id}
                  onClick={() => setSelected(t)}
                  className={`p-3 rounded-xl cursor-pointer border transition flex items-center gap-3 ${
                    isSel
                      ? 'bg-sky-950/40 border-sky-500/40 text-sky-100'
                      : 'bg-slate-950/50 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <img src={t.img} className="w-10 h-10 rounded-lg object-cover flex-shrink-0" alt="" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold font-mono truncate">{t.id}</span>
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                          t.status === 'On Route' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-amber-500/15 text-amber-400'
                        }`}
                      >
                        {t.status}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5 truncate">{t.model}</div>
                    <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-mono">
                      <span>Speed: {t.speed}</span>
                      <span>{t.left}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Truck Card & Telemetry Tabs */}
        <div className="lg:col-span-8 space-y-5">
          {/* Map Preview */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden relative h-64 sm:h-72">
            <MapContainer center={[50.35, 28.65]} zoom={8} style={{ height: '100%', width: '100%' }} zoomControl={false}>
              <TileLayer
                attribution="&copy; OpenStreetMap &copy; CARTO"
                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
              />
              <Polyline
                positions={[
                  [50.45, 30.52],
                  [50.25, 28.65],
                  [50.61, 26.25],
                ]}
                color="#0EA5E9"
                weight={4}
              />
              <Marker position={[50.25, 28.65]} icon={redIcon} />
            </MapContainer>

            {/* Selected Floating Pill */}
            <div className="absolute top-3 left-3 z-[1000] bg-slate-950/90 border border-slate-800 rounded-xl p-3 backdrop-blur">
              <div className="text-[10px] text-sky-400 font-bold uppercase">Tracking Selected Asset</div>
              <div className="text-sm font-black text-slate-100 font-mono mt-0.5">{selected.id}</div>
              <div className="text-xs text-slate-400 mt-1">Driver: {selected.driver} · Current Speed: {selected.speed}</div>
            </div>
          </div>

          {/* Details & Telemetry Tabs */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
            <div className="flex gap-2 border-b border-slate-800 pb-3 mb-4 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap ${
                    activeTab === tab
                      ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {activeTab === 'Telemetry' && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
                  <div className="text-[10px] text-slate-500">Engine RPM</div>
                  <div className="text-base font-bold font-mono text-slate-200 mt-1">1,420 RPM</div>
                </div>
                <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
                  <div className="text-[10px] text-slate-500">Coolant Temp</div>
                  <div className="text-base font-bold font-mono text-emerald-400 mt-1">88°C (Normal)</div>
                </div>
                <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
                  <div className="text-[10px] text-slate-500">Fuel Level</div>
                  <div className="text-base font-bold font-mono text-sky-400 mt-1">74% (320L)</div>
                </div>
                <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
                  <div className="text-[10px] text-slate-500">Battery Status</div>
                  <div className="text-base font-bold font-mono text-slate-200 mt-1">24.2V Optimal</div>
                </div>
              </div>
            )}

            {activeTab === 'Cargo Spec' && (
              <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800 text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">Cargo Type:</span>
                  <span className="font-semibold text-slate-200">Industrial Machinery & Components</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Gross Payload:</span>
                  <span className="font-mono text-amber-400 font-bold">8,450 KG</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Security Seal Status:</span>
                  <span className="text-emerald-400 font-bold">✓ Intact (Barcode Verified)</span>
                </div>
              </div>
            )}

            {activeTab === 'Waybill Docs' && (
              <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800 text-xs space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-slate-200">e-Waybill-2026-0903.pdf</span>
                  <button className="px-2.5 py-1 rounded bg-sky-500/20 text-sky-400 font-bold text-[11px]">Download</button>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-slate-800">
                  <span className="text-slate-200">Insurance_Coverage_Certificate.pdf</span>
                  <button className="px-2.5 py-1 rounded bg-sky-500/20 text-sky-400 font-bold text-[11px]">Download</button>
                </div>
              </div>
            )}

            {activeTab === 'Driver Vitals' && (
              <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800 text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">Assigned Driver:</span>
                  <span className="font-semibold text-slate-200">{selected.driver}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Duty Hours Today:</span>
                  <span className="font-mono text-slate-200">4 hrs 15 mins (Rest break due in 1h 45m)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Driver Safety Index:</span>
                  <span className="text-emerald-400 font-bold font-mono">98 / 100</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
