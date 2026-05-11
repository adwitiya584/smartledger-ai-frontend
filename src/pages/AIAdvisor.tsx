import React, { useState } from 'react';
import api from '../api/axios';
import { Bot, Send } from 'lucide-react';

interface Message {
  role: 'user' | 'ai';
  text: string;
}

const AIAdvisor = () => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'ai', text: 'Hi! I\'m your SmartLedger AI advisor. Ask me anything about your finances!' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);
    try {
      const res = await api.post('/ai/chat', { message: userMsg });
      setMessages(prev => [...prev, { role: 'ai', text: res.data.reply }]);
    } catch {
      setMessages(prev => [...prev, { role: 'ai', text: 'Sorry, something went wrong.' }]);
    }
    setLoading(false);
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') sendMessage();
  };

  const suggestions = [
    'How am I doing this month?',
    'Where should I cut expenses?',
    'How much should I save?',
    'Am I overspending on food?'
  ];

  return (
    <div>
      <h2 style={{ color: '#1e293b', marginBottom: '8px' }}>AI Financial Advisor</h2>
      <p style={{ color: '#64748b', marginBottom: '24px' }}>
        Powered by Llama 3.3 — Ask anything about your finances
      </p>

      {/* Suggestions */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
        {suggestions.map(s => (
          <button key={s} onClick={() => setInput(s)} style={{
            padding: '6px 14px', borderRadius: '99px', border: '1px solid #e2e8f0',
            background: '#fff', cursor: 'pointer', fontSize: '13px', color: '#3b82f6'
          }}>{s}</button>
        ))}
      </div>

      {/* Chat window */}
      <div style={{
        background: '#fff', borderRadius: '12px', padding: '20px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)', height: '420px',
        overflowY: 'auto', marginBottom: '16px'
      }}>
        {messages.map((m, i) => (
          <div key={i} style={{
            display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start',
            marginBottom: '12px'
          }}>
            {m.role === 'ai' && (
              <div style={{
                width: '32px', height: '32px', borderRadius: '50%',
                background: '#3b82f6', display: 'flex', alignItems: 'center',
                justifyContent: 'center', marginRight: '8px', flexShrink: 0
              }}>
                <Bot size={16} color="#fff" />
              </div>
            )}
            <div style={{
              maxWidth: '70%', padding: '10px 14px', borderRadius: '12px',
              background: m.role === 'user' ? '#3b82f6' : '#f1f5f9',
              color: m.role === 'user' ? '#fff' : '#1e293b',
              fontSize: '14px', lineHeight: '1.5'
            }}>
              {m.text}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#94a3b8' }}>
            <Bot size={16} /> <span>Thinking...</span>
          </div>
        )}
      </div>

      {/* Input */}
      <div style={{ display: 'flex', gap: '8px' }}>
        <input
          value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Ask about your finances..."
          style={{
            flex: 1, padding: '12px 16px', borderRadius: '8px',
            border: '1px solid #e2e8f0', fontSize: '14px'
          }}
        />
        <button onClick={sendMessage} style={{
          padding: '12px 20px', background: '#3b82f6', color: '#fff',
          border: 'none', borderRadius: '8px', cursor: 'pointer'
        }}>
          <Send size={18} />
        </button>
      </div>
    </div>
  );
};

export default AIAdvisor;