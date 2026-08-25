import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';

const revenueData = [
  { d: 'May 1', v: 20 }, { d: 'May 6', v: 35 }, { d: 'May 12', v: 28 },
  { d: 'May 18', v: 42.58 }, { d: 'May 24', v: 50 }, { d: 'May 30', v: 65 },
];

const navItems = [
  { label: 'Dashboard', icon: '📊', active: true },
  { label: 'Analytics', icon: '📈' },
  { label: 'Projects', icon: '📁' },
  { label: 'Revenue', icon: '💰' },
  { label: 'Customers', icon: '👥' },
  { label: 'Reports', icon: '📋' },
  { label: 'Settings', icon: '⚙️' },
  { label: 'Integrations', icon: '🔌' },
];

const topProducts = [
  { name: 'Analytics Pro', rev: '$320,4K', growth: '+16.3%', icon: '📊', bg: '#312e81' },
  { name: 'Data Insights', rev: '$245,7K', growth: '+12.8%', icon: '📉', bg: '#312e81' },
  { name: 'Workflow Max', rev: '$185,9K', growth: '+9.7%', icon: '⚡', bg: '#312e81' },
  { name: 'Team Collaboration', rev: '$142,6K', growth: '+7.2%', icon: '👥', bg: '#312e81' },
];

