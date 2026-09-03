import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function BentoGridPage() {
  const navigate = useNavigate();

  return (
    <div className="space-y-5 pb-10">
      {/* ── HEADER ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/80 border border-slate-800 rounded-2xl p-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl">🔮</span>
            <h1 className="text-xl font-black text-slate-100">Bento Grid Intelligence Matrix</h1>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              AI ENGINE READY
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">Automated algorithmic decision matrices and intelligent routing</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/task-automate')}
            className="px-3.5 py-2 text-xs font-bold rounded-lg bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 hover:bg-indigo-500/25 transition"
          >
            🤖 Task Automation
          </button>
        </div>
      </div>

      {/* ── BENTO GRID CONTAINER ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {/* Card 1: Fuel Theft Algorithmic Sentinel */}
        <div className="p-6 bg-slate-900/80 border border-slate-800 rounded-2xl flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-red-500/20 border border-red-500/30 flex items-center justify-center text-xl mb-4">
              🚨
            </div>
            <h3 className="text-base font-bold text-slate-100">Fuel Theft Sentinel</h3>
            <p className="text-xs text-slate-400 mt-2">
              Continuous deviation detection comparing expected fuel vs actual odometer telemetry with 20% variance alerts.
            </p>
          </div>
          <div className="mt-4 pt-4 border-t border-slate-800 flex justify-between items-center text-xs">
            <span className="text-emerald-400 font-mono font-bold">Active Engine</span>
            <button onClick={() => navigate('/dashboard')} className="text-sky-400 font-bold hover:underline">
              View Alerts →
            </button>
          </div>
        </div>

        {/* Card 2: AI Capacity Matching (Hero 2-span) */}
        <div className="md:col-span-2 p-6 bg-gradient-to-br from-indigo-950/60 via-slate-900 to-purple-950/40 border border-indigo-500/30 rounded-2xl flex flex-col justify-between relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-2">
              <span>✨</span> Algorithmic Suggestion Engine
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-100">Optimal Load Allocation</h2>
            <p className="text-xs text-slate-300 mt-2 max-w-md">
              Evaluates real-time payload mass against available fleet asset load ratings to minimize unused headroom and reduce fuel burn.
            </p>
          </div>

          <div className="relative z-10 mt-6 flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => navigate('/trips')}
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl transition shadow-lg shadow-indigo-600/30"
            >
              Test Suggestion in Trips
            </button>
          </div>
        </div>

        {/* Card 3: Driver Performance Index */}
        <div className="p-6 bg-slate-900/80 border border-slate-800 rounded-2xl flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-sky-500/20 border border-sky-500/30 flex items-center justify-center text-xl mb-4">
              🏆
            </div>
            <h3 className="text-base font-bold text-slate-100">Driver Scoring</h3>
            <p className="text-xs text-slate-400 mt-2">
              Composite ranking: 50% safety score, 40% completion rate, 10% trip volume.
            </p>
          </div>
          <div className="mt-4 pt-4 border-t border-slate-800 flex justify-between items-center text-xs">
            <span className="text-sky-400 font-mono font-bold">Leaderboard Ready</span>
            <button onClick={() => navigate('/drivers')} className="text-sky-400 font-bold hover:underline">
              Inspect →
            </button>
          </div>
        </div>

        {/* Card 4: Vehicle Health Diagnostic */}
        <div className="md:col-span-2 p-6 bg-slate-900/80 border border-slate-800 rounded-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
              <span>🔧</span> Maintenance Diagnostics
            </div>
            <h3 className="text-lg font-bold text-slate-100">Predictive Health Analysis</h3>
            <p className="text-xs text-slate-400 mt-2">
              Composite health index derived from odometer lifetime thresholds (30%), repair frequency (35%), and shop downtime ratios (35%).
            </p>
          </div>
          <div className="mt-4 flex justify-between items-center pt-3 border-t border-slate-800 text-xs">
            <span className="text-emerald-400 font-mono">Status: 92/100 Fleet Avg</span>
            <button onClick={() => navigate('/vehicles')} className="text-sky-400 font-bold hover:underline">
              Fleet Health Details →
            </button>
          </div>
        </div>

        {/* Card 5: Rule Engine Workflows */}
        <div className="md:col-span-2 p-6 bg-slate-900/80 border border-slate-800 rounded-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-purple-400 text-xs font-bold uppercase tracking-wider mb-2">
              <span>🤖</span> Automated Execution
            </div>
            <h3 className="text-lg font-bold text-slate-100">Workflow & Task Engine</h3>
            <p className="text-xs text-slate-400 mt-2">
              Trigger automated tasks, approval gates, license renewal reminders, and maintenance lockouts without manual intervention.
            </p>
          </div>
          <div className="mt-4 flex justify-between items-center pt-3 border-t border-slate-800 text-xs">
            <span className="text-purple-400 font-mono">Engine: Active</span>
            <button onClick={() => navigate('/task-automate')} className="text-sky-400 font-bold hover:underline">
              Manage Tasks →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
