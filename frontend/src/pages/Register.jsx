import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { Link } from 'react-router-dom'

const roleOptions = [
  { value: 'FLEET_MANAGER', label: 'Fleet Manager', icon: '🚛', desc: 'Full dashboard, vehicles, trips', color: '#0EA5E9' },
  { value: 'DRIVER', label: 'Driver', icon: '🚗', desc: 'Trip tracking, route navigation', color: '#22C55E' },
  { value: 'SAFETY_OFFICER', label: 'Safety Officer', icon: '🛡️', desc: 'Safety logs, incident reports', color: '#F59E0B' },
  { value: 'FINANCIAL_ANALYST', label: 'Financial Analyst', icon: '📊', desc: 'Expense reports, revenue analytics', color: '#8B5CF6' },
]


export default function Register() {
  const { register } = useAuth()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('FLEET_MANAGER')
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState(1)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await register(name, email, password, role)
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Try again.')
    } finally {
      setLoading(false)
    }
  }

  const selectedRole = roleOptions.find(r => r.value === role)

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');

        @keyframes gradientShift {
          0%, 100% { background-position: 0% 50%; }
          50%       { background-position: 100% 50%; }
        }
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes floatUp {
          0%   { transform: translateY(0) scale(1); opacity: 0.3; }
          50%  { transform: translateY(-30px) scale(1.05); opacity: 0.6; }
          100% { transform: translateY(0) scale(1); opacity: 0.3; }
        }
        @keyframes spinSlow {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.3; }
        }
        @keyframes shimmer {
          0%   { background-position: -400px 0; }
          100% { background-position: 400px 0; }
        }

        .reg-input {
          width: 100%;
          background: rgba(255,255,255,0.04);
          border: 1.5px solid rgba(255,255,255,0.08);
          border-radius: 12px;
          padding: 13px 16px;
          color: #fff;
          font-size: 14px;
          font-family: 'Inter', sans-serif;
          outline: none;
          transition: all 0.25s ease;
          box-sizing: border-box;
        }
        .reg-input:focus {
          border-color: #8b5cf6;
          background: rgba(139,92,246,0.08);
          box-shadow: 0 0 0 3px rgba(139,92,246,0.15);
        }
        .reg-input::placeholder { color: rgba(255,255,255,0.22); }
        .reg-select {
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='%23888'%3E%3Cpath d='M7 10l5 5 5-5H7z'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 14px center;
        }

        .reg-btn {
          width: 100%;
          padding: 14px;
          border: none;
          border-radius: 12px;
          font-size: 15px;
          font-weight: 700;
          font-family: 'Inter', sans-serif;
          cursor: pointer;
          background: linear-gradient(135deg, #8b5cf6, #6366f1, #8b5cf6);
          background-size: 200% 200%;
          animation: gradientShift 3s ease infinite;
          color: #fff;
          letter-spacing: 0.03em;
          transition: transform 0.15s ease, opacity 0.15s ease;
          position: relative;
          overflow: hidden;
        }
        .reg-btn:hover:not(:disabled) { transform: translateY(-1px); }
        .reg-btn:disabled { opacity: 0.6; cursor: not-allowed; }
        .reg-btn::after {
          content: '';
          position: absolute; top: -50%; left: -75%;
          width: 50%; height: 200%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent);
          transform: skewX(-20deg);
          animation: shimmer 2.5s infinite;
        }

        .role-pill {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 9px 12px;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.2s ease;
          border: 1.5px solid rgba(255,255,255,0.06);
          background: rgba(255,255,255,0.02);
        }
        .role-pill.active {
          border-color: rgba(139,92,246,0.5);
          background: rgba(139,92,246,0.12);
        }
        .role-pill:hover:not(.active) {
          background: rgba(255,255,255,0.05);
          border-color: rgba(255,255,255,0.12);
        }
      `}</style>

      <div style={{
        minHeight: '100vh', width: '100vw',
        background: 'linear-gradient(135deg, #060614 0%, #0d0b2a 40%, #13102a 70%, #060614 100%)',
        display: 'flex', overflow: 'hidden', position: 'relative',
        fontFamily: "'Inter', sans-serif",
      }}>

        {/* Background particles */}
        {[
          { w: 280, h: 280, top: '5%', left: '5%', d: '0s', dur: '10s', c: '#6366f1' },
          { w: 180, h: 180, top: '70%', left: '10%', d: '2s', dur: '8s', c: '#8b5cf6' },
          { w: 350, h: 350, top: '15%', right: '8%', d: '1s', dur: '12s', c: '#8b5cf6' },
          { w: 120, h: 120, bottom: '8%', right: '25%', d: '3s', dur: '9s', c: '#22d3ee' },
        ].map((p, i) => (
          <div key={i} style={{
            position: 'absolute', borderRadius: '50%', pointerEvents: 'none',
            width: p.w, height: p.h, top: p.top, left: p.left, right: p.right, bottom: p.bottom,
            background: `radial-gradient(circle, ${p.c}40 0%, transparent 70%)`,
            animation: `floatUp ${p.dur} ${p.d} infinite ease-in-out`,
          }} />
        ))}

        {/* Grid lines */}
        {[
          { top: '12%', rot: -3, c: '#8b5cf6' },
          { top: '40%', rot: 2, c: '#6366f1' },
          { top: '75%', rot: -2, c: '#22d3ee' },
        ].map((g, i) => (
          <div key={i} style={{
            position: 'absolute', left: '-10%', right: '-10%', height: 1, top: g.top,
            transform: `rotate(${g.rot}deg)`,
            background: `linear-gradient(90deg, transparent, ${g.c}25 30%, ${g.c}25 70%, transparent)`,
          }} />
        ))}

        {/* ── LEFT PANEL — Features showcase ── */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '48px 56px', position: 'relative' }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 42, height: 42, background: 'linear-gradient(135deg, #8b5cf6, #6366f1)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, boxShadow: '0 4px 20px rgba(139,92,246,0.4)' }}>🚛</div>
            <div>
              <div style={{ fontSize: 18, fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>TransitOps</div>
              <div style={{ fontSize: 10, color: '#8b5cf6', fontWeight: 600, letterSpacing: '0.15em' }}>ENTERPRISE FLEET</div>
            </div>
          </div>

          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', animation: 'fadeSlideIn 0.8s ease both' }}>
            <h1 style={{ fontSize: 40, fontWeight: 900, color: '#fff', lineHeight: 1.1, letterSpacing: '-0.03em', margin: '0 0 20px' }}>
              Join the<br />
              <span style={{ background: 'linear-gradient(135deg, #8b5cf6, #22d3ee)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Fleet Revolution</span>
            </h1>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', lineHeight: 1.7, marginBottom: 40, maxWidth: 380 }}>
              Create your enterprise account and start managing your fleet with AI-powered insights.
            </p>

            {/* Feature checklist */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {[
                { icon: '🗺️', title: 'Real-time GPS Tracking', desc: 'Monitor every vehicle live across routes' },
                { icon: '🤖', title: 'AI Route Optimization', desc: '96% efficiency with predictive algorithms' },
                { icon: '📊', title: 'Advanced Analytics', desc: 'Fuel, cost, performance — all at a glance' },
                { icon: '🔔', title: 'Smart Alerts', desc: 'Geofencing, anomaly & maintenance alerts' },
              ].map(f => (
                <div key={f.title} style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                  <div style={{ width: 38, height: 38, borderRadius: 10, background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17, flexShrink: 0 }}>{f.icon}</div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#e5e7eb', marginBottom: 2 }}>{f.title}</div>
                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>{f.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom */}
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.18)' }}>
            © 2024 TransitOps · Enterprise Fleet Intelligence
          </div>
        </div>

        {/* ── RIGHT PANEL — Register Form ── */}
        <div style={{
          width: 480, display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '36px 48px',
          background: 'rgba(255,255,255,0.02)',
          borderLeft: '1px solid rgba(255,255,255,0.05)',
          backdropFilter: 'blur(20px)',
          animation: 'fadeSlideIn 0.6s ease both',
          overflowY: 'auto',
        }}>
          <div style={{ width: '100%' }}>
            {/* Header */}
            <div style={{ marginBottom: 28 }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.3)', borderRadius: 20, padding: '4px 12px', marginBottom: 18 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#4ade80', display: 'inline-block', animation: 'blink 2s infinite' }} />
                <span style={{ fontSize: 10, color: '#c4b5fd', fontWeight: 600, letterSpacing: '0.08em' }}>FREE 14-DAY TRIAL</span>
              </div>
              <h2 style={{ fontSize: 26, fontWeight: 900, color: '#fff', margin: '0 0 6px', letterSpacing: '-0.02em' }}>Create your account</h2>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.38)', margin: 0 }}>Join 12K+ fleet operators on TransitOps</p>
            </div>

            {/* Error */}
            {error && (
              <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 10, padding: '10px 14px', marginBottom: 18, fontSize: 12, color: '#fca5a5', display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 16 }}>⚠️</span> {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* Name */}
              <div style={{ marginBottom: 14 }}>
                <label style={{ display: 'block', fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.38)', marginBottom: 7, letterSpacing: '0.08em' }}>FULL NAME</label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 14, opacity: 0.4 }}>👤</span>
                  <input type="text" required value={name} onChange={e => setName(e.target.value)} className="reg-input" placeholder="John Doe" style={{ paddingLeft: 42 }} />
                </div>
              </div>

              {/* Email */}
              <div style={{ marginBottom: 14 }}>
                <label style={{ display: 'block', fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.38)', marginBottom: 7, letterSpacing: '0.08em' }}>EMAIL ADDRESS</label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 14, opacity: 0.4 }}>📧</span>
                  <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="reg-input" placeholder="you@company.com" style={{ paddingLeft: 42 }} />
                </div>
              </div>

              {/* Password */}
              <div style={{ marginBottom: 18 }}>
                <label style={{ display: 'block', fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.38)', marginBottom: 7, letterSpacing: '0.08em' }}>PASSWORD</label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 14, opacity: 0.4 }}>🔒</span>
                  <input type={showPass ? 'text' : 'password'} required value={password} onChange={e => setPassword(e.target.value)} className="reg-input" placeholder="Minimum 8 characters" style={{ paddingLeft: 42, paddingRight: 44 }} />
                  <button type="button" onClick={() => setShowPass(v => !v)} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, opacity: 0.5 }}>
                    {showPass ? '🙈' : '👁️'}
                  </button>
                </div>
                {/* Strength dots */}
                {password && (
                  <div style={{ display: 'flex', gap: 4, marginTop: 8 }}>
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} style={{ flex: 1, height: 3, borderRadius: 3, background: password.length >= i * 3 ? (password.length >= 10 ? '#4ade80' : '#f59e0b') : 'rgba(255,255,255,0.08)', transition: 'all 0.3s ease' }} />
                    ))}
                  </div>
                )}
              </div>

              {/* Role selector — card style */}
              <div style={{ marginBottom: 22 }}>
                <label style={{ display: 'block', fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.38)', marginBottom: 10, letterSpacing: '0.08em' }}>SELECT YOUR ROLE</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  {roleOptions.map(r => (
                    <div
                      key={r.value}
                      className={`role-pill ${role === r.value ? 'active' : ''}`}
                      onClick={() => setRole(r.value)}
                    >
                      <span style={{ fontSize: 18 }}>{r.icon}</span>
                      <div>
                        <div style={{ fontSize: 11, fontWeight: 700, color: role === r.value ? '#c4b5fd' : '#d1d5db' }}>{r.label}</div>
                        <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.28)', marginTop: 1, lineHeight: 1.3 }}>{r.desc.slice(0, 30)}…</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Terms */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 20 }}>
                <input type="checkbox" id="terms" required style={{ accentColor: '#8b5cf6', width: 14, height: 14, marginTop: 1, flexShrink: 0 }} />
                <label htmlFor="terms" style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', lineHeight: 1.5 }}>
                  I agree to the{' '}
                  <span style={{ color: '#a78bfa', cursor: 'pointer' }}>Terms of Service</span>
                  {' '}and{' '}
                  <span style={{ color: '#a78bfa', cursor: 'pointer' }}>Privacy Policy</span>
                </label>
              </div>

              {/* Submit */}
              <button type="submit" disabled={loading} className="reg-btn" style={{ marginBottom: 18 }}>
                {loading ? (
                  <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
                    <span style={{ display: 'inline-block', width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spinSlow 0.7s linear infinite' }} />
                    Creating account...
                  </span>
                ) : `Join as ${selectedRole?.label} →`}
              </button>

              <div style={{ textAlign: 'center' }}>
                <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)' }}>Already have an account? </span>
                <Link to="/login" style={{ fontSize: 13, color: '#a78bfa', fontWeight: 700, textDecoration: 'none' }}>Sign in →</Link>
              </div>
            </form>

            {/* Security badge */}
            <div style={{ marginTop: 24, padding: '12px 16px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: 10, display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 18, opacity: 0.5 }}>🔐</span>
              <div>
                <div style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.06em' }}>SECURE REGISTRATION</div>
                <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.18)', marginTop: 1 }}>BCrypt hashing · No credit card required · Cancel anytime</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
