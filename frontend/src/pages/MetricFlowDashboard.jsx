import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid
} from 'recharts';
import api from '../api/axios';

const performanceData = [
  { name: 'Jan', Sales: 2800, Target: 3000 },
  { name: 'Feb', Sales: 4200, Target: 3800 },
  { name: 'Mar', Sales: 3600, Target: 3500 },
  { name: 'Apr', Sales: 4790, Target: 3830 },
  { name: 'May', Sales: 3900, Target: 4200 },
  { name: 'Jun', Sales: 5200, Target: 4600 },
];

const countries = [
  { name: 'United Kingdom', count: '6.3K', flag: '🇬🇧' },
  { name: 'Indonesia', count: '5.2K', flag: '🇮🇩' },
  { name: 'Malaysia', count: '4.7K', flag: '🇲🇾' },
  { name: 'China', count: '4.5K', flag: '🇨🇳' },
  { name: 'Thailand', count: '3.2K', flag: '🇹🇭' },
  { name: 'Philippines', count: '2.9K', flag: '🇵🇭' },
];

const products = [
  { name: 'Heavy Cargo Freight', revenue: '$24,500', sales: 846, growth: 32, up: true, reviews: 570, views: 978 },
  { name: 'Express Cold Chain', revenue: '$16,300', sales: 598, growth: 26, up: true, reviews: 385, views: 945 },
  { name: 'Interstate Bulk Haul', revenue: '$12,980', sales: 389, growth: 13, up: true, reviews: 127, views: 437 },
  { name: 'Urban Last-Mile Dispatch', revenue: '$10,984', sales: 265, growth: 11, up: false, reviews: 190, views: 265 },
];

const heatmap = [
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [1, 1, 2, 0, 2, 0, 0],
  [1, 2, 3, 3, 3, 1, 0],
  [0, 1, 2, 3, 1, 2, 0],
  [0, 0, 1, 1, 1, 0, 0],
  [0, 0, 0, 1, 0, 0, 0],
];
const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const hours = ['9 am', '10 am', '11 am', '12 pm', '1 pm', '2 pm', '3 pm'];

const getCell = (val) => {
  if (val === 3) return { bg: '#EF4444', stripe: true };
  if (val === 2) return { bg: '#EF444499', stripe: true };
  if (val === 1) return { bg: '#EF444433', stripe: false };
  return { bg: '#0D1628', stripe: false };
};

