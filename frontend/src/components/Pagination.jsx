import React from 'react'

export default function Pagination({
  currentPage = 1,
  totalItems = 0,
  pageSize = 10,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 25, 50, 100],
}) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize))
  const safePage = Math.min(Math.max(1, currentPage), totalPages)

  const startItem = totalItems === 0 ? 0 : (safePage - 1) * pageSize + 1
  const endItem = Math.min(safePage * pageSize, totalItems)

  const getPageNumbers = () => {
    const pages = []
    const maxVisible = 5
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i)
    } else {
      let start = Math.max(1, safePage - 2)
      let end = Math.min(totalPages, safePage + 2)

      if (safePage <= 3) {
        start = 1
        end = 5
      } else if (safePage >= totalPages - 2) {
        start = totalPages - 4
        end = totalPages
      }

      for (let i = start; i <= end; i++) {
        pages.push(i)
      }
    }
    return pages
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-3 bg-slate-900/60 border-t border-slate-800 text-xs text-slate-400">
      {/* ── Left: Items range & page size selector ── */}
      <div className="flex items-center gap-3">
        <span>
          Showing <span className="font-semibold text-slate-200">{startItem}</span> to{' '}
          <span className="font-semibold text-slate-200">{endItem}</span> of{' '}
          <span className="font-semibold text-cyan-400">{totalItems}</span> records
        </span>

        {onPageSizeChange && (
          <div className="flex items-center gap-1.5 ml-2 border-l border-slate-800 pl-3">
            <span className="text-[11px] text-slate-400">Per page:</span>
            <select
              value={pageSize}
              onChange={(e) => {
                onPageSizeChange(Number(e.target.value))
                if (onPageChange) onPageChange(1)
              }}
              className="bg-slate-850 border border-slate-700/80 text-slate-200 rounded-lg px-2 py-1 text-[11px] focus:outline-none focus:border-cyan-500 cursor-pointer"
            >
              {pageSizeOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* ── Right: Page navigation buttons ── */}
      <div className="flex items-center gap-1">
        {/* First page */}
        <button
          onClick={() => onPageChange && onPageChange(1)}
          disabled={safePage === 1}
          className="px-2.5 py-1 rounded-lg border border-slate-800 bg-slate-850 text-slate-300 hover:bg-slate-700 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-colors"
          title="First Page"
        >
          «
        </button>

        {/* Previous page */}
        <button
          onClick={() => onPageChange && onPageChange(safePage - 1)}
          disabled={safePage === 1}
          className="px-2.5 py-1 rounded-lg border border-slate-800 bg-slate-850 text-slate-300 hover:bg-slate-700 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-colors"
          title="Previous Page"
        >
          ‹ Prev
        </button>

        {/* Numbered Page Buttons */}
        {getPageNumbers().map((num) => (
          <button
            key={num}
            onClick={() => onPageChange && onPageChange(num)}
            className={`min-w-[28px] h-7 px-2 rounded-lg font-semibold transition-all ${
              safePage === num
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-lg shadow-cyan-500/20'
                : 'border border-slate-800 bg-slate-850 text-slate-300 hover:bg-slate-700 hover:text-white'
            }`}
          >
            {num}
          </button>
        ))}

        {/* Next page */}
        <button
          onClick={() => onPageChange && onPageChange(safePage + 1)}
          disabled={safePage === totalPages}
          className="px-2.5 py-1 rounded-lg border border-slate-800 bg-slate-850 text-slate-300 hover:bg-slate-700 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-colors"
          title="Next Page"
        >
          Next ›
        </button>

        {/* Last page */}
        <button
          onClick={() => onPageChange && onPageChange(totalPages)}
          disabled={safePage === totalPages}
          className="px-2.5 py-1 rounded-lg border border-slate-800 bg-slate-850 text-slate-300 hover:bg-slate-700 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-colors"
          title="Last Page"
        >
          »
        </button>
      </div>
    </div>
  )
}
