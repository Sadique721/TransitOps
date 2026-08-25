/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Inter', '"Plus Jakarta Sans"', 'sans-serif'],
        mono:    ['"JetBrains Mono"', '"Fira Code"', 'monospace'],
      },
      colors: {
        /* ── TRANSPORT DARK BASE ── */
        base: {
          950: '#050A14',   // deep transport night
          900: '#080F1E',   // dark surface
          800: '#0D1628',   // card bg
          700: '#122038',   // elevated panel
          600: '#1A2E4A',   // border surface
        },
        /* ── TRANSPORT BLUE — primary nav, routes, info ── */
        fleet: {
          DEFAULT: '#0EA5E9',
          dark:    '#0369A1',
          light:   '#7DD3FC',
          glow:    '#38BDF8',
          50:      '#F0F9FF',
          400:     '#38BDF8',
          500:     '#0EA5E9',
          600:     '#0284C7',
          700:     '#0369A1',
        },
        /* ── SIGNAL RED — alerts, emergency, danger ── */
        signal: {
          DEFAULT: '#EF4444',
          dark:    '#B91C1C',
          light:   '#FCA5A5',
          glow:    '#F87171',
          400:     '#F87171',
          500:     '#EF4444',
          600:     '#DC2626',
        },
        /* ── ROUTE GREEN — on-route, available, success ── */
        route: {
          DEFAULT: '#22C55E',
          dark:    '#15803D',
          light:   '#86EFAC',
          neon:    '#4ADE80',
          amber:   '#F59E0B',
          cyan:    '#0EA5E9',
          green:   '#22C55E',
          red:     '#EF4444',
        },
        /* ── AMBER — warnings, fuel, pending ── */
        amber: {
          DEFAULT: '#F59E0B',
          dark:    '#B45309',
          light:   '#FCD34D',
          glow:    '#FBBF24',
        },
        /* ── VIOLET — premium accents, AI features ── */
        violet: {
          DEFAULT: '#8B5CF6',
          dark:    '#6D28D9',
          light:   '#C4B5FD',
        },
      },
      backgroundImage: {
        'route-line':      'repeating-linear-gradient(90deg, currentColor 0 8px, transparent 8px 16px)',
        'transport-hero':  'url(/transport_hero.jpg)',
        'fleet-bg':        'url(/fleet_dashboard_bg.jpg)',
        'gradient-fleet':  'linear-gradient(135deg, #0EA5E9 0%, #0369A1 100%)',
        'gradient-signal': 'linear-gradient(135deg, #EF4444 0%, #B91C1C 100%)',
        'gradient-route':  'linear-gradient(135deg, #22C55E 0%, #15803D 100%)',
        'gradient-amber':  'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
        'gradient-multi':  'linear-gradient(135deg, #EF4444 0%, #F59E0B 33%, #22C55E 66%, #0EA5E9 100%)',
        'card-shine':      'linear-gradient(145deg, rgba(255,255,255,0.05) 0%, transparent 60%)',
      },
      boxShadow: {
        'fleet':    '0 0 24px rgba(14,165,233,0.4)',
        'fleet-lg': '0 0 60px rgba(14,165,233,0.3)',
        'signal':   '0 0 24px rgba(239,68,68,0.45)',
        'route':    '0 0 24px rgba(34,197,94,0.4)',
        'amber':    '0 0 24px rgba(245,158,11,0.4)',
        'card':     '0 4px 32px rgba(0,0,0,0.7), 0 1px 0 rgba(255,255,255,0.04) inset',
        'glass':    '0 8px 40px rgba(0,0,0,0.6), 0 1px 0 rgba(255,255,255,0.05) inset',
      },
    },
  },
  plugins: [],
}
