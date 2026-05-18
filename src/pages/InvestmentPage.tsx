import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import {
  PlusCircle, Trash2, TrendingUp, TrendingDown,PieChart, Wallet, RefreshCw
} from 'lucide-react';
import {
  PieChart as RechartsPie, Pie, Cell,
  ResponsiveContainer, Tooltip
} from 'recharts';

const INVESTMENT_TYPES = [
  { value: 'SIP', label: '📈 Mutual Fund SIP', color: '#6366f1' },
  { value: 'STOCKS', label: '📊 Stocks / Shares', color: '#10b981' },
  { value: 'PPF', label: '🏛️ PPF', color: '#f59e0b' },
  { value: 'FD', label: '🏦 Fixed Deposit', color: '#06b6d4' },
  { value: 'NPS', label: '🎯 NPS', color: '#8b5cf6' },
  { value: 'GOLD', label: '🥇 Gold', color: '#fbbf24' },
  { value: 'CRYPTO', label: '₿ Crypto', color: '#f97316' },
  { value: 'REAL_ESTATE', label: '🏠 Real Estate', color: '#84cc16' },
  { value: 'OTHER', label: '💼 Other', color: '#94a3b8' },
];

const TYPE_COLORS: Record<string, string> = Object.fromEntries(
  INVESTMENT_TYPES.map(t => [t.value, t.color])
);

