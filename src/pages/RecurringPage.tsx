import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { PlusCircle, Trash2, Repeat, AlertCircle, Clock } from 'lucide-react';

const FIXED_EXPENSES = [
  'Electricity Bill', 'LIC Premium', 'Health Insurance',
  'Home Loan EMI', 'Car Loan EMI', 'Rent', 'Internet Bill',
  'Mobile Bill', 'Water Bill', 'Gas Bill'
];

const FLEXIBLE_EXPENSES = [
  'Credit Card Payment', 'Medical Bills', 'Shopping',
  'Travelling', 'Food & Dining', 'Entertainment',
  'Subscriptions', 'Education', 'Gym & Fitness', 'Miscellaneous'
];

const INCOME_SOURCES = [
  'Salary', 'House Property / Rent', 'Business / Profession',
  'Dividends', 'Interest Income', 'Miscellaneous'
];

const RecurringPage = () => {
  const [items, setItems] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    title: '',
    amount: '',
    type: 'EXPENSE',
    category: 'Rent',
    dueDay: '1',
    frequency: 'MONTHLY'
  });

  const load = () => api.get('/recurring').then(res => setItems(res.data));
  useEffect(() => { load(); }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.post('/recurring', {
      ...form,
      amount: parseFloat(form.amount),
      dueDay: parseInt(form.dueDay)
    });
    setShowForm(false);
    setForm({ title: '', amount: '', type: 'EXPENSE', category: 'Rent', dueDay: '1', frequency: 'MONTHLY' });
    load();
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Remove this recurring transaction?')) {
      await api.delete(`/recurring/${id}`);
      load();
    }
  };


  const totalMonthly = items
    .filter(i => i.type === 'EXPENSE')
    .reduce((s: number, i: any) => s + Number(i.amount), 0);

  const dueSoon = items.filter(i => i.isDueSoon).length;
  const overdue = items.filter(i => i.isOverdue).length;

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Recurring Transactions</h1>
          <p className="text-slate-400 mt-1">Track your regular bills and subscriptions</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 balance-gradient text-white px-4 py-2.5 rounded-xl font-medium hover:opacity-90 transition shadow-lg shadow-indigo-500/20"
        >
          <PlusCircle size={18} />
          Add Recurring
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className="glass rounded-xl p-4">
          <p className="text-slate-400 text-xs mb-1">Monthly Commitments</p>
          <p className="text-red-400 font-bold text-lg">₹{totalMonthly.toLocaleString()}</p>
        </div>
        <div className="glass rounded-xl p-4">
          <p className="text-slate-400 text-xs mb-1">Due Soon (5 days)</p>
          <p className={`font-bold text-lg ${dueSoon > 0 ? 'text-amber-400' : 'text-green-400'}`}>
            {dueSoon} items
          </p>
        </div>
        <div className="glass rounded-xl p-4">
          <p className="text-slate-400 text-xs mb-1">Overdue</p>
          <p className={`font-bold text-lg ${overdue > 0 ? 'text-red-400' : 'text-green-400'}`}>
            {overdue} items
          </p>
        </div>
      </div>

      {/* Add Form */}
      {showForm && (
        <div className="glass rounded-2xl p-6 animate-slide-up">
          <h3 className="text-white font-semibold mb-4">Add Recurring Transaction</h3>
          <form onSubmit={handleCreate}>
            {/* Type selector */}
            <div className="flex gap-3 mb-4">
              {['INCOME', 'EXPENSE'].map(t => (
                <button
                  key={t} type="button"
                  onClick={() => setForm({
                    ...form, type: t,
                    category: t === 'INCOME' ? 'Salary' : 'Rent'
                  })}
                  className={`flex-1 py-2.5 rounded-xl font-medium text-sm transition
                    ${form.type === t
                      ? t === 'INCOME'
                        ? 'income-gradient text-white'
                        : 'expense-gradient text-white'
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
                  placeholder="e.g. Netflix Subscription"
                  value={form.title}
                  onChange={e => setForm({...form, title: e.target.value})}
                  required
                  className="w-full bg-white/5 border border-white/10 text-white placeholder-slate-500 rounded-xl px-4 py-2.5 focus:outline-none focus:border-indigo-500 text-sm"
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
                  className="w-full bg-white/5 border border-white/10 text-white placeholder-slate-500 rounded-xl px-4 py-2.5 focus:outline-none focus:border-indigo-500 text-sm"
                />
              </div>
              <div>
                <label className="text-slate-400 text-xs mb-1 block">Category</label>
                <select
                  value={form.category}
                  onChange={e => setForm({...form, category: e.target.value})}
                  className="w-full bg-[#1e293b] border border-white/10 text-white rounded-xl px-4 py-2.5 focus:outline-none focus:border-indigo-500 text-sm"
                >
                  {form.type === 'INCOME' ? (
                    <optgroup label="Income Sources">
                      {INCOME_SOURCES.map(c => <option key={c}>{c}</option>)}
                    </optgroup>
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
                <label className="text-slate-400 text-xs mb-1 block">Due Day of Month</label>
                <input
                  type="number"
                  placeholder="1-31"
                  min="1" max="31"
                  value={form.dueDay}
                  onChange={e => setForm({...form, dueDay: e.target.value})}
                  required
                  className="w-full bg-white/5 border border-white/10 text-white placeholder-slate-500 rounded-xl px-4 py-2.5 focus:outline-none focus:border-indigo-500 text-sm"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-4">
              <button type="submit" className="flex-1 balance-gradient text-white py-2.5 rounded-xl font-medium hover:opacity-90 transition">
                Add Recurring
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="px-6 glass text-slate-400 py-2.5 rounded-xl hover:text-white transition">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Recurring list */}
      {items.length > 0 ? (
        <div className="space-y-3">
          {/* Overdue */}
          {items.filter(i => i.isOverdue).length > 0 && (
            <div>
              <p className="text-red-400 text-sm font-medium mb-2 flex items-center gap-2">
                <AlertCircle size={14} /> Overdue
              </p>
              {items.filter(i => i.isOverdue).map(item => (
                <RecurringCard key={item.id} item={item} onDelete={handleDelete} />
              ))}
            </div>
          )}

          {/* Due soon */}
          {items.filter(i => i.isDueSoon && !i.isOverdue).length > 0 && (
            <div>
              <p className="text-amber-400 text-sm font-medium mb-2 flex items-center gap-2">
                <Clock size={14} /> Due Soon
              </p>
              {items.filter(i => i.isDueSoon && !i.isOverdue).map(item => (
                <RecurringCard key={item.id} item={item} onDelete={handleDelete} />
              ))}
            </div>
          )}

          {/* Upcoming */}
          <div>
            <p className="text-slate-400 text-sm font-medium mb-2">Upcoming</p>
            {items.filter(i => !i.isDueSoon && !i.isOverdue).map(item => (
              <RecurringCard key={item.id} item={item} onDelete={handleDelete} />
            ))}
          </div>
        </div>
      ) : (
        <div className="glass rounded-2xl p-12 text-center">
          <Repeat size={40} className="text-slate-600 mx-auto mb-4" />
          <p className="text-slate-400 font-medium">No recurring transactions yet</p>
          <p className="text-slate-600 text-sm mt-1">Add your bills and subscriptions to track them</p>
        </div>
      )}
    </div>
  );
};

const RecurringCard = ({ item, onDelete }: { item: any, onDelete: (id: number) => void }) => (
  <div className={`glass rounded-xl p-4 mb-3 flex items-center justify-between
    ${item.isOverdue ? 'border border-red-500/30' : item.isDueSoon ? 'border border-amber-500/30' : ''}`}>
    <div className="flex items-center gap-4">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold
        ${item.type === 'INCOME' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
        {item.type === 'INCOME' ? '↑' : '↓'}
      </div>
      <div>
        <p className="text-white font-medium text-sm">{item.title}</p>
        <p className="text-slate-500 text-xs">{item.category} • Every month on day {item.dueDay}</p>
      </div>
    </div>

    <div className="flex items-center gap-6">
      <div className="text-right">
        <p className={`font-semibold ${item.type === 'INCOME' ? 'text-green-400' : 'text-red-400'}`}>
          {item.type === 'INCOME' ? '+' : '-'}₹{Number(item.amount).toLocaleString()}
        </p>
        <p className={`text-xs ${item.isOverdue ? 'text-red-400' : item.isDueSoon ? 'text-amber-400' : 'text-slate-500'}`}>
          {item.isOverdue
            ? `${Math.abs(item.daysUntilDue)} days overdue`
            : item.daysUntilDue === 0
              ? 'Due today!'
              : `Due in ${item.daysUntilDue} days`
          }
        </p>
      </div>
      <button onClick={() => onDelete(item.id)} className="text-slate-600 hover:text-red-400 transition">
        <Trash2 size={16} />
      </button>
    </div>
  </div>
);

export default RecurringPage;