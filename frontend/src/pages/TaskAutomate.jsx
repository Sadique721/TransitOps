import React, { useState } from 'react';
import api from '../api/axios';

const initialTasks = {
  todo: [
    { id: 1, title: 'Generate AI Blog Draft', desc: '', comments: 3, attachments: 0, users: ['👩‍💻', '👨‍🎨'] },
    { id: 2, title: 'Automate Social Media Posts', desc: '', comments: 2, attachments: 0, users: ['👩‍💼', '👨‍💻'] },
    { id: 3, title: 'Prepare AI Sales Report', desc: 'Compile and analyze AI-driven sales data for performance insights and forecasting.', comments: 3, attachments: 1, users: ['👨‍💼', '👩‍💻'] },
    { id: 4, title: 'Train AI Chatbot Responses', desc: '', comments: 4, attachments: 0, users: ['👨‍💻'] },
  ],
  doing: [
    { id: 5, title: 'Optimize Lead Scoring', desc: '', comments: 1, attachments: 0, users: ['👩‍💻'] },
    { id: 6, title: 'Refine AI Blog Text', desc: 'Improving AI-generated content for clarity, tone, and readability before final review.', comments: 2, attachments: 0, users: ['👨‍🎨'] },
    { id: 7, title: 'Test AI Chatbot', desc: '', comments: 5, attachments: 0, users: ['👨‍💻', '👩‍💼'] },
  ],
  done: [
    { id: 8, title: 'Launch AI Dashboard', desc: '', comments: 7, attachments: 0, users: ['👨‍💻', '👩‍💼'] },
    { id: 9, title: 'Schedule AI Social Campaign', desc: '', comments: 2, attachments: 1, users: ['👨‍🎨'] },
    { id: 10, title: 'Finalize AI-Powered Email Assistant', desc: '', comments: 2, attachments: 0, users: ['👩‍💻', '👨‍💼'] },
    { id: 11, title: 'Deploy Chatbot v2.0', desc: '', comments: 1, attachments: 0, users: ['👨‍💻'] },
    { id: 12, title: 'Optimize AI Model Performance', desc: 'Improving AI-generated content for clarity, tone, and readability before final review.', comments: 4, attachments: 1, users: ['👩‍💻'] },
  ]
};

