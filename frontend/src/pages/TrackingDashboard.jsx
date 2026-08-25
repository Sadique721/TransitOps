import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Polyline, Marker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const redIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [20, 33], iconAnchor: [10, 33], shadowSize: [33, 33],
});

const trucks = [
  { id: 'RE-74ER453TR5', status: 'On Route', time: '02:47:24', left: '58 min. left', img: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=200&q=60' },
  { id: 'YR-34DFR734W2', status: 'On Route', time: '01:38:47', left: '57 min. left', img: 'https://images.unsplash.com/photo-1519003300449-424ad0405076?w=200&q=60', selected: true },
  { id: 'DW-847DE74E4R', status: 'On Route', time: '03:29:58', left: '78 min. left', img: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=200&q=60' },
  { id: 'AQ-2S7DRE141E', status: 'Waiting', time: '03:29:58', left: '20 min. left', img: 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=200&q=60' },
  { id: 'BG-ER74R69B4R', status: 'On Route', time: '00:28:38', left: '88 min. left', img: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=200&q=60' },
  { id: 'CV-414ER58SER', status: 'Waiting', time: '02:38:47', left: '18 min. left', img: 'https://images.unsplash.com/photo-1519003300449-424ad0405076?w=200&q=60' },
];

const partners = ['Shiphike - For Packages', 'Roambee', 'Post Hawk', 'Loginext', 'Forwardo', 'Lopez Pallets', 'Sonosolve'];
const tabs = ['Shipping Info', 'Vehicle Info', 'Documents', 'Company', 'Billing'];

export default function TrackingDashboard() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(trucks[1]);
  const [activeTab, setActiveTab] = useState('Shipping Info');

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#f5f5f5', fontFamily: 'Inter, sans-serif', overflow: 'hidden' }}>
      {/* ── SIDEBAR ── George Davidson */}
      <div style={{ width: 200, background: '#fff', borderRight: '1px solid #f0f0f0', display: 'flex', flexDirection: 'column' }}>
        {/* Profile */}
        <div style={{ padding: '16px 14px', borderBottom: '1px solid #f5f5f5', display: 'flex', alignItems: 'center', gap: 10 }}>
          <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=50&q=80" style={{ width: 38, height: 38, borderRadius: '50%', objectFit: 'cover' }} />
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#1a1a1a' }}>George Davidson</div>
            <div style={{ fontSize: 9, color: '#aaa' }}>george.davidson@email.com</div>
          </div>
        </div>
        {/* Nav */}
        <div style={{ flex: 1, padding: '8px 8px' }}>
          {[
            { label: 'Dashboard', icon: '📊', path: '/dashboard' },
            { label: 'Partners', icon: '🤝', path: '/live-ops' },
            { label: 'Chats', icon: '💬', path: '/shipment-track', badge: '7' },
            { label: 'Tracking', icon: '📍', path: '/tracking', active: true },
            { label: 'Request', icon: '📋', path: '/vehicles', sub: ['Trucks', 'Cargos', 'Repair', 'Drivers', 'Reports'], counts: [null, 5, null, null, 4] },
            { label: 'Analysis', icon: '📈', path: '/drivers' },
            { label: 'History', icon: '🕒', path: '/trips' },
          ].map(item => (
            <div key={item.label}>
              <button onClick={() => navigate(item.path)} style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px',
                border: 'none', cursor: 'pointer', borderRadius: 8, marginBottom: 2,
                background: item.active ? '#ef4444' : 'transparent',
                color: item.active ? '#fff' : '#888', fontWeight: item.active ? 700 : 500, fontSize: 12, textAlign: 'left',
              }}>
                <span style={{ fontSize: 14 }}>{item.icon}</span>
                <span style={{ flex: 1 }}>{item.label}</span>
                {item.badge && <span style={{ background: '#fee2e2', color: '#ef4444', fontSize: 9, padding: '1px 5px', borderRadius: 8, fontWeight: 700 }}>{item.badge}</span>}
              </button>
              {item.sub && item.sub.map((s, si) => (
                <div key={s} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 10px 5px 28px', fontSize: 11, color: '#aaa', cursor: 'pointer' }}>
                  <span>{s}</span>
                  {item.counts[si] && <span style={{ background: '#fee2e2', color: '#ef4444', fontSize: 9, padding: '1px 5px', borderRadius: 8, fontWeight: 700 }}>{item.counts[si]}</span>}
                </div>
              ))}
            </div>
          ))}
        </div>
        <div style={{ padding: '10px 8px', borderTop: '1px solid #f5f5f5' }}>
          <button style={{ width: '100%', background: '#ef4444', color: '#fff', border: 'none', borderRadius: 8, padding: '9px 12px', fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>Create new request</button>
        </div>
      </div>

      {/* ── CENTER PANEL: Truck grid ── */}
      <div style={{ width: 320, background: '#fff', borderRight: '1px solid #f0f0f0', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <div style={{ padding: '16px 14px', borderBottom: '1px solid #f5f5f5' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: '#1a1a1a' }}>Tracking</h2>
            <span style={{ fontSize: 16, color: '#aaa', cursor: 'pointer' }}>🔍</span>
          </div>
          <div style={{ fontSize: 10, color: '#aaa', marginBottom: 8 }}>Filter by Partners</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
            {partners.map((p, i) => (
              <span key={p} style={{ background: '#f5f5f5', border: '1px solid #e5e7eb', borderRadius: 20, padding: '2px 8px', fontSize: 9, color: '#666', cursor: 'pointer' }}>
                {p} {i % 2 === 0 ? '12' : '11'}
              </span>
            ))}
          </div>
          <div style={{ marginTop: 8 }}>
            <div style={{ fontSize: 10, color: '#aaa', marginBottom: 6 }}>Show</div>
            <div style={{ display: 'flex', gap: 4 }}>
              {['Active', 'Inactive', 'All'].map((s, i) => (
                <button key={s} style={{ padding: '3px 10px', borderRadius: 20, border: 'none', cursor: 'pointer', fontSize: 10, fontWeight: 600, background: i === 0 ? '#fee2e2' : '#f5f5f5', color: i === 0 ? '#ef4444' : '#888' }}>
                  {s}{i === 2 ? ' 47' : ''}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Truck cards grid 2-col */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '10px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {trucks.map(trk => (
            <div key={trk.id} onClick={() => setSelected(trk)} style={{
              border: selected.id === trk.id ? '2px solid #ef4444' : '2px solid #f0f0f0',
              borderRadius: 12, padding: '10px', cursor: 'pointer', background: '#fff',
              boxShadow: selected.id === trk.id ? '0 2px 12px rgba(239,68,68,0.15)' : 'none',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <span style={{ fontSize: 9, fontWeight: 600, color: '#888', fontFamily: 'monospace' }}>{trk.id}</span>
                <span style={{ fontSize: 8, background: trk.status === 'On Route' ? '#d1fae5' : '#fef3c7', color: trk.status === 'On Route' ? '#059669' : '#d97706', padding: '1px 5px', borderRadius: 8, fontWeight: 700 }}>● {trk.status}</span>
              </div>
              <img src={trk.img} style={{ width: '100%', height: 60, objectFit: 'cover', borderRadius: 6, filter: 'grayscale(80%)', marginBottom: 6 }} />
              <div style={{ fontSize: 13, fontWeight: 800, color: '#1a1a1a', fontFamily: 'monospace' }}>{trk.time}</div>
              <div style={{ fontSize: 9, color: '#aaa', marginTop: 2 }}>{trk.left}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── RIGHT DETAIL PANEL ── */}
      <div style={{ flex: 1, background: '#fff', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Selected truck header */}
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #f5f5f5', display: 'flex', alignItems: 'center', gap: 14 }}>
          <span style={{ fontSize: 16, fontWeight: 800, color: '#1a1a1a', fontFamily: 'monospace' }}>{selected.id}</span>
          <span style={{ background: '#d1fae5', color: '#059669', fontSize: 10, fontWeight: 700, padding: '3px 10px', borderRadius: 20 }}>● On Route</span>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
            <button style={{ background: '#fff', border: '2px solid #ef4444', color: '#ef4444', borderRadius: 8, padding: '6px 14px', fontSize: 11, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>📞 Call Driver</button>
            <button style={{ background: '#ef4444', border: 'none', color: '#fff', borderRadius: 8, padding: '6px 14px', fontSize: 11, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>💬 Chat with Driver</button>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 0, borderBottom: '1px solid #f0f0f0', padding: '0 20px' }}>
          {tabs.map(t => (
            <button key={t} onClick={() => setActiveTab(t)} style={{
              padding: '10px 16px', border: 'none', background: 'transparent', cursor: 'pointer',
              fontSize: 11, fontWeight: 600, color: activeTab === t ? '#ef4444' : '#aaa',
              borderBottom: activeTab === t ? '2px solid #ef4444' : '2px solid transparent',
            }}>{t}</button>
          ))}
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px' }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: '#1a1a1a', marginBottom: 14, marginTop: 0 }}>Current Truck Capacity</h3>

          {/* Truck with capacity */}
          <div style={{ position: 'relative', marginBottom: 20, borderRadius: 12, overflow: 'hidden', background: '#f5f5f5', height: 140 }}>
            <img src={selected.img} style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(70%)' }} />
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: '82%', background: 'repeating-linear-gradient(-45deg, rgba(239,68,68,0.75), rgba(239,68,68,0.75) 5px, rgba(239,68,68,0.55) 5px, rgba(239,68,68,0.55) 10px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: 32, fontWeight: 900, color: '#fff', textShadow: '0 2px 8px rgba(0,0,0,0.4)' }}>82%</span>
              </div>
            </div>
          </div>

          {/* Route map */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: '#1a1a1a', margin: 0 }}>Route</h3>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#1a1a1a', fontFamily: 'monospace' }}>1:38:47</span>
              <span style={{ fontSize: 11, color: '#aaa' }}>57 min. left</span>
              <button style={{ background: '#f5f5f5', border: '1px solid #e5e7eb', borderRadius: 8, padding: '5px 10px', fontSize: 10, fontWeight: 600, color: '#666', cursor: 'pointer' }}>✏️ Change Route</button>
            </div>
          </div>

          <div style={{ height: 140, borderRadius: 12, overflow: 'hidden', border: '1px solid #f0f0f0', marginBottom: 20, position: 'relative', zIndex: 0 }}>
            <MapContainer center={[50.35, 28.65]} zoom={7} style={{ height: '100%', width: '100%' }} zoomControl={false}>
              <TileLayer attribution='&copy; OpenStreetMap' url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" />
              <Polyline positions={[[50.4501, 30.5234], [50.2547, 28.6587]]} color="#ef4444" weight={3} />
              <Marker position={[50.4501, 30.5234]} icon={redIcon} />
              <Marker position={[50.2547, 28.6587]} icon={redIcon} />
            </MapContainer>
          </div>

          {/* Cargo photo reports */}
          <h3 style={{ fontSize: 14, fontWeight: 700, color: '#1a1a1a', marginBottom: 12 }}>Cargo Photo Reports</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: 10 }}>
            {[
              { img: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=120&q=60', label: 'Photo #1 Cargo Photo', loc: '112 Maev City · 01:15 PM' },
              { img: 'https://images.unsplash.com/photo-1566576721346-d4a3b4eaeb55?w=120&q=60', label: 'Photo #2 Cargo Photo', loc: '954 Sheffield · 03:10 PM' },
              { img: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=120&q=60', label: 'Photo #3 Cargo Photo', loc: '397 Hathaway · 02:40 PM' },
            ].map(p => (
              <div key={p.label}>
                <img src={p.img} style={{ width: '100%', height: 70, objectFit: 'cover', borderRadius: 8, border: '1px solid #f0f0f0' }} />
                <div style={{ fontSize: 9, color: '#ef4444', fontWeight: 600, marginTop: 4 }}>{p.label}</div>
                <div style={{ fontSize: 8, color: '#aaa' }}>{p.loc}</div>
              </div>
            ))}
            <div style={{ border: '1.5px dashed #f0f0f0', borderRadius: 8, height: 70, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', minWidth: 70 }}>
              <span style={{ fontSize: 20, color: '#ef4444' }}>+</span>
              <span style={{ fontSize: 9, color: '#aaa', marginTop: 4, textAlign: 'center' }}>Add Photo</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
