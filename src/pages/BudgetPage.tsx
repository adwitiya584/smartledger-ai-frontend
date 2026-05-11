import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { BudgetStatus } from '../types';
import { PlusCircle } from 'lucide-react';

const categories = ['Food', 'Transport', 'Shopping', 'Bills', 'Health', 'Entertainment', 'Other'];

const BudgetPage = () => {
  const [budgets, setBudgets] = useState<BudgetStatus[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ category: 'Food', monthlyLimit: '', month: 5, year: 2026 });

  const load = () => {
    api.get(`/budgets/status?month=${form.month}&year=${form.year}`)
      .then(res => setBudgets(res.data));
  };

 // useEffect(() => { load(); }, []);
  // eslint-disable-next-line react-hooks/exhaustive-deps
useEffect(() => { load(); }, [form.month, form.year]);
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.post('/budgets', { ...form, monthlyLimit: parseFloat(form.monthlyLimit) });
    setShowForm(false);
    load();
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ color: '#1e293b', margin: 0 }}>Budget Tracker</h2>
        <button onClick={() => setShowForm(!showForm)} style={btnStyle}>
          <PlusCircle size={16} /> Set Budget
        </button>
      </div>

      {showForm && (
        <div style={{ background: '#fff', borderRadius: '12px', padding: '24px', marginBottom: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
          <form onSubmit={handleSave}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '12px' }}>
              <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} style={inputStyle}>
                {categories.map(c => <option key={c}>{c}</option>)}
              </select>
              <input type="number" placeholder="Monthly Limit" value={form.monthlyLimit}
                onChange={e => setForm({...form, monthlyLimit: e.target.value})}
                style={inputStyle} required />
              <input type="number" placeholder="Month" value={form.month}
                onChange={e => setForm({...form, month: parseInt(e.target.value)})}
                style={inputStyle} min={1} max={12} required />
              <input type="number" placeholder="Year" value={form.year}
                onChange={e => setForm({...form, year: parseInt(e.target.value)})}
                style={inputStyle} required />
            </div>
            <button type="submit" style={{ ...btnStyle, marginTop: '12px' }}>Save Budget</button>
          </form>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '16px' }}>
        {budgets.map(b => (
          <div key={b.category} style={{
            background: '#fff', borderRadius: '12px', padding: '20px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
            borderLeft: `4px solid ${b.exceeded ? '#ef4444' : '#10b981'}`
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
              <h3 style={{ margin: 0, color: '#1e293b' }}>{b.category}</h3>
              {b.exceeded && <span style={{ color: '#ef4444', fontSize: '12px', fontWeight: 'bold' }}>⚠️ Exceeded!</span>}
            </div>
            <div style={{ background: '#f1f5f9', borderRadius: '99px', height: '8px', marginBottom: '12px' }}>
              <div style={{
                width: `${Math.min(b.percentage, 100)}%`, height: '100%',
                borderRadius: '99px',
                background: b.exceeded ? '#ef4444' : b.percentage > 75 ? '#f59e0b' : '#10b981'
              }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#64748b' }}>
              <span>Spent: <strong>₹{Number(b.spent).toLocaleString()}</strong></span>
              <span>Limit: <strong>₹{Number(b.limit).toLocaleString()}</strong></span>
              <span>Remaining: <strong>₹{Number(b.remaining).toLocaleString()}</strong></span>
            </div>
          </div>
        ))}
        {budgets.length === 0 && (
          <p style={{ color: '#94a3b8', gridColumn: 'span 2', textAlign: 'center', padding: '40px' }}>
            No budgets set yet
          </p>
        )}
      </div>
    </div>
  );
};

const btnStyle: React.CSSProperties = {
  display: 'flex', alignItems: 'center', gap: '6px',
  padding: '10px 16px', background: '#3b82f6', color: '#fff',
  border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px'
};
const inputStyle: React.CSSProperties = {
  padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0',
  fontSize: '14px', width: '100%', boxSizing: 'border-box'
};

export default BudgetPage;