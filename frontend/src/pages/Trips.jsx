import { useEffect, useState } from 'react'
import api from '../api/axios'
import Navbar from '../components/Navbar'
import StatusBadge from '../components/StatusBadge'
import Modal from '../components/Modal'

export default function Trips() {
  const [trips, setTrips] = useState([])
  const [vehicles, setVehicles] = useState([])
  const [drivers, setDrivers] = useState([])
  const [statusFilter, setStatusFilter] = useState('')
  const [showCreate, setShowCreate] = useState(false)
  const [completing, setCompleting] = useState(null)
  const [form, setForm] = useState({ source: '', destination: '', cargoWeight: '', plannedDistance: '', vehicleId: '', driverId: '' })
  const [completeForm, setCompleteForm] = useState({ finalOdometer: '', fuelConsumed: '' })
  const [error, setError] = useState('')
  const [suggestion, setSuggestion] = useState(null)

  useEffect(() => { load() }, [statusFilter])

  async function load() {
    const { data } = await api.get('/trips', { params: statusFilter ? { status: statusFilter } : {} })
    setTrips(data)
  }

  async function openCreate() {
    setError('')
    setSuggestion(null)
    const [v, d] = await Promise.all([
      api.get('/vehicles/dispatchable'),
      api.get('/drivers/dispatchable'),
    ])
    setVehicles(v.data)
    setDrivers(d.data)
    setShowCreate(true)
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
    await api.patch(`/trips/${id}/cancel`)
    load()
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

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-7xl mx-auto px-6 py-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-100">Trip Management</h1>
            <p className="text-sm text-slate-500 mt-1">Draft → Dispatched → Completed / Cancelled</p>
          </div>
          <button className="btn-primary" onClick={openCreate}>+ Create Trip</button>
        </div>

        <div className="flex gap-3">
          <select className="input" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="">All statuses</option>
            <option value="DRAFT">Draft</option>
            <option value="DISPATCHED">Dispatched</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>

        <div className="card overflow-hidden">
          <table className="w-full table-shell">
            <thead className="bg-white/[0.02]">
              <tr>
                <th>Trip #</th>
                <th>Route</th>
                <th>Cargo</th>
                <th>Vehicle</th>
                <th>Driver</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {trips.map((t) => (
                <tr key={t.id} className="hover:bg-white/[0.02]">
                  <td className="font-mono text-slate-300">{t.tripNumber}</td>
                  <td className="text-[#E2E0FF]">{t.source} → {t.destination}</td>
                  <td className="font-mono text-[rgba(196,190,255,0.55)]">{t.cargoWeight} kg</td>
                  <td className="text-[rgba(196,190,255,0.55)]">{t.vehicle?.registrationNumber}</td>
                  <td className="text-[rgba(196,190,255,0.55)]">{t.driver?.name}</td>
                  <td><StatusBadge status={t.status} /></td>
                  <td>
                    <div className="flex gap-2 justify-end">
                      {t.status === 'DRAFT' && (
                        <>
                          <button className="text-xs text-route-cyan hover:underline" onClick={() => handleDispatch(t.id)}>Dispatch</button>
                          <button className="text-xs text-route-red hover:underline" onClick={() => handleCancel(t.id)}>Cancel</button>
                        </>
                      )}
                      {t.status === 'DISPATCHED' && (
                        <>
                          <button className="text-xs text-route-green hover:underline" onClick={() => setCompleting(t)}>Complete</button>
                          <button className="text-xs text-route-red hover:underline" onClick={() => handleCancel(t.id)}>Cancel</button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {trips.length === 0 && (
                <tr><td colSpan={7} className="text-center text-slate-500 py-8">No trips yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </main>

      {showCreate && (
        <Modal title="Create Trip" onClose={() => setShowCreate(false)}>
          <form onSubmit={handleCreate} className="space-y-3">
            {error && <div className="text-sm text-route-red bg-route-red/10 rounded-md px-3 py-2">{error}</div>}
            <input required className="input w-full" placeholder="Source" value={form.source} onChange={(e) => setForm({ ...form, source: e.target.value })} />
            <input required className="input w-full" placeholder="Destination" value={form.destination} onChange={(e) => setForm({ ...form, destination: e.target.value })} />
            <div className="flex gap-2">
              <input required type="number" className="input flex-1" placeholder="Cargo weight (kg)" value={form.cargoWeight} onChange={(e) => setForm({ ...form, cargoWeight: e.target.value })} />
              <button type="button" className="btn-ghost text-xs whitespace-nowrap" onClick={handleSuggest}>✨ AI Suggest</button>
            </div>
            {suggestion && (
              <div className="text-xs text-route-cyan bg-route-cyan/10 rounded-md px-3 py-2">
                Suggested: {suggestion.registrationNumber} ({suggestion.maxLoadCapacity} kg capacity)
              </div>
            )}
            <input type="number" className="input w-full" placeholder="Planned distance (km)" value={form.plannedDistance} onChange={(e) => setForm({ ...form, plannedDistance: e.target.value })} />

            <div>
              <label className="block text-xs text-slate-500 mb-1">Vehicle (Available only)</label>
              <select required className="input w-full" value={form.vehicleId} onChange={(e) => setForm({ ...form, vehicleId: e.target.value })}>
                <option value="">Select vehicle…</option>
                {vehicles.map((v) => <option key={v.id} value={v.id}>{v.registrationNumber} — {v.name} ({v.maxLoadCapacity} kg)</option>)}
              </select>
            </div>

            <div>
              <label className="block text-xs text-slate-500 mb-1">Driver (Available only)</label>
              <select required className="input w-full" value={form.driverId} onChange={(e) => setForm({ ...form, driverId: e.target.value })}>
                <option value="">Select driver…</option>
                {drivers.map((d) => <option key={d.id} value={d.id}>{d.name} — {d.licenseNumber}</option>)}
              </select>
            </div>

            <button type="submit" className="btn-primary w-full">Create Draft</button>
          </form>
        </Modal>
      )}

      {completing && (
        <Modal title={`Complete Trip ${completing.tripNumber}`} onClose={() => setCompleting(null)}>
          <form onSubmit={handleComplete} className="space-y-3">
            <input required type="number" className="input w-full" placeholder="Final odometer (km)" value={completeForm.finalOdometer} onChange={(e) => setCompleteForm({ ...completeForm, finalOdometer: e.target.value })} />
            <input required type="number" className="input w-full" placeholder="Fuel consumed (liters)" value={completeForm.fuelConsumed} onChange={(e) => setCompleteForm({ ...completeForm, fuelConsumed: e.target.value })} />
            <button type="submit" className="btn-primary w-full">Mark Completed</button>
          </form>
        </Modal>
      )}
    </div>
  )
}