export default function TaskAutomate() {
  const [tasks, setTasks] = useState(initialTasks);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { sender: 'user', text: "How can I improve my website's conversion rate?" },
    {
      sender: 'bot',
      text: "Improving your website's conversion rate starts with optimizing user experience. Here are three key strategies:\n\n1. Simplify Your Landing Page - Keep it clean, remove distractions, and highlight a clear call-to-action.\n2. Use AI-Powered A/B Testing - Test headlines, images, and CTAs to find what converts best.\n3. Personalize User Experience - Tailor content and recommendations based on visitor behavior."
    }
  ]);
  const [chatLoading, setChatLoading] = useState(false);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg = chatInput.trim();
    setChatMessages((prev) => [...prev, { sender: 'user', text: userMsg }]);
    setChatInput('');
    setChatLoading(true);

    try {
      // Query the backend rule-based AI Fleet Copilot
      const { data } = await api.post('/ai/chat', { query: userMsg });
      setChatMessages((prev) => [...prev, { sender: 'bot', text: data.answer }]);
    } catch (err) {
      console.error(err);
      setChatMessages((prev) => [
        ...prev,
        { sender: 'bot', text: "Error: Could not connect to AI Copilot. Please verify database/server connection." }
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  // Simple Kanban column drag and drop handlers (state representation)
  const [draggedTaskId, setDraggedTaskId] = useState(null);
  const [draggedColName, setDraggedColName] = useState(null);

  const handleDragStart = (id, fromCol) => {
    setDraggedTaskId(id);
    setDraggedColName(fromCol);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (toCol) => {
    if (!draggedTaskId || !draggedColName || draggedColName === toCol) return;

    const sourceList = [...tasks[draggedColName]];
    const destList = [...tasks[toCol]];

    const taskIndex = sourceList.findIndex((t) => t.id === draggedTaskId);
    const [task] = sourceList.splice(taskIndex, 1);
    destList.push(task);

    setTasks({
      ...tasks,
      [draggedColName]: sourceList,
      [toCol]: destList
    });

    setDraggedTaskId(null);
    setDraggedColName(null);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-10rem)]">
      {/* Sidebar for Task Automate Projects lists */}
      <div className="w-full lg:w-56 bg-[#0A0818] border border-[rgba(124,58,237,0.14)] rounded-xl p-4 flex flex-col justify-between overflow-y-auto">
        <div className="space-y-6">
          <div>
            <span className="text-[10px] uppercase font-bold text-[rgba(167,139,250,0.45)] tracking-wider">Favorites</span>
            <ul className="mt-2 space-y-1 text-xs">
              <li className="flex items-center gap-2 p-1.5 rounded hover:bg-[#16132E] text-[rgba(196,190,255,0.55)] hover:text-[#E2E0FF] cursor-pointer">
                <span>⭐</span> Sales Forecast
              </li>
              <li className="flex items-center gap-2 p-1.5 rounded hover:bg-[#16132E] text-[rgba(196,190,255,0.55)] hover:text-[#E2E0FF] cursor-pointer">
                <span>⭐</span> AI Writer
              </li>
              <li className="flex items-center gap-2 p-1.5 rounded hover:bg-[#16132E] text-[rgba(196,190,255,0.55)] hover:text-[#E2E0FF] cursor-pointer">
                <span>⭐</span> Data Insights
              </li>
              <li className="flex items-center gap-2 p-1.5 rounded hover:bg-[#16132E] text-[rgba(196,190,255,0.55)] hover:text-[#E2E0FF] cursor-pointer text-[#A78BFA] font-semibold bg-[#100D22]">
                <span>⭐</span> Predictive AI
              </li>
            </ul>
          </div>

          <div>
            <span className="text-[10px] uppercase font-bold text-[rgba(167,139,250,0.45)] tracking-wider">All Projects</span>
            <ul className="mt-2 space-y-1 text-xs">
              <li className="flex items-center justify-between p-1.5 rounded hover:bg-[#16132E] text-[rgba(196,190,255,0.55)] hover:text-[#E2E0FF] cursor-pointer">
                <span className="flex items-center gap-2">📂 Sales Forecast</span>
                <span className="text-[10px] font-mono bg-[#16132E] px-1.5 py-0.5 rounded text-[rgba(167,139,250,0.45)]">2</span>
              </li>
              <li className="flex items-center justify-between p-1.5 rounded hover:bg-[#16132E] text-[rgba(196,190,255,0.55)] hover:text-[#E2E0FF] cursor-pointer">
                <span className="flex items-center gap-2">📂 Sentiment AI</span>
                <span className="text-[10px] font-mono bg-[#16132E] px-1.5 py-0.5 rounded text-[rgba(167,139,250,0.45)]">7</span>
              </li>
              <li className="flex items-center justify-between p-1.5 rounded hover:bg-[#16132E] text-[#A78BFA] bg-[#16132E]/40 font-semibold cursor-pointer">
                <span className="flex items-center gap-2">📂 Task Automate</span>
                <span className="text-[10px] font-mono bg-[#100D22] px-1.5 py-0.5 rounded text-[#A78BFA] border border-cyan-500/20">18</span>
              </li>
              <li className="flex items-center justify-between p-1.5 rounded hover:bg-[#16132E] text-[rgba(196,190,255,0.55)] hover:text-[#E2E0FF] cursor-pointer">
                <span className="flex items-center gap-2">📂 Script AI</span>
                <span className="text-[10px] font-mono bg-[#16132E] px-1.5 py-0.5 rounded text-[rgba(167,139,250,0.45)]">3</span>
              </li>
              <li className="flex items-center justify-between p-1.5 rounded hover:bg-[#16132E] text-[rgba(196,190,255,0.55)] hover:text-[#E2E0FF] cursor-pointer">
                <span className="flex items-center gap-2">📂 Lead Scoring</span>
                <span className="text-[10px] font-mono bg-[#16132E] px-1.5 py-0.5 rounded text-[rgba(167,139,250,0.45)]">15</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Upgrade Premium Card */}
        <div className="bg-gradient-to-br from-indigo-950/40 to-indigo-900/10 border border-indigo-500/10 rounded-lg p-3 text-center mt-6">
          <h4 className="text-xs font-semibold text-[#E2E0FF]">Unlock Premium Features</h4>
          <p className="text-[10px] text-[rgba(167,139,250,0.45)] mt-1 leading-normal">Advanced AI routing, automatic scheduling, and telemetry models.</p>
          <button className="w-full mt-2 py-1 px-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-[10px] font-semibold transition-colors">
            Upgrade to premium
          </button>
        </div>
      </div>

      {/* Center Kanban Board Workspace */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h3 className="text-md font-bold text-[#E2E0FF] font-display">Task Automate</h3>
            <span className="text-xs text-[rgba(167,139,250,0.45)]">⭐</span>
          </div>
          <div className="flex items-center space-x-2 text-xs">
            <button className="bg-[#0A0818] border border-[rgba(124,58,237,0.14)] hover:bg-[#100D22] px-3 py-1 rounded text-[#A78BFA] font-semibold font-mono">Kanban</button>
            <button className="bg-[#05040F] border border-slate-900 hover:bg-[#0A0818] px-3 py-1 rounded text-[rgba(167,139,250,0.45)] font-mono">Table</button>
            <button className="bg-[#05040F] border border-slate-900 hover:bg-[#0A0818] px-3 py-1 rounded text-[rgba(167,139,250,0.45)] font-mono">List</button>
          </div>
        </div>

        {/* Columns Grid */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4 overflow-y-auto pr-1">
          {/* Column TO DO */}
          <div
            onDragOver={handleDragOver}
            onDrop={() => handleDrop('todo')}
            className="bg-[#05040F]/40 border border-slate-900 rounded-xl p-3 flex flex-col"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-[rgba(196,190,255,0.55)] uppercase tracking-wider">To do</span>
              <span className="text-[10px] font-mono bg-[#0A0818] text-[rgba(167,139,250,0.45)] px-1.5 py-0.5 rounded border border-slate-850">
                {tasks.todo.length}
              </span>
            </div>
            
            <div className="space-y-3 flex-1 overflow-y-auto">
              {tasks.todo.map((t) => (
                <div
                  key={t.id}
                  draggable
                  onDragStart={() => handleDragStart(t.id, 'todo')}
                  className="bg-[#0A0818] border border-[rgba(124,58,237,0.14)] hover:border-[rgba(124,58,237,0.1)] p-3 rounded-lg cursor-grab active:cursor-grabbing transition-all hover:translate-y-[-2px] shadow-lg"
                >
                  <h4 className="text-xs font-semibold text-[#E2E0FF]">{t.title}</h4>
                  {t.desc && <p className="text-[10px] text-[rgba(167,139,250,0.45)] mt-1.5 leading-normal">{t.desc}</p>}
                  <div className="flex items-center justify-between mt-3 text-[10px] text-[rgba(167,139,250,0.45)] font-mono">
                    <div className="flex items-center gap-2">
                      <span>💬 {t.comments}</span>
                      {t.attachments > 0 && <span>🔗 {t.attachments}</span>}
                    </div>
                    <div className="flex -space-x-1">
                      {t.users.map((u, i) => (
                        <span key={i} className="text-xs bg-[#16132E] rounded-full w-5 h-5 flex items-center justify-center border border-slate-900">{u}</span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
              <button className="w-full py-1.5 border border-dashed border-[rgba(124,58,237,0.14)] hover:border-[rgba(124,58,237,0.1)] text-[10px] text-[rgba(167,139,250,0.45)] hover:text-[rgba(196,190,255,0.55)] rounded-lg text-center transition-colors">
                + Add task
              </button>
            </div>
          </div>

          {/* Column DOING */}
          <div
            onDragOver={handleDragOver}
            onDrop={() => handleDrop('doing')}
            className="bg-[#05040F]/40 border border-slate-900 rounded-xl p-3 flex flex-col"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-[rgba(196,190,255,0.55)] uppercase tracking-wider">Doing</span>
              <span className="text-[10px] font-mono bg-[#0A0818] text-[rgba(167,139,250,0.45)] px-1.5 py-0.5 rounded border border-slate-850">
                {tasks.doing.length}
              </span>
            </div>

            <div className="space-y-3 flex-1 overflow-y-auto">
              {tasks.doing.map((t) => (
                <div
                  key={t.id}
                  draggable
                  onDragStart={() => handleDragStart(t.id, 'doing')}
                  className="bg-[#0A0818] border border-[rgba(124,58,237,0.14)] hover:border-[rgba(124,58,237,0.1)] p-3 rounded-lg cursor-grab active:cursor-grabbing transition-all hover:translate-y-[-2px] shadow-lg"
                >
                  <h4 className="text-xs font-semibold text-[#E2E0FF]">{t.title}</h4>
                  {t.desc && <p className="text-[10px] text-[rgba(167,139,250,0.45)] mt-1.5 leading-normal">{t.desc}</p>}
                  <div className="flex items-center justify-between mt-3 text-[10px] text-[rgba(167,139,250,0.45)] font-mono">
                    <div className="flex items-center gap-2">
                      <span>💬 {t.comments}</span>
                      {t.attachments > 0 && <span>🔗 {t.attachments}</span>}
                    </div>
                    <div className="flex -space-x-1">
                      {t.users.map((u, i) => (
                        <span key={i} className="text-xs bg-[#16132E] rounded-full w-5 h-5 flex items-center justify-center border border-slate-900">{u}</span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
              <button className="w-full py-1.5 border border-dashed border-[rgba(124,58,237,0.14)] hover:border-[rgba(124,58,237,0.1)] text-[10px] text-[rgba(167,139,250,0.45)] hover:text-[rgba(196,190,255,0.55)] rounded-lg text-center transition-colors">
                + Add task
              </button>
            </div>
          </div>

          {/* Column DONE */}
          <div
            onDragOver={handleDragOver}
            onDrop={() => handleDrop('done')}
            className="bg-[#05040F]/40 border border-slate-900 rounded-xl p-3 flex flex-col"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-[rgba(196,190,255,0.55)] uppercase tracking-wider">Done</span>
              <span className="text-[10px] font-mono bg-[#0A0818] text-[rgba(167,139,250,0.45)] px-1.5 py-0.5 rounded border border-slate-850">
                {tasks.done.length}
              </span>
            </div>

            <div className="space-y-3 flex-1 overflow-y-auto">
              {tasks.done.map((t) => (
                <div
                  key={t.id}
                  draggable
                  onDragStart={() => handleDragStart(t.id, 'done')}
                  className="bg-[#0A0818] border border-[rgba(124,58,237,0.14)] hover:border-[rgba(124,58,237,0.1)] p-3 rounded-lg cursor-grab active:cursor-grabbing transition-all hover:translate-y-[-2px] shadow-lg"
                >
                  <h4 className="text-xs font-semibold text-[#E2E0FF]">{t.title}</h4>
                  {t.desc && <p className="text-[10px] text-[rgba(167,139,250,0.45)] mt-1.5 leading-normal">{t.desc}</p>}
                  <div className="flex items-center justify-between mt-3 text-[10px] text-[rgba(167,139,250,0.45)] font-mono">
                    <div className="flex items-center gap-2">
                      <span>💬 {t.comments}</span>
                      {t.attachments > 0 && <span>🔗 {t.attachments}</span>}
                    </div>
                    <div className="flex -space-x-1">
                      {t.users.map((u, i) => (
                        <span key={i} className="text-xs bg-[#16132E] rounded-full w-5 h-5 flex items-center justify-center border border-slate-900">{u}</span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
              <button className="w-full py-1.5 border border-dashed border-[rgba(124,58,237,0.14)] hover:border-[rgba(124,58,237,0.1)] text-[10px] text-[rgba(167,139,250,0.45)] hover:text-[rgba(196,190,255,0.55)] rounded-lg text-center transition-colors">
                + Add task
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Right SynthAI Chatbot Sidebar Panel */}
      <div className="w-full lg:w-80 bg-[#0A0818] border border-[rgba(124,58,237,0.14)] rounded-xl flex flex-col h-full overflow-hidden">
        {/* Chatbot Header */}
        <div className="p-4 border-b border-[rgba(124,58,237,0.14)] bg-[#0A0818]/50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-indigo-400 text-lg">🤖</span>
            <div>
              <h4 className="text-xs font-bold text-[#E2E0FF] font-display">SynthAI</h4>
              <span className="text-[9px] text-[rgba(167,139,250,0.45)] font-mono">Powered by TransitOps AI</span>
            </div>
          </div>
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 live-dot" />
        </div>

        {/* Chatbot Messages List */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4 font-display">
          {chatMessages.map((msg, index) => (
            <div key={index} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
              <div
                className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-indigo-600 text-white rounded-tr-none'
                    : 'bg-[#05040F] text-[#C4BEFF] rounded-tl-none border border-slate-850'
                }`}
                style={{ whiteSpace: 'pre-line' }}
              >
                {msg.text}
              </div>
              <span className="text-[8px] text-slate-650 mt-1 font-mono">
                {msg.sender === 'user' ? 'You' : 'SynthAI'}
              </span>
            </div>
          ))}
          {chatLoading && (
            <div className="flex items-start">
              <div className="bg-[#05040F] text-[rgba(167,139,250,0.45)] rounded-2xl rounded-tl-none border border-slate-850 px-4 py-2 text-xs font-mono animate-pulse">
                SynthAI is thinking…
              </div>
            </div>
          )}
        </div>

        {/* Chatbot Footer Input */}
        <form onSubmit={handleSendMessage} className="p-3 border-t border-[rgba(124,58,237,0.14)] bg-[#05040F]/40">
          <div className="relative flex items-center">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Ask AI (e.g. idle vehicles...)"
              className="w-full bg-[#05040F] border border-[rgba(124,58,237,0.14)] rounded-xl py-2.5 pl-3 pr-10 text-xs text-[#E2E0FF] placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 transition-colors"
            />
            <button
              type="submit"
              disabled={chatLoading}
              className="absolute right-2 text-indigo-400 hover:text-indigo-300 disabled:opacity-30 text-sm p-1.5 transition-opacity"
            >
              ▲
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
