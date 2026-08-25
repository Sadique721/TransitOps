import { useEffect, useRef, useState } from 'react'
import { Client } from '@stomp/stompjs'
import SockJS from 'sockjs-client'
import api from '../api/axios'
import Navbar from '../components/Navbar'
import KpiCard from '../components/KpiCard'

const WS_BASE = import.meta.env.VITE_WS_BASE || 'http://localhost:8080/ws'

export default function Dashboard() {
  const [kpis, setKpis] = useState(null)
  const [feed, setFeed] = useState([])
  const clientRef = useRef(null)

  useEffect(() => {
    loadDashboard()
    connectSocket()
    return () => clientRef.current?.deactivate()
  }, [])

  async function loadDashboard() {
    try {
      const { data } = await api.get('/reports/dashboard')
      setKpis(data)
    } catch (e) {
      console.error(e)
    }
  }

  function connectSocket() {
    const client = new Client({
      webSocketFactory: () => new SockJS(WS_BASE),
      reconnectDelay: 4000,
      onConnect: () => {
        client.subscribe('/topic/trip_updated', (msg) => {
          const body = JSON.parse(msg.body)
          setFeed((prev) => [{ ...body, at: new Date().toLocaleTimeString() }, ...prev].slice(0, 20))
          loadDashboard()
        })
      },
    })
    client.activate()
    clientRef.current = client
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        <div>
          <h1 className="text-2xl font-semibold text-slate-100">Dashboard</h1>
          <p className="text-sm text-slate-500 mt-1">Live fleet operations overview</p>
        </div>

        {kpis ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            <KpiCard label="Total Vehicles" value={kpis.totalVehicles} />
            <KpiCard label="Available" value={kpis.availableVehicles} accent="text-route-green" />
            <KpiCard label="On Trip" value={kpis.onTripVehicles} accent="text-route-cyan" />
            <KpiCard label="In Shop" value={kpis.inShopVehicles} accent="text-route-amber" />
            <KpiCard label="Fleet Utilization" value={kpis.fleetUtilizationPercent} suffix="%" accent="text-route-cyan" />
            <KpiCard label="Active Trips" value={kpis.activeTrips} accent="text-route-cyan" />
            <KpiCard label="Pending (Draft)" value={kpis.pendingTrips} />
            <KpiCard label="Drivers On Duty" value={kpis.driversOnDuty} accent="text-route-cyan" />
            <KpiCard label="Drivers Available" value={kpis.driversAvailable} accent="text-route-green" />
          </div>
        ) : (
          <div className="text-slate-500 text-sm">Loading KPIs…</div>
        )}

        <div className="card p-5">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-2 h-2 rounded-full bg-route-green live-dot" />
            <h2 className="text-sm font-semibold text-slate-200 uppercase tracking-wider">Live Feed</h2>
          </div>
          <div className="route-divider text-route-cyan mb-4" />
          {feed.length === 0 ? (
            <p className="text-sm text-slate-500 font-mono">Waiting for trip activity…</p>
          ) : (
            <ul className="space-y-2 font-mono text-sm">
              {feed.map((item, idx) => (
                <li key={idx} className="flex items-center gap-3 text-slate-300">
                  <span className="text-slate-600">{item.at}</span>
                  <span>{item.message}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </div>
  )
}
