import React, { useState, useEffect } from 'react';

export default function SmartForm({ formKey, initialValues, onSubmit, fields }) {
  const [formData, setFormData] = useState(() => {
    try {
      const saved = localStorage.getItem(`draft_${formKey}`);
      return saved ? JSON.parse(saved) : initialValues;
    } catch (e) {
      return initialValues;
    }
  });

  // Autosave to localStorage every 30s
  useEffect(() => {
    const timer = setInterval(() => {
      localStorage.setItem(`draft_${formKey}`, JSON.stringify(formData));
    }, 30000);
    return () => clearInterval(timer);
  }, [formData, formKey]);

  const handleChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    localStorage.removeItem(`draft_${formKey}`);
  };

  return (
    <form onSubmit={handleFormSubmit} className="space-y-4 bg-slate-900 p-6 border border-slate-800 rounded-lg">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <span className="text-sm text-slate-400 font-medium">Smart Form Console</span>
        <button
          type="button"
          onClick={() => {
            setFormData(initialValues);
            localStorage.removeItem(`draft_${formKey}`);
          }}
          className="text-xs text-amber-500 hover:text-amber-400"
        >
          Clear Draft
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {fields.map((field) => {
          // Conditional check
          if (field.condition && !field.condition(formData)) {
            return null;
          }

          return (
            <div key={field.name} className="flex flex-col space-y-1">
              <label className="text-xs text-slate-400 font-semibold">{field.label}</label>
              {field.type === 'select' ? (
                <select
                  value={formData[field.name] || ''}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded p-2 text-sm text-slate-100 focus:outline-none focus:border-cyan-500"
                >
                  <option value="">Select...</option>
                  {field.options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              ) : field.type === 'checkbox' ? (
                <label className="inline-flex items-center cursor-pointer pt-2">
                  <input
                    type="checkbox"
                    checked={!!formData[field.name]}
                    onChange={(e) => handleChange(field.name, e.target.checked)}
                    className="rounded bg-slate-950 border-slate-800 text-cyan-500 focus:ring-0 mr-2"
                  />
                  <span className="text-sm text-slate-300">{field.description}</span>
                </label>
              ) : (
                <input
                  type={field.type || 'text'}
                  value={formData[field.name] || ''}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                  placeholder={field.placeholder}
                  className="bg-slate-950 border border-slate-800 rounded p-2 text-sm text-slate-100 focus:outline-none focus:border-cyan-500"
                />
              )}
            </div>
          );
        })}
      </div>

      <div className="pt-4 flex justify-end">
        <button
          type="submit"
          className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded text-sm font-semibold transition-colors"
        >
          Submit Changes
        </button>
      </div>
    </form>
  );
}
