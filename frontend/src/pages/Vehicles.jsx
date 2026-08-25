import { useEffect, useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import api from '../api/axios'
import Navbar from '../components/Navbar'
import StatusBadge from '../components/StatusBadge'
import Modal from '../components/Modal'

const VEHICLE_TYPES = ['TRUCK', 'VAN', 'BIKE', 'CAR', 'OTHER']

export default function Vehicles() {
  const [vehicles, setVehicles] = useState([])
  const [statusFilter, setStatusFilter] = useState('')
  const [search, setSearch] = useState('')
  const [showCreate, setShowCreate] = useState(false)
  const [qrVehicle, setQrVehicle] = useState(null)
  const [form, setForm] = useState({ registrationNumber: '', name: '', model: '', type: 'TRUCK', maxLoadCapacity: '', acquisitionCost: '', region: '' })
  const [error, setError] = useState('')

  useEffect(() => { load() }, [statusFilter])

  async function load() {
    const { data } = await api.get('/vehicles', { params: statusFilter ? { status: statusFilter } : {} })
    setVehicles(data)
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
    await api.delete(`/vehicles/${id}`)
    load()
  }

  const filtered = vehicles.filter((v) =>
    (v.name + v.registrationNumber).toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-7xl mx-auto px-6 py-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-100">Vehicle Registry</h1>
            <p className="text-sm text-[rgba(167,139,250,0.45)] mt-1">{vehicles.length} vehicles on record</p>
          </div>
          <button className="btn-primary" onClick={() => setShowCreate(true)}>+ Register Vehicle</button>
        </div>

        <div className="flex items-center gap-3">
          <input className="input flex-1 max-w-xs" placeholder="Search name or reg. number…" value={search} onChange={(e) => setSearch(e.target.value)} />
          <select className="input" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="">All statuses</option>
            <option value="AVAILABLE">Available</option>
            <option value="ON_TRIP">On Trip</option>
            <option value="IN_SHOP">In Shop</option>
            <option value="RETIRED">Retired</option>
          </select>
        </div>

        <div className="card overflow-hidden">
          <table className="w-full table-shell">
            <thead className="bg-white/[0.02]">
              <tr>
                <th>Registration</th>
                <th>Name / Model</th>
                <th>Type</th>
                <th>Capacity</th>
                <th>Odometer</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((v) => (
                <tr key={v.id} className="hover:bg-white/[0.02]">
                  <td className="font-mono text-[#C4BEFF]">{v.registrationNumber}</td>
                  <td>
                    <div className="text-[#E2E0FF]">{v.name}</div>
                    <div className="text-xs text-[rgba(167,139,250,0.45)]">{v.model}</div>
                  </td>
                  <td className="text-[rgba(196,190,255,0.55)]">{v.type}</td>
                  <td className="font-mono text-[#C4BEFF]">{v.maxLoadCapacity} kg</td>
                  <td className="font-mono text-[rgba(196,190,255,0.55)]">{v.odometer} km</td>
                  <td><StatusBadge status={v.status} /></td>
                  <td>
                    <div className="flex gap-2 justify-end">
                      <button className="text-xs text-route-cyan hover:underline" onClick={() => setQrVehicle(v)}>QR</button>
                      {v.status !== 'RETIRED' && (
                        <button className="text-xs text-route-red hover:underline" onClick={() => handleRetire(v.id)}>Retire</button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={7} className="text-center text-[rgba(167,139,250,0.45)] py-8">No vehicles match.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </main>

      {showCreate && (
        <Modal title="Register Vehicle" onClose={() => setShowCreate(false)}>
          <form onSubmit={handleCreate} className="space-y-3">
            {error && <div className="text-sm text-route-red bg-route-red/10 rounded-md px-3 py-2">{error}</div>}
            <input required className="input w-full" placeholder="Registration number" value={form.registrationNumber} onChange={(e) => setForm({ ...form, registrationNumber: e.target.value })} />
            <input required className="input w-full" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <input className="input w-full" placeholder="Model" value={form.model} onChange={(e) => setForm({ ...form, model: e.target.value })} />
            <select className="input w-full" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
              {VEHICLE_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
            <input required type="number" className="input w-full" placeholder="Max load capacity (kg)" value={form.maxLoadCapacity} onChange={(e) => setForm({ ...form, maxLoadCapacity: e.target.value })} />
            <input type="number" className="input w-full" placeholder="Acquisition cost (₹)" value={form.acquisitionCost} onChange={(e) => setForm({ ...form, acquisitionCost: e.target.value })} />
            <input className="input w-full" placeholder="Region" value={form.region} onChange={(e) => setForm({ ...form, region: e.target.value })} />
            <button type="submit" className="btn-primary w-full">Register</button>
          </form>
        </Modal>
      )}

      {qrVehicle && (
        <Modal title={`QR — ${qrVehicle.registrationNumber}`} onClose={() => setQrVehicle(null)}>
          <div className="flex flex-col items-center gap-4 py-4">
            <div className="bg-white p-4 rounded-lg">
              <QRCodeSVG value={qrVehicle.qrCode || qrVehicle.registrationNumber} size={180} />
            </div>
            <p className="text-xs text-[rgba(167,139,250,0.45)] font-mono">{qrVehicle.qrCode}</p>
          </div>
        </Modal>
      )}
    </div>
  )
}
