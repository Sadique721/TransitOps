import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';

const revenueData = [
  { d: 'May 1', v: 20 },
  { d: 'May 6', v: 35 },
  { d: 'May 12', v: 28 },
  { d: 'May 18', v: 42.58 },
  { d: 'May 24', v: 50 },
  { d: 'May 30', v: 65 },
];

const topProducts = [
  { name: 'Interstate Freight Service', rev: '$320.4K', growth: '+16.3%', icon: '📊' },
  { name: 'Cold-Chain Pharma Transit', rev: '$245.7K', growth: '+12.8%', icon: '📉' },
  { name: 'Bulk Materials Haulage', rev: '$185.9K', growth: '+9.7%', icon: '⚡' },
  { name: 'Last-Mile Micro Hubs', rev: '$142.6K', growth: '+7.2%', icon: '👥' },
];

export default function AcmeCorpDashboard() {
  const navigate = useNavigate();
  const [timeRange, setTimeRange] = useState('30D');

  return (
    <div className="space-y-5 pb-10">
      {/* ── HEADER ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/80 border border-slate-800 rounded-2xl p-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl">🏢</span>
            <h1 className="text-xl font-black text-slate-100">AcmeCorp Corporate Finance & ROI</h1>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20">
              AUDITED FINANCIALS
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">Enterprise revenue breakdown, cost allocations, and margin expansion</p>
        </div>
        <div className="flex items-center gap-2">
          {['7D', '30D', '90D', '1Y'].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                timeRange === range
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* ── KPI METRICS ROW ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Gross Revenue', val: '$894,620', sub: '+18.4% vs last cycle', up: true },
          { label: 'Operating Net', val: '$342,180', sub: '+12.1% net margin', up: true },
          { label: 'Fuel & Maintenance Cost', val: '$128,450', sub: '-3.2% efficiency gain', up: true },
          { label: 'Fleet ROI Index', val: '28.4%', sub: '+4.5% target exceeded', up: true },
        ].map((k) => (
          <div key={k.label} className="p-5 bg-slate-900/80 border border-slate-800 rounded-2xl">
            <div className="text-xs font-semibold text-slate-400">{k.label}</div>
            <div className="text-2xl font-black text-slate-100 font-mono mt-1">{k.val}</div>
            <div className="text-[10px] text-emerald-400 font-bold mt-2">{k.sub}</div>
          </div>
        ))}
      </div>

      {/* ── REVENUE AREA CHART ── */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
        <div className="flex justify-between items-center mb-4">
          <div>
            <div className="text-sm font-bold text-slate-100">Revenue Growth Velocity</div>
            <div className="text-xs text-slate-500 mt-0.5">Aggregated recurring client invoicing</div>
          </div>
          <div className="text-base font-black text-purple-400 font-mono">$65.0K / peak day</div>
        </div>
        <div className="h-64 sm:h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="purpleGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="d" stroke="#64748B" fontSize={11} tickLine={false} />
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
              <Area type="monotone" dataKey="v" stroke="#8B5CF6" strokeWidth={3} fillOpacity={1} fill="url(#purpleGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── TOP CORPORATE ACCOUNTS & PRODUCT REVENUE ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-3">
          <div className="text-sm font-bold text-slate-100 border-b border-slate-800 pb-3">
            Top Service Verticals
          </div>
          <div className="space-y-2.5">
            {topProducts.map((p) => (
              <div
                key={p.name}
                className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">{p.icon}</span>
                  <div>
                    <div className="text-xs font-bold text-slate-200">{p.name}</div>
                    <div className="text-[10px] text-slate-500">Corporate Contract</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-bold font-mono text-slate-200">{p.rev}</div>
                  <div className="text-[10px] text-emerald-400 font-bold font-mono">{p.growth}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-3">
          <div className="text-sm font-bold text-slate-100 border-b border-slate-800 pb-3">
            Financial Compliance & Audit Trail
          </div>
          <div className="space-y-2 text-xs text-slate-400">
            <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 flex justify-between items-center">
              <div>
                <div className="font-bold text-slate-200">FY2026 Q2 Tax Reconciliation</div>
                <div className="text-[10px] text-slate-500">Filed on 28 Aug 2026</div>
              </div>
              <span className="text-[10px] bg-emerald-500/15 text-emerald-400 px-2 py-0.5 rounded font-bold">VERIFIED</span>
            </div>
            <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 flex justify-between items-center">
              <div>
                <div className="font-bold text-slate-200">Fuel Surcharge Adjustment</div>
                <div className="text-[10px] text-slate-500">Auto-calculated via Fuel Intelligence</div>
              </div>
              <span className="text-[10px] bg-sky-500/15 text-sky-400 px-2 py-0.5 rounded font-bold">APPLIED</span>
            </div>
            <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 flex justify-between items-center">
              <div>
                <div className="font-bold text-slate-200">Depreciation Schedule</div>
                <div className="text-[10px] text-slate-500">Straight-line asset amortisation</div>
              </div>
              <span className="text-[10px] bg-purple-500/15 text-purple-400 px-2 py-0.5 rounded font-bold">ACTIVE</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
