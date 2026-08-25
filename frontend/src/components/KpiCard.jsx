export default function KpiCard({ label, value, accent = 'text-slate-100', suffix = '' }) {
  return (
    <div className="card p-4">
      <div className="text-xs uppercase tracking-wider text-slate-500">{label}</div>
      <div className={`mt-2 text-3xl font-mono font-semibold ${accent}`}>
        {value}
        {suffix}
      </div>
    </div>
  )
}
