import { NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const LINKS = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/vehicles', label: 'Vehicles' },
  { to: '/drivers', label: 'Drivers' },
  { to: '/trips', label: 'Trips' },
  { to: '/maintenance', label: 'Maintenance' },
]

export default function Navbar() {
  const { user, logout } = useAuth()

  return (
    <header className="sticky top-0 z-20 bg-base-950/90 backdrop-blur border-b border-white/5">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <span className="text-route-cyan font-mono text-lg">◆</span>
            <span className="font-semibold tracking-tight text-slate-100">TransitOps</span>
          </div>
          <nav className="hidden md:flex items-center gap-1">
            {LINKS.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                className={({ isActive }) =>
                  `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <div className="text-sm text-slate-200">{user?.name}</div>
            <div className="text-xs text-slate-500 font-mono">{user?.role}</div>
          </div>
          <button onClick={logout} className="btn-ghost text-xs">Log out</button>
        </div>
      </div>
      <div className="route-divider text-route-cyan" />
    </header>
  )
}
