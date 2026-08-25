import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function BentoGridPage() {
  const navigate = useNavigate();

  return (
    <div style={{
      minHeight: '100vh', background: 'linear-gradient(135deg, #0f0e1a 0%, #1a1040 60%, #0f0e1a 100%)',
      fontFamily: 'Inter, sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px',
    }}>
      <div style={{ width: '100%', maxWidth: 920 }}>
        {/* Bento Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 1fr', gridTemplateRows: 'auto auto', gap: 14 }}>
          {/* Row 1 */}

          {/* Card 1: Effortless Prompt Perfection */}
          <div style={{ background: '#1a1940', border: '1px solid #2a2860', borderRadius: 18, padding: '28px 24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ width: 36, height: 36, background: 'linear-gradient(135deg, #8b5cf6, #6366f1)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, marginBottom: 18 }}>✨</div>
              <div style={{ fontSize: 18, fontWeight: 800, color: '#fff', lineHeight: 1.3, marginBottom: 20 }}>Effortless<br />Prompt<br />Perfection</div>
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#a78bfa', marginBottom: 4 }}>14 days trial</div>
              <div style={{ fontSize: 11, color: '#555' }}>after – $5/month</div>
            </div>
          </div>

          {/* Card 2 (center hero): Your AI Prompt Companion */}
          <div style={{
            background: 'linear-gradient(145deg, #7c3aed, #6366f1, #4f46e5)',
            borderRadius: 18, padding: '36px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between',
            gridRow: '1 / 3', position: 'relative', overflow: 'hidden',
          }}>
            <div style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 16 }}>
                <span style={{ fontSize: 18 }}>✨</span>
                <span style={{ fontWeight: 700, fontSize: 14, color: 'rgba(255,255,255,0.9)' }}>PromptPal</span>
              </div>
              <h1 style={{ fontSize: 28, fontWeight: 900, color: '#fff', lineHeight: 1.25, margin: '0 0 28px' }}>Your AI Prompt<br />Companion</h1>
            </div>
            {/* Galaxy orb */}
            <div style={{
              width: 180, height: 180, borderRadius: '50%', position: 'relative', zIndex: 1, flexShrink: 0,
              background: 'radial-gradient(circle at 35% 35%, #f97316, #8b5cf6 40%, #1d1b4b 75%, #0a0820)',
              boxShadow: '0 0 60px rgba(139,92,246,0.5), 0 0 120px rgba(249,115,22,0.2)',
              border: '2px solid rgba(255,255,255,0.08)',
              overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {/* Binary text ring - decorative */}
              <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: 'transparent', border: '1px solid rgba(255,255,255,0.08)' }} />
              <div style={{ fontSize: 7, color: 'rgba(255,255,255,0.3)', fontFamily: 'monospace', textAlign: 'center', lineHeight: 1.6, padding: '0 20px' }}>
                10101 1001010110 010 001<br />1 10101 1001010110 010<br />101 1001 01010 11010
              </div>
            </div>
            <div style={{ position: 'relative', zIndex: 1, width: '100%', marginTop: 24 }}>
              <button onClick={() => navigate('/dashboard')} style={{
                width: '100%', background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(4px)',
                border: '1px solid rgba(255,255,255,0.3)', borderRadius: 30,
                color: '#fff', fontSize: 14, fontWeight: 700, padding: '12px', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              }}>
                ✨ Generate
              </button>
            </div>
          </div>

          {/* Card 3: 25M */}
          <div style={{ background: '#1a1940', border: '1px solid #2a2860', borderRadius: 18, padding: '28px 24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div style={{ width: 38, height: 38, background: 'rgba(99,102,241,0.15)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, marginBottom: 12 }}>✨</div>
            <div>
              <div style={{ fontSize: 42, fontWeight: 900, color: '#fff', letterSpacing: '-2px' }}>25M</div>
              <div style={{ borderTop: '2px solid #3730a3', margin: '10px 0' }} />
              <div style={{ fontSize: 12, color: '#6b7280', fontFamily: 'monospace' }}>created prompts</div>
            </div>
          </div>

          {/* Row 2 */}

          {/* Card 4: 12K happy users */}
          <div style={{ background: '#1a1940', border: '1px solid #2a2860', borderRadius: 18, padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: 32, fontWeight: 900, color: '#f97316', marginBottom: 6 }}>12K</div>
              <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 16 }}>happy users</div>
            </div>
            <div style={{ display: 'flex', gap: -8 }}>
              {[
                'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=40&q=80',
                'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=40&q=80',
              ].map((src, i) => (
                <img key={i} src={src} style={{ width: 32, height: 32, borderRadius: '50%', border: '2px solid #0f0e1a', marginLeft: i > 0 ? -8 : 0, objectFit: 'cover' }} />
              ))}
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg, #8b5cf6, #6366f1)', border: '2px solid #0f0e1a', display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: -8 }}>✦</div>
            </div>
          </div>

          {/* Card 5: Branching paths */}
          <div style={{ background: '#1a1940', border: '1px solid #2a2860', borderRadius: 18, padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div style={{ width: 36, height: 36, background: '#f97316', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17, marginBottom: 14 }}>↕</div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#fff', marginBottom: 6 }}>Branching paths</div>
              <div style={{ fontSize: 11, color: '#6b7280', lineHeight: 1.5 }}>Explore multiple prompt directions with branching.</div>
            </div>
          </div>

          {/* Card 6: Keyword enhancer */}
          <div style={{ background: '#1a1940', border: '1px solid #2a2860', borderRadius: 18, padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div style={{ width: 36, height: 36, background: 'rgba(139,92,246,0.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17, marginBottom: 14 }}>🏷️</div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#fff', marginBottom: 6 }}>Keyword enhancer</div>
              <div style={{ fontSize: 11, color: '#6b7280', lineHeight: 1.5 }}>Boost your prompt precision with keywords.</div>
            </div>
          </div>

          {/* Card 7: Prompt templates */}
          <div style={{ background: '#1a1940', border: '1px solid #2a2860', borderRadius: 18, padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#fff', marginBottom: 6 }}>Prompt templates</div>
              <div style={{ fontSize: 11, color: '#6b7280', lineHeight: 1.5, marginBottom: 14 }}>Use pre-made templates to jumpstart creativity.</div>
            </div>
            <div>
              <div style={{ background: '#fff', color: '#1a1a1a', display: 'inline-block', borderRadius: 20, padding: '3px 10px', fontSize: 10, fontWeight: 700, transform: 'rotate(15deg)', marginBottom: 10 }}>14 days trial</div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {['📝 Rewrite', '🎁', '📄 PDF', '📊 PNG', '📋 JPG'].map(t => (
                  <span key={t} style={{ background: 'rgba(99,102,241,0.15)', color: '#a5b4fc', border: '1px solid rgba(99,102,241,0.3)', borderRadius: 20, padding: '3px 8px', fontSize: 9, fontWeight: 600 }}>{t}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Go Back button */}
        <div style={{ textAlign: 'center', marginTop: 28 }}>
          <button onClick={() => navigate('/dashboard')} style={{
            background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.4)',
            color: '#a5b4fc', borderRadius: 30, padding: '10px 28px', fontSize: 13, fontWeight: 700, cursor: 'pointer',
          }}>← Back to Dashboard</button>
        </div>
      </div>
    </div>
  );
}
