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

const makeLabel = (text, bg) => new L.DivIcon({
  className: '',
  html: `<div style="background:${bg};color:#fff;font-weight:700;font-size:9px;font-family:monospace;padding:3px 7px;border-radius:20px;white-space:nowrap;box-shadow:0 2px 8px rgba(0,0,0,0.3)">${text}</div>`,
  iconAnchor: [30, 10],
});

const makeAvatar = (src, borderColor) => new L.DivIcon({
  className: '',
  html: `<div style="width:32px;height:32px;border-radius:50%;border:2.5px solid ${borderColor};overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.2)"><img src="${src}" style="width:100%;height:100%;object-fit:cover"/></div>`,
  iconAnchor: [16, 16],
});

const employees = [
  { name: 'Unassigned', hrs: '5hrs', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=40&q=80', checked: false },
  { name: 'Millie Fernandez', hrs: '3hrs', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=40&q=80', checked: false },
  { name: 'Riley Cooper', hrs: '2hrs', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&q=80', checked: false },
  { name: 'Nawf El Azam', hrs: '6hrs', avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=40&q=80', checked: false, initials: 'NA' },
  { name: 'Carole Chimako', hrs: '4hrs', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=40&q=80', checked: true },
  { name: 'Julian Gruber', hrs: '6hrs', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&q=80', checked: false },
  { name: 'Filipa Gaspar', hrs: '8hrs', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=40&q=80', checked: false },
];

// Singapore center matching mockup
const MAP_CENTER = [1.2989, 103.8475];

export default function ATTMapsDeck() {
  const navigate = useNavigate();
  const [list, setList] = useState(employees);
  const [filter, setFilter] = useState('');

  const toggle = (i) => setList(l => l.map((e, idx) => idx === i ? { ...e, checked: !e.checked } : e));

  // Route polylines from mockup (approximate Singapore coords)
  const tealRoute = [[1.315, 103.830], [1.312, 103.840], [1.305, 103.848], [1.302, 103.860], [1.296, 103.868], [1.290, 103.862]];
  const blueRoute1 = [[1.302, 103.860], [1.296, 103.868], [1.285, 103.860], [1.280, 103.848], [1.278, 103.836]];
  const blueRoute2 = [[1.290, 103.862], [1.285, 103.855], [1.280, 103.848]];
  const blueRoute3 = [[1.280, 103.848], [1.275, 103.840], [1.270, 103.832], [1.268, 103.823]];

  const avatar1 = makeAvatar('https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=40&q=80', '#8b5cf6');
  const avatar2 = makeAvatar('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&q=80', '#f59e0b');

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#f0f2f5', fontFamily: 'Inter, sans-serif', overflow: 'hidden' }}>
      {/* ── INDIGO ICON SIDEBAR ── */}
      <div style={{ width: 64, background: '#5350EA', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', padding: '20px 0' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}>
          {/* O logo */}
          <div onClick={() => navigate('/dashboard')} style={{ width: 32, height: 32, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, cursor: 'pointer', fontSize: 14 }}>O</div>
          {[
            { emoji: '📊', path: '/dashboard', tip: 'Metric Flow' },
            { emoji: '📅', path: '/task-automate', tip: 'Tasks' },
            { emoji: '📦', path: '/shipment-track', tip: 'Shipment' },
            { emoji: '🗺️', path: '/live-ops', tip: 'Map', active: true },
            { emoji: '🚛', path: '/tracking', tip: 'Tracking' },
            { emoji: '👤', path: '/drivers', tip: 'Drivers' },
            { emoji: '⚙️', path: '/maintenance', tip: 'Settings' },
          ].map(item => (
            <button key={item.tip} onClick={() => navigate(item.path)} title={item.tip} style={{
              width: 40, height: 40, borderRadius: 10, border: 'none', cursor: 'pointer',
              background: item.active ? 'rgba(255,255,255,0.25)' : 'transparent',
              color: '#fff', fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>{item.emoji}</button>
          ))}
        </div>
        <button onClick={() => navigate('/vehicles')} style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(255,255,255,0.15)', border: 'none', color: '#fff', fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>?</button>
      </div>

      {/* ── MAIN AREA ── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Top navbar */}
        <div style={{ height: 56, background: '#fff', borderBottom: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ color: '#e5341a', fontSize: 18 }}>📡</span>
            <span style={{ fontWeight: 700, fontSize: 15, color: '#1a1a1a' }}>AT&T</span>
            <span style={{ color: '#999', fontSize: 12, marginLeft: 4 }}>▾</span>
          </div>
          <div style={{ position: 'relative', width: 320 }}>
            <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#aaa', fontSize: 13 }}>🔍</span>
            <input placeholder="Search" style={{ width: '100%', background: '#f5f6fa', border: '1px solid #e5e7eb', borderRadius: 8, padding: '7px 14px 7px 36px', fontSize: 12, color: '#333', outline: 'none' }} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <span style={{ fontSize: 18, color: '#888', cursor: 'pointer' }}>⚙️</span>
            <div style={{ position: 'relative' }}>
              <span style={{ fontSize: 18, color: '#888', cursor: 'pointer' }}>🔔</span>
              <span style={{ position: 'absolute', top: -4, right: -4, background: '#ef4444', color: '#fff', fontSize: 8, borderRadius: '50%', width: 14, height: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>3</span>
            </div>
            <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=40&q=80" style={{ width: 34, height: 34, borderRadius: '50%', objectFit: 'cover', border: '2px solid #e5e7eb', cursor: 'pointer' }} onClick={() => navigate('/rent-co')} />
          </div>
        </div>

        {/* Sub-header: Map / Calendar toggle */}
        <div style={{ background: '#fff', borderBottom: '1px solid #e5e7eb', padding: '10px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h2 style={{ fontWeight: 700, fontSize: 18, color: '#1a1a1a', margin: 0 }}>Map</h2>
          <div style={{ display: 'flex', gap: 6, background: '#f5f6fa', padding: 4, borderRadius: 8, border: '1px solid #e5e7eb' }}>
            <button onClick={() => navigate('/task-automate')} style={{ padding: '5px 14px', borderRadius: 6, border: 'none', background: 'transparent', color: '#666', fontSize: 12, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>📅 Calendar</button>
            <button style={{ padding: '5px 14px', borderRadius: 6, border: 'none', background: '#5350EA', color: '#fff', fontSize: 12, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>📍 Map</button>
          </div>
        </div>

        {/* ── CONTENT AREA ── */}
        <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
          {/* Employee filter list */}
          <div style={{ width: 260, background: '#fff', borderRight: '1px solid #e5e7eb', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '12px 14px', borderBottom: '1px solid #f0f0f0' }}>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#aaa', fontSize: 12 }}>🔍</span>
                <input placeholder="Filter Employees" value={filter} onChange={e => setFilter(e.target.value)} style={{ width: '100%', background: '#f5f6fa', border: '1px solid #e5e7eb', borderRadius: 8, padding: '6px 10px 6px 30px', fontSize: 11, outline: 'none', boxSizing: 'border-box' }} />
              </div>
            </div>
            <div style={{ flex: 1, overflowY: 'auto' }}>
              {list.filter(e => e.name.toLowerCase().includes(filter.toLowerCase())).map((emp, i) => (
                <div key={i} onClick={() => toggle(i)} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', borderBottom: '1px solid #f5f5f5', cursor: 'pointer', background: emp.checked ? '#f0efff' : '#fff' }}>
                  <input type="checkbox" checked={emp.checked} onChange={() => toggle(i)} onClick={e => e.stopPropagation()} style={{ accentColor: '#5350EA', width: 14, height: 14 }} />
                  {emp.initials
                    ? <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#5350EA', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 11, flexShrink: 0 }}>{emp.initials}</div>
                    : <img src={emp.avatar} style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
                  }
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: '#333' }}>{emp.name}</div>
                  </div>
                  <span style={{ fontSize: 11, color: '#aaa', fontFamily: 'monospace' }}>{emp.hrs}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Map */}
          <div style={{ flex: 1, position: 'relative' }}>
            <MapContainer center={MAP_CENTER} zoom={13} style={{ height: '100%', width: '100%' }} zoomControl={false}>
              <TileLayer
                attribution='&copy; OpenStreetMap contributors &copy; CARTO'
                url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
              />
              <Polyline positions={tealRoute} color="#06b6d4" weight={3} />
              <Polyline positions={blueRoute1} color="#5350EA" weight={3} />
              <Polyline positions={blueRoute2} color="#5350EA" weight={3} />
              <Polyline positions={blueRoute3} color="#5350EA" weight={3} />

              <Marker position={[1.315, 103.830]} icon={makeLabel('CK 10:30 AM', '#1a1a1a')} />
              <Marker position={[1.302, 103.860]} icon={makeLabel('CK 11:00 AM', '#1a1a1a')} />
              <Marker position={[1.285, 103.855]} icon={makeLabel('CK 2:30 PM', '#f97316')} />
              <Marker position={[1.268, 103.823]} icon={makeLabel('CK 4:30 PM', '#8b5cf6')} />
              <Marker position={[1.290, 103.848]} icon={makeLabel('4:00 PM', '#ef4444')} />
              <Marker position={[1.296, 103.868]} icon={avatar1} />
              <Marker position={[1.280, 103.836]} icon={avatar2} />
            </MapContainer>

            {/* 13 MIN info box */}
            <div style={{
              position: 'absolute', top: 20, left: 20, zIndex: 1000,
              background: '#1a1a1a', color: '#fff', borderRadius: 12, padding: '12px 16px',
              display: 'flex', alignItems: 'center', gap: 12, boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
            }}>
              <div style={{ background: '#5350EA', borderRadius: 8, padding: '8px 10px', textAlign: 'center' }}>
                <div style={{ fontSize: 18, fontWeight: 800 }}>13</div>
                <div style={{ fontSize: 8, letterSpacing: 1 }}>MIN</div>
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 13 }}>12 One Tree Hill</div>
                <div style={{ fontSize: 10, color: '#aaa', marginTop: 2 }}>6.5 KM</div>
              </div>
            </div>

            {/* Beth Murphy Profile Card */}
            <div style={{
              position: 'absolute', top: 16, right: 16, zIndex: 1000, width: 240,
              background: '#fff', borderRadius: 16, padding: '16px', boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14, paddingBottom: 12, borderBottom: '1px solid #f0f0f0' }}>
                <span style={{ fontSize: 11, color: '#666', fontFamily: 'monospace', fontWeight: 600 }}>DR928523</span>
                <span style={{ fontSize: 9, background: '#d1fae5', color: '#059669', padding: '3px 8px', borderRadius: 20, fontWeight: 700 }}>ON THE WAY</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginBottom: 14 }}>
                <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&q=80" style={{ width: 64, height: 64, borderRadius: '50%', objectFit: 'cover', border: '3px solid #5350EA', marginBottom: 10 }} />
                <div style={{ fontWeight: 700, fontSize: 15, color: '#1a1a1a' }}>Beth Murphy</div>
                <div style={{ fontSize: 11, color: '#888', marginTop: 2 }}>Technician</div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, borderTop: '1px solid #f0f0f0', borderBottom: '1px solid #f0f0f0', padding: '12px 0', textAlign: 'center', marginBottom: 12 }}>
                <div>
                  <div style={{ fontSize: 9, color: '#aaa', marginBottom: 3 }}>FOLLOWERS</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#1a1a1a' }}>365 K</div>
                </div>
                <div>
                  <div style={{ fontSize: 9, color: '#aaa', marginBottom: 3 }}>RATING</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#1a1a1a' }}>★ 4.2</div>
                </div>
              </div>
              <div style={{ fontSize: 9, color: '#aaa', fontWeight: 700, marginBottom: 8, letterSpacing: 1 }}>TODAY</div>
              <div style={{ display: 'flex', gap: 6 }}>
                {[['#5350EA', '70%'], ['#06b6d4', '50%'], ['#f59e0b', '40%']].map(([c, w], i) => (
                  <div key={i} style={{ flex: 1, height: 6, background: '#f0f0f0', borderRadius: 3, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: w, background: c, borderRadius: 3 }} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
