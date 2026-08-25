const STYLES = {
  AVAILABLE: 'bg-route-green/15 text-route-green',
  ON_TRIP: 'bg-route-cyan/15 text-route-cyan',
  IN_SHOP: 'bg-route-amber/15 text-route-amber',
  RETIRED: 'bg-slate-500/15 text-slate-400',
  OFF_DUTY: 'bg-slate-500/15 text-slate-400',
  SUSPENDED: 'bg-route-red/15 text-route-red',
  DRAFT: 'bg-slate-500/15 text-slate-400',
  DISPATCHED: 'bg-route-cyan/15 text-route-cyan',
  COMPLETED: 'bg-route-green/15 text-route-green',
  CANCELLED: 'bg-route-red/15 text-route-red',
}

export default function StatusBadge({ status }) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${STYLES[status] || 'bg-white/10 text-slate-300'}`}>
      {status?.replace('_', ' ')}
    </span>
  )
}
