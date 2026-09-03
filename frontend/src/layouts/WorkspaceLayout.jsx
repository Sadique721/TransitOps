import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AiAssistantWidget from '../components/AiAssistantWidget';
import UserProfileModal from '../components/UserProfileModal';

const NAV_CATEGORIES = {
  ADMIN: [
    {
      category: 'OPERATIONS',
      items: [
        { name: 'Metric Flow', path: '/dashboard', icon: '📊', color: '#0EA5E9' },
        { name: 'Live Ops Radar', path: '/live-ops', icon: '🗺️', color: '#22C55E' },
      ],
    },
    {
      category: 'FLEET REGISTRY',
      items: [
        { name: 'Vehicles', path: '/vehicles', icon: '🚚', color: '#06B6D4' },
        { name: 'Drivers', path: '/drivers', icon: '👤', color: '#3B82F6' },
        { name: 'Trips Dispatcher', path: '/trips', icon: '🛣️', color: '#F59E0B' },
        { name: 'Maintenance', path: '/maintenance', icon: '🔧', color: '#EF4444' },
      ],
    },
    {
      category: 'LOGISTICS & TRACKING',
      items: [
        { name: 'Shipment Track', path: '/shipment-track', icon: '📦', color: '#EC4899' },
        { name: 'GPS Tracking', path: '/tracking', icon: '📍', color: '#10B981' },
        { name: 'Rent Co. Fleet', path: '/rent-co', icon: '🚗', color: '#F97316' },
      ],
    },
    {
      category: 'INTELLIGENCE & REPORTS',
      items: [
        { name: 'AcmeCorp Financials', path: '/acme-corp', icon: '🏢', color: '#8B5CF6' },
        { name: 'Bento Grid', path: '/bento-grid', icon: '🔮', color: '#A855F7' },
        { name: 'Task Automate', path: '/task-automate', icon: '🤖', color: '#06B6D4' },
      ],
    },
  ],
  FLEET_MANAGER: [
    {
      category: 'OPERATIONS',
      items: [
        { name: 'Metric Flow', path: '/dashboard', icon: '📊', color: '#0EA5E9' },
        { name: 'Live Ops Radar', path: '/live-ops', icon: '🗺️', color: '#22C55E' },
      ],
    },
    {
      category: 'FLEET REGISTRY',
      items: [
        { name: 'Vehicles', path: '/vehicles', icon: '🚚', color: '#06B6D4' },
        { name: 'Drivers', path: '/drivers', icon: '👤', color: '#3B82F6' },
        { name: 'Trips Dispatcher', path: '/trips', icon: '🛣️', color: '#F59E0B' },
        { name: 'Maintenance', path: '/maintenance', icon: '🔧', color: '#EF4444' },
      ],
    },
    {
      category: 'LOGISTICS & TRACKING',
      items: [
        { name: 'Shipment Track', path: '/shipment-track', icon: '📦', color: '#EC4899' },
        { name: 'GPS Tracking', path: '/tracking', icon: '📍', color: '#10B981' },
        { name: 'Rent Co. Fleet', path: '/rent-co', icon: '🚗', color: '#F97316' },
      ],
    },
    {
      category: 'INTELLIGENCE & REPORTS',
      items: [
        { name: 'AcmeCorp Financials', path: '/acme-corp', icon: '🏢', color: '#8B5CF6' },
        { name: 'Bento Grid', path: '/bento-grid', icon: '🔮', color: '#A855F7' },
        { name: 'Task Automate', path: '/task-automate', icon: '🤖', color: '#06B6D4' },
      ],
    },
  ],
  DRIVER: [
    {
      category: 'DRIVER CONSOLE',
      items: [
        { name: 'My Assigned Trips', path: '/trips', icon: '🛣️', color: '#F59E0B' },
        { name: 'Shipment Track', path: '/shipment-track', icon: '📦', color: '#EC4899' },
        { name: 'Live GPS Route', path: '/tracking', icon: '📍', color: '#10B981' },
      ],
    },
  ],
  SAFETY_OFFICER: [
    {
      category: 'SAFETY & COMPLIANCE',
      items: [
        { name: 'Vehicles & Diagnostics', path: '/vehicles', icon: '🚚', color: '#06B6D4' },
        { name: 'Driver Safety Scores', path: '/drivers', icon: '👤', color: '#3B82F6' },
        { name: 'Maintenance Records', path: '/maintenance', icon: '🔧', color: '#EF4444' },
        { name: 'Live Ops Radar', path: '/live-ops', icon: '🗺️', color: '#22C55E' },
      ],
    },
  ],
  FINANCIAL_ANALYST: [
    {
      category: 'FINANCIAL ANALYTICS',
      items: [
        { name: 'Metric Flow Dashboard', path: '/dashboard', icon: '📊', color: '#0EA5E9' },
        { name: 'AcmeCorp Financials', path: '/acme-corp', icon: '🏢', color: '#8B5CF6' },
        { name: 'Rent Co Fleet Costing', path: '/rent-co', icon: '🚗', color: '#F97316' },
        { name: 'Trips Revenue & ROI', path: '/trips', icon: '🛣️', color: '#F59E0B' },
      ],
    },
  ],
};

