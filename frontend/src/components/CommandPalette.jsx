import React, { useState, useEffect } from 'react';

export default function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [isAiMode, setIsAiMode] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.key === 'k') {
        e.preventDefault();
        setIsAiMode(false);
        setIsOpen(!isOpen);
      } else if (e.ctrlKey && e.shiftKey && e.key === 'A') {
        e.preventDefault();
        setIsAiMode(true);
        setIsOpen(!isOpen);
      } else if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const handleSearch = (val) => {
    setQuery(val);
    if (!val) {
      setResults([]);
      return;
    }
    if (isAiMode) {
      setResults([
        { label: `Ask AI Fleet Assistant: "${val}"`, action: 'ai' }
      ]);
    } else {
      const match = [
        { label: 'Create New Trip stop', action: 'create_trip' },
        { label: 'Register Vehicle sensor', action: 'reg_vehicle' },
        { label: 'Go to Drivers list', action: 'nav_drivers' },
        { label: 'Go to Invoices', action: 'nav_invoices' }
      ].filter((item) => item.label.toLowerCase().includes(val.toLowerCase()));
      setResults(match);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-950/70 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-lg w-full max-w-lg overflow-hidden shadow-2xl">
        <div className="p-4 border-b border-slate-800 flex items-center space-x-3">
          <span className="text-xl">{isAiMode ? '🤖' : '⌨️'}</span>
          <input
            type="text"
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder={isAiMode ? 'Ask AI: "Which vehicles are retired?"' : 'Type a command or page (Ctrl+K)...'}
            className="flex-1 bg-transparent text-slate-100 placeholder-slate-500 focus:outline-none text-sm"
            autoFocus
          />
          <span className="text-xs bg-slate-800 px-2 py-1 rounded text-slate-400">ESC to close</span>
        </div>
        <div className="max-h-60 overflow-y-auto p-2">
          {results.length > 0 ? (
            results.map((res, index) => (
              <button
                key={index}
                className="w-full text-left px-3 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white rounded transition-colors flex items-center justify-between"
              >
                <span>{res.label}</span>
                <span className="text-xs text-slate-500">Action</span>
              </button>
            ))
          ) : (
            <p className="text-xs text-slate-500 text-center py-4">No commands or matches found</p>
          )}
        </div>
      </div>
    </div>
  );
}
