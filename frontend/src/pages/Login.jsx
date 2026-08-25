import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { Link } from 'react-router-dom'

const roles = [
  { role: 'Fleet Manager', email: 'entitykart@gmail.com', password: 'Amin@123', icon: '🚛', color: '#0EA5E9', label: 'Full Dashboard Access' },
  { role: 'Driver', email: 'driver@transitops.com', password: 'Amin@123', icon: '🚗', color: '#22C55E', label: 'Trip & Route Access' },
]

const stats = [
  { val: '32+', label: 'Live Vehicles', color: '#0EA5E9', icon: '🚛' },
  { val: '99.2%', label: 'Uptime SLA', color: '#22C55E', icon: '✅' },
  { val: '18', label: 'Active Alerts', color: '#EF4444', icon: '🚨' },
  { val: '₹4.8L', label: 'Today Revenue', color: '#F59E0B', icon: '💰' },
]

export default function Login() {
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPass, setShowPass] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials. Try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Plus+Jakarta+Sans:wght@700;800;900&display=swap');

        @keyframes fadeSlideIn {
          from { opacity:0; transform:translateY(18px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes gradShift {
          0%,100% { background-position:0% 50%; }
          50%      { background-position:100% 50%; }
        }
        @keyframes vehicleMove {
          0%   { transform: translateX(-100px); opacity:0; }
          10%  { opacity:1; }
          90%  { opacity:1; }
          100% { transform: translateX(calc(100vw + 100px)); opacity:0; }
        }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.2} }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes shimmerBtn {
          0%   { left:-75%; }
          100% { left:125%; }
        }
        @keyframes pulse-ring {
          0%   { transform:scale(1); opacity:0.6; }
          100% { transform:scale(2.5); opacity:0; }
        }

        .login-input {
          width:100%; background:rgba(255,255,255,0.05);
          border:1.5px solid rgba(14,165,233,0.2); border-radius:12px;
          padding:13px 16px; color:#D0E4F7; font-size:14px;
          font-family:'Inter',sans-serif; outline:none;
          transition:all 0.25s ease; box-sizing:border-box;
        }
        .login-input:focus {
          border-color:#0EA5E9;
          background:rgba(14,165,233,0.08);
          box-shadow:0 0 0 3px rgba(14,165,233,0.15);
        }
        .login-input::placeholder { color:rgba(125,211,252,0.28); }

        .login-btn {
          width:100%; padding:14px; border:none; border-radius:12px;
          font-size:15px; font-weight:800; font-family:'Inter',sans-serif;
          cursor:pointer; position:relative; overflow:hidden;
          background: linear-gradient(135deg,#0EA5E9,#0369A1,#0EA5E9);
          background-size:200% 200%; animation:gradShift 3s ease infinite;
          color:#fff; letter-spacing:0.03em;
          box-shadow:0 4px 24px rgba(14,165,233,0.45);
          transition:transform 0.15s ease, box-shadow 0.15s ease;
        }
        .login-btn:hover:not(:disabled) {
          transform:translateY(-2px);
          box-shadow:0 8px 32px rgba(14,165,233,0.6);
        }
        .login-btn:disabled { opacity:0.55; cursor:not-allowed; }
        .login-btn::after {
          content:''; position:absolute; top:0; left:-75%; width:50%; height:100%;
          background:linear-gradient(90deg,transparent,rgba(255,255,255,0.22),transparent);
          transform:skewX(-20deg); animation:shimmerBtn 2.5s infinite;
        }

        .role-card {
          cursor:pointer; border-radius:12px; padding:12px 14px;
          border:1.5px solid rgba(255,255,255,0.07);
          background:rgba(255,255,255,0.03);
          transition:all 0.22s ease; display:flex; align-items:center; gap:12px;
        }
        .role-card:hover { transform:translateY(-2px); }
      `}</style>

      <div style={{
        minHeight:'100vh', width:'100vw', display:'flex', overflow:'hidden',
        fontFamily:"'Inter','Plus Jakarta Sans',sans-serif", position:'relative',
      }}>

        {/* ══════════════════════════════════
            LEFT HALF — HQ Transport Image bg
        ══════════════════════════════════ */}
        <div style={{
          flex:1, position:'relative', overflow:'hidden',
          background:'#050A14',
        }}>
          {/* Full-bleed hero image */}
          <img
            src="/transport_hero.jpg"
            alt="TransitOps Fleet"
            style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover', opacity:0.75 }}
          />
          {/* Dark overlay gradient */}
          <div style={{
            position:'absolute', inset:0,
            background:'linear-gradient(135deg, rgba(5,10,20,0.55) 0%, rgba(5,10,20,0.3) 50%, rgba(5,10,20,0.75) 100%)',
          }} />
          {/* Right fade into form panel */}
          <div style={{
            position:'absolute', top:0, right:0, bottom:0, width:200,
            background:'linear-gradient(90deg, transparent, #080F1E)',
          }} />

          {/* Overlay content */}
          <div style={{ position:'relative', zIndex:10, height:'100%', display:'flex', flexDirection:'column', justifyContent:'space-between', padding:'44px 48px' }}>
            {/* Logo */}
            <div style={{ display:'flex', alignItems:'center', gap:12 }}>
              <div style={{
                width:46, height:46, borderRadius:13, display:'flex', alignItems:'center', justifyContent:'center',
                background:'linear-gradient(135deg,#EF4444,#F59E0B)',
                boxShadow:'0 4px 20px rgba(239,68,68,0.5)', fontSize:22,
              }}>🚛</div>
              <div>
                <div style={{ fontSize:20, fontWeight:900, color:'#fff', letterSpacing:'-0.02em', fontFamily:"'Plus Jakarta Sans',sans-serif" }}>TransitOps</div>
                <div style={{ fontSize:9, color:'rgba(125,211,252,0.7)', fontWeight:700, letterSpacing:'0.16em', marginTop:1 }}>FLEET COMMAND CENTER</div>
              </div>
            </div>

            {/* Center headline */}
            <div style={{ animation:'fadeSlideIn 0.8s ease both' }}>
              <h1 style={{ fontSize:46, fontWeight:900, color:'#fff', lineHeight:1.1, margin:'0 0 18px', fontFamily:"'Plus Jakarta Sans',sans-serif", textShadow:'0 2px 20px rgba(0,0,0,0.8)' }}>
                Real-Time<br />
                <span style={{ background:'linear-gradient(135deg,#EF4444,#F59E0B,#22C55E,#0EA5E9)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>
                  Fleet Intelligence
                </span>
              </h1>
              <p style={{ fontSize:15, color:'rgba(255,255,255,0.6)', lineHeight:1.65, maxWidth:420 }}>
                AI-powered dispatch, live GPS tracking, predictive maintenance & route optimization — all in one enterprise platform.
              </p>
            </div>

            {/* 4-color KPI strip */}
            <div style={{ display:'flex', gap:12 }}>
              {stats.map(s => (
                <div key={s.val} style={{
                  flex:1, background:'rgba(5,10,20,0.7)', backdropFilter:'blur(12px)',
                  border:`1px solid ${s.color}30`, borderRadius:14,
                  padding:'14px 10px', textAlign:'center',
                  boxShadow:`0 0 16px ${s.color}20`,
                }}>
                  <div style={{ fontSize:18, marginBottom:6 }}>{s.icon}</div>
                  <div style={{ fontSize:20, fontWeight:900, color:s.color, lineHeight:1, fontFamily:"'JetBrains Mono',monospace" }}>{s.val}</div>
                  <div style={{ fontSize:9, color:'rgba(255,255,255,0.4)', marginTop:4, fontWeight:600, letterSpacing:'0.06em' }}>{s.label.toUpperCase()}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════
            RIGHT HALF — Login Form
        ══════════════════════════════════ */}
        <div style={{
          width:460, background:'#080F1E',
          borderLeft:'1px solid rgba(14,165,233,0.1)',
          display:'flex', alignItems:'center', justifyContent:'center',
          padding:'40px 44px', animation:'fadeSlideIn 0.6s ease both',
          position:'relative', overflowY:'auto',
        }}>
          {/* Subtle top glow */}
          <div style={{ position:'absolute', top:-80, left:'50%', transform:'translateX(-50%)', width:300, height:200, borderRadius:'50%', background:'radial-gradient(circle, rgba(14,165,233,0.12) 0%, transparent 70%)', pointerEvents:'none' }} />

          <div style={{ width:'100%', position:'relative' }}>
            {/* Header */}
            <div style={{ marginBottom:28 }}>
              <div style={{ display:'inline-flex', alignItems:'center', gap:7, background:'rgba(14,165,233,0.1)', border:'1px solid rgba(14,165,233,0.25)', borderRadius:20, padding:'4px 14px', marginBottom:18 }}>
                <span style={{ width:7, height:7, borderRadius:'50%', background:'#22C55E', display:'inline-block', animation:'blink 2s infinite', boxShadow:'0 0 6px #22C55E' }} />
                <span style={{ fontSize:10, color:'#7DD3FC', fontWeight:700, letterSpacing:'0.1em' }}>ALL SYSTEMS OPERATIONAL</span>
              </div>
              <h2 style={{ fontSize:28, fontWeight:900, color:'#EFF6FF', margin:'0 0 6px', fontFamily:"'Plus Jakarta Sans',sans-serif", letterSpacing:'-0.025em' }}>Welcome back</h2>
              <p style={{ fontSize:13, color:'rgba(125,211,252,0.45)', margin:0 }}>Sign in to your fleet operations console</p>
            </div>

            {/* Quick-fill role cards */}
            <div style={{ marginBottom:22 }}>
              <div style={{ fontSize:9, color:'rgba(125,211,252,0.4)', fontWeight:700, letterSpacing:'0.12em', marginBottom:10 }}>⚡ QUICK ACCESS</div>
              <div style={{ display:'flex', gap:10 }}>
                {roles.map(r => (
                  <div
                    key={r.role}
                    className="role-card"
                    style={{ flex:1, borderColor:`${r.color}30` }}
                    onClick={() => { setEmail(r.email); setPassword(r.password); setError(''); }}
                    onMouseEnter={e => { e.currentTarget.style.background = `${r.color}12`; e.currentTarget.style.borderColor = `${r.color}50`; e.currentTarget.style.boxShadow = `0 0 16px ${r.color}22`; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.borderColor = `${r.color}30`; e.currentTarget.style.boxShadow = 'none'; }}
                  >
                    <div style={{ width:34, height:34, borderRadius:9, background:`${r.color}18`, border:`1px solid ${r.color}35`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:17, flexShrink:0 }}>{r.icon}</div>
                    <div>
                      <div style={{ fontSize:11, fontWeight:800, color:'#D0E4F7' }}>{r.role}</div>
                      <div style={{ fontSize:9, color:'rgba(125,211,252,0.38)', marginTop:2 }}>{r.label}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Divider */}
            <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:20 }}>
              <div style={{ flex:1, height:1, background:'rgba(14,165,233,0.12)' }} />
              <span style={{ fontSize:10, color:'rgba(125,211,252,0.35)', fontWeight:600 }}>OR ENTER MANUALLY</span>
              <div style={{ flex:1, height:1, background:'rgba(14,165,233,0.12)' }} />
            </div>

            {/* Error */}
            {error && (
              <div style={{ background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.28)', borderRadius:10, padding:'10px 14px', marginBottom:18, fontSize:12, color:'#FCA5A5', display:'flex', alignItems:'center', gap:8 }}>
                <span style={{ fontSize:16 }}>🚨</span> {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* Email */}
              <div style={{ marginBottom:14 }}>
                <label style={{ display:'block', fontSize:10, fontWeight:700, color:'rgba(125,211,252,0.45)', marginBottom:7, letterSpacing:'0.1em' }}>EMAIL ADDRESS</label>
                <div style={{ position:'relative' }}>
                  <span style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', fontSize:14, opacity:0.4 }}>📧</span>
                  <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="login-input" placeholder="operator@transitops.com" style={{ paddingLeft:42 }} autoComplete="email" />
                </div>
              </div>

              {/* Password */}
              <div style={{ marginBottom:14 }}>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:7 }}>
                  <label style={{ fontSize:10, fontWeight:700, color:'rgba(125,211,252,0.45)', letterSpacing:'0.1em' }}>PASSWORD</label>
                  <span style={{ fontSize:10, color:'#0EA5E9', cursor:'pointer', fontWeight:700 }}>Forgot?</span>
                </div>
                <div style={{ position:'relative' }}>
                  <span style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', fontSize:14, opacity:0.4 }}>🔑</span>
                  <input type={showPass ? 'text' : 'password'} required value={password} onChange={e => setPassword(e.target.value)} className="login-input" placeholder="••••••••" style={{ paddingLeft:42, paddingRight:46 }} autoComplete="current-password" />
                  <button type="button" onClick={() => setShowPass(v => !v)} style={{ position:'absolute', right:14, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', fontSize:15, opacity:0.45 }}>
                    {showPass ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>

              {/* Remember me */}
              <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:22 }}>
                <input type="checkbox" id="remember" style={{ accentColor:'#0EA5E9', width:14, height:14 }} />
                <label htmlFor="remember" style={{ fontSize:12, color:'rgba(125,211,252,0.38)', cursor:'pointer' }}>Keep me signed in for 30 days</label>
              </div>

              {/* Submit */}
              <button type="submit" disabled={loading} className="login-btn" style={{ marginBottom:18 }}>
                {loading ? (
                  <span style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:10 }}>
                    <span style={{ width:16, height:16, border:'2px solid rgba(255,255,255,0.3)', borderTopColor:'#fff', borderRadius:'50%', animation:'spin 0.7s linear infinite', display:'inline-block' }} />
                    Authenticating...
                  </span>
                ) : '🚛  Sign in to TransitOps'}
              </button>

              <div style={{ textAlign:'center' }}>
                <span style={{ fontSize:13, color:'rgba(125,211,252,0.35)' }}>New fleet operator? </span>
                <Link to="/register" style={{ fontSize:13, color:'#38BDF8', fontWeight:700, textDecoration:'none' }}>Create account →</Link>
              </div>
            </form>

            {/* Color-coded fleet status */}
            <div style={{ marginTop:28, display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:8 }}>
              {[
                { label:'On Route', count:14, color:'#22C55E' },
                { label:'Idle', count:8, color:'#F59E0B' },
                { label:'Alert', count:3, color:'#EF4444' },
                { label:'Offline', count:7, color:'rgba(125,211,252,0.3)' },
              ].map(s => (
                <div key={s.label} style={{ textAlign:'center', padding:'10px 6px', background:`${s.color}0F`, border:`1px solid ${s.color}25`, borderRadius:10 }}>
                  <div style={{ fontSize:18, fontWeight:900, color:s.color, fontFamily:"'JetBrains Mono',monospace" }}>{s.count}</div>
                  <div style={{ fontSize:8, color:`${s.color}AA`, marginTop:3, fontWeight:700, letterSpacing:'0.06em' }}>{s.label.toUpperCase()}</div>
                </div>
              ))}
            </div>

            {/* Security */}
            <div style={{ marginTop:16, padding:'10px 14px', background:'rgba(14,165,233,0.04)', border:'1px solid rgba(14,165,233,0.1)', borderRadius:10, display:'flex', alignItems:'center', gap:10 }}>
              <span style={{ fontSize:16, opacity:0.5 }}>🔐</span>
              <div style={{ fontSize:9, color:'rgba(125,211,252,0.3)', lineHeight:1.5 }}>
                <span style={{ fontWeight:700, display:'block', color:'rgba(125,211,252,0.45)', letterSpacing:'0.06em' }}>ENTERPRISE SECURITY</span>
                JWT Auth · BCrypt · AES-256 · TLS 1.3
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
