import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AiAssistantWidget from '../components/AiAssistantWidget';

const NAV_ALL = [
  { name: 'Metric Flow',    path: '/dashboard',     icon: '📊', roles: ['FLEET_MANAGER'], color: '#0EA5E9' },
  { name: 'Live Ops',       path: '/live-ops',       icon: '🗺️', roles: ['FLEET_MANAGER'], color: '#22C55E' },
  { name: 'Shipment Track', path: '/shipment-track', icon: '📦', roles: ['FLEET_MANAGER','DRIVER'], color: '#F59E0B' },
  { name: 'GPS Tracking',   path: '/tracking',       icon: '📍', roles: ['FLEET_MANAGER','DRIVER'], color: '#EF4444' },
  { name: 'Rent Co.',       path: '/rent-co',        icon: '🚗', roles: ['FLEET_MANAGER'], color: '#F59E0B' },
  { name: 'AcmeCorp',      path: '/acme-corp',       icon: '🏢', roles: ['FLEET_MANAGER','FINANCIAL_ANALYST'], color: '#8B5CF6' },
  { name: 'Bento Grid',     path: '/bento-grid',     icon: '🔮', roles: ['FLEET_MANAGER'], color: '#8B5CF6' },
  { name: 'Task Automate',  path: '/task-automate',  icon: '🤖', roles: ['FLEET_MANAGER'], color: '#0EA5E9' },
  { name: 'Vehicles',       path: '/vehicles',        icon: '🚚', roles: ['FLEET_MANAGER'], color: '#22C55E' },
  { name: 'Drivers',        path: '/drivers',         icon: '👤', roles: ['FLEET_MANAGER'], color: '#0EA5E9' },
  { name: 'Trips',          path: '/trips',           icon: '🛣️', roles: ['FLEET_MANAGER','DRIVER'], color: '#F59E0B' },
  { name: 'Maintenance',    path: '/maintenance',     icon: '🔧', roles: ['FLEET_MANAGER'], color: '#EF4444' },
];

