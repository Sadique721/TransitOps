import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Polyline, Marker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const makeLabel = (text, bg) =>
  new L.DivIcon({
    className: '',
    html: `<div style="background:${bg};color:#fff;font-weight:700;font-size:9px;font-family:monospace;padding:3px 7px;border-radius:20px;white-space:nowrap;box-shadow:0 2px 8px rgba(0,0,0,0.5)">${text}</div>`,
    iconAnchor: [30, 10],
  });

const makeAvatar = (src, borderColor) =>
  new L.DivIcon({
    className: '',
    html: `<div style="width:32px;height:32px;border-radius:50%;border:2.5px solid ${borderColor};overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.4)"><img src="${src}" style="width:100%;height:100%;object-fit:cover"/></div>`,
    iconAnchor: [16, 16],
  });

const employees = [
  { name: 'Unassigned Fleet', hrs: '5hrs', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=40&q=80', checked: false },
  { name: 'Millie Fernandez', hrs: '3hrs', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=40&q=80', checked: false },
  { name: 'Riley Cooper', hrs: '2hrs', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&q=80', checked: false },
  { name: 'Nawf El Azam', hrs: '6hrs', avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=40&q=80', checked: false, initials: 'NA' },
  { name: 'Carole Chimako', hrs: '4hrs', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=40&q=80', checked: true },
  { name: 'Julian Gruber', hrs: '6hrs', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&q=80', checked: false },
  { name: 'Filipa Gaspar', hrs: '8hrs', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=40&q=80', checked: false },
];

const MAP_CENTER = [1.2989, 103.8475];

export default function ATTMapsDeck() {
  const navigate = useNavigate();
  const [list, setList] = useState(employees);
  const [filter, setFilter] = useState('');

  const toggle = (i) =>
    setList((l) => l.map((e, idx) => (idx === i ? { ...e, checked: !e.checked } : e)));

  const tealRoute = [
    [1.315, 103.83],
    [1.312, 103.84],
    [1.305, 103.848],
    [1.302, 103.86],
    [1.296, 103.868],
    [1.29, 103.862],
  ];
  const blueRoute1 = [
    [1.302, 103.86],
    [1.296, 103.868],
    [1.285, 103.86],
    [1.28, 103.848],
    [1.278, 103.836],
  ];
  const blueRoute2 = [
    [1.29, 103.862],
    [1.285, 103.855],
    [1.28, 103.848],
  ];
  const blueRoute3 = [
    [1.28, 103.848],
    [1.275, 103.84],
    [1.27, 103.832],
    [1.268, 103.823],
  ];

  const avatar1 = makeAvatar('https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=40&q=80', '#8b5cf6');
  const avatar2 = makeAvatar('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&q=80', '#f59e0b');

  return (
    <div className="space-y-4 h-[calc(100vh-100px)] flex flex-col">
      {/* ── HEADER ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex-shrink-0">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-emerald-400 text-lg">🗺️</span>
            <h1 className="text-xl font-black text-slate-100">Live Ops Geospatial Radar</h1>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              ACTIVE TELEMETRY
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">Live vehicle trajectories, field operators, and transit checkpoints</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/task-automate')}
            className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-700 transition"
          >
            📅 Tasks & Schedule
          </button>
          <button
            onClick={() => navigate('/tracking')}
            className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/25 transition"
          >
            📍 GPS Deck
          </button>
        </div>
      </div>

      {/* ── MAP CONTAINER WITH OPERATOR DRAWER ── */}
      <div className="flex-1 flex flex-col lg:flex-row gap-4 overflow-hidden min-h-0">
        {/* Operator checklist drawer */}
        <div className="w-full lg:w-72 bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-col flex-shrink-0 max-h-48 lg:max-h-full overflow-hidden">
          <div className="mb-3">
            <input
              placeholder="Filter field operators…"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 outline-none focus:border-sky-500"
            />
          </div>
          <div className="flex-1 overflow-y-auto space-y-1.5 pr-1">
            {list
              .filter((e) => e.name.toLowerCase().includes(filter.toLowerCase()))
              .map((emp, i) => (
                <div
                  key={i}
                  onClick={() => toggle(i)}
                  className={`flex items-center gap-2.5 p-2 rounded-xl cursor-pointer transition border ${
                    emp.checked
                      ? 'bg-indigo-950/40 border-indigo-500/30 text-indigo-300'
                      : 'bg-slate-950/40 border-slate-800/60 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={emp.checked}
                    onChange={() => toggle(i)}
                    onClick={(e) => e.stopPropagation()}
                    className="accent-indigo-500 rounded"
                  />
                  {emp.initials ? (
                    <div className="w-7 h-7 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs flex-shrink-0">
                      {emp.initials}
                    </div>
                  ) : (
                    <img src={emp.avatar} className="w-7 h-7 rounded-full object-cover flex-shrink-0" alt="" />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-semibold truncate">{emp.name}</div>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500">{emp.hrs}</span>
                </div>
              ))}
          </div>
        </div>

        {/* Leaflet Live Map */}
        <div className="flex-1 relative rounded-2xl overflow-hidden border border-slate-800 min-h-[320px]">
          <MapContainer center={MAP_CENTER} zoom={13} style={{ height: '100%', width: '100%' }} zoomControl={false}>
            <TileLayer
              attribution="&copy; OpenStreetMap &copy; CARTO"
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            />
            <Polyline positions={tealRoute} color="#06B6D4" weight={3.5} />
            <Polyline positions={blueRoute1} color="#6366F1" weight={3.5} />
            <Polyline positions={blueRoute2} color="#6366F1" weight={3.5} />
            <Polyline positions={blueRoute3} color="#6366F1" weight={3.5} />

            <Marker position={[1.315, 103.83]} icon={makeLabel('HUB 10:30 AM', '#0284C7')} />
            <Marker position={[1.302, 103.86]} icon={makeLabel('CK 11:00 AM', '#10B981')} />
            <Marker position={[1.285, 103.855]} icon={makeLabel('PORT 2:30 PM', '#F97316')} />
            <Marker position={[1.268, 103.823]} icon={makeLabel('BAY 4:30 PM', '#8B5CF6')} />
            <Marker position={[1.29, 103.848]} icon={makeLabel('4:00 PM', '#EF4444')} />
            <Marker position={[1.296, 103.868]} icon={avatar1} />
            <Marker position={[1.28, 103.836]} icon={avatar2} />
          </MapContainer>

          {/* Telemetry info card */}
          <div className="absolute top-4 left-4 z-[1000] bg-slate-900/90 border border-slate-700/80 rounded-xl p-3 flex items-center gap-3 backdrop-blur shadow-xl">
            <div className="bg-indigo-600/30 border border-indigo-500/50 rounded-lg p-2 text-center">
              <div className="text-base font-black text-indigo-300">13</div>
              <div className="text-[8px] font-bold text-indigo-400 tracking-wider">MIN</div>
            </div>
            <div>
              <div className="font-bold text-xs text-slate-100">Checkpoint 12 Marina Bay</div>
              <div className="text-[10px] text-slate-400 mt-0.5">ETA 13 mins · 6.5 KM</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
