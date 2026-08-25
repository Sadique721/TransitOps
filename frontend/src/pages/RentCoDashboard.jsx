import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const pinIcon = (color) => new L.DivIcon({
  className: '',
  html: `<div style="width:24px;height:36px;position:relative"><svg viewBox="0 0 24 36" fill="${color}" xmlns="http://www.w3.org/2000/svg"><path d="M12 0C5.373 0 0 5.373 0 12c0 9 12 24 12 24s12-15 12-24C24 5.373 18.627 0 12 0z"/></svg><div style="position:absolute;top:5px;left:50%;transform:translateX(-50%);width:8px;height:8px;border-radius:50%;background:#fff"></div></div>`,
  iconAnchor: [12, 36],
});

// Vehicle pics for live tracking list
const vehicleImgs = {
  'Noah Car': 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=60&q=60',
  'jeep car': 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=60&q=60',
  'Peterbilt Trucks': 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=60&q=60',
  'Cargo Truck': 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=60&q=60',
  'Keeway V302C': 'https://images.unsplash.com/photo-1558981852-426c07ade7ef?w=60&q=60',
  '500 SJD': 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=60&q=60',
  'jeep car 2': 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=60&q=60',
};

const trackingList = [
  { name: 'Noah Car', status: 'Heina 23 - 20%', km: '486 KM' },
  { name: 'jeep car', status: 'Heina 23 - 20%', km: '486 KM' },
  { name: 'Peterbilt Trucks', status: 'Heina 23 - 20%', km: '486 KM', selected: true },
  { name: 'Cargo Truck', status: 'Heina 23 - 20%', km: '486 KM' },
  { name: 'Keeway V302C', status: 'Heina 23 - 20%', km: '486 KM' },
  { name: 'jeep car 2', status: 'Heina 23 - 20%', km: '486 KM' },
  { name: '500 SJD', status: 'Heina 23 - 20%', km: '486 KM' },
];

const trips = [
  { t1: '10:24', loc1: 'Plot 461, Bashiru Shittu St tu', t2: '11:34', loc2: 'Industrial St tu StB Ashiru', name: 'Polestar 520', km: '486 KM' },
  { t1: '10:24', loc1: 'Plot 461, Bashiru Shittu St tu', t2: '11:34', loc2: 'Industrial St tu StB Ashiru', name: 'Polestar 520', km: '486 KM' },
  { t1: '10:24', loc1: 'Plot 461, Bashiru Shittu St tu', t2: '11:34', loc2: 'Industrial St tu StB Ashiru', name: 'Polestar 520', km: '486 KM' },
];

const pathCoords = [
  [59.4510, 24.720], [59.4480, 24.732], [59.4440, 24.738],
  [59.4400, 24.745], [59.4390, 24.755], [59.4370, 24.760],
  [59.4350, 24.762], [59.4330, 24.752], [59.4310, 24.745],
  [59.4290, 24.740], [59.4270, 24.735],
];

