import { useEffect, useState, useMemo } from 'react'
import api from '../api/axios'
import StatusBadge from '../components/StatusBadge'
import Modal from '../components/Modal'
import Pagination from '../components/Pagination'
import { useAuth } from '../context/AuthContext'

export default function Trips() {
  const { user } = useAuth() || {}
  const [trips, setTrips] = useState([])
  const [vehicles, setVehicles] = useState([])
  const [drivers, setDrivers] = useState([])
  const [statusFilter, setStatusFilter] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('newest')
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [showCreate, setShowCreate] = useState(false)
  const [completing, setCompleting] = useState(null)
  const [form, setForm] = useState({ source: '', destination: '', cargoWeight: '', plannedDistance: '', vehicleId: '', driverId: '' })
  const [completeForm, setCompleteForm] = useState({ finalOdometer: '', fuelConsumed: '' })
  const [error, setError] = useState('')
  const [suggestion, setSuggestion] = useState(null)
  const [loading, setLoading] = useState(true)

  const isAdmin = user?.role === 'ADMIN' || user?.role === 'FLEET_MANAGER'

  useEffect(() => {
    load()
  }, [])

  async function load() {
    setLoading(true)
    try {
      const { data } = await api.get('/trips')
      setTrips(Array.isArray(data) ? data : [])
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  async function openCreate() {
    setError('')
    setSuggestion(null)
    try {
      const [v, d] = await Promise.all([
        api.get('/vehicles/dispatchable'),
        api.get('/drivers/dispatchable'),
      ])
      setVehicles(v.data || [])
      setDrivers(d.data || [])
      setShowCreate(true)
    } catch (err) {
      console.error(err)
    }
  }

  async function handleSuggest() {
    if (!form.cargoWeight) return
    try {
      const { data } = await api.get('/trips/suggest-vehicle', { params: { cargoWeight: form.cargoWeight } })
      setSuggestion(data)
      setForm({ ...form, vehicleId: data.id })
    } catch (err) {
      setError(err.response?.data?.message || 'No suitable vehicle found')
    }
  }

  async function handleCreate(e) {
    e.preventDefault()
    setError('')
    try {
      await api.post('/trips', {
        ...form,
        cargoWeight: parseFloat(form.cargoWeight),
        plannedDistance: form.plannedDistance ? parseFloat(form.plannedDistance) : null,
        vehicleId: parseInt(form.vehicleId),
        driverId: parseInt(form.driverId),
      })
      setShowCreate(false)
      setForm({ source: '', destination: '', cargoWeight: '', plannedDistance: '', vehicleId: '', driverId: '' })
      load()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create trip')
    }
  }

  async function handleDispatch(id) {
    try {
      await api.patch(`/trips/${id}/dispatch`)
      load()
    } catch (err) {
      alert(err.response?.data?.message || 'Dispatch failed')
    }
  }

  async function handleCancel(id) {
    if (!confirm('Cancel this trip?')) return
    try {
      await api.patch(`/trips/${id}/cancel`)
      load()
    } catch (err) {
      alert(err.response?.data?.message || 'Cancel failed')
    }
  }

  async function handleComplete(e) {
    e.preventDefault()
    try {
      await api.patch(`/trips/${completing.id}/complete`, {
        finalOdometer: parseFloat(completeForm.finalOdometer),
        fuelConsumed: parseFloat(completeForm.fuelConsumed),
      })
      setCompleting(null)
      setCompleteForm({ finalOdometer: '', fuelConsumed: '' })
      load()
    } catch (err) {
      alert(err.response?.data?.message || 'Complete failed')
    }
  }

  // ── Filter & Sort Pipelines ──
  const filteredTrips = useMemo(() => {
    return trips.filter((t) => {
      // Status filter
      if (statusFilter && t.status !== statusFilter) return false

      // Search query filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        const tripNum = (t.tripNumber || `TRIP-${t.id}`).toLowerCase()
        const src = (t.source || '').toLowerCase()
        const dst = (t.destination || '').toLowerCase()
        const veh = (t.vehicle?.name || t.vehicle?.registrationNumber || '').toLowerCase()
        const drv = (t.driver?.name || '').toLowerCase()

        if (
          !tripNum.includes(query) &&
          !src.includes(query) &&
          !dst.includes(query) &&
          !veh.includes(query) &&
          !drv.includes(query)
        ) {
          return false
        }
      }
      return true
    }).sort((a, b) => {
      if (sortBy === 'newest') return (b.id || 0) - (a.id || 0)
      if (sortBy === 'oldest') return (a.id || 0) - (b.id || 0)
      if (sortBy === 'revenueDesc') return (b.revenue || 0) - (a.revenue || 0)
      if (sortBy === 'revenueAsc') return (a.revenue || 0) - (b.revenue || 0)
      if (sortBy === 'weightDesc') return (b.cargoWeight || 0) - (a.cargoWeight || 0)
      return 0
    })
  }, [trips, statusFilter, searchQuery, sortBy])

  // Paginated slice
  const paginatedTrips = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return filteredTrips.slice(start, start + pageSize)
  }, [filteredTrips, currentPage, pageSize])

  return (
    <div className="space-y-6 pb-12">
      {/* ── HEADER ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl">🛣️</span>
            <h1 className="text-xl sm:text-2xl font-black text-slate-100 tracking-tight">Trip Dispatcher & Scheduling</h1>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              {filteredTrips.length} / {trips.length} TRIPS
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">Lifecycle state transitions (Draft → Dispatched → Completed/Cancelled) with auto vehicle & driver locks</p>
        </div>
        {isAdmin && (
          <button className="btn-primary px-4 py-2.5 text-xs font-bold rounded-xl shadow-lg shadow-cyan-500/10" onClick={openCreate}>
            + Create New Trip
          </button>
        )}
      </div>

      {/* ── MULTI-FILTER & SEARCH TOOLBAR ── */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 bg-slate-900/40 p-3.5 border border-slate-800/80 rounded-2xl">
        {/* Search input */}
        <div className="sm:col-span-5 relative">
          <input
            type="text"
            placeholder="🔍 Search by Trip #, Route, Vehicle, Driver..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value)
              setCurrentPage(1)
            }}
            className="input w-full pl-3 pr-8 text-xs py-2 bg-slate-850/80 border-slate-700/80 rounded-xl placeholder:text-slate-500 text-slate-200"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 text-xs"
            >
              ✕
            </button>
          )}
        </div>

        {/* Status filter */}
        <div className="sm:col-span-4">
          <select
            className="input w-full text-xs py-2 bg-slate-850/80 border-slate-700/80 rounded-xl text-slate-200"
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value)
              setCurrentPage(1)
            }}
          >
            <option value="">All Trip Statuses ({trips.length})</option>
            <option value="DRAFT">Draft (Pending Dispatch)</option>
            <option value="DISPATCHED">Dispatched (Active on Route)</option>
            <option value="COMPLETED">Completed Trips</option>
            <option value="CANCELLED">Cancelled Trips</option>
          </select>
        </div>

        {/* Sort by */}
        <div className="sm:col-span-3">
          <select
            className="input w-full text-xs py-2 bg-slate-850/80 border-slate-700/80 rounded-xl text-slate-200"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="newest">Sort: Newest First</option>
            <option value="oldest">Sort: Oldest First</option>
            <option value="revenueDesc">Revenue: High → Low</option>
            <option value="revenueAsc">Revenue: Low → High</option>
            <option value="weightDesc">Cargo Weight: High → Low</option>
          </select>
        </div>
      </div>

      {/* ── RESPONSIVE TABLE CONTAINER ── */}
      <div className="card overflow-hidden border border-slate-800 rounded-2xl shadow-lg bg-slate-900/90">
        <div className="overflow-x-auto">
          <table className="w-full table-shell min-w-[750px]">
            <thead className="bg-slate-950/80 border-b border-slate-800 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              <tr>
                <th className="py-3.5 px-4 text-left">Trip ID</th>
                <th className="py-3.5 px-4 text-left">Route (Origin → Dest)</th>
                <th className="py-3.5 px-4 text-left">Payload & Dist.</th>
                <th className="py-3.5 px-4 text-left">Vehicle Asset</th>
                <th className="py-3.5 px-4 text-left">Driver</th>
                <th className="py-3.5 px-4 text-left">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs">
              {loading ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-slate-400">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin" />
                      <span>Loading dynamic trips dataset...</span>
                    </div>
                  </td>
                </tr>
              ) : paginatedTrips.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-slate-500">
                    No trips found matching filter criteria.
                  </td>
                </tr>
              ) : (
                paginatedTrips.map((trip) => (
                  <tr key={trip.id} className="hover:bg-slate-850/50 transition-colors">
                    <td className="py-3 px-4 font-mono font-semibold text-cyan-400">
                      {trip.tripNumber || `TRIP-${trip.id}`}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-200">{trip.source} → {trip.destination}</div>
                      {trip.revenue && (
                        <div className="text-[10px] text-emerald-400 font-mono mt-0.5">
                          ₹{Number(trip.revenue).toLocaleString()}
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4 text-slate-300">
                      <div><span className="text-slate-400">Cargo:</span> {trip.cargoWeight} kg</div>
                      {trip.plannedDistance && (
                        <div className="text-[10px] text-slate-500">{trip.plannedDistance} km dist</div>
                      )}
                    </td>
                    <td className="py-3 px-4 text-slate-300">
                      {trip.vehicle ? (
                        <div>
                          <span className="font-semibold text-slate-200">{trip.vehicle.name}</span>
                          <span className="block text-[10px] text-slate-400 font-mono">{trip.vehicle.registrationNumber}</span>
                        </div>
                      ) : (
                        <span className="text-slate-600">—</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-slate-300">
                      {trip.driver ? (
                        <span className="font-semibold text-slate-200">{trip.driver.name}</span>
                      ) : (
                        <span className="text-slate-600">—</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge status={trip.status} />
                      {trip.fuelTheftSuspected && (
                        <span className="ml-1.5 text-[9px] px-1.5 py-0.5 rounded bg-red-500/10 text-red-400 border border-red-500/30">
                          🚨 Fuel Anomaly
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right space-x-2">
                      {trip.status === 'DRAFT' && isAdmin && (
                        <>
                          <button
                            className="px-2 py-1 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded text-[11px] font-bold transition-all"
                            onClick={() => handleDispatch(trip.id)}
                          >
                            Dispatch
                          </button>
                          <button
                            className="px-2 py-1 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 rounded text-[11px] font-bold transition-all"
                            onClick={() => handleCancel(trip.id)}
                          >
                            Cancel
                          </button>
                        </>
                      )}
                      {trip.status === 'DISPATCHED' && (
                        <>
                          <button
                            className="px-2 py-1 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 rounded text-[11px] font-bold transition-all"
                            onClick={() => {
                              setCompleting(trip)
                              setCompleteForm({
                                finalOdometer: trip.vehicle ? String((trip.vehicle.odometer || 0) + (trip.plannedDistance || 100)) : '',
                                fuelConsumed: trip.plannedDistance ? String(Math.round(trip.plannedDistance / 4.2)) : '',
                              })
                            }}
                          >
                            Complete
                          </button>
                          {isAdmin && (
                            <button
                              className="px-2 py-1 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 rounded text-[11px] font-bold transition-all"
                              onClick={() => handleCancel(trip.id)}
                            >
                              Cancel
                            </button>
                          )}
                        </>
                      )}
                      {trip.status === 'COMPLETED' && trip.finalOdometer && (
                        <span className="text-[10px] text-slate-500 font-mono">
                          {trip.fuelConsumed ? `${trip.fuelConsumed}L` : ''}
                        </span>
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
          totalItems={filteredTrips.length}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          onPageSizeChange={setPageSize}
          pageSizeOptions={[10, 25, 50, 100]}
        />
      </div>

      {/* ── CREATE DRAFT MODAL ── */}
      {showCreate && (
        <Modal title="Create New Trip Draft" onClose={() => setShowCreate(false)}>
          <form onSubmit={handleCreate} className="space-y-4">
            {error && <div className="p-3 text-xs bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl">{error}</div>}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Origin Source *</label>
                <input
                  required
                  placeholder="e.g. Mumbai Port"
                  className="input w-full"
                  value={form.source}
                  onChange={(e) => setForm({ ...form, source: e.target.value })}
                />
              </div>
              <div>
                <label className="label">Destination *</label>
                <input
                  required
                  placeholder="e.g. Pune Hub"
                  className="input w-full"
                  value={form.destination}
                  onChange={(e) => setForm({ ...form, destination: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Cargo Weight (kg) *</label>
                <div className="flex gap-2">
                  <input
                    required
                    type="number"
                    step="any"
                    placeholder="e.g. 12000"
                    className="input w-full"
                    value={form.cargoWeight}
                    onChange={(e) => setForm({ ...form, cargoWeight: e.target.value })}
                  />
                  <button type="button" className="btn-secondary px-3 py-1 text-xs whitespace-nowrap" onClick={handleSuggest}>
                    AI Match
                  </button>
                </div>
              </div>
              <div>
                <label className="label">Planned Dist (km)</label>
                <input
                  type="number"
                  step="any"
                  placeholder="e.g. 165"
                  className="input w-full"
                  value={form.plannedDistance}
                  onChange={(e) => setForm({ ...form, plannedDistance: e.target.value })}
                />
              </div>
            </div>

            {suggestion && (
              <div className="p-3 bg-cyan-500/10 border border-cyan-500/20 rounded-xl text-xs text-cyan-300">
                ✨ <strong>AI Suggestion:</strong> Assigned {suggestion.name} ({suggestion.registrationNumber}) — Capacity: {suggestion.maxLoadCapacity} kg
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Select Vehicle Asset *</label>
                <select
                  required
                  className="input w-full"
                  value={form.vehicleId}
                  onChange={(e) => setForm({ ...form, vehicleId: e.target.value })}
                >
                  <option value="">-- Choose Available Vehicle --</option>
                  {vehicles.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.name} ({v.registrationNumber}) - Max: {v.maxLoadCapacity} kg
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label">Select Assigned Driver *</label>
                <select
                  required
                  className="input w-full"
                  value={form.driverId}
                  onChange={(e) => setForm({ ...form, driverId: e.target.value })}
                >
                  <option value="">-- Choose Available Driver --</option>
                  {drivers.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name} ({d.licenseCategory || 'Commercial'})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
              <button type="button" className="btn-secondary px-4 py-2" onClick={() => setShowCreate(false)}>
                Cancel
              </button>
              <button type="submit" className="btn-primary px-5 py-2">
                Create Trip
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* ── COMPLETE TRIP MODAL ── */}
      {completing && (
        <Modal title={`Complete Trip #${completing.tripNumber || completing.id}`} onClose={() => setCompleting(null)}>
          <form onSubmit={handleComplete} className="space-y-4">
            <p className="text-xs text-slate-400">
              Record final trip telemetry to close route, release vehicle asset and evaluate fuel consumption deviation.
            </p>
            <div>
              <label className="label">Final Odometer Reading (km) *</label>
              <input
                required
                type="number"
                step="any"
                className="input w-full"
                value={completeForm.finalOdometer}
                onChange={(e) => setCompleteForm({ ...completeForm, finalOdometer: e.target.value })}
              />
            </div>
            <div>
              <label className="label">Actual Fuel Consumed (Liters) *</label>
              <input
                required
                type="number"
                step="any"
                className="input w-full"
                value={completeForm.fuelConsumed}
                onChange={(e) => setCompleteForm({ ...completeForm, fuelConsumed: e.target.value })}
              />
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
              <button type="button" className="btn-secondary px-4 py-2" onClick={() => setCompleting(null)}>
                Cancel
              </button>
              <button type="submit" className="btn-primary px-5 py-2">
                Submit & Close Trip
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}
