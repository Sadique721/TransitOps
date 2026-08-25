import React, { useState, useRef, useEffect } from 'react';
import api from '../api/axios';

export default function AiAssistantWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: 'Namaste! Main TransitOps AI Assistant hoon. Fleet status, top drivers, fuel theft alerts ya maintenance questions me se kuch bhi pucho!',
    },
  ]);

  const chatEndRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const quickQuestions = [
    'How many vehicles are available?',
    'Who is the top driver?',
    'Show fuel theft alerts',
    'Which vehicles need maintenance?',
    'What is the fleet fuel efficiency?',
  ];

  const handleSend = async (questionToSend) => {
    const text = questionToSend || query;
    if (!text.trim() || loading) return;

    const userMsg = { sender: 'user', text };
    setMessages((prev) => [...prev, userMsg]);
    if (!questionToSend) setQuery('');
    setLoading(true);

    try {
      const res = await api.post('/ai/chat', { query: text });
      const aiMsg = { sender: 'ai', text: res.data.answer || 'Kuch error aaya response lane me.' };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { sender: 'ai', text: 'Error connecting to AI Fleet Assistant endpoint.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 9999 }}>
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '12px 18px',
            background: 'linear-gradient(135deg, #0EA5E9 0%, #2563EB 100%)',
            color: '#fff',
            borderRadius: 30,
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 8px 24px rgba(14, 165, 233, 0.4)',
            cursor: 'pointer',
            fontWeight: 700,
            fontSize: 14,
            transition: 'all 0.2s ease-in-out',
          }}
        >
          <span style={{ fontSize: 18 }}>🤖</span>
          <span>AI Fleet Assistant</span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div
          style={{
            width: 360,
            height: 480,
            background: 'linear-gradient(180deg, #080F1E 0%, #0D1628 100%)',
            border: '1px solid rgba(14, 165, 233, 0.3)',
            borderRadius: 16,
            boxShadow: '0 12px 36px rgba(0, 0, 0, 0.6), 0 0 20px rgba(14, 165, 233, 0.15)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          {/* Chat Header */}
          <div
            style={{
              padding: '14px 18px',
              background: 'rgba(14, 165, 233, 0.1)',
              borderBottom: '1px solid rgba(14, 165, 233, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #0EA5E9, #22C55E)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 16,
                }}
              >
                🤖
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: 14, color: '#F8FAFC' }}>
                  AI Fleet Assistant
                </div>
                <div style={{ fontSize: 10, color: '#38BDF8', fontWeight: 600 }}>
                  Real-time Intelligence Active
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#94A3B8',
                fontSize: 18,
                cursor: 'pointer',
                padding: '4px',
              }}
            >
              ✖
            </button>
          </div>

          {/* Messages Container */}
          <div style={{ flex: 1, padding: 14, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 10 }}>
            {messages.map((m, idx) => (
              <div
                key={idx}
                style={{
                  alignSelf: m.sender === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '85%',
                  background:
                    m.sender === 'user'
                      ? 'linear-gradient(135deg, #0EA5E9, #2563EB)'
                      : 'rgba(30, 41, 59, 0.8)',
                  color: '#F8FAFC',
                  padding: '10px 14px',
                  borderRadius: m.sender === 'user' ? '14px 14px 2px 14px' : '14px 14px 14px 2px',
                  border: m.sender === 'user' ? 'none' : '1px solid rgba(14, 165, 233, 0.2)',
                  fontSize: 13,
                  lineHeight: 1.4,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                }}
              >
                {m.text}
              </div>
            ))}
            {loading && (
              <div
                style={{
                  alignSelf: 'flex-start',
                  background: 'rgba(30, 41, 59, 0.8)',
                  padding: '8px 14px',
                  borderRadius: 12,
                  fontSize: 12,
                  color: '#38BDF8',
                  fontStyle: 'italic',
                }}
              >
                Thinking... ⚡
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Quick Prompts */}
          <div
            style={{
              padding: '6px 12px',
              background: 'rgba(15, 23, 42, 0.6)',
              borderTop: '1px solid rgba(255, 255, 255, 0.05)',
              display: 'flex',
              gap: 6,
              overflowX: 'auto',
              whiteSpace: 'nowrap',
            }}
          >
            {quickQuestions.map((q, i) => (
              <button
                key={i}
                onClick={() => handleSend(q)}
                style={{
                  background: 'rgba(14, 165, 233, 0.1)',
                  border: '1px solid rgba(14, 165, 233, 0.2)',
                  color: '#7DD3FC',
                  borderRadius: 12,
                  padding: '4px 10px',
                  fontSize: 11,
                  cursor: 'pointer',
                  flexShrink: 0,
                }}
              >
                {q}
              </button>
            ))}
          </div>

          {/* Chat Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            style={{
              padding: 12,
              borderTop: '1px solid rgba(14, 165, 233, 0.15)',
              display: 'flex',
              gap: 8,
              background: '#080F1E',
            }}
          >
            <input
              type="text"
              placeholder="Ask anything about your fleet..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              style={{
                flex: 1,
                background: 'rgba(15, 23, 42, 0.8)',
                border: '1px solid rgba(14, 165, 233, 0.3)',
                borderRadius: 8,
                padding: '8px 12px',
                color: '#F8FAFC',
                fontSize: 13,
                outline: 'none',
              }}
            />
            <button
              type="submit"
              disabled={loading || !query.trim()}
              style={{
                background: 'linear-gradient(135deg, #0EA5E9, #2563EB)',
                border: 'none',
                borderRadius: 8,
                padding: '8px 14px',
                color: '#fff',
                fontWeight: 700,
                cursor: loading || !query.trim() ? 'not-allowed' : 'pointer',
                opacity: loading || !query.trim() ? 0.5 : 1,
              }}
            >
              Send
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
