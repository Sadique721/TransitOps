import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Polyline, Marker } from 'react-leaflet';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const numberedIcon = (num) =>
  new L.DivIcon({
    className: '',
    html: `<div style="width:26px;height:26px;border-radius:50%;background:#EF4444;border:2.5px solid #fff;color:#fff;font-weight:800;font-size:12px;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 8px rgba(0,0,0,0.5)">${num}</div>`,
    iconAnchor: [13, 13],
  });

const trendData = [
  { d: '28.10', v: 1 },
  { d: '29.10', v: 2 },
  { d: '30.10', v: 3 },
  { d: '31.10', v: 2 },
  { d: '01.11', v: 4 },
  { d: '02.11', v: 3 },
  { d: '03.11', v: 5 },
];

const [KY, ZH, RV] = [
  [50.4501, 30.5234],
  [50.2547, 28.6587],
  [50.6199, 26.2516],
];

const initialMessages = [
  { from: 'Central Dispatch', text: 'Cargo manifests verified. Clear for departure.', side: 'left' },
  { from: 'Driver (Michael)', text: 'En route on Highway 06. ETA 45 minutes.', side: 'right' },
];

export default function ShipmentTrack() {
  const navigate = useNavigate();
  const [msg, setMsg] = useState('');
  const [chat, setChat] = useState(initialMessages);

  const send = (e) => {
    e.preventDefault();
    if (!msg.trim()) return;
    setChat([...chat, { from: 'Driver', text: msg, side: 'right' }]);
    setMsg('');
  };

  return (
    <div className="space-y-5 pb-10">
      {/* ── HEADER ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/80 border border-slate-800 rounded-2xl p-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl">📦</span>
            <h1 className="text-xl font-black text-slate-100">Live Shipment & Manifest Tracking</h1>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
              IN TRANSIT #SP-99214
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">Real-time GPS waypoints, cargo load capacity, and dispatch comms</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/trips')}
            className="px-3.5 py-2 text-xs font-bold rounded-lg bg-sky-500/15 border border-sky-500/30 text-sky-300 hover:bg-sky-500/25 transition"
          >
            🛣️ View Trips
          </button>
        </div>
      </div>

      {/* ── TOP SECTION: MAP + TRUCK CAPACITY ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Map View with Route */}
        <div className="lg:col-span-8 bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden relative h-80 sm:h-96">
          <MapContainer center={[50.35, 28.65]} zoom={7} style={{ height: '100%', width: '100%' }} zoomControl={false}>
            <TileLayer
              attribution="&copy; OpenStreetMap &copy; CARTO"
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            />
            <Polyline positions={[KY, ZH, RV]} color="#EF4444" weight={4} />
            <Marker position={KY} icon={numberedIcon(1)} />
            <Marker position={ZH} icon={numberedIcon(2)} />
            <Marker position={RV} icon={numberedIcon(3)} />
          </MapContainer>

          {/* Map Overlay Badge */}
          <div className="absolute top-4 left-4 z-[1000] bg-slate-950/90 border border-slate-800 rounded-xl p-3 backdrop-blur shadow-2xl">
            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Fastest Route</div>
            <div className="text-sm font-black text-slate-100 font-mono mt-0.5">384 KM · 4h 15m</div>
            <div className="flex items-center gap-2 mt-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="text-[11px] text-emerald-400 font-semibold">Clear Traffic</span>
            </div>
          </div>
        </div>

        {/* Truck Capacity & Telemetry */}
        <div className="lg:col-span-4 bg-slate-900/80 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Cargo Hold Utilization</span>
              <span className="text-xs font-mono text-emerald-400 font-bold">86% Loaded</span>
            </div>
            {/* Progress bar */}
            <div className="w-full bg-slate-800 h-3.5 rounded-full overflow-hidden p-0.5 border border-slate-700 mb-4">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-amber-500 rounded-full transition-all"
                style={{ width: '86%' }}
              />
            </div>
            <div className="grid grid-cols-2 gap-3 mb-4 text-xs">
              <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                <div className="text-[10px] text-slate-500">Max Capacity</div>
                <div className="text-sm font-bold font-mono text-slate-200 mt-1">12,000 KG</div>
              </div>
              <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                <div className="text-[10px] text-slate-500">Loaded Weight</div>
                <div className="text-sm font-bold font-mono text-amber-400 mt-1">10,320 KG</div>
              </div>
            </div>
          </div>

          <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800 space-y-2 text-xs">
            <div className="flex justify-between text-slate-400">
              <span>Assigned Vehicle:</span>
              <span className="font-mono text-slate-200">TRK-Volvo-FH16</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Driver:</span>
              <span className="font-semibold text-slate-200">Michael Johnson</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Temperature:</span>
              <span className="font-mono text-emerald-400">+4.2°C (Optimal)</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── BOTTOM SECTION: SHIPMENT DETAILS & LIVE DISPATCH CHAT ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Shipment Milestones */}
        <div className="lg:col-span-7 bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex justify-between items-center border-b border-slate-800 pb-3">
            <span className="text-sm font-bold text-slate-100">Delivery Milestones</span>
            <span className="text-xs text-emerald-400 font-bold font-mono">ON SCHEDULE</span>
          </div>

          <div className="grid grid-cols-3 gap-3 text-xs">
            <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl">
              <div className="text-[10px] text-slate-500 font-bold uppercase">Origin Hub</div>
              <div className="font-bold text-slate-200 mt-1">Kyiv Central Hub</div>
              <div className="text-[10px] text-emerald-400 mt-1 font-mono">✓ 08:30 AM</div>
            </div>
            <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl">
              <div className="text-[10px] text-slate-500 font-bold uppercase">Checkpoint</div>
              <div className="font-bold text-slate-200 mt-1">Zhytomyr Toll</div>
              <div className="text-[10px] text-emerald-400 mt-1 font-mono">✓ 10:45 AM</div>
            </div>
            <div className="p-3 bg-slate-950/60 border border-sky-500/30 rounded-xl bg-sky-950/20">
              <div className="text-[10px] text-sky-400 font-bold uppercase">Destination</div>
              <div className="font-bold text-slate-200 mt-1">Rivne Terminal</div>
              <div className="text-[10px] text-sky-400 mt-1 font-mono">ETA 01:15 PM</div>
            </div>
          </div>

          <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl text-xs space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-400">Cargo Type:</span>
              <span className="font-semibold text-slate-200">Express Freight & Medical Supplies</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Total Waybill Value:</span>
              <span className="font-bold text-emerald-400 font-mono">$48,250.00</span>
            </div>
          </div>
        </div>

        {/* Live Driver & Dispatch Comms */}
        <div className="lg:col-span-5 bg-slate-900/80 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between h-72 lg:h-auto">
          <div className="flex justify-between items-center mb-3 pb-2 border-b border-slate-800">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Dispatch Comms Channel</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto space-y-2.5 mb-3 pr-1 text-xs">
            {chat.map((c, i) => (
              <div key={i} className={`flex flex-col ${c.side === 'right' ? 'items-end' : 'items-start'}`}>
                <span className="text-[9px] text-slate-500 font-semibold mb-0.5">{c.from}</span>
                <div
                  className={`px-3 py-2 rounded-xl max-w-[85%] ${
                    c.side === 'right'
                      ? 'bg-sky-600/30 border border-sky-500/40 text-sky-100 rounded-br-none'
                      : 'bg-slate-800/80 border border-slate-700 text-slate-200 rounded-bl-none'
                  }`}
                >
                  {c.text}
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <form onSubmit={send} className="flex gap-2">
            <input
              placeholder="Send message to driver..."
              value={msg}
              onChange={(e) => setMsg(e.target.value)}
              className="flex-1 bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 outline-none focus:border-sky-500"
            />
            <button type="submit" className="px-3.5 py-2 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs rounded-xl transition">
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
