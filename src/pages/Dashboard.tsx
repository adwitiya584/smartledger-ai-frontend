import React, { useEffect, useState } from 'react';
import {
  AreaChart, Area, PieChart, Pie, Cell,
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid,
} from 'recharts';
import {
  TrendingUp, TrendingDown, Wallet, ArrowUpRight,
  PiggyBank, CreditCard, Target, Sparkles
} from 'lucide-react';
import api from '../api/axios';

const COLORS = ['#6366f1', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#06b6d4'];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass rounded-xl px-4 py-3 text-sm shadow-xl">
        <p className="text-slate-400 text-xs mb-1">{label}</p>
        {payload.map((p: any, i: number) => (
          <p key={i} style={{ color: p.color }} className="font-bold">
            {p.name}: ₹{Number(p.value).toLocaleString()}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const StatCard = ({ title, value, icon, gradient, subtitle, trend }: any) => (
  <div className={`${gradient} rounded-2xl p-5 card-hover shadow-xl relative overflow-hidden`}>
    <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-white/10 -mr-6 -mt-6"></div>
    <div className="relative z-10">
      <div className="flex items-center justify-between mb-3">
        <p className="text-white/80 text-xs font-medium uppercase tracking-wide">{title}</p>
        <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
          {icon}
        </div>
      </div>
      <p className="text-white text-xl font-bold mb-1">
        ₹{Number(value || 0).toLocaleString()}
      </p>
      {subtitle && <p className="text-white/60 text-xs">{subtitle}</p>}
      {trend && (
        <div className="flex items-center gap-1 mt-1">
          <ArrowUpRight size={12} className="text-white/60" />
          <span className="text-white/60 text-xs">{trend}</span>
        </div>
      )}
    </div>
  </div>
);

const Dashboard = () => {
  const [summary, setSummary] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [portfolio, setPortfolio] = useState<any>(null);
  const [loanData, setLoanData] = useState<any>(null);
  const [goals, setGoals] = useState<any[]>([]);
  const name = localStorage.getItem('name');

  useEffect(() => {
    api.get('/transactions/summary').then(res => setSummary(res.data));
    api.get('/transactions').then(res => setTransactions(res.data.slice(0, 6)));
    api.get('/investments/portfolio').then(res => setPortfolio(res.data));
    api.get('/loans').then(res => setLoanData(res.data));
    api.get('/goals').then(res => setGoals(res.data.slice(0, 3)));
  }, []);

  // Net Worth Calculation
  const totalIncome = Number(summary?.totalIncome || 0);
  const totalExpense = Number(summary?.totalExpense || 0);
  const totalInvested = Number(portfolio?.totalInvested || 0);
  const totalCurrentValue = Number(portfolio?.totalCurrentValue || 0);
  const totalOutstanding = Number(loanData?.totalOutstanding || 0);
  const totalMonthlyEmi = Number(loanData?.totalMonthlyEmi || 0);
  const totalMonthlySip = Number(portfolio?.totalMonthlySip || 0);

  const netBalance = totalIncome - totalExpense;
  const netSavings = netBalance - totalInvested;
  const netWorth = totalCurrentValue - totalOutstanding;
  const investmentReturns = totalCurrentValue - totalInvested;

  const pieData = summary
    ? Object.entries(summary.expenseByCategory).map(([name, value]) => ({
        name, value: Number(value)
      }))
    : [];

  const netWorthData = [
    { name: 'Assets', value: totalCurrentValue, fill: '#10b981' },
    { name: 'Liabilities', value: totalOutstanding, fill: '#ef4444' },
    { name: 'Net Worth', value: netWorth, fill: '#6366f1' },
  ];

  const cashFlowData = [
    { name: 'Income', amount: totalIncome },
    { name: 'Expenses', amount: totalExpense },
    { name: 'Investments', amount: totalInvested },
    { name: 'Net Savings', amount: netSavings },
  ];

  const areaData = transactions.slice().reverse().map((t, i) => ({
    name: t.transactionDate,
    amount: Number(t.amount),
  }));

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">
            Good day, <span className="gradient-text">{name}</span> 👋
          </h1>
          <p className="text-slate-400 mt-1 text-sm">
            Complete financial overview — Income, Expenses, Investments & Net Worth
          </p>
        </div>
        <div className="glass px-4 py-2 rounded-xl flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
          <span className="text-slate-400 text-xs">Live Dashboard</span>
        </div>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          title="Total Income"
          value={totalIncome}
          icon={<TrendingUp size={18} className="text-white" />}
          gradient="income-gradient"
          subtitle="All time earnings"
        />
        <StatCard
          title="Total Expenses"
          value={totalExpense}
          icon={<TrendingDown size={18} className="text-white" />}
          gradient="expense-gradient"
          subtitle="All time spending"
        />
        <StatCard
          title="Invested"
          value={totalInvested}
          icon={<PiggyBank size={18} className="text-white" />}
          gradient="ai-gradient"
          subtitle={`Current: ₹${totalCurrentValue.toLocaleString()}`}
        />
        <StatCard
          title="Net Balance"
          value={netBalance}
          icon={<Wallet size={18} className="text-white" />}
          gradient="balance-gradient"
          subtitle="Income minus expenses"
        />
      </div>

      {/* Net Worth Banner */}
      <div className="glass rounded-2xl p-6 border border-indigo-500/20 bg-indigo-500/5">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles size={20} className="text-indigo-400" />
          <h2 className="text-white font-semibold">Net Worth & Real Savings Breakdown</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="text-center p-3 bg-green-500/10 rounded-xl border border-green-500/20">
            <p className="text-slate-400 text-xs mb-1">Total Income</p>
            <p className="text-green-400 font-bold text-lg">₹{totalIncome.toLocaleString()}</p>
          </div>
          <div className="text-center p-3 bg-red-500/10 rounded-xl border border-red-500/20">
            <p className="text-slate-400 text-xs mb-1">− Expenses</p>
            <p className="text-red-400 font-bold text-lg">₹{totalExpense.toLocaleString()}</p>
          </div>
          <div className="text-center p-3 bg-amber-500/10 rounded-xl border border-amber-500/20">
            <p className="text-slate-400 text-xs mb-1">− Investments</p>
            <p className="text-amber-400 font-bold text-lg">₹{totalInvested.toLocaleString()}</p>
          </div>
          <div className="text-center p-3 bg-indigo-500/10 rounded-xl border border-indigo-500/20">
            <p className="text-slate-400 text-xs mb-1">= Net Savings</p>
            <p className={`font-bold text-lg ${netSavings >= 0 ? 'text-indigo-400' : 'text-red-400'}`}>
              ₹{netSavings.toLocaleString()}
            </p>
          </div>
          <div className="text-center p-3 bg-purple-500/10 rounded-xl border border-purple-500/20">
            <p className="text-slate-400 text-xs mb-1">Net Worth</p>
            <p className={`font-bold text-lg ${netWorth >= 0 ? 'text-purple-400' : 'text-red-400'}`}>
              ₹{netWorth.toLocaleString()}
            </p>
            <p className="text-xs text-slate-500">Assets − Liabilities</p>
          </div>
        </div>

        {/* Monthly commitments */}
        <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center">
              <PiggyBank size={16} className="text-amber-400" />
            </div>
            <div>
              <p className="text-slate-500 text-xs">Monthly SIP</p>
              <p className="text-white font-medium text-sm">₹{totalMonthlySip.toLocaleString()}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center">
              <CreditCard size={16} className="text-red-400" />
            </div>
            <div>
              <p className="text-slate-500 text-xs">Monthly EMI</p>
              <p className="text-white font-medium text-sm">₹{totalMonthlyEmi.toLocaleString()}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center">
              <TrendingUp size={16} className="text-green-400" />
            </div>
            <div>
              <p className="text-slate-500 text-xs">Investment Returns</p>
              <p className={`font-medium text-sm ${investmentReturns >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {investmentReturns >= 0 ? '+' : ''}₹{investmentReturns.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cash Flow Bar Chart */}
        <div className="lg:col-span-2 glass rounded-2xl p-6 card-hover">
          <h3 className="text-white font-semibold mb-4">Cash Flow Overview</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={cashFlowData} barSize={40}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" />
              <XAxis dataKey="name" stroke="#475569" tick={{ fill: '#94a3b8', fontSize: 12 }} />
              <YAxis stroke="#475569" tick={{ fill: '#94a3b8', fontSize: 12 }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="amount" radius={[8, 8, 0, 0]}>
                {cashFlowData.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={
                      index === 0 ? '#10b981' :
                      index === 1 ? '#ef4444' :
                      index === 2 ? '#f59e0b' : '#6366f1'
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Expense Pie */}
        <div className="glass rounded-2xl p-6 card-hover">
          <h3 className="text-white font-semibold mb-4">Expense Breakdown</h3>
          {pieData.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie
                    data={pieData} cx="50%" cy="50%"
                    innerRadius={45} outerRadius={70}
                    dataKey="value" paddingAngle={3}
                  >
                    {pieData.map((_, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(val) => `₹${Number(val).toLocaleString()}`} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-1 mt-2">
                {pieData.slice(0, 4).map((entry, index) => (
                  <div key={entry.name} className="flex justify-between text-xs">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full" style={{ background: COLORS[index % COLORS.length] }}></div>
                      <span className="text-slate-400 truncate max-w-20">{entry.name}</span>
                    </div>
                    <span className="text-white">₹{Number(entry.value).toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="h-40 flex items-center justify-center">
              <p className="text-slate-500 text-sm">No expense data</p>
            </div>
          )}
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Net Worth Chart */}
        <div className="glass rounded-2xl p-6 card-hover">
          <h3 className="text-white font-semibold mb-4">Assets vs Liabilities</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={netWorthData} barSize={50}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" />
              <XAxis dataKey="name" stroke="#475569" tick={{ fill: '#94a3b8', fontSize: 12 }} />
              <YAxis stroke="#475569" tick={{ fill: '#94a3b8', fontSize: 12 }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                {netWorthData.map((entry, index) => (
                  <Cell key={index} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Transaction trend */}
        <div className="glass rounded-2xl p-6 card-hover">
          <h3 className="text-white font-semibold mb-4">Recent Transaction Trend</h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={areaData}>
              <defs>
                <linearGradient id="colorAmt" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" />
              <XAxis dataKey="name" stroke="#475569" tick={{ fill: '#94a3b8', fontSize: 10 }} />
              <YAxis stroke="#475569" tick={{ fill: '#94a3b8', fontSize: 12 }} />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone" dataKey="amount"
                stroke="#6366f1" strokeWidth={2}
                fill="url(#colorAmt)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Transactions */}
        <div className="glass rounded-2xl p-6 card-hover">
          <h3 className="text-white font-semibold mb-4">Recent Transactions</h3>
          <div className="space-y-3">
            {transactions.length > 0 ? transactions.map((t: any) => (
              <div key={t.id} className="flex items-center justify-between py-1.5 border-b border-white/5 last:border-0">
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold
                    ${t.type === 'INCOME' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                    {t.type === 'INCOME' ? '↑' : '↓'}
                  </div>
                  <div>
                    <p className="text-white text-xs font-medium">{t.title}</p>
                    <p className="text-slate-500 text-xs">{t.category}</p>
                  </div>
                </div>
                <p className={`font-semibold text-xs ${t.type === 'INCOME' ? 'text-green-400' : 'text-red-400'}`}>
                  {t.type === 'INCOME' ? '+' : '-'}₹{Number(t.amount).toLocaleString()}
                </p>
              </div>
            )) : (
              <p className="text-slate-500 text-sm text-center py-6">No transactions yet</p>
            )}
          </div>
        </div>

        {/* Savings Goals Progress */}
        <div className="glass rounded-2xl p-6 card-hover">
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <Target size={18} className="text-indigo-400" />
            Savings Goals
          </h3>
          <div className="space-y-4">
            {goals.length > 0 ? goals.map((g: any) => (
              <div key={g.id}>
                <div className="flex justify-between mb-1">
                  <span className="text-white text-xs font-medium">{g.icon} {g.name}</span>
                  <span className="text-slate-400 text-xs">{g.percentage.toFixed(0)}%</span>
                </div>
                <div className="w-full bg-white/5 rounded-full h-1.5">
                  <div
                    className="h-1.5 rounded-full transition-all"
                    style={{
                      width: `${Math.min(g.percentage, 100)}%`,
                      background: g.color
                    }}
                  />
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-slate-500 text-xs">₹{Number(g.savedAmount).toLocaleString()}</span>
                  <span className="text-slate-500 text-xs">₹{Number(g.targetAmount).toLocaleString()}</span>
                </div>
              </div>
            )) : (
              <p className="text-slate-500 text-sm text-center py-6">No goals set yet</p>
            )}
          </div>
        </div>

        {/* EMI & Investment Summary */}
        <div className="glass rounded-2xl p-6 card-hover">
          <h3 className="text-white font-semibold mb-4">Monthly Commitments</h3>
          <div className="space-y-3">
            <div className="p-3 bg-amber-500/10 rounded-xl border border-amber-500/20">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <PiggyBank size={16} className="text-amber-400" />
                  <span className="text-slate-300 text-sm">SIP Investment</span>
                </div>
                <span className="text-amber-400 font-bold">₹{totalMonthlySip.toLocaleString()}</span>
              </div>
            </div>
            <div className="p-3 bg-red-500/10 rounded-xl border border-red-500/20">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <CreditCard size={16} className="text-red-400" />
                  <span className="text-slate-300 text-sm">Loan EMIs</span>
                </div>
                <span className="text-red-400 font-bold">₹{totalMonthlyEmi.toLocaleString()}</span>
              </div>
            </div>
            <div className="p-3 bg-indigo-500/10 rounded-xl border border-indigo-500/20">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Wallet size={16} className="text-indigo-400" />
                  <span className="text-slate-300 text-sm">Total Committed</span>
                </div>
                <span className="text-indigo-400 font-bold">
                  ₹{(totalMonthlySip + totalMonthlyEmi).toLocaleString()}
                </span>
              </div>
            </div>
            <div className="p-3 bg-green-500/10 rounded-xl border border-green-500/20">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <TrendingUp size={16} className="text-green-400" />
                  <span className="text-slate-300 text-sm">Investment Returns</span>
                </div>
                <span className={`font-bold ${investmentReturns >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {investmentReturns >= 0 ? '+' : ''}₹{investmentReturns.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;