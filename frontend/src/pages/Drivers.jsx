import { useEffect, useState, useMemo } from 'react'
import api from '../api/axios'
import StatusBadge from '../components/StatusBadge'
import Modal from '../components/Modal'
import Pagination from '../components/Pagination'
import { useAuth } from '../context/AuthContext'

export default function Drivers() {
  const { user } = useAuth() || {}
  const [drivers, setDrivers] = useState([])
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [sortBy, setSortBy] = useState('newest')
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [showCreate, setShowCreate] = useState(false)
  const [showLeaderboard, setShowLeaderboard] = useState(false)
  const [leaderboardData, setLeaderboardData] = useState([])
  const [perfDriver, setPerfDriver] = useState(null)
  const [perfData, setPerfData] = useState(null)
  const [perfLoading, setPerfLoading] = useState(false)
  const [form, setForm] = useState({ name: '', licenseNumber: '', licenseCategory: '', licenseExpiryDate: '', contactNumber: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  const isAdmin = user?.role === 'ADMIN' || user?.role === 'FLEET_MANAGER'

  useEffect(() => {
    load()
  }, [])

  async function load() {
    setLoading(true)
    try {
      const { data } = await api.get('/drivers')
      setDrivers(Array.isArray(data) ? data : [])
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  async function handleCreate(e) {
    e.preventDefault()
    setError('')
    try {
      await api.post('/drivers', form)
      setShowCreate(false)
      setForm({ name: '', licenseNumber: '', licenseCategory: '', licenseExpiryDate: '', contactNumber: '' })
      load()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add driver')
    }
  }

  async function openLeaderboard() {
    setShowLeaderboard(true)
    try {
      const { data } = await api.get('/drivers/leaderboard')
      setLeaderboardData(data || [])
    } catch (err) {
      console.error(err)
    }
  }

  async function openPerformance(d) {
    setPerfDriver(d)
    setPerfLoading(true)
    setPerfData(null)
    try {
      const { data } = await api.get(`/drivers/${d.id}/performance`)
      setPerfData(data)
    } catch (err) {
      console.error(err)
    } finally {
      setPerfLoading(false)
    }
  }

  function isExpired(date) {
    return new Date(date) < new Date()
  }

  function isExpiringSoon(date) {
    const d = new Date(date)
    const in30 = new Date()
    in30.setDate(in30.getDate() + 30)
    return d >= new Date() && d <= in30
  }

  // ── Multi-Filter & Search Pipeline ──
  const filteredDrivers = useMemo(() => {
    return drivers.filter((d) => {
      if (statusFilter && d.status !== statusFilter) return false
      if (categoryFilter && !(d.licenseCategory || '').includes(categoryFilter)) return false

      if (search) {
        const query = search.toLowerCase()
        const match = (
          (d.name || '').toLowerCase().includes(query) ||
          (d.licenseNumber || '').toLowerCase().includes(query) ||
          (d.contactNumber || '').toLowerCase().includes(query) ||
          (d.licenseCategory || '').toLowerCase().includes(query)
        )
        if (!match) return false
      }
      return true
    }).sort((a, b) => {
      if (sortBy === 'newest') return (b.id || 0) - (a.id || 0)
      if (sortBy === 'oldest') return (a.id || 0) - (b.id || 0)
      if (sortBy === 'safetyDesc') return (b.safetyScore || 0) - (a.safetyScore || 0)
      if (sortBy === 'safetyAsc') return (a.safetyScore || 0) - (b.safetyScore || 0)
      if (sortBy === 'nameAsc') return (a.name || '').localeCompare(b.name || '')
      return 0
    })
  }, [drivers, statusFilter, categoryFilter, search, sortBy])

  const paginatedDrivers = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return filteredDrivers.slice(start, start + pageSize)
  }, [filteredDrivers, currentPage, pageSize])

  return (
    <div className="space-y-6 pb-12">
      {/* ── HEADER ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl">👤</span>
            <h1 className="text-xl sm:text-2xl font-black text-slate-100 tracking-tight">Driver Management & Safety</h1>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              {filteredDrivers.length} / {drivers.length} DRIVERS
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">Operator compliance, license expirations, safety telemetry, and performance ranking</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={openLeaderboard}
            className="px-3.5 py-2 text-xs font-bold rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 hover:bg-amber-500/25 transition shadow-lg shadow-amber-500/10"
          >
            🏆 Leaderboard
          </button>
          {isAdmin && (
            <button className="btn-primary flex items-center justify-center gap-2 px-4 py-2 rounded-xl font-bold text-xs shadow-lg shadow-cyan-500/10" onClick={() => setShowCreate(true)}>
              <span>+</span> Add Driver
            </button>
          )}
        </div>
      </div>

      {/* ── MULTI-FILTER TOOLBAR ── */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 bg-slate-900/40 p-3.5 border border-slate-800/80 rounded-2xl">
        {/* Search Input */}
        <div className="sm:col-span-5 relative">
          <input
            type="text"
            placeholder="🔍 Search Driver Name, License #, Phone..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setCurrentPage(1)
            }}
            className="input w-full pl-3 pr-8 text-xs py-2 bg-slate-850/80 border-slate-700/80 rounded-xl placeholder:text-slate-500 text-slate-200"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 text-xs"
            >
              ✕
            </button>
          )}
        </div>

        {/* Status Filter */}
        <div className="sm:col-span-3">
          <select
            className="input w-full text-xs py-2 bg-slate-850/80 border-slate-700/80 rounded-xl text-slate-200"
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value)
              setCurrentPage(1)
            }}
          >
            <option value="">All Statuses ({drivers.length})</option>
            <option value="AVAILABLE">Available for Dispatch</option>
            <option value="ON_TRIP">On Active Route</option>
            <option value="SUSPENDED">Suspended / Inactive</option>
          </select>
        </div>

        {/* Category Filter */}
        <div className="sm:col-span-2">
          <select
            className="input w-full text-xs py-2 bg-slate-850/80 border-slate-700/80 rounded-xl text-slate-200"
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value)
              setCurrentPage(1)
            }}
          >
            <option value="">All Categories</option>
            <option value="Heavy">Heavy Commercial</option>
            <option value="Medium">Medium Freight</option>
            <option value="Light">Light Commercial</option>
            <option value="Hazardous">Hazardous Tanker</option>
          </select>
        </div>

        {/* Sort By */}
        <div className="sm:col-span-2">
          <select
            className="input w-full text-xs py-2 bg-slate-850/80 border-slate-700/80 rounded-xl text-slate-200"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="safetyDesc">Safety: High → Low</option>
            <option value="safetyAsc">Safety: Low → High</option>
            <option value="nameAsc">Name (A → Z)</option>
          </select>
        </div>
      </div>

      {/* ── RESPONSIVE TABLE CONTAINER ── */}
      <div className="card overflow-hidden border border-slate-800 rounded-2xl shadow-lg bg-slate-900/90">
        <div className="overflow-x-auto">
          <table className="w-full table-shell min-w-[700px]">
            <thead className="bg-slate-950/80 border-b border-slate-800 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              <tr>
                <th className="py-3.5 px-4 text-left">Driver Name</th>
                <th className="py-3.5 px-4 text-left">License Details</th>
                <th className="py-3.5 px-4 text-left">License Expiry</th>
                <th className="py-3.5 px-4 text-left">Safety Score</th>
                <th className="py-3.5 px-4 text-left">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs">
              {loading ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-slate-400">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin" />
                      <span>Loading dynamic driver profiles...</span>
                    </div>
                  </td>
                </tr>
              ) : paginatedDrivers.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-slate-500">
                    No drivers found matching filter criteria.
                  </td>
                </tr>
              ) : (
                paginatedDrivers.map((d) => (
                  <tr key={d.id} className="hover:bg-slate-850/50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-200">{d.name}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{d.contactNumber || 'No Phone'}</div>
                    </td>
                    <td className="py-3 px-4 text-slate-300 font-mono">
                      <div>{d.licenseNumber}</div>
                      <div className="text-[10px] text-slate-400 font-sans">{d.licenseCategory || 'Commercial'}</div>
                    </td>
                    <td className="py-3 px-4">
                      {isExpired(d.licenseExpiryDate) ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-500/10 text-red-400 border border-red-500/20">
                          Expired ({d.licenseExpiryDate})
                        </span>
                      ) : isExpiringSoon(d.licenseExpiryDate) ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                          Expiring Soon ({d.licenseExpiryDate})
                        </span>
                      ) : (
                        <span className="text-slate-300 font-mono">{d.licenseExpiryDate}</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-slate-800 rounded-full h-1.5 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              d.safetyScore >= 90 ? 'bg-emerald-400' : d.safetyScore >= 75 ? 'bg-amber-400' : 'bg-red-400'
                            }`}
                            style={{ width: `${Math.min(100, d.safetyScore || 0)}%` }}
                          />
                        </div>
                        <span className={`font-mono font-bold text-xs ${
                          d.safetyScore >= 90 ? 'text-emerald-400' : d.safetyScore >= 75 ? 'text-amber-400' : 'text-red-400'
                        }`}>
                          {d.safetyScore || 0}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge status={d.status} />
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        className="px-2.5 py-1 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 rounded text-[11px] font-bold transition-all"
                        onClick={() => openPerformance(d)}
                        title="View Performance Scorecard"
                      >
                        📊 Scorecard
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* ── PAGINATION COMPONENT ── */}
        <Pagination
          currentPage={currentPage}
          totalItems={filteredDrivers.length}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          onPageSizeChange={setPageSize}
          pageSizeOptions={[10, 25, 50, 100]}
        />
      </div>

      {/* ── ADD DRIVER MODAL ── */}
      {showCreate && (
        <Modal title="Add New Driver Profile" onClose={() => setShowCreate(false)}>
          <form onSubmit={handleCreate} className="space-y-4">
            {error && <div className="p-3 text-xs bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl">{error}</div>}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Driver Full Name *</label>
                <input
                  required
                  placeholder="e.g. Michael Johnson"
                  className="input w-full"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>
              <div>
                <label className="label">Contact Phone Number</label>
                <input
                  placeholder="e.g. +91 9876543210"
                  className="input w-full"
                  value={form.contactNumber}
                  onChange={(e) => setForm({ ...form, contactNumber: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">License Number *</label>
                <input
                  required
                  placeholder="e.g. DL-142024001928"
                  className="input w-full uppercase"
                  value={form.licenseNumber}
                  onChange={(e) => setForm({ ...form, licenseNumber: e.target.value.toUpperCase() })}
                />
              </div>
              <div>
                <label className="label">License Expiry Date *</label>
                <input
                  required
                  type="date"
                  className="input w-full"
                  value={form.licenseExpiryDate}
                  onChange={(e) => setForm({ ...form, licenseExpiryDate: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="label">License Category</label>
              <input
                placeholder="e.g. Heavy Commercial Vehicle (HMV)"
                className="input w-full"
                value={form.licenseCategory}
                onChange={(e) => setForm({ ...form, licenseCategory: e.target.value })}
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
              <button type="button" className="btn-secondary px-4 py-2" onClick={() => setShowCreate(false)}>
                Cancel
              </button>
              <button type="submit" className="btn-primary px-5 py-2">
                Save & Register Driver
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* ── DRIVER PERFORMANCE MODAL ── */}
      {perfDriver && (
        <Modal title={`Performance Scorecard — ${perfDriver.name}`} onClose={() => setPerfDriver(null)}>
          {perfLoading ? (
            <div className="p-8 text-center text-slate-400 text-xs">Computing performance metrics...</div>
          ) : perfData ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-850 border border-slate-800 rounded-xl">
                <div>
                  <div className="text-xs text-slate-400">Overall Performance Index</div>
                  <div className="text-2xl font-black text-cyan-400">{perfData.performanceScore} / 100</div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-slate-400">Composite Tier</div>
                  <span className="text-xs font-bold text-amber-400">
                    {perfData.performanceScore >= 85 ? '🌟 Elite Operator' : perfData.performanceScore >= 70 ? '⭐ Certified Driver' : '⚠️ Review Required'}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl">
                  <div className="text-[10px] text-slate-400">Safety Index (50%)</div>
                  <div className="text-xs font-bold text-emerald-400 mt-1">{perfData.safetyScore}/100</div>
                </div>
                <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl">
                  <div className="text-[10px] text-slate-400">On-Time Rate (40%)</div>
                  <div className="text-xs font-bold text-cyan-400 mt-1">{perfData.completionRate}%</div>
                </div>
                <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl">
                  <div className="text-[10px] text-slate-400">Trips Volume (10%)</div>
                  <div className="text-xs font-bold text-amber-400 mt-1">{perfData.totalTrips} Total</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4 text-center text-xs text-slate-400">No performance records found.</div>
          )}
        </Modal>
      )}

      {/* ── LEADERBOARD MODAL ── */}
      {showLeaderboard && (
        <Modal title="🏆 Fleet Driver Performance Leaderboard" onClose={() => setShowLeaderboard(false)}>
          <div className="space-y-3">
            <p className="text-xs text-slate-400">
              Ranked dynamically by Composite Driver Rating: 50% Safety Score + 40% Completion Rate + 10% Trips Volume.
            </p>
            <div className="overflow-x-auto max-h-[400px]">
              <table className="w-full text-xs">
                <thead className="bg-slate-950/80 text-[10px] uppercase text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="p-2 text-left">Rank</th>
                    <th className="p-2 text-left">Driver Name</th>
                    <th className="p-2 text-right">Safety</th>
                    <th className="p-2 text-right">Completion</th>
                    <th className="p-2 text-right">Composite Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {leaderboardData.map((lb, idx) => (
                    <tr key={lb.driverId || idx} className="hover:bg-slate-850/50">
                      <td className="p-2 font-bold font-mono">
                        {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `#${idx + 1}`}
                      </td>
                      <td className="p-2 font-semibold text-slate-200">{lb.driverName}</td>
                      <td className="p-2 text-right font-mono text-emerald-400">{lb.safetyScore}</td>
                      <td className="p-2 text-right font-mono text-cyan-400">{lb.completionRate}%</td>
                      <td className="p-2 text-right font-mono font-bold text-amber-400">{lb.performanceScore}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