export default function MetricFlowDashboard() {
  const navigate = useNavigate();
  const [kpis, setKpis] = useState(null);
  const [fuelAlerts, setFuelAlerts] = useState([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  async function loadDashboardData() {
    try {
      const [kpiRes, alertsRes] = await Promise.all([
        api.get('/reports/dashboard').catch(() => ({ data: null })),
        api.get('/fuel-intelligence/theft-alerts').catch(() => ({ data: [] })),
      ]);
      if (kpiRes?.data) setKpis(kpiRes.data);
      if (alertsRes?.data) setFuelAlerts(alertsRes.data);
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <div className="space-y-6 pb-12">
      {/* ── HEADER BANNER ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-blue-950/40 via-slate-900/60 to-slate-950/40 border border-sky-500/20 rounded-2xl p-5 backdrop-blur-md">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl">📊</span>
            <h1 className="text-xl sm:text-2xl font-black text-slate-100 tracking-tight">Metric Flow Intelligence</h1>
            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-400 border border-sky-500/30">LIVE OPS</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">Real-time dispatch metrics, fleet health, and telemetry insights</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/trips')} className="px-3.5 py-2 text-xs font-bold rounded-lg bg-sky-500/15 border border-sky-500/30 text-sky-300 hover:bg-sky-500/25 transition">
            🛣️ Dispatch Hub
          </button>
          <button onClick={() => navigate('/live-ops')} className="px-3.5 py-2 text-xs font-bold rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/25 transition">
            🗺️ Live Radar
          </button>
        </div>
      </div>

      {/* ── LIVE FLEET KPIS ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Total Fleet</div>
          <div className="text-2xl font-black text-slate-100 font-mono mt-1">{kpis?.totalVehicles ?? 32}</div>
          <div className="text-[10px] text-slate-500 mt-1">Registered assets</div>
        </div>
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
          <div className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider">Available</div>
          <div className="text-2xl font-black text-emerald-400 font-mono mt-1">{kpis?.availableVehicles ?? 18}</div>
          <div className="text-[10px] text-slate-500 mt-1">Ready for dispatch</div>
        </div>
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
          <div className="text-[11px] font-semibold text-sky-400 uppercase tracking-wider">On Route</div>
          <div className="text-2xl font-black text-sky-400 font-mono mt-1">{kpis?.onTripVehicles ?? 11}</div>
          <div className="text-[10px] text-slate-500 mt-1">Active transit</div>
        </div>
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
          <div className="text-[11px] font-semibold text-amber-400 uppercase tracking-wider">In Shop</div>
          <div className="text-2xl font-black text-amber-400 font-mono mt-1">{kpis?.inShopVehicles ?? 3}</div>
          <div className="text-[10px] text-slate-500 mt-1">Under maintenance</div>
        </div>
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
          <div className="text-[11px] font-semibold text-cyan-400 uppercase tracking-wider">Utilization</div>
          <div className="text-2xl font-black text-cyan-400 font-mono mt-1">{kpis?.fleetUtilizationPercent ?? 37.9}%</div>
          <div className="text-[10px] text-slate-500 mt-1">Operational load</div>
        </div>
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
          <div className="text-[11px] font-semibold text-red-400 uppercase tracking-wider">Fuel Alerts</div>
          <div className="text-2xl font-black text-red-400 font-mono mt-1">{fuelAlerts.length}</div>
          <div className="text-[10px] text-slate-500 mt-1">Suspected theft</div>
        </div>
      </div>

      {/* ── SUSPECTED FUEL THEFT ALERTS (IF ANY) ── */}
      {fuelAlerts.length > 0 && (
        <div className="bg-red-950/20 border border-red-500/30 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-red-400 text-lg">⚠️</span>
            <h2 className="text-sm font-black text-red-400 uppercase tracking-wider">
              Suspected Fuel Theft Alerts ({fuelAlerts.length})
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {fuelAlerts.map((trip) => (
              <div key={trip.id} className="p-3.5 bg-slate-900/90 border border-red-500/20 rounded-xl text-xs space-y-1.5">
                <div className="flex justify-between font-bold text-slate-200">
                  <span>Trip #{trip.tripNumber}</span>
                  <span className="text-red-400">+{trip.fuelDeviationPercent?.toFixed(1)}%</span>
                </div>
                <div className="text-slate-400">
                  {trip.source} → {trip.destination}
                </div>
                <div className="flex justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-800">
                  <span>Consumed: {trip.fuelConsumed}L</span>
                  <span>Expected: {trip.expectedFuelConsumed?.toFixed(1)}L</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── KPI CARDS ROW (COMMERCE & FINANCIAL) ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Revenue', value: '$ 24,500', badge: '+12.5%', up: true },
          { label: 'Total Orders', value: '1,240', badge: '+8.2%', up: true },
          { label: 'New Customers', value: '320', badge: '-4.3%', up: false },
          { label: 'Conversion Rate', value: '3.2 %', badge: '+2.1%', up: true },
        ].map((card) => (
          <div key={card.label} className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs text-slate-400 font-semibold">{card.label}</span>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                  card.up ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
                }`}
              >
                <span>{card.up ? '↗' : '↘'}</span>
                {card.badge}
              </span>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-100 font-mono">{card.value}</div>
            <div className="text-[10px] text-slate-500 mt-2 font-mono">Current 30-day operating window</div>
          </div>
        ))}
      </div>

      {/* ── HEATMAP + LINE CHART ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Heatmap */}
        <div className="lg:col-span-5 bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
          <div className="flex justify-between items-center mb-4">
            <span className="font-bold text-sm text-slate-100">Dispatches by Time Window</span>
            <div className="flex gap-2 text-[9px] text-slate-400">
              <span>● 200+</span>
              <span className="text-red-400/60">● 500+</span>
              <span className="text-red-400">● 1,000+</span>
            </div>
          </div>
          <div className="overflow-x-auto">
            {hours.map((h, hi) => (
              <div key={h} className="flex items-center mb-1.5 min-w-[280px]">
                <span className="w-12 text-[9px] text-slate-500 text-right pr-2 font-mono flex-shrink-0">{h}</span>
                {days.map((d, di) => {
                  const cell = getCell(heatmap[hi][di]);
                  return (
                    <div
                      key={d}
                      style={{
                        flex: 1,
                        height: 20,
                        borderRadius: 4,
                        marginRight: 3,
                        background: cell.stripe
                          ? `repeating-linear-gradient(-45deg, ${cell.bg}, ${cell.bg} 3px, ${cell.bg}88 3px, ${cell.bg}88 6px)`
                          : cell.bg,
                        border: '1px solid rgba(255,255,255,0.04)',
                      }}
                    />
                  );
                })}
              </div>
            ))}
            <div className="flex mt-2 pl-12 min-w-[280px]">
              {days.map((d) => (
                <div key={d} className="flex-1 text-center text-[9px] text-slate-500 mr-1">
                  {d}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Line Chart */}
        <div className="lg:col-span-7 bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
          <div className="flex justify-between items-center mb-4">
            <span className="font-bold text-sm text-slate-100">Monthly Fleet Revenue & Target</span>
            <div className="flex gap-3 text-xs">
              <span className="flex items-center gap-1.5 text-red-400">
                <span className="w-3 h-0.5 bg-red-500 inline-block" /> Actual
              </span>
              <span className="flex items-center gap-1.5 text-indigo-400">
                <span className="w-3 h-0.5 bg-indigo-500 inline-block" /> Target
              </span>
            </div>
          </div>
          <div className="h-60 sm:h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={performanceData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                <XAxis dataKey="name" stroke="#64748B" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748B" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    background: '#0F172A',
                    border: '1px solid #334155',
                    borderRadius: 8,
                    fontSize: 11,
                    color: '#F8FAFC',
                  }}
                />
                <Line type="monotone" dataKey="Sales" stroke="#EF4444" strokeWidth={2.5} dot={{ r: 3 }} activeDot={{ r: 5 }} />
                <Line type="monotone" dataKey="Target" stroke="#818CF8" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* ── COUNTRIES & TOP PRODUCTS TABLE ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Hubs by Region */}
        <div className="lg:col-span-5 bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
          <div className="flex justify-between items-center mb-4">
            <span className="font-bold text-sm text-slate-100">Regional Delivery Hubs</span>
            <span className="text-xs text-sky-400 cursor-pointer hover:underline">Global View</span>
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            {countries.map((c) => (
              <div
                key={c.name}
                className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3 flex items-center gap-3 hover:border-slate-700 transition"
              >
                <span className="text-2xl">{c.flag}</span>
                <div>
                  <div className="text-xs font-bold text-slate-200">{c.name}</div>
                  <div className="text-[10px] text-slate-500">{c.count} Trips</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Service Categories */}
        <div className="lg:col-span-7 bg-slate-900/80 border border-slate-800 rounded-2xl p-5 overflow-hidden">
          <div className="flex justify-between items-center mb-4">
            <span className="font-bold text-sm text-slate-100">Top Service Deliverables</span>
            <span className="text-xs text-sky-400 cursor-pointer hover:underline" onClick={() => navigate('/trips')}>
              All Trips ↗
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[480px]">
              <thead>
                <tr className="border-b border-slate-800 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="pb-2.5">SERVICE LINE</th>
                  <th className="pb-2.5 text-right">REVENUE</th>
                  <th className="pb-2.5 text-right">VOLUME</th>
                  <th className="pb-2.5 text-right">GROWTH</th>
                  <th className="pb-2.5 text-right">RATING</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-xs font-mono">
                {products.map((p) => (
                  <tr key={p.name} className="hover:bg-slate-800/20 transition">
                    <td className="py-2.5 text-slate-200 font-sans font-semibold">{p.name}</td>
                    <td className="py-2.5 text-right text-slate-300">{p.revenue}</td>
                    <td className="py-2.5 text-right text-slate-300">{p.sales}</td>
                    <td className={`py-2.5 text-right font-bold ${p.up ? 'text-emerald-400' : 'text-red-400'}`}>
                      {p.up ? '↗' : '↘'} {p.growth}%
                    </td>
                    <td className="py-2.5 text-right text-slate-400">{p.reviews} ★</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
