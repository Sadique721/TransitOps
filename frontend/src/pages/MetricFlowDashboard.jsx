import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid
} from 'recharts';

const performanceData = [
  { name: 'Jan', Sales: 2800, Target: 3000 },
  { name: 'Feb', Sales: 4200, Target: 3800 },
  { name: 'Mar', Sales: 3600, Target: 3500 },
  { name: 'Apr', Sales: 4790, Target: 3830 },
  { name: 'May', Sales: 3900, Target: 4200 },
  { name: 'Jun', Sales: 5200, Target: 4600 },
];

const countries = [
  { name: 'United Kingdom', count: '6.3K', flag: '🇬🇧' },
  { name: 'Indonesia', count: '5.2K', flag: '🇮🇩' },
  { name: 'Malaysia', count: '4.7K', flag: '🇲🇾' },
  { name: 'China', count: '4.5K', flag: '🇨🇳' },
  { name: 'Thailand', count: '3.2K', flag: '🇹🇭' },
  { name: 'Philippines', count: '2.9K', flag: '🇵🇭' },
];

const products = [
  { name: 'MagStand Pro 1', revenue: '$24,500', sales: 846, growth: 32, up: true, reviews: 570, views: 978 },
  { name: 'MagStand Pro 2', revenue: '$16,300', sales: 598, growth: 26, up: true, reviews: 385, views: 945 },
  { name: 'MagStand Pro 3', revenue: '$12,980', sales: 389, growth: 13, up: true, reviews: 127, views: 437 },
  { name: 'MagStand Pro 4', revenue: '$10,984', sales: 265, growth: 11, up: false, reviews: 190, views: 265 },
];

// Heatmap: 0=empty, 1=light, 2=medium, 3=high (with diagonal stripes like mockup)
const heatmap = [
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [1, 1, 2, 0, 2, 0, 0],
  [1, 2, 3, 3, 3, 1, 0],
  [0, 1, 2, 3, 1, 2, 0],
  [0, 0, 1, 1, 1, 0, 0],
  [0, 0, 0, 1, 0, 0, 0],
];
const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const hours = ['9 am', '10 am', '11 am', '12 pm', '1 pm', '2 pm', '3 pm'];

const getCell = (val) => {
  if (val === 3) return { bg: '#EF4444', stripe: true };
  if (val === 2) return { bg: '#EF444499', stripe: true };
  if (val === 1) return { bg: '#EF444433', stripe: false };
  return { bg: '#0D1628', stripe: false };
};

