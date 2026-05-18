import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { BudgetStatus } from '../types';
import { PlusCircle, Target, AlertTriangle, CheckCircle } from 'lucide-react';

const FIXED_EXPENSES = [
  'Electricity Bill', 'LIC Premium', 'Health Insurance',
  'Home Loan EMI', 'Car Loan EMI', 'Rent', 'Internet Bill',
  'Mobile Bill', 'Water Bill', 'Gas Bill'
];

const FLEXIBLE_EXPENSES = [
  'Credit Card Payment', 'Medical Bills', 'Shopping',
  'Travelling', 'Food & Dining', 'Entertainment',
  'Subscriptions', 'Education', 'Gym & Fitness',
  'Gifts & Donations', 'Home Maintenance', 'Personal Care', 'Miscellaneous'
];


const BudgetPage = () => {
  const [budgets, setBudgets] = useState<BudgetStatus[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [form, setForm] = useState({
    category: 'Food & Dining',
    monthlyLimit: '',
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear()
  });

  const load = () => {
    api.get(`/budgets/status?month=${month}&year=${year}`)
      .then(res => setBudgets(res.data));
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { load(); }, [month, year]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.post('/budgets', {
      ...form,
      monthlyLimit: parseFloat(form.monthlyLimit)
    });
    setShowForm(false);
    setForm({ ...form, monthlyLimit: '' });
    load();
  };

  const totalBudget = budgets.reduce((s, b) => s + Number(b.limit), 0);
  const totalSpent = budgets.reduce((s, b) => s + Number(b.spent), 0);
  const exceeded = budgets.filter(b => b.exceeded).length;

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Budget Tracker</h1>
          <p className="text-slate-400 mt-1">Set and track your monthly spending limits</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 balance-gradient text-white px-4 py-2.5 rounded-xl font-medium hover:opacity-90 transition shadow-lg shadow-indigo-500/20"
        >
          <PlusCircle size={18} />
          Set Budget
        </button>
      </div>

      {/* Month/Year selector */}
      <div className="glass rounded-2xl p-4 flex items-center gap-4">
        <Target size={20} className="text-indigo-400" />
        <span className="text-slate-400 text-sm">Viewing:</span>
        <select
          value={month}
          onChange={e => setMonth(parseInt(e.target.value))}
          className="bg-white/5 border border-white/10 text-white rounded-xl px-3 py-1.5 text-sm focus:outline-none focus:border-indigo-500"
        >
          {months.map((m, i) => (
            <option key={i + 1} value={i + 1}>{m}</option>
          ))}
        </select>
        <select
          value={year}
          onChange={e => setYear(parseInt(e.target.value))}
          className="bg-white/5 border border-white/10 text-white rounded-xl px-3 py-1.5 text-sm focus:outline-none focus:border-indigo-500"
        >
          {[2024, 2025, 2026, 2027].map(y => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="glass rounded-xl p-4">
          <p className="text-slate-400 text-xs mb-1">Total Budget</p>
          <p className="text-white font-bold text-lg">₹{totalBudget.toLocaleString()}</p>
        </div>
        <div className="glass rounded-xl p-4">
          <p className="text-slate-400 text-xs mb-1">Total Spent</p>
          <p className="text-red-400 font-bold text-lg">₹{totalSpent.toLocaleString()}</p>
        </div>
        <div className="glass rounded-xl p-4">
          <p className="text-slate-400 text-xs mb-1">Budgets Exceeded</p>
          <p className={`font-bold text-lg ${exceeded > 0 ? 'text-red-400' : 'text-green-400'}`}>
            {exceeded} {exceeded > 0 ? '⚠️' : '✅'}
          </p>
        </div>
      </div>

      {/* Add Form */}
      {showForm && (
        <div className="glass rounded-2xl p-6 animate-slide-up">
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <PlusCircle size={18} className="text-indigo-400" />
            Set Monthly Budget
          </h3>
          <form onSubmit={handleSave}>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-slate-400 text-xs mb-1 block">Category</label>
                <select
                  value={form.category}
                  onChange={e => setForm({...form, category: e.target.value})}
                  className="w-full bg-[#1e293b] border border-white/10 text-white rounded-xl px-4 py-2.5 focus:outline-none focus:border-indigo-500 text-sm"
                >
                  <optgroup label="Fixed Expenses">
                    {FIXED_EXPENSES.map(c => <option key={c}>{c}</option>)}
                  </optgroup>
                  <optgroup label="Flexible Expenses">
                    {FLEXIBLE_EXPENSES.map(c => <option key={c}>{c}</option>)}
                  </optgroup>
                </select>
              </div>
              <div>
                <label className="text-slate-400 text-xs mb-1 block">Monthly Limit (₹)</label>
                <input
                  type="number"
                  placeholder="5000"
                  value={form.monthlyLimit}
                  onChange={e => setForm({...form, monthlyLimit: e.target.value})}
                  required
                  className="w-full bg-white/5 border border-white/10 text-white placeholder-slate-500 rounded-xl px-4 py-2.5 focus:outline-none focus:border-indigo-500 text-sm"
                />
              </div>
              <div>
                <label className="text-slate-400 text-xs mb-1 block">Month</label>
                <select
                  value={form.month}
                  onChange={e => setForm({...form, month: parseInt(e.target.value)})}
                  className="w-full bg-[#1e293b] border border-white/10 text-white rounded-xl px-4 py-2.5 focus:outline-none focus:border-indigo-500 text-sm"
                >
                  {months.map((m, i) => (
                    <option key={i + 1} value={i + 1}>{m}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-slate-400 text-xs mb-1 block">Year</label>
                <select
                  value={form.year}
                  onChange={e => setForm({...form, year: parseInt(e.target.value)})}
                  className="w-full bg-[#1e293b] border border-white/10 text-white rounded-xl px-4 py-2.5 focus:outline-none focus:border-indigo-500 text-sm"
                >
                  {[2024, 2025, 2026, 2027].map(y => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-4">
              <button
                type="submit"
                className="flex-1 balance-gradient text-white py-2.5 rounded-xl font-medium hover:opacity-90 transition"
              >
                Save Budget
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

      {/* Budget cards */}
      {budgets.length > 0 ? (
        <>
          {/* Fixed expenses section */}
          {budgets.filter(b => FIXED_EXPENSES.includes(b.category)).length > 0 && (
            <div>
              <h3 className="text-slate-400 text-sm font-medium mb-3 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                Fixed Expenses
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {budgets
                  .filter(b => FIXED_EXPENSES.includes(b.category))
                  .map(b => <BudgetCard key={b.category} b={b} />)}
              </div>
            </div>
          )}

          {/* Flexible expenses section */}
          {budgets.filter(b => FLEXIBLE_EXPENSES.includes(b.category)).length > 0 && (
            <div>
              <h3 className="text-slate-400 text-sm font-medium mb-3 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-purple-400"></div>
                Flexible Expenses
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {budgets
                  .filter(b => FLEXIBLE_EXPENSES.includes(b.category))
                  .map(b => <BudgetCard key={b.category} b={b} />)}
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="glass rounded-2xl p-12 text-center">
          <Target size={40} className="text-slate-600 mx-auto mb-4" />
          <p className="text-slate-400 font-medium">No budgets set for this month</p>
          <p className="text-slate-600 text-sm mt-1">Click "Set Budget" to get started</p>
        </div>
      )}
    </div>
  );
};

const BudgetCard = ({ b }: { b: BudgetStatus }) => (
  <div className={`glass rounded-2xl p-5 card-hover border
    ${b.exceeded ? 'border-red-500/30' : 'border-white/5'}`}>
    <div className="flex items-center justify-between mb-3">
      <h3 className="text-white font-medium text-sm">{b.category}</h3>
      {b.exceeded
        ? <span className="flex items-center gap-1 text-red-400 text-xs"><AlertTriangle size={12} /> Exceeded</span>
        : b.percentage > 75
          ? <span className="text-amber-400 text-xs">⚠️ High</span>
          : <span className="flex items-center gap-1 text-green-400 text-xs"><CheckCircle size={12} /> Good</span>
      }
    </div>

    {/* Progress bar */}
    <div className="w-full bg-white/5 rounded-full h-2 mb-3">
      <div
        className="h-2 rounded-full transition-all duration-500"
        style={{
          width: `${Math.min(b.percentage, 100)}%`,
          background: b.exceeded
            ? 'linear-gradient(90deg, #ef4444, #dc2626)'
            : b.percentage > 75
              ? 'linear-gradient(90deg, #f59e0b, #d97706)'
              : 'linear-gradient(90deg, #10b981, #059669)'
        }}
      />
    </div>

    <div className="flex justify-between text-xs text-slate-400">
      <span>Spent: <span className="text-white font-medium">₹{Number(b.spent).toLocaleString()}</span></span>
      <span>{b.percentage.toFixed(0)}%</span>
      <span>Limit: <span className="text-white font-medium">₹{Number(b.limit).toLocaleString()}</span></span>
    </div>

    <div className="mt-2 text-xs">
      <span className={b.remaining >= 0 ? 'text-green-400' : 'text-red-400'}>
        {b.remaining >= 0
          ? `₹${Number(b.remaining).toLocaleString()} remaining`
          : `₹${Math.abs(Number(b.remaining)).toLocaleString()} over budget`
        }
      </span>
    </div>
  </div>
);

export default BudgetPage;