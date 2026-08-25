export default function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <div className="card w-full max-w-lg p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-slate-100 font-semibold">{title}</h3>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-200">✕</button>
        </div>
        {children}
      </div>
    </div>
  )
}
