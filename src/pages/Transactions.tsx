import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { Transaction } from '../types';
import { Trash2, PlusCircle, Search} from 'lucide-react';

const INCOME_SOURCES = [
  'Salary',
  'House Property / Rent',
  'Business / Profession',
  'Capital Gains',
  'Freelance',
  'Dividends',
  'Interest Income',
  'Miscellaneous'
];

const FIXED_EXPENSES = [
  'Electricity Bill',
  'LIC Premium',
  'Health Insurance',
  'Home Loan EMI',
  'Car Loan EMI',
  'Rent',
  'Internet Bill',
  'Mobile Bill',
  'Water Bill',
  'Gas Bill'
];

const FLEXIBLE_EXPENSES = [
  'Credit Card Payment',
  'Medical Bills',
  'Shopping',
  'Travelling',
  'Food & Dining',
  'Entertainment',
  'Subscriptions',
  'Education',
  'Gym & Fitness',
  'Gifts & Donations',
  'Home Maintenance',
  'Personal Care',
  'Miscellaneous'
];

const Transactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('ALL');
  const [form, setForm] = useState({
    title: '',
    amount: '',
    type: 'EXPENSE',
    category: 'Food & Dining',
    transactionDate: new Date().toISOString().split('T')[0],
    note: ''
  });

  const load = () => api.get('/transactions').then(res => setTransactions(res.data));
  useEffect(() => { load(); }, []);


  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.post('/transactions', { ...form, amount: parseFloat(form.amount) });
    setForm({
      title: '', amount: '', type: 'EXPENSE',
      category: 'Food & Dining',
      transactionDate: new Date().toISOString().split('T')[0],
      note: ''
    });
    setShowForm(false);
    load();
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Delete this transaction?')) {
      await api.delete(`/transactions/${id}`);
      load();
    }
  };

  const filtered = transactions
    .filter(t => filterType === 'ALL' || t.type === filterType)
    .filter(t =>
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.category?.toLowerCase().includes(search.toLowerCase())
    );

  const totalIncome = transactions.filter(t => t.type === 'INCOME').reduce((s, t) => s + Number(t.amount), 0);
  const totalExpense = transactions.filter(t => t.type === 'EXPENSE').reduce((s, t) => s + Number(t.amount), 0);

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Transactions</h1>
          <p className="text-slate-400 mt-1">Manage your income and expenses</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 balance-gradient text-white px-4 py-2.5 rounded-xl font-medium hover:opacity-90 transition shadow-lg shadow-indigo-500/20"
        >
          <PlusCircle size={18} />
          Add Transaction
        </button>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="glass rounded-xl p-4">
          <p className="text-slate-400 text-xs mb-1">Total Income</p>
          <p className="text-green-400 font-bold text-lg">₹{totalIncome.toLocaleString()}</p>
        </div>
        <div className="glass rounded-xl p-4">
          <p className="text-slate-400 text-xs mb-1">Total Expenses</p>
          <p className="text-red-400 font-bold text-lg">₹{totalExpense.toLocaleString()}</p>
        </div>
        <div className="glass rounded-xl p-4">
          <p className="text-slate-400 text-xs mb-1">Net Balance</p>
          <p className={`font-bold text-lg ${totalIncome - totalExpense >= 0 ? 'text-indigo-400' : 'text-red-400'}`}>
            ₹{(totalIncome - totalExpense).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Add Form */}
      {showForm && (
        <div className="glass rounded-2xl p-6 animate-slide-up">
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <PlusCircle size={18} className="text-indigo-400" />
            New Transaction
          </h3>
          <form onSubmit={handleAdd}>
            {/* Type selector */}
            <div className="flex gap-3 mb-4">
              {['INCOME', 'EXPENSE'].map(t => (
                <button
                  key={t} type="button"
                  onClick={() => setForm({
                    ...form, type: t,
                    category: t === 'INCOME' ? 'Salary' : 'Food & Dining'
                  })}
                  className={`flex-1 py-2.5 rounded-xl font-medium text-sm transition
                    ${form.type === t
                      ? t === 'INCOME'
                        ? 'income-gradient text-white shadow-lg'
                        : 'expense-gradient text-white shadow-lg'
                      : 'glass text-slate-400 hover:text-white'
                    }`}
                >
                  {t === 'INCOME' ? '↑ Income' : '↓ Expense'}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-slate-400 text-xs mb-1 block">Title</label>
                <input
                  placeholder="e.g. May Salary"
                  value={form.title}
                  onChange={e => setForm({...form, title: e.target.value})}
                  required
                  className="w-full bg-white/5 border border-white/10 text-white placeholder-slate-500 rounded-xl px-4 py-2.5 focus:outline-none focus:border-indigo-500 text-sm transition"
                />
              </div>
              <div>
                <label className="text-slate-400 text-xs mb-1 block">Amount (₹)</label>
                <input
                  type="number"
                  placeholder="0.00"
                  value={form.amount}
                  onChange={e => setForm({...form, amount: e.target.value})}
                  required
                  className="w-full bg-white/5 border border-white/10 text-white placeholder-slate-500 rounded-xl px-4 py-2.5 focus:outline-none focus:border-indigo-500 text-sm transition"
                />
              </div>

              <div>
                <label className="text-slate-400 text-xs mb-1 block">
                  {form.type === 'INCOME' ? 'Income Source' : 'Expense Category'}
                </label>
                <select
                  value={form.category}
                  onChange={e => setForm({...form, category: e.target.value})}
                  className="w-full bg-[#1e293b] border border-white/10 text-white rounded-xl px-4 py-2.5 focus:outline-none focus:border-indigo-500 text-sm"
                >
                  {form.type === 'INCOME' ? (
                    <>
                      <optgroup label="Income Sources">
                        {INCOME_SOURCES.map(c => <option key={c}>{c}</option>)}
                      </optgroup>
                    </>
                  ) : (
                    <>
                      <optgroup label="Fixed Expenses">
                        {FIXED_EXPENSES.map(c => <option key={c}>{c}</option>)}
                      </optgroup>
                      <optgroup label="Flexible Expenses">
                        {FLEXIBLE_EXPENSES.map(c => <option key={c}>{c}</option>)}
                      </optgroup>
                    </>
                  )}
                </select>
              </div>

              <div>
                <label className="text-slate-400 text-xs mb-1 block">Date</label>
                <input
                  type="date"
                  value={form.transactionDate}
                  onChange={e => setForm({...form, transactionDate: e.target.value})}
                  required
                  className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-2.5 focus:outline-none focus:border-indigo-500 text-sm transition"
                />
              </div>

              <div className="col-span-2">
                <label className="text-slate-400 text-xs mb-1 block">Note (optional)</label>
                <input
                  placeholder="Add a note..."
                  value={form.note}
                  onChange={e => setForm({...form, note: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 text-white placeholder-slate-500 rounded-xl px-4 py-2.5 focus:outline-none focus:border-indigo-500 text-sm transition"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-4">
              <button
                type="submit"
                className="flex-1 balance-gradient text-white py-2.5 rounded-xl font-medium hover:opacity-90 transition"
              >
                Save Transaction
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-6 glass text-slate-400 py-2.5 rounded-xl hover:text-white transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filters */}
      <div className="flex gap-4 items-center">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            placeholder="Search transactions..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-white/5 border border-white/10 text-white placeholder-slate-500 rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:border-indigo-500 text-sm"
          />
        </div>
        <div className="flex gap-2">
          {['ALL', 'INCOME', 'EXPENSE'].map(f => (
            <button
              key={f}
              onClick={() => setFilterType(f)}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium transition
                ${filterType === f
                  ? 'balance-gradient text-white'
                  : 'glass text-slate-400 hover:text-white'
                }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Transactions table */}
      <div className="glass rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/5">
              <th className="text-left text-slate-400 text-xs font-medium px-6 py-4">TRANSACTION</th>
              <th className="text-left text-slate-400 text-xs font-medium px-6 py-4">CATEGORY</th>
              <th className="text-left text-slate-400 text-xs font-medium px-6 py-4">DATE</th>
              <th className="text-left text-slate-400 text-xs font-medium px-6 py-4">AMOUNT</th>
              <th className="text-left text-slate-400 text-xs font-medium px-6 py-4"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(t => (
              <tr key={t.id} className="border-b border-white/5 hover:bg-white/2 transition">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold
                      ${t.type === 'INCOME' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                      {t.type === 'INCOME' ? '↑' : '↓'}
                    </div>
                    <div>
                      <p className="text-white text-sm font-medium">{t.title}</p>
                      <p className="text-slate-500 text-xs">{t.note || '—'}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="glass text-slate-300 text-xs px-3 py-1 rounded-full">
                    {t.category}
                  </span>
                </td>
                <td className="px-6 py-4 text-slate-400 text-sm">{t.transactionDate}</td>
                <td className="px-6 py-4">
                  <span className={`font-semibold text-sm ${t.type === 'INCOME' ? 'text-green-400' : 'text-red-400'}`}>
                    {t.type === 'INCOME' ? '+' : '-'}₹{Number(t.amount).toLocaleString()}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => handleDelete(t.id)}
                    className="text-slate-600 hover:text-red-400 transition"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center py-12 text-slate-500">
                  No transactions found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Transactions;