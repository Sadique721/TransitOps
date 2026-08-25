import React, { useState } from 'react';

export default function AdvancedDataTable({ columns, data, bulkActions }) {
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [columnVisibility, setColumnVisibility] = useState(
    columns.reduce((acc, col) => ({ ...acc, [col.key]: true }), {})
  );

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(new Set(data.map((row) => row.id)));
    } else {
      setSelectedIds(new Set());
    }
  };

  const handleSelectRow = (id) => {
    const next = new Set(selectedIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setSelectedIds(next);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden flex flex-col h-full">
      {/* Table Toolbar */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
        <div className="flex items-center space-x-3">
          {selectedIds.size > 0 && bulkActions && (
            <div className="flex items-center space-x-2 bg-slate-800 px-3 py-1.5 rounded-md border border-slate-700">
              <span className="text-xs text-slate-300 font-medium">{selectedIds.size} selected</span>
              {bulkActions.map((action) => (
                <button
                  key={action.name}
                  onClick={() => action.handler(Array.from(selectedIds))}
                  className="px-2 py-1 bg-cyan-600 hover:bg-cyan-500 text-white rounded text-xs transition-colors"
                >
                  {action.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Column config */}
        <div className="flex items-center space-x-2">
          <span className="text-xs text-slate-400">Columns:</span>
          {columns.map((col) => (
            <label key={col.key} className="inline-flex items-center text-xs text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={columnVisibility[col.key]}
                onChange={() => setColumnVisibility({ ...columnVisibility, [col.key]: !columnVisibility[col.key] })}
                className="mr-1 rounded bg-slate-800 border-slate-700 text-cyan-500 focus:ring-0"
              />
              {col.label}
            </label>
          ))}
        </div>
      </div>

      {/* Main Table */}
      <div className="flex-1 overflow-auto max-h-[500px]">
        <table className="w-full text-left border-collapse">
          <thead className="sticky top-0 bg-slate-950 z-10 border-b border-slate-800">
            <tr>
              <th className="p-3 w-10">
                <input
                  type="checkbox"
                  onChange={handleSelectAll}
                  checked={selectedIds.size === data.length && data.length > 0}
                  className="rounded bg-slate-850 border-slate-700 text-cyan-500 focus:ring-0"
                />
              </th>
              {columns.map((col) => columnVisibility[col.key] && (
                <th key={col.key} className="p-3 text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-850">
            {data.map((row) => (
              <tr key={row.id} className="hover:bg-slate-850/50 transition-colors">
                <td className="p-3 w-10">
                  <input
                    type="checkbox"
                    checked={selectedIds.has(row.id)}
                    onChange={() => handleSelectRow(row.id)}
                    className="rounded bg-slate-850 border-slate-700 text-cyan-500 focus:ring-0"
                  />
                </td>
                {columns.map((col) => columnVisibility[col.key] && (
                  <td key={col.key} className="p-3 text-sm text-slate-300">
                    {col.render ? col.render(row[col.key], row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
