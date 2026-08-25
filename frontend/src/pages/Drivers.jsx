import { useEffect, useState } from 'react'
import api from '../api/axios'
import Navbar from '../components/Navbar'
import StatusBadge from '../components/StatusBadge'
import Modal from '../components/Modal'

export default function Drivers() {
  const [drivers, setDrivers] = useState([])
  const [showCreate, setShowCreate] = useState(false)
  const [form, setForm] = useState({ name: '', licenseNumber: '', licenseCategory: '', licenseExpiryDate: '', contactNumber: '' })
  const [error, setError] = useState('')

  useEffect(() => { load() }, [])

  async function load() {
    const { data } = await api.get('/drivers')
    setDrivers(data)
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

  function isExpired(date) {
    return new Date(date) < new Date()
  }

  function isExpiringSoon(date) {
    const d = new Date(date)
    const in7 = new Date()
    in7.setDate(in7.getDate() + 7)
    return d >= new Date() && d <= in7
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-7xl mx-auto px-6 py-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-100">Driver Management</h1>
            <p className="text-sm text-[rgba(167,139,250,0.45)] mt-1">{drivers.length} drivers on record</p>
          </div>
          <button className="btn-primary" onClick={() => setShowCreate(true)}>+ Add Driver</button>
        </div>

        <div className="card overflow-hidden">
          <table className="w-full table-shell">
            <thead className="bg-white/[0.02]">
              <tr>
                <th>Name</th>
                <th>License No.</th>
                <th>Category</th>
                <th>Expiry</th>
                <th>Safety Score</th>
                <th>Contact</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {drivers.map((d) => (
                <tr key={d.id} className="hover:bg-white/[0.02]">
                  <td className="text-[#E2E0FF]">{d.name}</td>
                  <td className="font-mono text-slate-300">{d.licenseNumber}</td>
                  <td className="text-[rgba(196,190,255,0.55)]">{d.licenseCategory || '—'}</td>
                  <td>
                    <span className={
                      isExpired(d.licenseExpiryDate) ? 'text-route-red font-medium' :
                      isExpiringSoon(d.licenseExpiryDate) ? 'text-route-amber font-medium' :
                      'text-slate-300'
                    }>
                      {d.licenseExpiryDate}
                      {isExpired(d.licenseExpiryDate) && ' (Expired)'}
                    </span>
                  </td>
                  <td className="font-mono text-slate-300">{d.safetyScore}</td>
                  <td className="text-[rgba(196,190,255,0.55)]">{d.contactNumber || '—'}</td>
                  <td><StatusBadge status={d.status} /></td>
                </tr>
              ))}
              {drivers.length === 0 && (
                <tr><td colSpan={7} className="text-center text-[rgba(167,139,250,0.45)] py-8">No drivers registered yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </main>

      {showCreate && (
        <Modal title="Add Driver" onClose={() => setShowCreate(false)}>
          <form onSubmit={handleCreate} className="space-y-3">
            {error && <div className="text-sm text-route-red bg-route-red/10 rounded-md px-3 py-2">{error}</div>}
            <input required className="input w-full" placeholder="Full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <input required className="input w-full" placeholder="License number" value={form.licenseNumber} onChange={(e) => setForm({ ...form, licenseNumber: e.target.value })} />
            <input className="input w-full" placeholder="License category" value={form.licenseCategory} onChange={(e) => setForm({ ...form, licenseCategory: e.target.value })} />
            <div>
              <label className="block text-xs text-[rgba(167,139,250,0.45)] mb-1">License expiry date</label>
              <input required type="date" className="input w-full" value={form.licenseExpiryDate} onChange={(e) => setForm({ ...form, licenseExpiryDate: e.target.value })} />
            </div>
            <input className="input w-full" placeholder="Contact number" value={form.contactNumber} onChange={(e) => setForm({ ...form, contactNumber: e.target.value })} />
            <button type="submit" className="btn-primary w-full">Add Driver</button>
          </form>
        </Modal>
      )}
    </div>
  )
}
