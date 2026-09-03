import { useEffect, useState, useMemo } from 'react'
import api from '../api/axios'
import Modal from '../components/Modal'
import Pagination from '../components/Pagination'
import { useAuth } from '../context/AuthContext'

export default function Maintenance() {
  const { user } = useAuth() || {}
  const [vehicles, setVehicles] = useState([])
  const [logs, setLogs] = useState([])
  const [search, setSearch] = useState('')
  const [stateFilter, setStateFilter] = useState('')
  const [sortBy, setSortBy] = useState('newest')
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [showCreate, setShowCreate] = useState(false)
  const [form, setForm] = useState({ vehicleId: '', description: '', cost: '', maintenanceDate: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  const isAdminOrSafety = user?.role === 'ADMIN' || user?.role === 'FLEET_MANAGER' || user?.role === 'SAFETY_OFFICER'

  useEffect(() => {
    load()
  }, [])

  async function load() {
    setLoading(true)
    try {
      const [vRes, mRes] = await Promise.all([
        api.get('/vehicles'),
        api.get('/maintenance').catch(() => ({ data: [] })),
      ])
      setVehicles(vRes.data || [])
      setLogs(Array.isArray(mRes.data) ? mRes.data : [])
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
      await api.post('/maintenance', {
        ...form,
        vehicleId: parseInt(form.vehicleId),
        cost: form.cost ? parseFloat(form.cost) : null,
      })
      setShowCreate(false)
      setForm({ vehicleId: '', description: '', cost: '', maintenanceDate: '' })
      load()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create maintenance record')
    }
  }

  async function handleClose(logId) {
    try {
      await api.patch(`/maintenance/${logId}/close`)
      load()
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to close maintenance record')
    }
  }

  // ── Multi-Filter & Search Pipeline ──
  const filteredLogs = useMemo(() => {
    return logs.filter((l) => {
      if (stateFilter === 'ACTIVE' && !l.isActive) return false
      if (stateFilter === 'CLOSED' && l.isActive) return false

      if (search) {
        const query = search.toLowerCase()
        const match = (
          (l.description || '').toLowerCase().includes(query) ||
          (l.vehicle?.registrationNumber || '').toLowerCase().includes(query) ||
          (l.vehicle?.name || '').toLowerCase().includes(query)
        )
        if (!match) return false
      }
      return true
    }).sort((a, b) => {
      if (sortBy === 'newest') return (b.id || 0) - (a.id || 0)
      if (sortBy === 'oldest') return (a.id || 0) - (b.id || 0)
      if (sortBy === 'costDesc') return (b.cost || 0) - (a.cost || 0)
      if (sortBy === 'costAsc') return (a.cost || 0) - (b.cost || 0)
      return 0
    })
  }, [logs, stateFilter, search, sortBy])

  const paginatedLogs = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return filteredLogs.slice(start, start + pageSize)
  }, [filteredLogs, currentPage, pageSize])

  return (
    <div className="space-y-6 pb-12">
      {/* ── HEADER ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl">🔧</span>
            <h1 className="text-xl sm:text-2xl font-black text-slate-100 tracking-tight">Maintenance & Workshop Logs</h1>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              {filteredLogs.length} / {logs.length} RECORDS
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/20">
              {logs.filter(l => l.isActive).length} ACTIVE IN-SHOP
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">Active maintenance records lock the vehicle from dispatch and release back to Available upon closure</p>
        </div>
        {isAdminOrSafety && (
          <button className="btn-primary px-4 py-2.5 text-xs font-bold rounded-xl shadow-lg shadow-cyan-500/10" onClick={() => setShowCreate(true)}>
            + Log Maintenance Record
          </button>
        )}
      </div>

      {/* ── MULTI-FILTER TOOLBAR ── */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 bg-slate-900/40 p-3.5 border border-slate-800/80 rounded-2xl">
        {/* Search Input */}
        <div className="sm:col-span-5 relative">
          <input
            type="text"
            placeholder="🔍 Search Issue, Vehicle Reg #, Service Details..."
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

        {/* State Filter */}
        <div className="sm:col-span-4">
          <select
            className="input w-full text-xs py-2 bg-slate-850/80 border-slate-700/80 rounded-xl text-slate-200"
            value={stateFilter}
            onChange={(e) => {
              setStateFilter(e.target.value)
              setCurrentPage(1)
            }}
          >
            <option value="">All Maintenance States ({logs.length})</option>
            <option value="ACTIVE">Active In-Shop (Locks Asset)</option>
            <option value="CLOSED">Completed & Closed Logs</option>
          </select>
        </div>

        {/* Sort By */}
        <div className="sm:col-span-3">
          <select
            className="input w-full text-xs py-2 bg-slate-850/80 border-slate-700/80 rounded-xl text-slate-200"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="costDesc">Cost: High → Low</option>
            <option value="costAsc">Cost: Low → High</option>
          </select>
        </div>
      </div>

      {/* ── RESPONSIVE TABLE CONTAINER ── */}
      <div className="card overflow-hidden border border-slate-800 rounded-2xl shadow-lg bg-slate-900/90">
        <div className="overflow-x-auto">
          <table className="w-full table-shell min-w-[700px]">
            <thead className="bg-slate-950/80 border-b border-slate-800 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              <tr>
                <th className="py-3.5 px-4 text-left">Vehicle Reg</th>
                <th className="py-3.5 px-4 text-left">Description / Issue</th>
                <th className="py-3.5 px-4 text-left">Service Date</th>
                <th className="py-3.5 px-4 text-left">Cost (₹)</th>
                <th className="py-3.5 px-4 text-left">State</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs">
              {loading ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-slate-400">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin" />
                      <span>Loading dynamic workshop logs...</span>
                    </div>
                  </td>
                </tr>
              ) : paginatedLogs.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-slate-500">
                    No maintenance records found matching filter criteria.
                  </td>
                </tr>
              ) : (
                paginatedLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-850/50 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-cyan-400">
                      {log.vehicle?.registrationNumber || `ID: ${log.vehicle?.id}`}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-200">{log.description}</div>
                      <div className="text-[10px] text-slate-400">{log.vehicle?.name}</div>
                    </td>
                    <td className="py-3 px-4 text-slate-300 font-mono">
                      {log.maintenanceDate || '—'}
                    </td>
                    <td className="py-3 px-4 text-slate-200 font-mono font-semibold">
                      {log.cost ? `₹${Number(log.cost).toLocaleString()}` : '—'}
                    </td>
                    <td className="py-3 px-4">
                      {log.isActive ? (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center gap-1.5 w-max">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                          IN-SHOP (ACTIVE)
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 w-max inline-block">
                          COMPLETED
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      {log.isActive && isAdminOrSafety && (
                        <button
                          className="px-2.5 py-1 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded text-[11px] font-bold transition-all"
                          onClick={() => handleClose(log.id)}
                          title="Release Vehicle to Available"
                        >
                          ✓ Close & Release
                        </button>
                      )}
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
          totalItems={filteredLogs.length}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          onPageSizeChange={setPageSize}
          pageSizeOptions={[10, 25, 50, 100]}
        />
      </div>

      {/* ── CREATE MAINTENANCE RECORD MODAL ── */}
      {showCreate && (
        <Modal title="Log Workshop Maintenance Record" onClose={() => setShowCreate(false)}>
          <form onSubmit={handleCreate} className="space-y-4">
            {error && <div className="p-3 text-xs bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl">{error}</div>}

            <div>
              <label className="label">Select Vehicle Asset *</label>
              <select
                required
                className="input w-full"
                value={form.vehicleId}
                onChange={(e) => setForm({ ...form, vehicleId: e.target.value })}
              >
                <option value="">-- Choose Fleet Vehicle --</option>
                {vehicles.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.name} ({v.registrationNumber}) — Status: {v.status}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="label">Service Description / Diagnostic Issue *</label>
              <textarea
                required
                rows={3}
                placeholder="e.g. 40,000 km routine engine oil replacement, brake overhaul, or scheduled diagnostics..."
                className="input w-full"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Estimated Service Cost (₹)</label>
                <input
                  type="number"
                  step="any"
                  placeholder="e.g. 14500"
                  className="input w-full"
                  value={form.cost}
                  onChange={(e) => setForm({ ...form, cost: e.target.value })}
                />
              </div>
              <div>
                <label className="label">Service Date *</label>
                <input
                  required
                  type="date"
                  className="input w-full"
                  value={form.maintenanceDate}
                  onChange={(e) => setForm({ ...form, maintenanceDate: e.target.value })}
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
              <button type="button" className="btn-secondary px-4 py-2" onClick={() => setShowCreate(false)}>
                Cancel
              </button>
              <button type="submit" className="btn-primary px-5 py-2">
                Submit & Lock Asset
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}
