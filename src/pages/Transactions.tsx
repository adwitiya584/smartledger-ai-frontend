import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { Transaction } from '../types';
import { Trash2, PlusCircle } from 'lucide-react';

const categories = ['Salary', 'Food', 'Transport', 'Shopping', 'Bills', 'Health', 'Entertainment', 'Other'];

const Transactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    title: '', amount: '', type: 'EXPENSE',
    category: 'Food', transactionDate: '', note: ''
  });

  const load = () => api.get('/transactions').then(res => setTransactions(res.data));
  useEffect(() => { load(); }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.post('/transactions', { ...form, amount: parseFloat(form.amount) });
    setForm({ title: '', amount: '', type: 'EXPENSE', category: 'Food', transactionDate: '', note: '' });
    setShowForm(false);
    load();
  };

  const handleDelete = async (id: number) => {
    await api.delete(`/transactions/${id}`);
    load();
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ color: '#1e293b', margin: 0 }}>Transactions</h2>
        <button onClick={() => setShowForm(!showForm)} style={btnStyle}>
          <PlusCircle size={16} /> Add Transaction
        </button>
      </div>

      {/* Add Form */}
      {showForm && (
        <div style={{ background: '#fff', borderRadius: '12px', padding: '24px', marginBottom: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
          <h3 style={{ marginBottom: '16px', color: '#1e293b' }}>New Transaction</h3>
          <form onSubmit={handleAdd}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <input placeholder="Title" value={form.title}
                onChange={e => setForm({...form, title: e.target.value})}
                style={inputStyle} required />
              <input type="number" placeholder="Amount" value={form.amount}
                onChange={e => setForm({...form, amount: e.target.value})}
                style={inputStyle} required />
              <select value={form.type} onChange={e => setForm({...form, type: e.target.value})} style={inputStyle}>
                <option value="INCOME">Income</option>
                <option value="EXPENSE">Expense</option>
              </select>
              <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} style={inputStyle}>
                {categories.map(c => <option key={c}>{c}</option>)}
              </select>
              <input type="date" value={form.transactionDate}
                onChange={e => setForm({...form, transactionDate: e.target.value})}
                style={inputStyle} required />
              <input placeholder="Note (optional)" value={form.note}
                onChange={e => setForm({...form, note: e.target.value})}
                style={inputStyle} />
            </div>
            <button type="submit" style={{ ...btnStyle, marginTop: '12px' }}>Save Transaction</button>
          </form>
        </div>
      )}

      {/* Transactions List */}
      <div style={{ background: '#fff', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f8fafc' }}>
              {['Title', 'Amount', 'Type', 'Category', 'Date', 'Action'].map(h => (
                <th key={h} style={thStyle}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {transactions.map(t => (
              <tr key={t.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={tdStyle}>{t.title}</td>
                <td style={{ ...tdStyle, fontWeight: 'bold',
                  color: t.type === 'INCOME' ? '#10b981' : '#ef4444' }}>
                  ₹{Number(t.amount).toLocaleString()}
                </td>
                <td style={tdStyle}>
                  <span style={{
                    padding: '2px 10px', borderRadius: '99px', fontSize: '12px',
                    background: t.type === 'INCOME' ? '#dcfce7' : '#fee2e2',
                    color: t.type === 'INCOME' ? '#16a34a' : '#dc2626'
                  }}>{t.type}</span>
                </td>
                <td style={tdStyle}>{t.category}</td>
                <td style={tdStyle}>{t.transactionDate}</td>
                <td style={tdStyle}>
                  <button onClick={() => handleDelete(t.id)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444' }}>
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
            {transactions.length === 0 && (
              <tr><td colSpan={6} style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
                No transactions yet
              </td></tr>
            )}
          </tbody>
        </table>
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
const thStyle: React.CSSProperties = {
  padding: '12px 16px', textAlign: 'left', fontSize: '13px',
  color: '#64748b', fontWeight: '600'
};
const tdStyle: React.CSSProperties = { padding: '12px 16px', fontSize: '14px', color: '#1e293b' };

export default Transactions;