export default function WorkspaceLayout({ children }) {
  const [open, setOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth() || {};

  let user = { name: 'Fleet Admin', role: 'FLEET_MANAGER' };
  try { const s = localStorage.getItem('user'); if (s) user = JSON.parse(s); } catch {}

  const items = NAV_ALL.filter(i => i.roles.includes(user.role));

  return (
    <div style={{ display:'flex', height:'100vh', overflow:'hidden', background:'#050A14', color:'#D0E4F7', fontFamily:"'Inter','Plus Jakarta Sans',sans-serif" }}>

      {/* ── SIDEBAR ── */}
      <div style={{
        width: open ? 236 : 60, transition:'width 0.3s cubic-bezier(.4,0,.2,1)',
        background:'linear-gradient(180deg,#080F1E 0%,#0D1628 100%)',
        borderRight:'1px solid rgba(14,165,233,0.1)',
        display:'flex', flexDirection:'column', flexShrink:0, overflow:'hidden', position:'relative',
      }}>
        {/* Top glow */}
        <div style={{ position:'absolute', top:-40, left:'50%', transform:'translateX(-50%)', width:180, height:160, borderRadius:'50%', background:'radial-gradient(circle,rgba(14,165,233,0.12) 0%,transparent 70%)', pointerEvents:'none' }} />

        {/* Logo */}
        <div style={{ height:62, display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 12px', borderBottom:'1px solid rgba(14,165,233,0.08)', flexShrink:0 }}>
          {open ? (
            <div style={{ display:'flex', alignItems:'center', gap:10, cursor:'pointer', flex:1 }} onClick={() => navigate('/dashboard')}>
              <div style={{ width:34, height:34, background:'linear-gradient(135deg,#EF4444,#F59E0B)', borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center', fontSize:17, boxShadow:'0 0 14px rgba(239,68,68,0.4)', flexShrink:0 }}>🚛</div>
              <div>
                <div style={{ fontWeight:900, fontSize:13, color:'#EFF6FF', letterSpacing:'-0.02em', fontFamily:"'Plus Jakarta Sans',sans-serif" }}>TransitOps</div>
                <div style={{ fontSize:7, color:'rgba(125,211,252,0.5)', fontWeight:700, letterSpacing:'0.14em' }}>FLEET COMMAND v2</div>
              </div>
            </div>
          ) : (
            <div style={{ width:34, height:34, background:'linear-gradient(135deg,#EF4444,#F59E0B)', borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center', fontSize:17, cursor:'pointer', margin:'0 auto' }} onClick={() => navigate('/dashboard')}>🚛</div>
          )}
          <button onClick={() => setOpen(!open)} style={{ background:'rgba(14,165,233,0.08)', border:'1px solid rgba(14,165,233,0.18)', borderRadius:7, width:26, height:26, display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', color:'#7DD3FC', fontSize:12, flexShrink:0, marginLeft:open ? 4 : 0 }}>
            {open ? '◀' : '▶'}
          </button>
        </div>

        {/* Nav */}
        <nav style={{ flex:1, padding:'10px 8px', overflowY:'auto', overflowX:'hidden' }}>
          {items.map(item => {
            const isActive = location.pathname === item.path;
            return (
              <button key={item.path} onClick={() => navigate(item.path)}
                title={!open ? item.name : undefined}
                style={{
                  width:'100%', display:'flex', alignItems:'center',
                  gap: open ? 10 : 0, justifyContent: open ? 'flex-start' : 'center',
                  padding: open ? '8px 11px' : '8px 0',
                  border:'none', cursor:'pointer', borderRadius:9, marginBottom:2,
                  background: isActive ? `${item.color}18` : 'transparent',
                  color: isActive ? item.color : 'rgba(176,204,224,0.45)',
                  fontWeight: isActive ? 700 : 500, fontSize:12, textAlign:'left',
                  borderLeft: isActive ? `2.5px solid ${item.color}` : '2.5px solid transparent',
                  transition:'all 0.18s ease',
                }}
                onMouseEnter={e => { if (!isActive) { e.currentTarget.style.background = `${item.color}0E`; e.currentTarget.style.color = item.color; } }}
                onMouseLeave={e => { if (!isActive) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(176,204,224,0.45)'; } }}
              >
                <span style={{ fontSize:15, flexShrink:0 }}>{item.icon}</span>
                {open && <span style={{ overflow:'hidden', whiteSpace:'nowrap', textOverflow:'ellipsis', flex:1 }}>{item.name}</span>}
                {open && isActive && <span style={{ width:6, height:6, borderRadius:'50%', background:item.color, boxShadow:`0 0 6px ${item.color}`, flexShrink:0 }} />}
              </button>
            );
          })}
        </nav>

        {/* User + Sign out */}
        <div style={{ padding:'8px 8px 14px', borderTop:'1px solid rgba(14,165,233,0.08)', flexShrink:0 }}>
          {open && (
            <div style={{ background:'rgba(14,165,233,0.06)', border:'1px solid rgba(14,165,233,0.12)', borderRadius:10, padding:'9px 12px', marginBottom:8 }}>
              <div style={{ fontSize:11, fontWeight:700, color:'#D0E4F7' }}>{user.name}</div>
              <div style={{ fontSize:9, color:'rgba(125,211,252,0.45)', marginTop:1 }}>{user.role.replace('_',' ')}</div>
            </div>
          )}
          <button
            onClick={() => { if (logout) logout(); navigate('/login'); }}
            style={{ width:'100%', padding:'8px', border:'1px solid rgba(239,68,68,0.2)', borderRadius:8, background:'rgba(239,68,68,0.06)', color:'#EF4444', fontSize:11, fontWeight:700, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:6 }}
          >
            🚪 {open ? 'Sign out' : ''}
          </button>
        </div>
      </div>

      {/* ── MAIN ── */}
      <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden' }}>
        {/* Navbar */}
        <header style={{ height:62, display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 22px', background:'linear-gradient(90deg,rgba(8,15,30,0.97),rgba(13,22,40,0.97))', borderBottom:'1px solid rgba(14,165,233,0.1)', backdropFilter:'blur(8px)', flexShrink:0 }}>
          <div style={{ display:'flex', alignItems:'center', gap:18 }}>
            {/* Status indicators */}
            {[
              { dot:'#22C55E', label:'On Route', val:'14 vehicles' },
              { dot:'#F59E0B', label:'Idle', val:'8 idle' },
              { dot:'#EF4444', label:'Alerts', val:'3 alerts' },
            ].map(s => (
              <div key={s.label} style={{ display:'flex', alignItems:'center', gap:6 }}>
                <span style={{ width:7, height:7, borderRadius:'50%', background:s.dot, display:'inline-block', boxShadow:`0 0 6px ${s.dot}`, animation:'pulse-dot 1.6s infinite' }} />
                <span style={{ fontSize:11, color:`${s.dot}CC`, fontWeight:600 }}>{s.val}</span>
              </div>
            ))}
          </div>

          <div style={{ display:'flex', alignItems:'center', gap:12 }}>
            {/* Search */}
            <div style={{ position:'relative' }}>
              <span style={{ position:'absolute', left:10, top:'50%', transform:'translateY(-50%)', color:'rgba(125,211,252,0.4)', fontSize:13 }}>🔍</span>
              <input placeholder="Search fleet..." style={{ background:'rgba(14,165,233,0.05)', border:'1px solid rgba(14,165,233,0.14)', borderRadius:8, padding:'6px 12px 6px 30px', fontSize:12, color:'#D0E4F7', outline:'none', width:190 }}
                onFocus={e => { e.target.style.borderColor='rgba(14,165,233,0.4)'; e.target.style.boxShadow='0 0 0 3px rgba(14,165,233,0.08)'; }}
                onBlur={e => { e.target.style.borderColor='rgba(14,165,233,0.14)'; e.target.style.boxShadow='none'; }}
              />
            </div>
            {/* Alert bell */}
            <div style={{ position:'relative', cursor:'pointer' }}>
              <div style={{ width:34, height:34, background:'rgba(239,68,68,0.08)', border:'1px solid rgba(239,68,68,0.2)', borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center', fontSize:16 }}>🔔</div>
              <div style={{ position:'absolute', top:4, right:4, width:8, height:8, background:'#EF4444', borderRadius:'50%', border:'2px solid #080F1E', boxShadow:'0 0 6px #EF4444' }} />
            </div>
            {/* User */}
            <div style={{ display:'flex', alignItems:'center', gap:8, cursor:'pointer', padding:'5px 10px', background:'rgba(14,165,233,0.06)', border:'1px solid rgba(14,165,233,0.16)', borderRadius:8 }}>
              <div style={{ width:26, height:26, background:'linear-gradient(135deg,#0EA5E9,#22C55E)', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, fontWeight:900, color:'#fff' }}>
                {user.name?.charAt(0)?.toUpperCase() || 'A'}
              </div>
              <span style={{ fontSize:12, fontWeight:600, color:'#D0E4F7' }}>{user.name}</span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <div style={{ flex:1, overflowY:'auto', padding:'22px', position:'relative' }}>
          {children}
          <AiAssistantWidget />
        </div>
      </div>
    </div>
  );
}

