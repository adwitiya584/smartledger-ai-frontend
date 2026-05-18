import React, { useState, useRef, useEffect } from 'react';
import api from '../api/axios';
import { Bot, Send, Sparkles, TrendingUp, AlertCircle, Lightbulb, PiggyBank } from 'lucide-react';

interface Message {
  role: 'user' | 'ai';
  text: string;
  time: string;
}

const suggestions = [
  { icon: <TrendingUp size={14} />, text: 'How am I doing this month?' },
  { icon: <AlertCircle size={14} />, text: 'Am I overspending anywhere?' },
  { icon: <PiggyBank size={14} />, text: 'How much should I save?' },
  { icon: <Lightbulb size={14} />, text: 'Give me tips to reduce expenses' },
  { icon: <TrendingUp size={14} />, text: 'Which category costs me the most?' },
  { icon: <PiggyBank size={14} />, text: 'How can I reach my savings goal?' },
];

const AIAdvisor = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'ai',
      text: "Hi! I'm your Paisa Nest AI advisor powered by Llama 3.3 🤖\n\nI can analyze your actual transaction data and give you personalized financial advice. What would you like to know?",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (text?: string) => {
    const msg = text || input;
    if (!msg.trim()) return;
    setInput('');

    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setMessages(prev => [...prev, { role: 'user', text: msg, time }]);
    setLoading(true);

    try {
      const res = await api.post('/ai/chat', { message: msg });
      setMessages(prev => [...prev, {
        role: 'ai',
        text: res.data.reply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } catch {
      setMessages(prev => [...prev, {
        role: 'ai',
        text: 'Sorry, something went wrong. Please try again.',
        time
      }]);
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] animate-slide-up">
      {/* Header */}
      <div className="mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl ai-gradient flex items-center justify-center shadow-lg shadow-amber-500/20">
            <Sparkles size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">AI Financial Advisor</h1>
            <p className="text-slate-400 text-sm">Powered by Llama 3.3 — analyzes your real data</p>
          </div>
          <div className="ml-auto flex items-center gap-2 glass px-3 py-1.5 rounded-full">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
            <span className="text-green-400 text-xs font-medium">Online</span>
          </div>
        </div>
      </div>

      {/* Suggestion chips */}
      <div className="flex flex-wrap gap-2 mb-4">
        {suggestions.map((s, i) => (
          <button
            key={i}
            onClick={() => sendMessage(s.text)}
            className="flex items-center gap-1.5 glass text-slate-300 hover:text-white text-xs px-3 py-1.5 rounded-full hover:border-indigo-500/50 transition"
          >
            <span className="text-indigo-400">{s.icon}</span>
            {s.text}
          </button>
        ))}
      </div>

      {/* Chat window */}
      <div className="flex-1 glass rounded-2xl p-4 overflow-y-auto mb-4 space-y-4">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
          >
            {m.role === 'ai' && (
              <div className="w-8 h-8 rounded-xl ai-gradient flex items-center justify-center mr-3 flex-shrink-0 mt-1 shadow-lg shadow-amber-500/20">
                <Bot size={14} className="text-white" />
              </div>
            )}
            <div className={`max-w-[75%] ${m.role === 'user' ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
              <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed
                ${m.role === 'user'
                  ? 'balance-gradient text-white rounded-tr-sm'
                  : 'bg-white/5 border border-white/10 text-slate-200 rounded-tl-sm'
                }`}
              >
                {m.text.split('\n').map((line, j) => (
                  <span key={j}>{line}{j < m.text.split('\n').length - 1 && <br />}</span>
                ))}
              </div>
              <span className="text-slate-600 text-xs px-1">{m.time}</span>
            </div>

            {m.role === 'user' && (
              <div className="w-8 h-8 rounded-xl balance-gradient flex items-center justify-center ml-3 flex-shrink-0 mt-1">
                <span className="text-white text-xs font-bold">
                  {localStorage.getItem('name')?.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex justify-start animate-fade-in">
            <div className="w-8 h-8 rounded-xl ai-gradient flex items-center justify-center mr-3 flex-shrink-0">
              <Bot size={14} className="text-white" />
            </div>
            <div className="bg-white/5 border border-white/10 px-4 py-3 rounded-2xl rounded-tl-sm">
              <div className="flex gap-1">
                <div className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="flex gap-3">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
          placeholder="Ask anything about your finances..."
          className="flex-1 bg-white/5 border border-white/10 text-white placeholder-slate-500 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500 text-sm transition"
        />
        <button
          onClick={() => sendMessage()}
          disabled={loading || !input.trim()}
          className="balance-gradient text-white p-3 rounded-xl hover:opacity-90 transition disabled:opacity-40 shadow-lg shadow-indigo-500/20"
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
};

export default AIAdvisor;