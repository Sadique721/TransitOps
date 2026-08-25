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
  const [fuelAlerts, setFuelAlerts] = useState([])
  const clientRef = useRef(null)

  useEffect(() => {
    loadDashboard()
    loadFuelAlerts()
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

  async function loadFuelAlerts() {
    try {
      const { data } = await api.get('/fuel-intelligence/theft-alerts')
      setFuelAlerts(data)
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
          setFeed((prev) => [{ ...body, type: 'TRIP', at: new Date().toLocaleTimeString() }, ...prev].slice(0, 20))
          loadDashboard()
        })
        client.subscribe('/topic/fuel_alert', (msg) => {
          const body = JSON.parse(msg.body)
          setFeed((prev) => [{ ...body, type: 'FUEL_ALERT', at: new Date().toLocaleTimeString() }, ...prev].slice(0, 20))
          loadFuelAlerts()
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
          <p className="text-sm text-slate-500 mt-1">Live fleet operations & intelligence overview</p>
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
            <KpiCard label="Fuel Theft Alerts" value={fuelAlerts.length} accent="text-red-500" />
          </div>
        ) : (
          <div className="text-slate-500 text-sm">Loading KPIs…</div>
        )}

        {/* Fuel Theft Alerts Section */}
        {fuelAlerts.length > 0 && (
          <div className="card p-5 border border-red-500/30 bg-red-950/10 rounded-xl">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-red-500 text-xl">⚠️</span>
              <h2 className="text-sm font-semibold text-red-400 uppercase tracking-wider">
                Suspected Fuel Theft Alerts ({fuelAlerts.length})
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {fuelAlerts.map((trip) => (
                <div key={trip.id} className="p-3 bg-slate-900/80 border border-red-500/20 rounded-lg text-xs space-y-1">
                  <div className="flex justify-between font-bold text-slate-200">
                    <span>Trip #{trip.id} ({trip.origin} ➔ {trip.destination})</span>
                    <span className="text-red-400">+{trip.fuelDeviationPercent}% Dev</span>
                  </div>
                  <div className="text-slate-400">
                    Vehicle ID: <span className="text-slate-200">{trip.vehicleId}</span> | Driver ID: <span className="text-slate-200">{trip.driverId}</span>
                  </div>
                  <div className="text-slate-400">
                    Expected: {trip.expectedFuelConsumed}L | Actual: {trip.actualFuelConsumed}L
                  </div>
                </div>
              ))}
            </div>
          </div>
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
                  {item.type === 'FUEL_ALERT' ? (
                    <span className="text-red-400 font-semibold">🚨 {item.message || 'Fuel theft suspected!'}</span>
                  ) : (
                    <span>{item.message}</span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </div>
  )
}