export default function AcmeCorpDashboard() {
  const navigate = useNavigate();
  const [activeNav, setActiveNav] = useState('Dashboard');

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#0f0e1a', color: '#e0e0e0', fontFamily: 'Inter, sans-serif', overflow: 'hidden' }}>
      {/* ── LEFT SIDEBAR ── */}
      <div style={{ width: 200, background: '#13122a', borderRight: '1px solid #1e1d3f', display: 'flex', flexDirection: 'column' }}>
        {/* Logo */}
        <div style={{ padding: '20px 18px', display: 'flex', alignItems: 'center', gap: 10, borderBottom: '1px solid #1e1d3f', cursor: 'pointer' }} onClick={() => navigate('/dashboard')}>
          <div style={{ width: 30, height: 30, background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>A</div>
          <span style={{ fontWeight: 800, fontSize: 15, color: '#fff' }}>AcmeCorp</span>
        </div>

        {/* Nav items */}
        <div style={{ flex: 1, padding: '12px 10px', overflowY: 'auto' }}>
          {navItems.map(item => (
            <button
              key={item.label}
              onClick={() => { setActiveNav(item.label); if (item.label === 'Settings') navigate('/maintenance'); }}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px',
                border: 'none', cursor: 'pointer', borderRadius: 8, marginBottom: 2, textAlign: 'left',
                background: activeNav === item.label ? 'rgba(99,102,241,0.18)' : 'transparent',
                color: activeNav === item.label ? '#818cf8' : '#9ca3af', fontSize: 12, fontWeight: activeNav === item.label ? 700 : 500,
              }}
            >
              <span style={{ fontSize: 15 }}>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </div>

        {/* Upgrade Plan */}
        <div style={{ padding: '14px', borderTop: '1px solid #1e1d3f' }}>
          <div style={{ background: 'rgba(99,102,241,0.12)', borderRadius: 12, padding: '12px 14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <span style={{ fontSize: 16 }}>🚀</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: '#a5b4fc' }}>Upgrade Plan</span>
            </div>
            <div style={{ fontSize: 12, fontWeight: 800, color: '#fff', marginBottom: 2 }}>Enterprise Plan</div>
            <div style={{ fontSize: 9, color: '#6b7280' }}>Renews on May 24, 2025</div>
          </div>
        </div>
      </div>

      {/* ── MAIN ── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Topbar */}
        <div style={{ height: 58, background: '#13122a', borderBottom: '1px solid #1e1d3f', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px' }}>
          <div style={{ position: 'relative', width: 360 }}>
            <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#555', fontSize: 13 }}>🔍</span>
            <input placeholder="Search anything..." style={{ width: '100%', background: '#1a1933', border: '1px solid #2a2850', borderRadius: 30, padding: '7px 16px 7px 36px', color: '#ccc', fontSize: 12, outline: 'none', boxSizing: 'border-box' }} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ position: 'relative' }}>
              <div style={{ width: 34, height: 34, background: '#1a1933', border: '1px solid #2a2850', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, cursor: 'pointer' }}>🔔</div>
              <div style={{ position: 'absolute', top: 4, right: 4, width: 16, height: 16, background: '#6366f1', borderRadius: '50%', fontSize: 8, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>3</div>
            </div>
            <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 800, color: '#fff', cursor: 'pointer' }}>JD</div>
            <div style={{ width: 28, height: 28, background: '#1a1933', border: '1px solid #2a2850', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, cursor: 'pointer' }}>🌙</div>
          </div>
        </div>

        {/* Scrollable content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
          <h2 style={{ fontWeight: 800, fontSize: 20, color: '#fff', margin: '0 0 20px' }}>Dashboard</h2>

          {/* KPI cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 20 }}>
            {[
              { label: 'Total Revenue', val: '$1.24M', badge: '↑ 18.6% vs last month', color: '#6366f1', icon: '💎' },
              { label: 'Active Users', val: '8,569', badge: '↑ 12.4% vs last month', color: '#22d3ee', icon: '👥' },
              { label: 'Conversion Rate', val: '3.42%', badge: '↑ 8.7% vs last month', color: '#f59e0b', icon: '⏱️' },
              { label: 'Retention Rate', val: '92.1%', badge: '↑ 14.3% vs last month', color: '#f97316', icon: '🔄' },
            ].map(card => (
              <div key={card.label} style={{ background: '#13122a', border: '1px solid #1e1d3f', borderRadius: 14, padding: '16px 18px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                  <span style={{ fontSize: 10, color: '#6b7280', fontWeight: 600 }}>{card.label}</span>
                  <div style={{ width: 28, height: 28, background: `${card.color}22`, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13 }}>{card.icon}</div>
                </div>
                <div style={{ fontSize: 24, fontWeight: 900, color: '#fff', marginBottom: 8, fontFamily: 'monospace' }}>{card.val}</div>
                <div style={{ fontSize: 9, color: '#4ade80', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span>↑</span><span>{card.badge}</span>
                </div>
                {/* sparkline */}
                <div style={{ marginTop: 10, height: 28, background: `${card.color}18`, borderRadius: 4, overflow: 'hidden' }}>
                  <svg viewBox="0 0 100 28" style={{ width: '100%', height: '100%' }}>
                    <polyline points="0,20 20,15 40,18 60,8 80,10 100,4" fill="none" stroke={card.color} strokeWidth="2" />
                  </svg>
                </div>
              </div>
            ))}
          </div>

          {/* Revenue chart + Top Products */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 14, marginBottom: 20 }}>
            <div style={{ background: '#13122a', border: '1px solid #1e1d3f', borderRadius: 14, padding: '18px 20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <span style={{ fontWeight: 700, fontSize: 14, color: '#fff' }}>Revenue Overview</span>
                <div style={{ background: '#1a1933', border: '1px solid #2a2850', borderRadius: 8, padding: '4px 12px', fontSize: 11, color: '#888', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>This Month ▾</div>
              </div>
              {/* Tooltip card overlay */}
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', top: 10, left: '55%', zIndex: 10, background: '#1a1933', border: '1px solid #2a2850', borderRadius: 8, padding: '8px 12px', fontSize: 11 }}>
                  <div style={{ color: '#6b7280', fontSize: 9 }}>May 18</div>
                  <div style={{ fontSize: 14, fontWeight: 800, color: '#fff' }}>$42,580</div>
                </div>
                <ResponsiveContainer width="100%" height={180}>
                  <AreaChart data={revenueData} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.5} />
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0.02} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="d" stroke="#333" fontSize={9} tickLine={false} />
                    <YAxis stroke="#333" fontSize={9} tickLine={false} tickFormatter={v => `$${v}k`} />
                    <Tooltip contentStyle={{ background: '#1a1933', border: '1px solid #2a2850', borderRadius: 8, fontSize: 10, color: '#fff' }} formatter={v => [`$${v}k`, 'Revenue']} />
                    <Area type="monotone" dataKey="v" stroke="#6366f1" strokeWidth={2.5} fill="url(#revGrad)" dot={{ r: 3, fill: '#6366f1' }} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Top Products */}
            <div style={{ background: '#13122a', border: '1px solid #1e1d3f', borderRadius: 14, padding: '18px 20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                <span style={{ fontWeight: 700, fontSize: 14, color: '#fff' }}>Top Products</span>
                <span style={{ fontSize: 11, color: '#6366f1', cursor: 'pointer' }}>View all</span>
              </div>
              {topProducts.map((p) => (
                <div key={p.name} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid #1a1933' }}>
                  <div style={{ width: 34, height: 34, background: 'rgba(99,102,241,0.15)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, flexShrink: 0 }}>{p.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: '#e5e7eb' }}>{p.name}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: '#fff', fontFamily: 'monospace' }}>{p.rev}</div>
                    <div style={{ fontSize: 10, color: '#4ade80', marginTop: 1 }}>↑ {p.growth}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity + Tasks */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div style={{ background: '#13122a', border: '1px solid #1e1d3f', borderRadius: 14, padding: '16px 18px' }}>
              <span style={{ fontWeight: 700, fontSize: 14, color: '#fff', display: 'block', marginBottom: 14 }}>Recent Activity</span>
              {[
                { icon: '👤', text: 'New user registered', time: '2 min ago' },
                { icon: '📝', text: 'Project "Website Redesign" updated', time: '15 min ago' },
                { icon: '💳', text: 'Payment of $1,240 received', time: '1 hr ago' },
                { icon: '📊', text: 'Monthly report generated', time: '3 hrs ago' },
              ].map((a, i) => (
                <div key={i} style={{ display: 'flex', gap: 12, marginBottom: 12, alignItems: 'flex-start' }}>
                  <div style={{ width: 30, height: 30, background: 'rgba(99,102,241,0.12)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, flexShrink: 0 }}>{a.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12, color: '#e5e7eb' }}>{a.text}</div>
                    <div style={{ fontSize: 10, color: '#4b5563', marginTop: 2 }}>{a.time}</div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ background: '#13122a', border: '1px solid #1e1d3f', borderRadius: 14, padding: '16px 18px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                <span style={{ fontWeight: 700, fontSize: 14, color: '#fff' }}>Tasks</span>
                <span style={{ background: '#6366f1', color: '#fff', fontSize: 10, padding: '2px 8px', borderRadius: 20, fontWeight: 700 }}>2/5</span>
              </div>
              {[
                { text: 'Review Q2 Reports', due: 'Due in 2 days', done: false },
                { text: 'Update User Permissions', due: 'Due in 5 days', done: false },
                { text: 'Deploy new dashboard', due: 'Completed', done: true },
                { text: 'Fix security audit issues', due: 'Completed', done: true },
              ].map((t, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                  <div style={{ width: 16, height: 16, border: `2px solid ${t.done ? '#6366f1' : '#374151'}`, borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', background: t.done ? '#6366f1' : 'transparent', flexShrink: 0 }}>
                    {t.done && <span style={{ color: '#fff', fontSize: 10, lineHeight: 1 }}>✓</span>}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12, color: t.done ? '#4b5563' : '#e5e7eb', textDecoration: t.done ? 'line-through' : 'none' }}>{t.text}</div>
                  </div>
                  <span style={{ fontSize: 10, color: '#4b5563' }}>{t.due}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
