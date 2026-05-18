import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { PlusCircle, Trash2, PiggyBank, Calendar, TrendingUp } from 'lucide-react';

const GOAL_ICONS = ['🎯', '🏠', '🚗', '✈️', '💍', '📱', '🎓', '💰', '🏖️', '💻'];
const GOAL_COLORS = [
  '#6366f1', '#8b5cf6', '#10b981', '#f59e0b',
  '#ef4444', '#06b6d4', '#ec4899', '#84cc16'
];

const SavingsGoals = () => {
  const [goals, setGoals] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [showAddMoney, setShowAddMoney] = useState<number | null>(null);
  const [addAmount, setAddAmount] = useState('');
  const [form, setForm] = useState({
    name: '',
    targetAmount: '',
    savedAmount: '0',
    targetDate: '',
    icon: '🎯',
    color: '#6366f1'
  });

  const load = () => api.get('/goals').then(res => setGoals(res.data));
  useEffect(() => { load(); }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.post('/goals', {
      ...form,
      targetAmount: parseFloat(form.targetAmount),
      savedAmount: parseFloat(form.savedAmount)
    });
    setShowForm(false);
    setForm({ name: '', targetAmount: '', savedAmount: '0', targetDate: '', icon: '🎯', color: '#6366f1' });
    load();
  };

  const handleAddMoney = async (goalId: number) => {
    await api.post(`/goals/${goalId}/add-savings`, { amount: parseFloat(addAmount) });
    setShowAddMoney(null);
    setAddAmount('');
    load();
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Delete this goal?')) {
      await api.delete(`/goals/${id}`);
      load();
    }
  };

  const totalTarget = goals.reduce((s, g) => s + Number(g.targetAmount), 0);
  const totalSaved = goals.reduce((s, g) => s + Number(g.savedAmount), 0);
  const completed = goals.filter(g => g.completed).length;

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Savings Goals</h1>
          <p className="text-slate-400 mt-1">Track your financial dreams and goals</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 balance-gradient text-white px-4 py-2.5 rounded-xl font-medium hover:opacity-90 transition shadow-lg shadow-indigo-500/20"
        >
          <PlusCircle size={18} />
          New Goal
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className="glass rounded-xl p-4">
          <p className="text-slate-400 text-xs mb-1">Total Target</p>
          <p className="text-white font-bold text-lg">₹{totalTarget.toLocaleString()}</p>
        </div>
        <div className="glass rounded-xl p-4">
          <p className="text-slate-400 text-xs mb-1">Total Saved</p>
          <p className="text-green-400 font-bold text-lg">₹{totalSaved.toLocaleString()}</p>
        </div>
        <div className="glass rounded-xl p-4">
          <p className="text-slate-400 text-xs mb-1">Completed Goals</p>
          <p className="text-indigo-400 font-bold text-lg">{completed} / {goals.length}</p>
        </div>
      </div>

      {/* Add Goal Form */}
      {showForm && (
        <div className="glass rounded-2xl p-6 animate-slide-up">
          <h3 className="text-white font-semibold mb-4">Create New Goal</h3>
          <form onSubmit={handleCreate}>
            {/* Icon picker */}
            <div className="mb-4">
              <label className="text-slate-400 text-xs mb-2 block">Choose Icon</label>
              <div className="flex gap-2 flex-wrap">
                {GOAL_ICONS.map(icon => (
                  <button
                    key={icon} type="button"
                    onClick={() => setForm({...form, icon})}
                    className={`w-10 h-10 rounded-xl text-xl flex items-center justify-center transition
                      ${form.icon === icon ? 'balance-gradient scale-110' : 'glass hover:scale-105'}`}
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>

            {/* Color picker */}
            <div className="mb-4">
              <label className="text-slate-400 text-xs mb-2 block">Choose Color</label>
              <div className="flex gap-2">
                {GOAL_COLORS.map(color => (
                  <button
                    key={color} type="button"
                    onClick={() => setForm({...form, color})}
                    className={`w-8 h-8 rounded-full transition hover:scale-110
                      ${form.color === color ? 'ring-2 ring-white scale-110' : ''}`}
                    style={{ background: color }}
                  />
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-slate-400 text-xs mb-1 block">Goal Name</label>
                <input
                  placeholder="e.g. New Laptop"
                  value={form.name}
                  onChange={e => setForm({...form, name: e.target.value})}
                  required
                  className="w-full bg-white/5 border border-white/10 text-white placeholder-slate-500 rounded-xl px-4 py-2.5 focus:outline-none focus:border-indigo-500 text-sm"
                />
              </div>
              <div>
                <label className="text-slate-400 text-xs mb-1 block">Target Amount (₹)</label>
                <input
                  type="number"
                  placeholder="50000"
                  value={form.targetAmount}
                  onChange={e => setForm({...form, targetAmount: e.target.value})}
                  required
                  className="w-full bg-white/5 border border-white/10 text-white placeholder-slate-500 rounded-xl px-4 py-2.5 focus:outline-none focus:border-indigo-500 text-sm"
                />
              </div>
              <div>
                <label className="text-slate-400 text-xs mb-1 block">Already Saved (₹)</label>
                <input
                  type="number"
                  placeholder="0"
                  value={form.savedAmount}
                  onChange={e => setForm({...form, savedAmount: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 text-white placeholder-slate-500 rounded-xl px-4 py-2.5 focus:outline-none focus:border-indigo-500 text-sm"
                />
              </div>
              <div>
                <label className="text-slate-400 text-xs mb-1 block">Target Date</label>
                <input
                  type="date"
                  value={form.targetDate}
                  onChange={e => setForm({...form, targetDate: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-2.5 focus:outline-none focus:border-indigo-500 text-sm"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-4">
              <button type="submit" className="flex-1 balance-gradient text-white py-2.5 rounded-xl font-medium hover:opacity-90 transition">
                Create Goal
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="px-6 glass text-slate-400 py-2.5 rounded-xl hover:text-white transition">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Goals Grid */}
      {goals.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {goals.map(g => (
            <div key={g.id} className="glass rounded-2xl p-6 card-hover">
              {/* Goal header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-lg"
                    style={{ background: `${g.color}30`, border: `1px solid ${g.color}50` }}
                  >
                    {g.icon}
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">{g.name}</h3>
                    {g.completed && (
                      <span className="text-green-400 text-xs font-medium">✅ Completed!</span>
                    )}
                  </div>
                </div>
                <button onClick={() => handleDelete(g.id)} className="text-slate-600 hover:text-red-400 transition">
                  <Trash2 size={16} />
                </button>
              </div>

              {/* Progress */}
              <div className="mb-3">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-400">Progress</span>
                  <span className="text-white font-medium">{g.percentage.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-white/5 rounded-full h-3">
                  <div
                    className="h-3 rounded-full transition-all duration-700"
                    style={{
                      width: `${Math.min(g.percentage, 100)}%`,
                      background: `linear-gradient(90deg, ${g.color}, ${g.color}aa)`
                    }}
                  />
                </div>
              </div>

              {/* Amounts */}
              <div className="flex justify-between text-sm mb-4">
                <div>
                  <p className="text-slate-500 text-xs">Saved</p>
                  <p className="text-green-400 font-semibold">₹{Number(g.savedAmount).toLocaleString()}</p>
                </div>
                <div className="text-center">
                  <p className="text-slate-500 text-xs">Remaining</p>
                  <p className="text-white font-semibold">₹{Number(g.remaining).toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-slate-500 text-xs">Target</p>
                  <p className="text-indigo-400 font-semibold">₹{Number(g.targetAmount).toLocaleString()}</p>
                </div>
              </div>

              {/* Meta info */}
              <div className="flex gap-3 text-xs text-slate-500 mb-4">
                {g.targetDate && (
                  <div className="flex items-center gap-1">
                    <Calendar size={12} />
                    <span>{g.daysRemaining > 0 ? `${g.daysRemaining} days left` : 'Overdue'}</span>
                  </div>
                )}
                {g.monthlyNeeded && (
                  <div className="flex items-center gap-1">
                    <TrendingUp size={12} />
                    <span>₹{Math.round(g.monthlyNeeded).toLocaleString()}/month needed</span>
                  </div>
                )}
              </div>

              {/* Add money */}
              {!g.completed && (
                <>
                  {showAddMoney === g.id ? (
                    <div className="flex gap-2">
                      <input
                        type="number"
                        placeholder="Amount to add"
                        value={addAmount}
                        onChange={e => setAddAmount(e.target.value)}
                        className="flex-1 bg-white/5 border border-white/10 text-white placeholder-slate-500 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-indigo-500"
                      />
                      <button
                        onClick={() => handleAddMoney(g.id)}
                        className="px-4 py-2 rounded-xl text-white text-sm font-medium hover:opacity-90 transition"
                        style={{ background: g.color }}
                      >
                        Add
                      </button>
                      <button
                        onClick={() => setShowAddMoney(null)}
                        className="px-3 py-2 glass text-slate-400 rounded-xl text-sm hover:text-white transition"
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setShowAddMoney(g.id)}
                      className="w-full py-2 rounded-xl text-sm font-medium hover:opacity-90 transition"
                      style={{ background: `${g.color}20`, color: g.color, border: `1px solid ${g.color}40` }}
                    >
                      + Add Money
                    </button>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="glass rounded-2xl p-12 text-center">
          <PiggyBank size={40} className="text-slate-600 mx-auto mb-4" />
          <p className="text-slate-400 font-medium">No savings goals yet</p>
          <p className="text-slate-600 text-sm mt-1">Create your first goal to start saving!</p>
        </div>
      )}
    </div>
  );
};

export default SavingsGoals;