const ROLE_BADGES = {
  ADMIN: { label: 'SUPER ADMIN', bg: 'rgba(239, 68, 68, 0.15)', text: '#F87171', border: 'rgba(239, 68, 68, 0.3)' },
  FLEET_MANAGER: { label: 'FLEET MANAGER', bg: 'rgba(14, 165, 233, 0.15)', text: '#38BDF8', border: 'rgba(14, 165, 233, 0.3)' },
  DRIVER: { label: 'OPERATIONS DRIVER', bg: 'rgba(34, 197, 94, 0.15)', text: '#4ADE80', border: 'rgba(34, 197, 94, 0.3)' },
  SAFETY_OFFICER: { label: 'SAFETY OFFICER', bg: 'rgba(245, 158, 11, 0.15)', text: '#FBBF24', border: 'rgba(245, 158, 11, 0.3)' },
  FINANCIAL_ANALYST: { label: 'FINANCIAL ANALYST', bg: 'rgba(139, 92, 246, 0.15)', text: '#C084FC', border: 'rgba(139, 92, 246, 0.3)' },
};

export default function WorkspaceLayout({ children }) {
  const [open, setOpen] = useState(true);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth() || {};

  let user = { name: 'Admin', role: 'FLEET_MANAGER' };
  try {
    const s = localStorage.getItem('user');
    if (s) user = JSON.parse(s);
  } catch {}

  const role = user?.role || 'FLEET_MANAGER';
  const roleBadge = ROLE_BADGES[role] || ROLE_BADGES.FLEET_MANAGER;
  const menuCategories = NAV_CATEGORIES[role] || NAV_CATEGORIES.FLEET_MANAGER;

  // Auto-close mobile drawer on route change
  useEffect(() => {
    setMobileDrawerOpen(false);
  }, [location.pathname]);

  const renderNavItems = (isMobile = false) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {menuCategories.map((cat, idx) => (
        <div key={cat.category || idx}>
          {(open || isMobile) && (
            <div
              style={{
                fontSize: 9,
                fontWeight: 800,
                color: 'rgba(125,211,252,0.4)',
                letterSpacing: '0.12em',
                padding: '0 12px 6px',
                textTransform: 'uppercase',
              }}
            >
              {cat.category}
            </div>
          )}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {cat.items.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <button
                  key={item.path}
                  onClick={() => {
                    navigate(item.path);
                    if (isMobile) setMobileDrawerOpen(false);
                  }}
                  title={!open && !isMobile ? item.name : undefined}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: open || isMobile ? 10 : 0,
                    justifyContent: open || isMobile ? 'flex-start' : 'center',
                    padding: open || isMobile ? '9px 12px' : '9px 0',
                    border: 'none',
                    cursor: 'pointer',
                    borderRadius: 9,
                    background: isActive ? `${item.color}20` : 'transparent',
                    color: isActive ? item.color : 'rgba(176,204,224,0.6)',
                    fontWeight: isActive ? 700 : 500,
                    fontSize: 12.5,
                    textAlign: 'left',
                    borderLeft: isActive ? `3px solid ${item.color}` : '3px solid transparent',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = `${item.color}12`;
                      e.currentTarget.style.color = item.color;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.color = 'rgba(176,204,224,0.6)';
                    }
                  }}
                >
                  <span style={{ fontSize: 16, flexShrink: 0 }}>{item.icon}</span>
                  {(open || isMobile) && (
                    <span style={{ overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', flex: 1 }}>
                      {item.name}
                    </span>
                  )}
                  {(open || isMobile) && isActive && (
                    <span
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: '50%',
                        background: item.color,
                        boxShadow: `0 0 8px ${item.color}`,
                        flexShrink: 0,
                      }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div
      style={{
        display: 'flex',
        height: '100vh',
        overflow: 'hidden',
        background: '#050A14',
        color: '#D0E4F7',
        fontFamily: "'Inter','Plus Jakarta Sans',sans-serif",
      }}
    >
      {/* ── MOBILE BACKDROP OVERLAY ── */}
      {mobileDrawerOpen && (
        <div
          onClick={() => setMobileDrawerOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(2, 6, 17, 0.75)',
            backdropFilter: 'blur(4px)',
            zIndex: 90,
          }}
        />
      )}

      {/* ── MOBILE SLIDE-OUT DRAWER ── */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          bottom: 0,
          width: 280,
          background: 'linear-gradient(180deg,#080F1E 0%,#0D1628 100%)',
          borderRight: '1px solid rgba(14,165,233,0.2)',
          zIndex: 100,
          display: 'flex',
          flexDirection: 'column',
          transform: mobileDrawerOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.3s cubic-bezier(.4,0,.2,1)',
          boxShadow: mobileDrawerOpen ? '0 0 30px rgba(0,0,0,0.8)' : 'none',
        }}
      >
        {/* Mobile Header */}
        <div
          style={{
            height: 64,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 16px',
            borderBottom: '1px solid rgba(14,165,233,0.1)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div
              style={{
                width: 36,
                height: 36,
                background: 'linear-gradient(135deg,#EF4444,#F59E0B)',
                borderRadius: 10,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 18,
              }}
            >
              🚛
            </div>
            <div>
              <div style={{ fontWeight: 900, fontSize: 14, color: '#EFF6FF' }}>TransitOps</div>
              <div style={{ fontSize: 8, color: 'rgba(125,211,252,0.6)', fontWeight: 700, letterSpacing: '0.14em' }}>
                ENTERPRISE v2
              </div>
            </div>
          </div>
          <button
            onClick={() => setMobileDrawerOpen(false)}
            style={{
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 8,
              width: 32,
              height: 32,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#D0E4F7',
              fontSize: 14,
            }}
          >
            ✕
          </button>
        </div>

        {/* Mobile Nav */}
        <nav style={{ flex: 1, padding: '16px 12px', overflowY: 'auto' }}>{renderNavItems(true)}</nav>

        {/* Mobile Footer / User */}
        <div style={{ padding: '12px 14px 18px', borderTop: '1px solid rgba(14,165,233,0.1)' }}>
          <div
            onClick={() => {
              setProfileOpen(true);
              setMobileDrawerOpen(false);
            }}
            title="View User Profile & Role Credentials"
            style={{
              background: 'rgba(14,165,233,0.06)',
              border: '1px solid rgba(14,165,233,0.15)',
              borderRadius: 10,
              padding: '10px 12px',
              marginBottom: 10,
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                background: roleBadge.bg,
                border: `1px solid ${roleBadge.border}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: 12,
                color: roleBadge.text,
              }}
            >
              {user?.name ? user.name[0].toUpperCase() : 'U'}
            </div>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#D0E4F7', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {user.name || 'User'}
              </div>
              <div
                style={{
                  fontSize: 9,
                  fontWeight: 800,
                  color: roleBadge.text,
                  letterSpacing: '0.05em',
                  marginTop: 2,
                }}
              >
                {roleBadge.label}
              </div>
            </div>
          </div>
          <button
            onClick={() => {
              if (logout) logout();
              navigate('/login');
            }}
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid rgba(239,68,68,0.3)',
              borderRadius: 8,
              background: 'rgba(239,68,68,0.08)',
              color: '#EF4444',
              fontSize: 12,
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
            }}
          >
            🚪 Sign out
          </button>
        </div>
      </div>

      {/* ── DESKTOP PERSISTENT SIDEBAR ── */}
      <div
        className="hidden lg:flex"
        style={{
          width: open ? 240 : 64,
          transition: 'width 0.3s cubic-bezier(.4,0,.2,1)',
          background: 'linear-gradient(180deg,#080F1E 0%,#0D1628 100%)',
          borderRight: '1px solid rgba(14,165,233,0.12)',
          flexDirection: 'column',
          flexShrink: 0,
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        {/* Top glow */}
        <div
          style={{
            position: 'absolute',
            top: -40,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 180,
            height: 160,
            borderRadius: '50%',
            background: 'radial-gradient(circle,rgba(14,165,233,0.15) 0%,transparent 70%)',
            pointerEvents: 'none',
          }}
        />

        {/* Logo Header */}
        <div
          style={{
            height: 62,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 14px',
            borderBottom: '1px solid rgba(14,165,233,0.08)',
            flexShrink: 0,
          }}
        >
          {open ? (
            <div
              style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', flex: 1 }}
              onClick={() => navigate(role === 'DRIVER' ? '/trips' : '/dashboard')}
            >
              <div
                style={{
                  width: 34,
                  height: 34,
                  background: 'linear-gradient(135deg,#EF4444,#F59E0B)',
                  borderRadius: 10,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 17,
                  boxShadow: '0 0 14px rgba(239,68,68,0.4)',
                  flexShrink: 0,
                }}
              >
                🚛
              </div>
              <div>
                <div style={{ fontWeight: 900, fontSize: 13.5, color: '#EFF6FF', letterSpacing: '-0.02em' }}>
                  TransitOps
                </div>
                <div style={{ fontSize: 7.5, color: 'rgba(125,211,252,0.6)', fontWeight: 700, letterSpacing: '0.12em' }}>
                  ENTERPRISE v2
                </div>
              </div>
            </div>
          ) : (
            <div
              style={{
                width: 34,
                height: 34,
                background: 'linear-gradient(135deg,#EF4444,#F59E0B)',
                borderRadius: 10,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 17,
                cursor: 'pointer',
                margin: '0 auto',
              }}
              onClick={() => navigate(role === 'DRIVER' ? '/trips' : '/dashboard')}
            >
              🚛
            </div>
          )}
          <button
            onClick={() => setOpen(!open)}
            style={{
              background: 'rgba(14,165,233,0.08)',
              border: '1px solid rgba(14,165,233,0.18)',
              borderRadius: 7,
              width: 26,
              height: 26,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#7DD3FC',
              fontSize: 12,
              flexShrink: 0,
              marginLeft: open ? 4 : 0,
            }}
          >
            {open ? '◀' : '▶'}
          </button>
        </div>

        {/* Desktop Nav */}
        <nav style={{ flex: 1, padding: '12px 8px', overflowY: 'auto', overflowX: 'hidden' }}>
          {renderNavItems(false)}
        </nav>

        {/* User + Sign out */}
        <div style={{ padding: '8px 8px 14px', borderTop: '1px solid rgba(14,165,233,0.08)', flexShrink: 0 }}>
          {open && (
            <div
              onClick={() => setProfileOpen(true)}
              title="View User Profile & Role Credentials"
              style={{
                background: 'rgba(14,165,233,0.06)',
                border: '1px solid rgba(14,165,233,0.14)',
                borderRadius: 10,
                padding: '8px 10px',
                marginBottom: 8,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                  background: roleBadge.bg,
                  border: `1px solid ${roleBadge.border}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: 11,
                  color: roleBadge.text,
                  flexShrink: 0,
                }}
              >
                {user?.name ? user.name[0].toUpperCase() : 'U'}
              </div>
              <div style={{ overflow: 'hidden' }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#D0E4F7', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {user.name || 'User'}
                </div>
                <div
                  style={{
                    fontSize: 8.5,
                    color: roleBadge.text,
                    fontWeight: 700,
                    letterSpacing: '0.04em',
                    marginTop: 1,
                  }}
                >
                  {roleBadge.label}
                </div>
              </div>
            </div>
          )}
          <button
            onClick={() => {
              if (logout) logout();
              navigate('/login');
            }}
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid rgba(239,68,68,0.2)',
              borderRadius: 8,
              background: 'rgba(239,68,68,0.06)',
              color: '#EF4444',
              fontSize: 11,
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
            }}
          >
            🚪 {open ? 'Sign out' : ''}
          </button>
        </div>
      </div>

      {/* ── MAIN CONTENT AREA ── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>
        {/* Top Header */}
        <header
          style={{
            height: 62,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 16px',
            background: 'linear-gradient(90deg,rgba(8,15,30,0.98),rgba(13,22,40,0.98))',
            borderBottom: '1px solid rgba(14,165,233,0.1)',
            backdropFilter: 'blur(10px)',
            flexShrink: 0,
            zIndex: 20,
          }}
        >
          {/* Left section: Hamburger (Mobile) + Live Status */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button
              onClick={() => setMobileDrawerOpen(true)}
              className="lg:hidden"
              style={{
                background: 'rgba(14,165,233,0.08)',
                border: '1px solid rgba(14,165,233,0.2)',
                borderRadius: 8,
                width: 36,
                height: 36,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#7DD3FC',
                fontSize: 18,
              }}
            >
              ☰
            </button>

            {/* Status indicators */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              {[
                { dot: '#22C55E', label: 'Fleet Active', val: 'On Route' },
                { dot: '#F59E0B', label: 'Idle Standby', val: 'Idle' },
                { dot: '#EF4444', label: 'Live Alerts', val: 'Security' },
              ].map((s) => (
                <div key={s.label} className="hidden sm:flex" style={{ alignItems: 'center', gap: 6 }}>
                  <span
                    style={{
                      width: 7,
                      height: 7,
                      borderRadius: '50%',
                      background: s.dot,
                      display: 'inline-block',
                      boxShadow: `0 0 6px ${s.dot}`,
                    }}
                  />
                  <span style={{ fontSize: 11, color: `${s.dot}EE`, fontWeight: 600 }}>{s.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right section: Search + Notifications + Role Badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {/* Search (Desktop) */}
            <div className="hidden md:block" style={{ position: 'relative' }}>
              <span
                style={{
                  position: 'absolute',
                  left: 10,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'rgba(125,211,252,0.4)',
                  fontSize: 13,
                }}
              >
                🔍
              </span>
              <input
                placeholder="Search fleet, trips, drivers..."
                style={{
                  background: 'rgba(14,165,233,0.05)',
                  border: '1px solid rgba(14,165,233,0.14)',
                  borderRadius: 8,
                  padding: '6px 12px 6px 30px',
                  fontSize: 12,
                  color: '#D0E4F7',
                  outline: 'none',
                  width: 210,
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'rgba(14,165,233,0.4)';
                  e.target.style.boxShadow = '0 0 0 3px rgba(14,165,233,0.08)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(14,165,233,0.14)';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>

            {/* Alert Bell */}
            <div
              onClick={() => navigate(role === 'DRIVER' ? '/trips' : '/dashboard')}
              style={{ position: 'relative', cursor: 'pointer' }}
            >
              <div
                style={{
                  width: 34,
                  height: 34,
                  background: 'rgba(239,68,68,0.08)',
                  border: '1px solid rgba(239,68,68,0.2)',
                  borderRadius: 8,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 15,
                }}
              >
                🔔
              </div>
              <div
                style={{
                  position: 'absolute',
                  top: 3,
                  right: 3,
                  width: 7,
                  height: 7,
                  background: '#EF4444',
                  borderRadius: '50%',
                  boxShadow: '0 0 6px #EF4444',
                }}
              />
            </div>

            {/* User Role Pill */}
            <div
              onClick={() => setProfileOpen(true)}
              title="Click to view full role profile & credentials"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '4px 10px',
                background: roleBadge.bg,
                border: `1px solid ${roleBadge.border}`,
                borderRadius: 8,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              <div
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: '50%',
                  background: roleBadge.text,
                  color: '#050A14',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 10,
                  fontWeight: 900,
                }}
              >
                {user?.name ? user.name[0].toUpperCase() : 'U'}
              </div>
              <div className="hidden sm:block" style={{ textAlign: 'left' }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#EFF6FF', lineHeight: 1.1 }}>
                  {user.name || 'User'}
                </div>
                <div style={{ fontSize: 8.5, color: roleBadge.text, fontWeight: 800, letterSpacing: '0.04em' }}>
                  {roleBadge.label}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content Scroll View */}
        <main
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '16px',
            position: 'relative',
            maxWidth: '100%',
          }}
        >
          {children}
          {(role === 'ADMIN' || role === 'FLEET_MANAGER') && <AiAssistantWidget />}
        </main>
      </div>

      {/* ── ROLE-BASED USER PROFILE MODAL ── */}
      <UserProfileModal isOpen={profileOpen} onClose={() => setProfileOpen(false)} />
    </div>
  );
}
