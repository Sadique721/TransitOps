import { useEffect, useState } from 'react'
import api from '../api/axios'
import Navbar from '../components/Navbar'
import Modal from '../components/Modal'

export default function Maintenance() {
  const [vehicles, setVehicles] = useState([])
  const [logsByVehicle, setLogsByVehicle] = useState({})
  const [showCreate, setShowCreate] = useState(false)
  const [form, setForm] = useState({ vehicleId: '', description: '', cost: '', maintenanceDate: '' })
  const [error, setError] = useState('')

  useEffect(() => { load() }, [])

  async function load() {
    const { data } = await api.get('/vehicles')
    setVehicles(data)
    const entries = await Promise.all(
      data.map(async (v) => {
        const { data: logs } = await api.get(`/maintenance/vehicle/${v.id}`)
        return [v.id, logs]
      })
    )
    setLogsByVehicle(Object.fromEntries(entries))
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
    await api.patch(`/maintenance/${logId}/close`)
    load()
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-7xl mx-auto px-6 py-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-100">Maintenance Logs</h1>
            <p className="text-sm text-slate-500 mt-1">Active records auto-move a vehicle to In Shop</p>
          </div>
          <button className="btn-primary" onClick={() => setShowCreate(true)}>+ New Record</button>
        </div>

        <div className="space-y-4">
          {vehicles.map((v) => {
            const logs = logsByVehicle[v.id] || []
            if (logs.length === 0) return null
            return (
              <div key={v.id} className="card p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <span className="font-mono text-[#E2E0FF]">{v.registrationNumber}</span>
                    <span className="text-slate-500 text-sm ml-2">{v.name}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  {logs.map((log) => (
                    <div key={log.id} className="flex items-center justify-between bg-white/[0.02] rounded-md px-3 py-2">
                      <div>
                        <div className="text-sm text-[#E2E0FF]">{log.description}</div>
                        <div className="text-xs text-slate-500">{log.maintenanceDate} {log.cost ? `· ₹${log.cost}` : ''}</div>
                      </div>
                      {log.isActive ? (
                        <button className="btn-ghost text-xs" onClick={() => handleClose(log.id)}>Close</button>
                      ) : (
                        <span className="text-xs text-slate-500">Closed</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
          {vehicles.every((v) => (logsByVehicle[v.id] || []).length === 0) && (
            <div className="card p-8 text-center text-slate-500 text-sm">No maintenance records yet.</div>
          )}
        </div>
      </main>

      {showCreate && (
        <Modal title="New Maintenance Record" onClose={() => setShowCreate(false)}>
          <form onSubmit={handleCreate} className="space-y-3">
            {error && <div className="text-sm text-route-red bg-route-red/10 rounded-md px-3 py-2">{error}</div>}
            <div>
              <label className="block text-xs text-slate-500 mb-1">Vehicle</label>
              <select required className="input w-full" value={form.vehicleId} onChange={(e) => setForm({ ...form, vehicleId: e.target.value })}>
                <option value="">Select vehicle…</option>
                {vehicles.filter((v) => v.status !== 'RETIRED' && v.status !== 'ON_TRIP').map((v) => (
                  <option key={v.id} value={v.id}>{v.registrationNumber} — {v.name}</option>
                ))}
              </select>
            </div>
            <input required className="input w-full" placeholder="Description (e.g. Oil Change)" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            <input type="number" className="input w-full" placeholder="Cost (₹)" value={form.cost} onChange={(e) => setForm({ ...form, cost: e.target.value })} />
            <input type="date" className="input w-full" value={form.maintenanceDate} onChange={(e) => setForm({ ...form, maintenanceDate: e.target.value })} />
            <button type="submit" className="btn-primary w-full">Create Record</button>
          </form>
        </Modal>
      )}
    </div>
  )
}
