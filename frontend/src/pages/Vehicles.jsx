import { useEffect, useState, useMemo } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import api from '../api/axios'
import StatusBadge from '../components/StatusBadge'
import Modal from '../components/Modal'
import Pagination from '../components/Pagination'
import { useAuth } from '../context/AuthContext'

const VEHICLE_TYPES = ['TRUCK', 'VAN', 'BIKE', 'CAR', 'OTHER']

export default function Vehicles() {
  const { user } = useAuth() || {}
  const [vehicles, setVehicles] = useState([])
  const [statusFilter, setStatusFilter] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [regionFilter, setRegionFilter] = useState('')
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState('newest')
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [showCreate, setShowCreate] = useState(false)
  const [qrVehicle, setQrVehicle] = useState(null)
  const [healthVehicle, setHealthVehicle] = useState(null)
  const [healthData, setHealthData] = useState(null)
  const [healthLoading, setHealthLoading] = useState(false)
  const [form, setForm] = useState({ registrationNumber: '', name: '', model: '', type: 'TRUCK', maxLoadCapacity: '', acquisitionCost: '', region: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  const isAdmin = user?.role === 'ADMIN' || user?.role === 'FLEET_MANAGER'

  useEffect(() => {
    load()
  }, [])

  async function load() {
    setLoading(true)
    try {
      const { data } = await api.get('/vehicles')
      setVehicles(Array.isArray(data) ? data : [])
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
      await api.post('/vehicles', {
        ...form,
        maxLoadCapacity: parseFloat(form.maxLoadCapacity),
        acquisitionCost: form.acquisitionCost ? parseFloat(form.acquisitionCost) : null,
      })
      setShowCreate(false)
      setForm({ registrationNumber: '', name: '', model: '', type: 'TRUCK', maxLoadCapacity: '', acquisitionCost: '', region: '' })
      load()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create vehicle')
    }
  }

  async function handleRetire(id) {
    if (!confirm('Retire this vehicle? This is permanent.')) return
    try {
      await api.delete(`/vehicles/${id}`)
      load()
    } catch (err) {
      alert(err.response?.data?.message || 'Retire failed')
    }
  }

  async function openHealthScore(v) {
    setHealthVehicle(v)
    setHealthLoading(true)
    setHealthData(null)
    try {
      const { data } = await api.get(`/vehicles/${v.id}/health-score`)
      setHealthData(data)
    } catch (err) {
      console.error(err)
    } finally {
      setHealthLoading(false)
    }
  }

  // ── Multi-Filter & Search Pipeline ──
  const filteredVehicles = useMemo(() => {
    return vehicles.filter((v) => {
      if (statusFilter && v.status !== statusFilter) return false
      if (typeFilter && v.type !== typeFilter) return false
      if (regionFilter && !(v.region || '').includes(regionFilter)) return false

      if (search) {
        const query = search.toLowerCase()
        const match = (
          (v.name || '').toLowerCase().includes(query) ||
          (v.registrationNumber || '').toLowerCase().includes(query) ||
          (v.model || '').toLowerCase().includes(query) ||
          (v.region || '').toLowerCase().includes(query)
        )
        if (!match) return false
      }
      return true
    }).sort((a, b) => {
      if (sortBy === 'newest') return (b.id || 0) - (a.id || 0)
      if (sortBy === 'oldest') return (a.id || 0) - (b.id || 0)
      if (sortBy === 'odometerDesc') return (b.odometer || 0) - (a.odometer || 0)
      if (sortBy === 'capacityDesc') return (b.maxLoadCapacity || 0) - (a.maxLoadCapacity || 0)
      if (sortBy === 'costDesc') return (b.acquisitionCost || 0) - (a.acquisitionCost || 0)
      return 0
    })
  }, [vehicles, statusFilter, typeFilter, regionFilter, search, sortBy])

  const paginatedVehicles = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return filteredVehicles.slice(start, start + pageSize)
  }, [filteredVehicles, currentPage, pageSize])

  return (
    <div className="space-y-6 pb-12">
      {/* ── HEADER ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl">🚚</span>
            <h1 className="text-xl sm:text-2xl font-black text-slate-100 tracking-tight">Vehicle Registry & Diagnostics</h1>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              {filteredVehicles.length} / {vehicles.length} ASSETS
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">Lifecycle status, telemetry load limits, QR identifiers, and health telemetry</p>
        </div>
        {isAdmin && (
          <button className="btn-primary flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs shadow-lg shadow-cyan-500/10" onClick={() => setShowCreate(true)}>
            <span>+</span> Register New Vehicle
          </button>
        )}
      </div>

      {/* ── MULTI-FILTER TOOLBAR ── */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 bg-slate-900/40 p-3.5 border border-slate-800/80 rounded-2xl">
        {/* Search Input */}
        <div className="sm:col-span-4 relative">
          <input
            type="text"
            placeholder="🔍 Search Reg #, Model, Asset Name..."
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
            <option value="">All Statuses ({vehicles.length})</option>
            <option value="AVAILABLE">Available</option>
            <option value="ON_TRIP">On Route / Dispatched</option>
            <option value="MAINTENANCE">In Shop (Maintenance)</option>
            <option value="RETIRED">Retired Fleet</option>
          </select>
        </div>

        {/* Type Filter */}
        <div className="sm:col-span-2">
          <select
            className="input w-full text-xs py-2 bg-slate-850/80 border-slate-700/80 rounded-xl text-slate-200"
            value={typeFilter}
            onChange={(e) => {
              setTypeFilter(e.target.value)
              setCurrentPage(1)
            }}
          >
            <option value="">All Types</option>
            {VEHICLE_TYPES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        {/* Sort By */}
        <div className="sm:col-span-3">
          <select
            className="input w-full text-xs py-2 bg-slate-850/80 border-slate-700/80 rounded-xl text-slate-200"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="newest">Sort: Newest First</option>
            <option value="oldest">Sort: Oldest First</option>
            <option value="odometerDesc">Odometer: High → Low</option>
            <option value="capacityDesc">Capacity: High → Low</option>
            <option value="costDesc">Cost: High → Low</option>
          </select>
        </div>
      </div>

      {/* ── RESPONSIVE TABLE CONTAINER ── */}
      <div className="card overflow-hidden border border-slate-800 rounded-2xl shadow-lg bg-slate-900/90">
        <div className="overflow-x-auto">
          <table className="w-full table-shell min-w-[700px]">
            <thead className="bg-slate-950/80 border-b border-slate-800 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              <tr>
                <th className="py-3.5 px-4 text-left">Registration</th>
                <th className="py-3.5 px-4 text-left">Asset Details</th>
                <th className="py-3.5 px-4 text-left">Type & Specs</th>
                <th className="py-3.5 px-4 text-left">Odometer</th>
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
                      <span>Loading dynamic fleet vehicles...</span>
                    </div>
                  </td>
                </tr>
              ) : paginatedVehicles.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-slate-500">
                    No vehicles found matching filter criteria.
                  </td>
                </tr>
              ) : (
                paginatedVehicles.map((v) => (
                  <tr key={v.id} className="hover:bg-slate-850/50 transition-colors">
                    <td className="py-3 px-4 font-mono font-semibold text-cyan-400">
                      {v.registrationNumber}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-200">{v.name}</div>
                      <div className="text-[10px] text-slate-400">{v.model || 'Standard Unit'} {v.region ? `• ${v.region}` : ''}</div>
                    </td>
                    <td className="py-3 px-4 text-slate-300">
                      <span className="font-medium text-slate-200">{v.type || 'TRUCK'}</span>
                      <span className="block text-[10px] text-slate-400">Max: {Number(v.maxLoadCapacity).toLocaleString()} kg</span>
                    </td>
                    <td className="py-3 px-4 text-slate-300 font-mono">
                      {v.odometer ? Number(v.odometer).toLocaleString() : 0} km
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge status={v.status} />
                    </td>
                    <td className="py-3 px-4 text-right space-x-2">
                      <button
                        className="px-2 py-1 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 rounded text-[11px] font-bold transition-all"
                        onClick={() => openHealthScore(v)}
                        title="View Health Score"
                      >
                        ⚡ Health
                      </button>
                      <button
                        className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[11px] font-bold transition-all"
                        onClick={() => setQrVehicle(v)}
                        title="Show Asset QR"
                      >
                        QR
                      </button>
                      {isAdmin && v.status !== 'RETIRED' && (
                        <button
                          className="px-2 py-1 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 rounded text-[11px] font-bold transition-all"
                          onClick={() => handleRetire(v.id)}
                          title="Retire Asset"
                        >
                          Retire
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
          totalItems={filteredVehicles.length}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          onPageSizeChange={setPageSize}
          pageSizeOptions={[10, 25, 50, 100]}
        />
      </div>

      {/* ── CREATE VEHICLE MODAL ── */}
      {showCreate && (
        <Modal title="Register New Vehicle Asset" onClose={() => setShowCreate(false)}>
          <form onSubmit={handleCreate} className="space-y-4">
            {error && <div className="p-3 text-xs bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl">{error}</div>}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Registration Number *</label>
                <input
                  required
                  placeholder="e.g. MH-12-AB-1234"
                  className="input w-full uppercase"
                  value={form.registrationNumber}
                  onChange={(e) => setForm({ ...form, registrationNumber: e.target.value.toUpperCase() })}
                />
              </div>
              <div>
                <label className="label">Vehicle Name *</label>
                <input
                  required
                  placeholder="e.g. Volvo FH16 Globetrotter"
                  className="input w-full"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Model</label>
                <input
                  placeholder="e.g. FH16 2024"
                  className="input w-full"
                  value={form.model}
                  onChange={(e) => setForm({ ...form, model: e.target.value })}
                />
              </div>
              <div>
                <label className="label">Vehicle Type</label>
                <select
                  className="input w-full"
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                >
                  {VEHICLE_TYPES.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Max Payload Capacity (kg) *</label>
                <input
                  required
                  type="number"
                  step="any"
                  placeholder="e.g. 12000"
                  className="input w-full"
                  value={form.maxLoadCapacity}
                  onChange={(e) => setForm({ ...form, maxLoadCapacity: e.target.value })}
                />
              </div>
              <div>
                <label className="label">Acquisition Cost (₹)</label>
                <input
                  type="number"
                  step="any"
                  placeholder="e.g. 3500000"
                  className="input w-full"
                  value={form.acquisitionCost}
                  onChange={(e) => setForm({ ...form, acquisitionCost: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="label">Operating Hub / Region</label>
              <input
                placeholder="e.g. North Zone - Delhi Hub"
                className="input w-full"
                value={form.region}
                onChange={(e) => setForm({ ...form, region: e.target.value })}
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
              <button type="button" className="btn-secondary px-4 py-2" onClick={() => setShowCreate(false)}>
                Cancel
              </button>
              <button type="submit" className="btn-primary px-5 py-2">
                Save & Register Asset
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* ── QR CODE MODAL ── */}
      {qrVehicle && (
        <Modal title={`QR Asset Tag — ${qrVehicle.registrationNumber}`} onClose={() => setQrVehicle(null)}>
          <div className="flex flex-col items-center gap-4 py-4">
            <div className="p-4 bg-white rounded-2xl shadow-xl">
              <QRCodeSVG value={qrVehicle.qrCode || `QR-${qrVehicle.registrationNumber}`} size={180} />
            </div>
            <div className="text-center space-y-1">
              <span className="font-mono text-xs text-cyan-400 font-bold">{qrVehicle.qrCode || `QR-${qrVehicle.registrationNumber}`}</span>
              <p className="text-xs text-slate-400 font-medium">{qrVehicle.name} • {qrVehicle.type}</p>
            </div>
          </div>
        </Modal>
      )}

      {/* ── HEALTH DIAGNOSTICS MODAL ── */}
      {healthVehicle && (
        <Modal title={`Health Diagnostics — ${healthVehicle.registrationNumber}`} onClose={() => setHealthVehicle(null)}>
          {healthLoading ? (
            <div className="p-8 text-center text-slate-400 text-xs">Computing composite diagnostics...</div>
          ) : healthData ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-850 border border-slate-800 rounded-xl">
                <div>
                  <div className="text-xs text-slate-400">Composite Health Score</div>
                  <div className={`text-2xl font-black ${healthData.healthScore >= 80 ? 'text-emerald-400' : healthData.healthScore >= 50 ? 'text-amber-400' : 'text-red-400'}`}>
                    {healthData.healthScore} / 100
                  </div>
                </div>
                <span className={`px-2.5 py-1 text-xs font-bold rounded-lg ${healthData.healthScore >= 80 ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'}`}>
                  {healthData.healthScore >= 80 ? 'Optimal Condition' : 'Service Recommended'}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl">
                  <div className="text-[10px] text-slate-400">Odometer Wear</div>
                  <div className="text-xs font-bold text-slate-200 mt-1">{healthData.odometerWearScore}/100</div>
                </div>
                <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl">
                  <div className="text-[10px] text-slate-400">Repair Frequency</div>
                  <div className="text-xs font-bold text-slate-200 mt-1">{healthData.repairFrequencyScore}/100</div>
                </div>
                <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl">
                  <div className="text-[10px] text-slate-400">Downtime Ratio</div>
                  <div className="text-xs font-bold text-slate-200 mt-1">{healthData.downtimeScore}/100</div>
                </div>
              </div>

              {healthData.recommendations && healthData.recommendations.length > 0 && (
                <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl space-y-1.5">
                  <div className="text-xs font-bold text-slate-300">💡 Telematics Recommendations:</div>
                  <ul className="text-xs text-slate-400 list-disc list-inside space-y-1">
                    {healthData.recommendations.map((rec, idx) => (
                      <li key={idx}>{rec}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <div className="p-4 text-center text-xs text-slate-400">No telemetry health data found.</div>
          )}
        </Modal>
      )}
    </div>
  )
}