export default function MetricFlowDashboard() {
  const navigate = useNavigate();

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#050A14', color: '#D0E4F7', fontFamily: "'Inter','Plus Jakarta Sans',sans-serif", overflow: 'hidden' }}>
      {/* ── LEFT SIDEBAR ── exact match to mockup */}
      <div style={{ width: 220, background: '#080F1E', borderRight: '1px solid rgba(14,165,233,0.12)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '24px 0' }}>
        <div>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '0 20px', marginBottom: 32, cursor: 'pointer' }} onClick={() => navigate('/dashboard')}>
            <div style={{ width: 32, height: 32, background: '#e5341a', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>🏠</div>
            <span style={{ fontWeight: 700, fontSize: 15, color: '#fff' }}>Metric Flow</span>
          </div>

          {/* Nav items */}
          {[
            { label: 'Dashboard', icon: '🏠', path: '/dashboard', active: true },
            { label: 'Orders', icon: '🛒', path: '/trips' },
            { label: 'Products', icon: '📦', path: '/vehicles' },
            { label: 'Customers', icon: '👤', path: '/drivers' },
            { label: 'Analysis', icon: '📊', path: '/live-ops' },
            { label: 'Marketing', icon: '📣', path: '/task-automate' },
          ].map(item => (
            <button
              key={item.label}
              onClick={() => navigate(item.path)}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: 12,
                padding: '10px 20px', border: 'none', cursor: 'pointer',
                background: item.active ? '#2e2e2e' : 'transparent',
                color: item.active ? '#e5341a' : '#999',
                borderRadius: item.active ? '0 20px 20px 0' : 0,
                fontWeight: item.active ? 700 : 500, fontSize: 13,
                textAlign: 'left', marginBottom: 2,
              }}
            >
              <span style={{ fontSize: 16 }}>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </div>

        <div>
          {[
            { label: 'Settings', icon: '⚙️', path: '/maintenance' },
            { label: 'Help Center', icon: '❓', path: '/shipment-track' },
          ].map(item => (
            <button
              key={item.label}
              onClick={() => navigate(item.path)}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: 12,
                padding: '10px 20px', border: 'none', cursor: 'pointer',
                background: 'transparent', color: '#888', fontWeight: 500, fontSize: 13, textAlign: 'left',
              }}
            >
              <span style={{ fontSize: 16 }}>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Top navbar */}
        <div style={{ height: 64, background: '#1a1a1a', borderBottom: '1px solid #333', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 28px' }}>
          <div style={{ position: 'relative', width: 340 }}>
            <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#666', fontSize: 14 }}>🔍</span>
            <input placeholder="Search" style={{
              width: '100%', background: '#2a2a2a', border: '1px solid #444', borderRadius: 30,
              padding: '8px 16px 8px 38px', color: '#fff', fontSize: 13, outline: 'none',
            }} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ background: '#2a2a2a', border: '1px solid #444', borderRadius: 8, padding: '6px 14px', fontSize: 12, color: '#ccc', display: 'flex', alignItems: 'center', gap: 8 }}>
              <span>📅</span><span>Wed, 29 May 2024</span>
            </div>
            <div style={{ position: 'relative' }}>
              <div style={{ width: 36, height: 36, background: '#2a2a2a', border: '1px solid #444', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>🔔</div>
              <div style={{ position: 'absolute', top: 6, right: 6, width: 8, height: 8, background: '#e5341a', borderRadius: '50%' }} />
            </div>
            <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=60&q=80" style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover', border: '2px solid #444', cursor: 'pointer' }} onClick={() => navigate('/acme-corp')} />
          </div>
        </div>

        {/* Scrollable content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px 28px' }}>
          {/* ── KPI CARDS ROW ── */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 24 }}>
            {[
              { label: 'Total Revenue', value: '$ 24,500', badge: '+12.5%', up: true },
              { label: 'Total Order', value: '1,240', badge: '+8.2%', up: true },
              { label: 'New customer', value: '320', badge: '-4.3%', up: false },
              { label: 'Conversion rate', value: '3.2 %', badge: '+2.1%', up: true },
            ].map(card => (
              <div key={card.label} style={{ background: '#222', border: '1px solid #333', borderRadius: 16, padding: '20px 22px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <span style={{ fontSize: 11, color: '#888', fontWeight: 600 }}>{card.label}</span>
                  <span style={{
                    fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 20,
                    background: card.up ? 'rgba(34,197,94,0.12)' : 'rgba(239,68,68,0.12)',
                    color: card.up ? '#4ade80' : '#f87171',
                    display: 'flex', alignItems: 'center', gap: 3,
                  }}>
                    <span>{card.up ? '↗' : '↘'}</span>{card.badge}
                  </span>
                </div>
                <div style={{ fontSize: card.value.includes('$') ? 26 : 28, fontWeight: 800, color: '#fff', fontFamily: 'monospace' }}>
                  {card.value}
                </div>
                <div style={{ fontSize: 10, color: '#555', marginTop: 8, fontFamily: 'monospace' }}>From Jun 01,2024 To Jun 29,2024</div>
              </div>
            ))}
          </div>

          {/* ── HEATMAP + CHART ── */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 16, marginBottom: 24 }}>
            {/* Heatmap */}
            <div style={{ background: '#222', border: '1px solid #333', borderRadius: 16, padding: '20px 22px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <span style={{ fontWeight: 700, fontSize: 13, color: '#fff' }}>Orders by time</span>
                <div style={{ display: 'flex', gap: 10, fontSize: 9, color: '#777' }}>
                  <span>● 200+</span><span style={{ color: '#e5341a88' }}>● 500+</span>
                  <span style={{ color: '#e5341aaa' }}>● 1,000+</span><span style={{ color: '#e5341a' }}>● 2,000+</span>
                </div>
              </div>
              {hours.map((h, hi) => (
                <div key={h} style={{ display: 'flex', alignItems: 'center', marginBottom: 5 }}>
                  <span style={{ width: 44, fontSize: 9, color: '#666', textAlign: 'right', paddingRight: 8, fontFamily: 'monospace' }}>{h}</span>
                  {days.map((d, di) => {
                    const cell = getCell(heatmap[hi][di]);
                    return (
                      <div key={d} style={{
                        flex: 1, height: 22, borderRadius: 4, marginRight: 3,
                        background: cell.stripe
                          ? `repeating-linear-gradient(-45deg, ${cell.bg}, ${cell.bg} 3px, ${cell.bg}88 3px, ${cell.bg}88 6px)`
                          : cell.bg,
                        border: '1px solid #2e2e2e',
                      }} />
                    );
                  })}
                </div>
              ))}
              <div style={{ display: 'flex', marginTop: 6, paddingLeft: 44 }}>
                {days.map(d => (
                  <div key={d} style={{ flex: 1, textAlign: 'center', fontSize: 9, color: '#666', marginRight: 3 }}>{d}</div>
                ))}
              </div>
            </div>

            {/* Line Chart */}
            <div style={{ background: '#222', border: '1px solid #333', borderRadius: 16, padding: '20px 22px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <span style={{ fontWeight: 700, fontSize: 13, color: '#fff' }}>Monthly Sales performance</span>
                <div style={{ display: 'flex', gap: 14, fontSize: 10 }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><span style={{ width: 20, height: 2, background: '#e5341a', display: 'inline-block' }} />Sales</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><span style={{ width: 20, height: 2, background: '#8b8bff', display: 'inline-block' }} />Target</span>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={performanceData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2e2e2e" />
                  <XAxis dataKey="name" stroke="#555" fontSize={10} tickLine={false} />
                  <YAxis stroke="#555" fontSize={10} tickLine={false} />
                  <Tooltip contentStyle={{ background: '#1a1a1a', border: '1px solid #444', borderRadius: 8, fontSize: 10 }} />
                  <Line type="monotone" dataKey="Sales" stroke="#e5341a" strokeWidth={2.5} dot={{ r: 3 }} activeDot={{ r: 5 }} />
                  <Line type="monotone" dataKey="Target" stroke="#8b8bff" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* ── COUNTRIES + PRODUCTS TABLE ── */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 16 }}>
            {/* Sales by Country */}
            <div style={{ background: '#222', border: '1px solid #333', borderRadius: 16, padding: '20px 22px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <span style={{ fontWeight: 700, fontSize: 13, color: '#fff' }}>Sales by Country</span>
                <span style={{ fontSize: 11, color: '#888', cursor: 'pointer' }}>View All</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                {countries.map(c => (
                  <div key={c.name} style={{ background: '#1a1a1a', border: '1px solid #333', borderRadius: 12, padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: 22 }}>{c.flag}</span>
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 600, color: '#ddd' }}>{c.name}</div>
                      <div style={{ fontSize: 10, color: '#666', marginTop: 2 }}>{c.count} Products</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Product Sales */}
            <div style={{ background: '#222', border: '1px solid #333', borderRadius: 16, padding: '20px 22px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <span style={{ fontWeight: 700, fontSize: 13, color: '#fff' }}>Top Product Sales</span>
                <span style={{ fontSize: 11, color: '#888', cursor: 'pointer' }}>View All</span>
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    {['PRODUCT', 'REVENUE', 'SALES', 'GROWTH', 'REVIEWS', 'VIEWS'].map(h => (
                      <th key={h} style={{ textAlign: h === 'PRODUCT' ? 'left' : 'right', fontSize: 9, color: '#666', fontWeight: 600, paddingBottom: 10, letterSpacing: '0.05em' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {products.map((p, i) => (
                    <tr key={p.name} style={{ borderTop: '1px solid #2e2e2e' }}>
                      <td style={{ padding: '10px 0', fontSize: 12, color: '#ddd', fontWeight: 600 }}>{p.name}</td>
                      <td style={{ textAlign: 'right', fontSize: 11, color: '#ccc', fontFamily: 'monospace' }}>{p.revenue}</td>
                      <td style={{ textAlign: 'right', fontSize: 11, color: '#ccc', fontFamily: 'monospace' }}>{p.sales}</td>
                      <td style={{ textAlign: 'right', fontSize: 11, fontWeight: 700, color: p.up ? '#4ade80' : '#f87171', fontFamily: 'monospace' }}>
                        {p.up ? '↗' : '↘'} {p.growth}%
                      </td>
                      <td style={{ textAlign: 'right', fontSize: 11, color: '#ccc', fontFamily: 'monospace' }}>{p.reviews}</td>
                      <td style={{ textAlign: 'right', fontSize: 11, color: '#888', fontFamily: 'monospace' }}>{p.views}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