export default function RentCoDashboard() {
  const navigate = useNavigate();
  const [selectedVehicle, setSelectedVehicle] = useState('Peterbilt Trucks');

  return (
    // ORANGE background wrapper matching mockup outer border
    <div style={{ background: '#c96a1a', padding: '20px', height: '100vh', boxSizing: 'border-box', display: 'flex', alignItems: 'stretch', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ flex: 1, background: '#fff', borderRadius: 20, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* ── TOP NAVBAR — white with orange logo ── */}
        <div style={{ height: 60, borderBottom: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }} onClick={() => navigate('/dashboard')}>
            <span style={{ fontSize: 22 }}>🚗</span>
            <span style={{ fontWeight: 800, fontSize: 17, color: '#e07b2e' }}>Rent Co.</span>
          </div>
          <div style={{ position: 'relative', width: 380 }}>
            <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#aaa', fontSize: 14 }}>🔍</span>
            <input placeholder="Search" style={{ width: '100%', background: '#f9f9f9', border: '1px solid #ebebeb', borderRadius: 30, padding: '8px 16px 8px 36px', fontSize: 12, outline: 'none', boxSizing: 'border-box' }} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&q=80" style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover', border: '2px solid #f0f0f0' }} />
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#1a1a1a' }}>Diky khan</div>
              <div style={{ fontSize: 10, color: '#aaa' }}>Admin</div>
            </div>
            <span style={{ color: '#aaa', fontSize: 14, cursor: 'pointer' }}>▾</span>
          </div>
        </div>

        {/* ── BODY: left mini sidebar + map + right panel ── */}
        <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
          {/* Orange icon sidebar (narrow) */}
          <div style={{ width: 56, background: '#fff', borderRight: '1px solid #f5f5f5', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '16px 0', gap: 20 }}>
            {[
              { icon: '⏰', path: '/dashboard' },
              { icon: '📋', path: '/trips' },
              { icon: '🗺️', path: '/rent-co', active: true },
              { icon: '🚛', path: '/vehicles' },
              { icon: '🔔', path: '/maintenance' },
              { icon: '⚙️', path: '/drivers' },
            ].map((item, i) => (
              <button key={i} onClick={() => navigate(item.path)} style={{
                width: 38, height: 38, border: 'none', cursor: 'pointer', borderRadius: 10,
                background: item.active ? '#e07b2e' : 'transparent',
                color: item.active ? '#fff' : '#aaa', fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>{item.icon}</button>
            ))}
          </div>

          {/* Map area */}
          <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
            {/* Uus 12 label */}
            <div style={{ position: 'absolute', top: 16, left: '50%', transform: 'translateX(-50%)', zIndex: 1000, background: '#fff', border: '1px solid #e0e0e0', borderRadius: 20, padding: '4px 14px', fontSize: 12, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ color: '#2ecc71', fontSize: 10 }}>●</span> Uus 12
            </div>
            <MapContainer center={[59.4370, 24.748]} zoom={14} style={{ height: '100%', width: '100%' }} zoomControl={true}>
              <TileLayer attribution='&copy; OpenStreetMap' url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" />
              <Polyline positions={pathCoords} color="#e07b2e" weight={4} />
              <Marker position={[59.4390, 24.755]} icon={pinIcon('#e07b2e')} />
              <Marker position={[59.4330, 24.752]} icon={pinIcon('#ef4444')} />
              <Marker position={[59.4270, 24.735]} icon={pinIcon('#e07b2e')} />
            </MapContainer>

            {/* Last Trip & All Expenses bottom strip */}
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 1000, background: '#fff', borderTop: '1px solid #f0f0f0', padding: '14px 16px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              {/* Last Trip */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                  <span style={{ fontWeight: 700, fontSize: 13, color: '#1a1a1a' }}>Last Trip</span>
                  <span style={{ fontSize: 11, color: '#e07b2e', cursor: 'pointer' }}>See All</span>
                </div>
                {trips.slice(0, 2).map((t, i) => (
                  <div key={i} style={{ marginBottom: 10 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#e07b2e', display: 'inline-block', flexShrink: 0 }} />
                      <span style={{ fontSize: 11, color: '#888', fontFamily: 'monospace', marginRight: 4 }}>{t.t1}</span>
                      <span style={{ fontSize: 11, color: '#333', flex: 1 }}>{t.loc1}</span>
                      <span style={{ fontSize: 11, fontWeight: 600, color: '#333' }}>{t.name}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#ddd', display: 'inline-block', flexShrink: 0 }} />
                      <span style={{ fontSize: 11, color: '#888', fontFamily: 'monospace', marginRight: 4 }}>{t.t2}</span>
                      <span style={{ fontSize: 11, color: '#aaa', flex: 1 }}>{t.loc2}</span>
                      <span style={{ fontSize: 11, fontWeight: 700, color: '#333' }}>{t.km}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* All Expenses */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                  <span style={{ fontWeight: 700, fontSize: 13, color: '#1a1a1a' }}>All Expenses</span>
                  <span style={{ fontSize: 11, color: '#e07b2e', cursor: 'pointer' }}>+ Add New</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  {[
                    { label: 'Gas Station', amount: '$500', icon: '⛽', bg: '#EEF0FF', iconBg: '#818CF8' },
                    { label: 'Oil', amount: '$250', icon: '🛢️', bg: '#F0FFF4', iconBg: '#34D399' },
                    { label: 'Wash', amount: '$400', icon: '🧽', bg: '#FAF5FF', iconBg: '#A78BFA' },
                    { label: 'Toll', amount: '$300', icon: '🚧', bg: '#FFFBEB', iconBg: '#FBBF24' },
                  ].map(e => (
                    <div key={e.label} style={{ background: e.bg, borderRadius: 12, padding: '10px 12px', display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 34, height: 34, borderRadius: 8, background: e.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>{e.icon}</div>
                      <div>
                        <div style={{ fontSize: 9, color: '#888', marginBottom: 2 }}>{e.label}</div>
                        <div style={{ fontSize: 14, fontWeight: 800, color: '#1a1a1a' }}>{e.amount}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ── RIGHT PANEL: My Fleet + Live Tracking ── */}
          <div style={{ width: 280, background: '#fff', borderLeft: '1px solid #f0f0f0', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            {/* My Fleet */}
            <div style={{ padding: '16px', borderBottom: '1px solid #f0f0f0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
                <span style={{ fontWeight: 700, fontSize: 14, color: '#1a1a1a' }}>My Fleet</span>
                <span style={{ fontSize: 11, color: '#e07b2e', cursor: 'pointer' }}>See All</span>
              </div>
              <div style={{ fontWeight: 800, fontSize: 16, color: '#e07b2e', marginBottom: 14 }}>POLESTAR 520 DDS</div>
              <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                  {[
                    { label: 'Speed', value: '135 KM/H' },
                    { label: 'Traveled', value: '486 KM' },
                    { label: 'Temperature', value: '20° C' },
                  ].map(item => (
                    <div key={item.label} style={{ marginBottom: 10 }}>
                      <div style={{ fontSize: 16, fontWeight: 800, color: '#1a1a1a' }}>{item.value}</div>
                      <div style={{ fontSize: 10, color: '#aaa' }}>{item.label}</div>
                    </div>
                  ))}
                </div>
                <img src="https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=150&q=60" style={{ width: 110, height: 80, objectFit: 'cover', borderRadius: 8, filter: 'grayscale(20%)' }} />
              </div>
            </div>

            {/* Live Tracking list */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              <div style={{ padding: '12px 16px', borderBottom: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14, color: '#1a1a1a' }}>Live Tracking</div>
                  <div style={{ fontSize: 9, color: '#aaa', marginTop: 2 }}>32 Vehicles on Road</div>
                </div>
                <span style={{ fontSize: 11, color: '#e07b2e', cursor: 'pointer' }}>See All</span>
              </div>
              <div style={{ flex: 1, overflowY: 'auto' }}>
                {trackingList.map((v, i) => (
                  <div key={i} onClick={() => setSelectedVehicle(v.name)} style={{
                    display: 'flex', alignItems: 'center', gap: 12, padding: '10px 16px',
                    borderBottom: '1px solid #f9f9f9', cursor: 'pointer',
                    background: selectedVehicle === v.name ? '#fff9f5' : '#fff',
                  }}>
                    <img src={vehicleImgs[v.name] || vehicleImgs['Noah Car']} style={{ width: 48, height: 36, objectFit: 'cover', borderRadius: 6 }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: '#1a1a1a' }}>{v.name}</div>
                      <div style={{ fontSize: 10, color: '#aaa', marginTop: 1 }}>{v.status}</div>
                    </div>
                    <span style={{ fontSize: 12, fontWeight: 700, color: '#e07b2e', fontFamily: 'monospace' }}>{v.km}</span>
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
