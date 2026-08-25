import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Polyline, Marker } from 'react-leaflet';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const numberedIcon = (num) => new L.DivIcon({
  className: '',
  html: `<div style="width:24px;height:24px;border-radius:50%;background:#ef4444;border:3px solid #fff;color:#fff;font-weight:800;font-size:12px;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 6px rgba(0,0,0,0.3)">${num}</div>`,
  iconAnchor: [12, 12],
});

const trendData = [
  { d: '28.10', v: 1 }, { d: '29.10', v: 2 }, { d: '30.10', v: 3 },
  { d: '31.10', v: 2 }, { d: '01.11', v: 4 }, { d: '02.11', v: 3 }, { d: '03.11', v: 5 },
];

const [KY, ZH, RV] = [[50.4501, 30.5234], [50.2547, 28.6587], [50.6199, 26.2516]];

const messages = [
  { from: 'Ivan', text: 'HI!', side: 'left' },
  { from: 'Alex', text: 'Hi! What is your question?', side: 'right' },
];

export default function ShipmentTrack() {
  const navigate = useNavigate();
  const [msg, setMsg] = useState('');
  const [chat, setChat] = useState(messages);

  const send = (e) => {
    e.preventDefault();
    if (!msg.trim()) return;
    setChat([...chat, { from: 'You', text: msg, side: 'right' }]);
    setMsg('');
  };

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#f5f5f5', fontFamily: 'Inter, sans-serif', overflow: 'hidden' }}>
      {/* ── LEFT SIDEBAR — matches mockup exactly ── */}
      <div style={{ width: 220, background: '#fff', borderRight: '1px solid #f0f0f0', display: 'flex', flexDirection: 'column', padding: 0 }}>
        {/* User profile */}
        <div style={{ padding: '20px 18px 16px', display: 'flex', alignItems: 'center', gap: 12, borderBottom: '1px solid #f5f5f5' }}>
          <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&q=80" style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover' }} />
          <div>
            <div style={{ fontSize: 10, color: '#aaa' }}>Welcome back,</div>
            <div style={{ fontSize: 13, fontWeight: 800, color: '#1a1a1a' }}>Alex!</div>
          </div>
        </div>

        {/* Company dropdown */}
        <div style={{ padding: '12px 18px', borderBottom: '1px solid #f5f5f5' }}>
          <div style={{ fontSize: 9, color: '#bbb', marginBottom: 4 }}>Company</div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#f5f5f5', borderRadius: 8, padding: '6px 10px', cursor: 'pointer' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 24, height: 24, background: '#e5341a', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 9, fontWeight: 800 }}>LS</div>
              <span style={{ fontSize: 11, fontWeight: 600, color: '#333' }}>Load Swift NYC</span>
            </div>
            <span style={{ color: '#aaa', fontSize: 11 }}>▾</span>
          </div>
        </div>

        {/* Nav */}
        <div style={{ flex: 1, padding: '8px 10px' }}>
          {[
            { label: 'Dashboard', icon: '📊', active: true },
            { label: 'Shipment', icon: '📦', path: '/shipment-track' },
            { label: 'Costumer', icon: '👤', path: '/drivers' },
            { label: 'Analysis', icon: '📈', path: '/live-ops', badge: '+20%' },
            { label: 'History', icon: '🕒', path: '/trips' },
            { label: 'Notification', icon: '🔔', path: '/maintenance', badge: '2' },
          ].map(item => (
            <button key={item.label} onClick={() => item.path && navigate(item.path)} style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px',
              border: 'none', cursor: 'pointer', borderRadius: 8, marginBottom: 2,
              background: item.active ? '#ef4444' : 'transparent',
              color: item.active ? '#fff' : '#888', fontWeight: item.active ? 700 : 500, fontSize: 12, textAlign: 'left',
            }}>
              <span style={{ fontSize: 15 }}>{item.icon}</span>
              <span style={{ flex: 1 }}>{item.label}</span>
              {item.badge && <span style={{ background: item.active ? 'rgba(255,255,255,0.3)' : '#fee2e2', color: item.active ? '#fff' : '#ef4444', fontSize: 9, padding: '1px 5px', borderRadius: 8, fontWeight: 700 }}>{item.badge}</span>}
            </button>
          ))}
        </div>

        {/* Recent trips card */}
        <div style={{ margin: '0 10px 12px', background: '#ef4444', borderRadius: 12, padding: '16px 14px', color: '#fff' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
            <span style={{ fontSize: 14, fontWeight: 800 }}>Recent<br />trips</span>
            <span style={{ fontSize: 10, opacity: 0.8 }}>28 Oct</span>
          </div>
          <div style={{ marginBottom: 12 }}>
            <button style={{ background: 'rgba(255,255,255,0.25)', border: 'none', color: '#fff', borderRadius: 20, padding: '3px 10px', fontSize: 10, fontWeight: 700, cursor: 'pointer', marginBottom: 6 }}>Duration</button>
            <div style={{ fontSize: 10, opacity: 0.8, marginBottom: 2 }}>Speed</div>
            <div style={{ fontSize: 10, opacity: 0.8, marginBottom: 8 }}>Stops</div>
            <div style={{ fontSize: 18, fontWeight: 800 }}>1246 KM</div>
            <div style={{ fontSize: 9, opacity: 0.7 }}>Train ride adventure.</div>
          </div>
          {/* icon row */}
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center', opacity: 0.7 }}>
            {['📅', '📦', '📋', '📝', '📊'].map(ic => (
              <span key={ic} style={{ fontSize: 14 }}>{ic}</span>
            ))}
          </div>
          <button style={{ width: '100%', marginTop: 12, background: 'rgba(255,255,255,0.15)', border: '1px dashed rgba(255,255,255,0.5)', borderRadius: 8, color: '#fff', padding: '8px', fontSize: 11, fontWeight: 600, cursor: 'pointer' }}>
            + Create new Request
          </button>
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Header */}
        <div style={{ background: '#fff', borderBottom: '1px solid #f0f0f0', padding: '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <h1 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: '#1a1a1a' }}>Shipment track</h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#f5f5f5', border: '1px solid #e5e7eb', borderRadius: 8, padding: '5px 10px', cursor: 'pointer', fontSize: 12, color: '#555' }}>
              Select truck <span>▾</span>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#aaa', fontSize: 13 }}>🔍</span>
              <input placeholder="Search" style={{ background: '#f5f5f5', border: '1px solid #e5e7eb', borderRadius: 8, padding: '6px 12px 6px 32px', fontSize: 12, outline: 'none' }} />
            </div>
            <span style={{ fontSize: 18, color: '#888', cursor: 'pointer' }}>☰</span>
          </div>
        </div>

        {/* Grid */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 24px', display: 'grid', gridTemplateColumns: '1fr 1fr 320px', gridTemplateRows: 'auto auto auto', gap: 16 }}>
          {/* Map - spans 2 cols */}
          <div style={{ gridColumn: '1 / 3', background: '#fff', borderRadius: 16, overflow: 'hidden', position: 'relative', height: 280, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            {/* Map filter pills */}
            <div style={{ position: 'absolute', top: 12, left: 12, zIndex: 500, display: 'flex', gap: 6 }}>
              {['Tracking', 'Traffic jams', 'POI'].map((p, i) => (
                <span key={p} style={{ background: i === 0 ? '#ef4444' : '#fff', color: i === 0 ? '#fff' : '#666', border: '1px solid #ddd', borderRadius: 20, padding: '4px 12px', fontSize: 11, fontWeight: 600, cursor: 'pointer' }}>{p}</span>
              ))}
            </div>
            {/* Distance overlay */}
            <div style={{ position: 'absolute', bottom: 12, left: 12, zIndex: 500, background: '#fff', borderRadius: 12, padding: '10px 14px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
              <div style={{ fontSize: 9, color: '#aaa', marginBottom: 4 }}>Distance to arrival:</div>
              <div style={{ fontSize: 20, fontWeight: 800, color: '#1a1a1a' }}>
                120<span style={{ fontSize: 12, fontWeight: 600 }}>KM</span> / 1h.<span style={{ color: '#ef4444' }}>50</span><span style={{ fontSize: 12 }}>min.</span>
              </div>
              <div style={{ fontSize: 9, color: '#aaa', marginTop: 6 }}>Traffic and route optimization:</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 3 }}>
                <span style={{ fontSize: 16, fontWeight: 800, color: '#ef4444' }}>85%</span>
                <div style={{ flex: 1, height: 2, background: '#f0f0f0', borderRadius: 1 }}><div style={{ width: '85%', height: '100%', background: '#ef4444', borderRadius: 1 }} /></div>
              </div>
              <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
                <button style={{ background: '#ef4444', color: '#fff', border: 'none', borderRadius: 6, padding: '4px 10px', fontSize: 10, fontWeight: 600, cursor: 'pointer' }}>Optimize</button>
                <button style={{ background: '#fff', color: '#888', border: '1px solid #ddd', borderRadius: 6, padding: '4px 10px', fontSize: 10, fontWeight: 600, cursor: 'pointer' }}>View all</button>
              </div>
            </div>
            {/* Geofence alert */}
            <div style={{ position: 'absolute', bottom: 12, right: 12, zIndex: 500, background: '#fff', borderRadius: 12, padding: '10px 14px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', maxWidth: 200 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: '#1a1a1a' }}>Geofencing alert</span>
                <span style={{ fontSize: 9, color: '#aaa' }}>13:48</span>
              </div>
              <div style={{ fontSize: 9, color: '#888', lineHeight: 1.5 }}>Truck crossed geofence at Warehouse A. Driver arrival notification sent to staff.</div>
            </div>
            <MapContainer center={[50.35, 28.65]} zoom={7} style={{ height: '100%', width: '100%' }} zoomControl={false}>
              <TileLayer attribution='&copy; OpenStreetMap' url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" />
              <Polyline positions={[KY, ZH, RV]} color="#ef4444" weight={4} />
              <Marker position={KY} icon={numberedIcon(1)} />
              <Marker position={ZH} icon={numberedIcon(2)} />
              <Marker position={RV} icon={numberedIcon(3)} />
            </MapContainer>
          </div>

          {/* Shipment Details */}
          <div style={{ background: '#fff', borderRadius: 16, padding: '16px 18px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', gridColumn: '1 / 2' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <span style={{ fontWeight: 700, fontSize: 14, color: '#1a1a1a' }}>Shipment details</span>
              <span style={{ fontSize: 11, color: '#aaa', cursor: 'pointer' }}>Read more</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14, paddingBottom: 12, borderBottom: '1px solid #f5f5f5' }}>
              <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&q=80" style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover' }} />
              <div>
                <div style={{ fontWeight: 700, fontSize: 13, color: '#1a1a1a' }}>Michael Johnson</div>
                <div style={{ fontSize: 10, color: '#aaa' }}>1241AA4121BB2351AB · Ukraine</div>
              </div>
              <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: 11, color: '#aaa' }}>Rating</span>
                <span style={{ background: '#fff0e8', color: '#ef4444', fontSize: 11, fontWeight: 700, padding: '2px 6px', borderRadius: 6 }}>4.2</span>
                <span style={{ color: '#ccc', fontSize: 14 }}>•••</span>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#1a1a1a', marginBottom: 4 }}>Novaposhta parcels</div>
                <div style={{ fontSize: 11, color: '#ef4444', fontWeight: 600 }}>Have been paid</div>
                <div style={{ fontSize: 18, fontWeight: 800, color: '#1a1a1a', marginTop: 10 }}>$ 520,45</div>
              </div>
              <div>
                <div style={{ fontSize: 11, color: '#aaa', marginBottom: 6 }}>Parcels Loading</div>
                <div style={{ display: 'flex', gap: 10, fontSize: 12, marginBottom: 4 }}>
                  <span style={{ fontWeight: 600 }}>Kyiv</span>
                  <div style={{ flex: 1, borderBottom: '2px solid #ef4444', alignSelf: 'center' }} />
                  <span style={{ fontWeight: 600 }}>Rivne</span>
                </div>
                <div style={{ fontSize: 11, color: '#aaa', marginTop: 10 }}>Date of arrival</div>
                <div style={{ fontSize: 14, fontWeight: 800, color: '#1a1a1a' }}>28.10.23</div>
              </div>
              <div>
                <div style={{ fontSize: 11, color: '#aaa', marginBottom: 6 }}>Status</div>
                <span style={{ background: '#ef4444', color: '#fff', fontSize: 10, fontWeight: 700, padding: '3px 10px', borderRadius: 6 }}>Delivered</span>
                <div style={{ fontSize: 11, color: '#aaa', marginTop: 10 }}>Type of Parcels</div>
                <span style={{ background: '#fff0e8', color: '#ef4444', fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 6, display: 'inline-block', marginTop: 4 }}>Household chemicals</span>
              </div>
            </div>
          </div>

          {/* Current Truck Capacity */}
          <div style={{ background: '#fff', borderRadius: 16, padding: '16px 18px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', gridRow: '2 / 4', gridColumn: '3 / 4' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
              <span style={{ fontWeight: 700, fontSize: 14, color: '#1a1a1a' }}>Current truck capacity</span>
              <span style={{ fontSize: 11, color: '#aaa', cursor: 'pointer' }}>Read more</span>
            </div>
            {/* Truck SVG-style graphic */}
            <div style={{ position: 'relative', marginBottom: 16 }}>
              <img src="https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=300&q=60" style={{ width: '100%', height: 100, objectFit: 'cover', borderRadius: 8, filter: 'grayscale(90%)' }} />
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 8, overflow: 'hidden' }}>
                <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: '86%', background: 'repeating-linear-gradient(-45deg, rgba(239,68,68,0.7), rgba(239,68,68,0.7) 5px, rgba(239,68,68,0.5) 5px, rgba(239,68,68,0.5) 10px)' }} />
                <span style={{ position: 'relative', fontSize: 28, fontWeight: 900, color: '#fff', zIndex: 1, textShadow: '0 2px 4px rgba(0,0,0,0.4)' }}>86%</span>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #f5f5f5' }}>
                <span style={{ fontSize: 12, color: '#888' }}>AL – 223965406</span>
                <span style={{ fontSize: 11, background: '#d1fae5', color: '#059669', padding: '2px 8px', borderRadius: 20, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>🟢 On-Route</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 12, color: '#888' }}>Max Load</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#1a1a1a' }}>8,453 KG</span>
              </div>
            </div>
          </div>

          {/* Shipment Trends */}
          <div style={{ background: '#fff', borderRadius: 16, padding: '16px 18px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
              <span style={{ fontWeight: 700, fontSize: 13, color: '#1a1a1a' }}>Shipment trends</span>
              <span style={{ fontSize: 18, color: '#ef4444' }}>⬇</span>
            </div>
            <div style={{ fontSize: 10, background: '#f5f5f5', display: 'inline-block', padding: '2px 8px', borderRadius: 4, color: '#666', marginBottom: 8 }}>5 shipments</div>
            <ResponsiveContainer width="100%" height={90}>
              <LineChart data={trendData} margin={{ top: 5, right: 5, left: -30, bottom: 0 }}>
                <XAxis dataKey="d" stroke="#ccc" fontSize={8} tickLine={false} />
                <YAxis stroke="#ccc" fontSize={8} tickLine={false} />
                <Tooltip contentStyle={{ fontSize: 10 }} />
                <Line type="monotone" dataKey="v" stroke="#ef4444" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Route efficiency (red panel) */}
          <div style={{ background: '#ef4444', borderRadius: 16, padding: '16px 18px', color: '#fff' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontWeight: 700, fontSize: 13 }}>Route efficiency</span>
              <span style={{ fontSize: 16, opacity: 0.8 }}>⬇</span>
            </div>
            <div style={{ fontSize: 48, fontWeight: 900, lineHeight: 1 }}>96<span style={{ fontSize: 24 }}>%</span></div>
            <div style={{ fontSize: 9, opacity: 0.8, marginTop: 4 }}>Send the best route to the driver's email</div>
          </div>

          {/* Chat */}
          <div style={{ background: '#fff', borderRadius: 16, overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '12px 14px', borderBottom: '1px solid #f5f5f5', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: 700, fontSize: 13, color: '#1a1a1a' }}>Chat</span>
              <span style={{ background: '#ef4444', color: '#fff', borderRadius: '50%', width: 22, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11 }}>↗</span>
            </div>
            <div style={{ flex: 1, overflowY: 'auto', padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: 8 }}>
              {chat.map((m, i) => (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: m.side === 'right' ? 'flex-end' : 'flex-start' }}>
                  <div style={{ fontSize: 9, color: '#aaa', marginBottom: 2 }}>{m.from}</div>
                  <div style={{ background: m.side === 'right' ? '#ef4444' : '#f5f5f5', color: m.side === 'right' ? '#fff' : '#333', padding: '6px 10px', borderRadius: 8, fontSize: 11, maxWidth: '80%' }}>{m.text}</div>
                </div>
              ))}
            </div>
            <form onSubmit={send} style={{ padding: '8px 12px', borderTop: '1px solid #f5f5f5', display: 'flex', gap: 8, alignItems: 'center' }}>
              <span style={{ fontSize: 16, color: '#aaa' }}>📎</span>
              <input value={msg} onChange={e => setMsg(e.target.value)} placeholder="Message" style={{ flex: 1, border: 'none', outline: 'none', fontSize: 12, color: '#333' }} />
              <span style={{ fontSize: 16, color: '#aaa', cursor: 'pointer' }}>😊</span>
              <button type="submit" style={{ background: 'none', border: 'none', fontSize: 16, color: '#ef4444', cursor: 'pointer' }}>➤</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