const InvestmentPage = () => {
  const [portfolio, setPortfolio] = useState<any>(null);
  const [showForm, setShowForm] = useState(false);
  const [updateId, setUpdateId] = useState<number | null>(null);
  const [updateValue, setUpdateValue] = useState('');
  const [form, setForm] = useState({
    name: '',
    type: 'SIP',
    investedAmount: '',
    currentValue: '',
    monthlySip: '',
    startDate: '',
    maturityDate: '',
    notes: ''
  });

  const load = () => api.get('/investments/portfolio').then(res => setPortfolio(res.data));
  useEffect(() => { load(); }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.post('/investments', {
      ...form,
      investedAmount: parseFloat(form.investedAmount),
      currentValue: form.currentValue ? parseFloat(form.currentValue) : null,
      monthlySip: form.monthlySip ? parseFloat(form.monthlySip) : null,
    });
    setShowForm(false);
    setForm({
      name: '', type: 'SIP', investedAmount: '',
      currentValue: '', monthlySip: '', startDate: '',
      maturityDate: '', notes: ''
    });
    load();
  };

  const handleUpdateValue = async (id: number) => {
    await api.put(`/investments/${id}/update-value`, {
      currentValue: parseFloat(updateValue)
    });
    setUpdateId(null);
    setUpdateValue('');
    load();
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Remove this investment?')) {
      await api.delete(`/investments/${id}`);
      load();
    }
  };

  const pieData = portfolio?.typeBreakdown
    ? Object.entries(portfolio.typeBreakdown).map(([name, value]) => ({
        name, value: Number(value)
      }))
    : [];

  const returnsPositive = portfolio?.totalReturns >= 0;

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Investment Portfolio</h1>
          <p className="text-slate-400 mt-1">Track SIPs, stocks, FDs and all your investments</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 balance-gradient text-white px-4 py-2.5 rounded-xl font-medium hover:opacity-90 transition shadow-lg shadow-indigo-500/20"
        >
          <PlusCircle size={18} />
          Add Investment
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass rounded-xl p-4">
          <p className="text-slate-400 text-xs mb-1">Total Invested</p>
          <p className="text-white font-bold text-lg">
            ₹{Number(portfolio?.totalInvested || 0).toLocaleString()}
          </p>
        </div>
        <div className="glass rounded-xl p-4">
          <p className="text-slate-400 text-xs mb-1">Current Value</p>
          <p className="text-indigo-400 font-bold text-lg">
            ₹{Number(portfolio?.totalCurrentValue || 0).toLocaleString()}
          </p>
        </div>
        <div className="glass rounded-xl p-4">
          <p className="text-slate-400 text-xs mb-1">Total Returns</p>
          <div className="flex items-center gap-1">
            {returnsPositive
              ? <TrendingUp size={16} className="text-green-400" />
              : <TrendingDown size={16} className="text-red-400" />
            }
            <p className={`font-bold text-lg ${returnsPositive ? 'text-green-400' : 'text-red-400'}`}>
              {returnsPositive ? '+' : ''}₹{Number(portfolio?.totalReturns || 0).toLocaleString()}
            </p>
          </div>
          <p className={`text-xs ${returnsPositive ? 'text-green-400' : 'text-red-400'}`}>
            {Number(portfolio?.returnsPercentage || 0).toFixed(2)}%
          </p>
        </div>
        <div className="glass rounded-xl p-4">
          <p className="text-slate-400 text-xs mb-1">Monthly SIP</p>
          <p className="text-amber-400 font-bold text-lg">
            ₹{Number(portfolio?.totalMonthlySip || 0).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Net Worth Breakdown */}
      <div className="glass rounded-2xl p-6">
        <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
          <Wallet size={18} className="text-indigo-400" />
          Real Savings Breakdown
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-green-500/10 rounded-xl border border-green-500/20">
            <p className="text-slate-400 text-xs mb-1">Total Income</p>
            <p className="text-green-400 font-bold">₹{Number(portfolio?.totalIncome || 0).toLocaleString()}</p>
          </div>
          <div className="text-center p-3 bg-red-500/10 rounded-xl border border-red-500/20">
            <p className="text-slate-400 text-xs mb-1">Total Expenses</p>
            <p className="text-red-400 font-bold">₹{Number(portfolio?.totalExpense || 0).toLocaleString()}</p>
          </div>
          <div className="text-center p-3 bg-indigo-500/10 rounded-xl border border-indigo-500/20">
            <p className="text-slate-400 text-xs mb-1">Investments</p>
            <p className="text-indigo-400 font-bold">₹{Number(portfolio?.totalInvested || 0).toLocaleString()}</p>
          </div>
          <div className="text-center p-3 bg-amber-500/10 rounded-xl border border-amber-500/20">
            <p className="text-slate-400 text-xs mb-1">Net Savings</p>
            <p className={`font-bold ${Number(portfolio?.netSavings) >= 0 ? 'text-amber-400' : 'text-red-400'}`}>
              ₹{Number(portfolio?.netSavings || 0).toLocaleString()}
            </p>
          </div>
        </div>
        {/* Formula */}
        <p className="text-slate-600 text-xs text-center mt-3">
          Net Savings = Income − Expenses − Investments
        </p>
      </div>

      {/* Charts + List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pie chart */}
        <div className="glass rounded-2xl p-6">
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <PieChart size={18} className="text-indigo-400" />
            By Type
          </h3>
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <RechartsPie>
                <Pie
                  data={pieData} cx="50%" cy="50%"
                  innerRadius={50} outerRadius={80}
                  dataKey="value" paddingAngle={3}
                >
                  {pieData.map((entry, index) => (
                    <Cell
                      key={index}
                      fill={TYPE_COLORS[entry.name] || '#6366f1'}
                    />
                  ))}
                </Pie>
                <Tooltip formatter={(val) => `₹${Number(val).toLocaleString()}`} />
              </RechartsPie>
            </ResponsiveContainer>
          ) : (
            <div className="h-48 flex items-center justify-center">
              <p className="text-slate-500 text-sm">No data yet</p>
            </div>
          )}
          {/* Legend */}
          <div className="space-y-1 mt-2">
            {pieData.map(entry => (
              <div key={entry.name} className="flex justify-between text-xs">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full" style={{ background: TYPE_COLORS[entry.name] }}></div>
                  <span className="text-slate-400">{entry.name}</span>
                </div>
                <span className="text-white">₹{Number(entry.value).toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Investment list */}
        <div className="lg:col-span-2 glass rounded-2xl p-6">
          <h3 className="text-white font-semibold mb-4">Holdings</h3>
          <div className="space-y-3">
            {portfolio?.investments?.length > 0 ? (
              portfolio.investments.map((inv: any) => {
                const returns = Number(inv.currentValue) - Number(inv.investedAmount);
                const returnsPos = returns >= 0;
                const typeInfo = INVESTMENT_TYPES.find(t => t.value === inv.type);

                return (
                  <div key={inv.id} className="flex items-center justify-between p-3 bg-white/3 rounded-xl border border-white/5 hover:border-white/10 transition">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
                        style={{ background: `${typeInfo?.color}20` }}
                      >
                        {typeInfo?.label.split(' ')[0]}
                      </div>
                      <div>
                        <p className="text-white text-sm font-medium">{inv.name}</p>
                        <p className="text-slate-500 text-xs">{inv.type}
                          {inv.monthlySip && ` • SIP ₹${Number(inv.monthlySip).toLocaleString()}/mo`}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-white text-sm font-medium">
                          ₹{Number(inv.currentValue).toLocaleString()}
                        </p>
                        <p className={`text-xs ${returnsPos ? 'text-green-400' : 'text-red-400'}`}>
                          {returnsPos ? '+' : ''}₹{returns.toLocaleString()}
                        </p>
                      </div>

                      {/* Update value */}
                      {updateId === inv.id ? (
                        <div className="flex gap-1">
                          <input
                            type="number"
                            value={updateValue}
                            onChange={e => setUpdateValue(e.target.value)}
                            placeholder="New value"
                            className="w-24 bg-white/5 border border-white/10 text-white text-xs rounded-lg px-2 py-1.5 focus:outline-none focus:border-indigo-500"
                          />
                          <button
                            onClick={() => handleUpdateValue(inv.id)}
                            className="px-2 py-1.5 balance-gradient text-white text-xs rounded-lg"
                          >
                            ✓
                          </button>
                          <button
                            onClick={() => setUpdateId(null)}
                            className="px-2 py-1.5 glass text-slate-400 text-xs rounded-lg"
                          >
                            ✕
                          </button>
                        </div>
                      ) : (
                        <div className="flex gap-1">
                          <button
                            onClick={() => { setUpdateId(inv.id); setUpdateValue(inv.currentValue); }}
                            className="p-1.5 glass text-slate-400 hover:text-indigo-400 rounded-lg transition"
                            title="Update current value"
                          >
                            <RefreshCw size={14} />
                          </button>
                          <button
                            onClick={() => handleDelete(inv.id)}
                            className="p-1.5 glass text-slate-400 hover:text-red-400 rounded-lg transition"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8">
                <TrendingUp size={32} className="text-slate-600 mx-auto mb-2" />
                <p className="text-slate-500 text-sm">No investments added yet</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Investment Form */}
      {showForm && (
        <div className="glass rounded-2xl p-6 animate-slide-up">
          <h3 className="text-white font-semibold mb-4">Add New Investment</h3>
          <form onSubmit={handleCreate}>
            {/* Type selector */}
            <div className="mb-4">
              <label className="text-slate-400 text-xs mb-2 block">Investment Type</label>
              <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
                {INVESTMENT_TYPES.map(t => (
                  <button
                    key={t.value} type="button"
                    onClick={() => setForm({...form, type: t.value})}
                    className={`py-2 px-3 rounded-xl text-xs font-medium transition text-center
                      ${form.type === t.value
                        ? 'text-white border-2'
                        : 'glass text-slate-400 hover:text-white border border-white/10'
                      }`}
                    style={form.type === t.value
                      ? { background: `${t.color}30`, borderColor: t.color, color: t.color }
                      : {}}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-slate-400 text-xs mb-1 block">Investment Name</label>
                <input
                  placeholder="e.g. HDFC Top 100 Fund"
                  value={form.name}
                  onChange={e => setForm({...form, name: e.target.value})}
                  required
                  className="w-full bg-white/5 border border-white/10 text-white placeholder-slate-500 rounded-xl px-4 py-2.5 focus:outline-none focus:border-indigo-500 text-sm"
                />
              </div>
              <div>
                <label className="text-slate-400 text-xs mb-1 block">Amount Invested (₹)</label>
                <input
                  type="number"
                  placeholder="50000"
                  value={form.investedAmount}
                  onChange={e => setForm({...form, investedAmount: e.target.value})}
                  required
                  className="w-full bg-white/5 border border-white/10 text-white placeholder-slate-500 rounded-xl px-4 py-2.5 focus:outline-none focus:border-indigo-500 text-sm"
                />
              </div>
              <div>
                <label className="text-slate-400 text-xs mb-1 block">Current Value (₹)</label>
                <input
                  type="number"
                  placeholder="Leave blank if same as invested"
                  value={form.currentValue}
                  onChange={e => setForm({...form, currentValue: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 text-white placeholder-slate-500 rounded-xl px-4 py-2.5 focus:outline-none focus:border-indigo-500 text-sm"
                />
              </div>
              <div>
                <label className="text-slate-400 text-xs mb-1 block">Monthly SIP (₹) — if applicable</label>
                <input
                  type="number"
                  placeholder="5000"
                  value={form.monthlySip}
                  onChange={e => setForm({...form, monthlySip: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 text-white placeholder-slate-500 rounded-xl px-4 py-2.5 focus:outline-none focus:border-indigo-500 text-sm"
                />
              </div>
              <div>
                <label className="text-slate-400 text-xs mb-1 block">Start Date</label>
                <input
                  type="date"
                  value={form.startDate}
                  onChange={e => setForm({...form, startDate: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-2.5 focus:outline-none focus:border-indigo-500 text-sm"
                />
              </div>
              <div>
                <label className="text-slate-400 text-xs mb-1 block">Maturity Date — for FD/PPF</label>
                <input
                  type="date"
                  value={form.maturityDate}
                  onChange={e => setForm({...form, maturityDate: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-2.5 focus:outline-none focus:border-indigo-500 text-sm"
                />
              </div>
              <div className="col-span-2">
                <label className="text-slate-400 text-xs mb-1 block">Notes</label>
                <input
                  placeholder="e.g. Zerodha account, folio number, etc."
                  value={form.notes}
                  onChange={e => setForm({...form, notes: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 text-white placeholder-slate-500 rounded-xl px-4 py-2.5 focus:outline-none focus:border-indigo-500 text-sm"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-4">
              <button
                type="submit"
                className="flex-1 balance-gradient text-white py-2.5 rounded-xl font-medium hover:opacity-90 transition"
              >
                Add Investment
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
    </div>
  );
};

export default InvestmentPage;