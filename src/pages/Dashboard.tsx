import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import api from '../api/axios';
import { Summary } from '../types';

const COLORS = ['#3b82f6', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6', '#06b6d4'];

const Dashboard = () => {
  const [summary, setSummary] = useState<Summary | null>(null);
  const name = localStorage.getItem('name');

  useEffect(() => {
    api.get('/transactions/summary').then(res => setSummary(res.data));
  }, []);

  const pieData = summary ? Object.entries(summary.expenseByCategory).map(([name, value]) => ({
    name, value: Number(value)
  })) : [];

  const barData = summary ? [
    { name: 'Income', amount: summary.totalIncome },
    { name: 'Expense', amount: summary.totalExpense },
    { name: 'Balance', amount: summary.balance },
  ] : [];

  return (
    <div>
      <h2 style={{ color: '#1e293b', marginBottom: '8px' }}>
        Welcome back, {name} 👋
      </h2>
      <p style={{ color: '#64748b', marginBottom: '24px' }}>
        Here's your financial overview
      </p>

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '32px' }}>
        <div style={cardStyle('#10b981')}>
          <p style={cardLabel}>Total Income</p>
          <p style={cardValue}>₹{summary?.totalIncome?.toLocaleString() ?? 0}</p>
        </div>
        <div style={cardStyle('#ef4444')}>
          <p style={cardLabel}>Total Expenses</p>
          <p style={cardValue}>₹{summary?.totalExpense?.toLocaleString() ?? 0}</p>
        </div>
        <div style={cardStyle('#3b82f6')}>
          <p style={cardLabel}>Net Balance</p>
          <p style={cardValue}>₹{summary?.balance?.toLocaleString() ?? 0}</p>
        </div>
      </div>

      {/* Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        <div style={chartBox}>
          <h3 style={chartTitle}>Income vs Expense</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={barData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(val) => `₹${Number(val).toLocaleString()}`} />
              <Bar dataKey="amount" fill="#3b82f6" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div style={chartBox}>
          <h3 style={chartTitle}>Expense by Category</h3>
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" outerRadius={80}
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name} ${((percent ?? 0) * 100).toFixed(0)}%`
                  }>
                  {pieData.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(val) => `₹${Number(val).toLocaleString()}`} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p style={{ color: '#94a3b8', textAlign: 'center', paddingTop: '80px' }}>
              No expense data yet
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

const cardStyle = (color: string): React.CSSProperties => ({
  background: '#fff', borderRadius: '12px', padding: '20px',
  boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
  borderLeft: `4px solid ${color}`
});
const cardLabel: React.CSSProperties = { color: '#64748b', fontSize: '13px', margin: '0 0 8px' };
const cardValue: React.CSSProperties = { color: '#1e293b', fontSize: '24px', fontWeight: 'bold', margin: 0 };
const chartBox: React.CSSProperties = {
  background: '#fff', borderRadius: '12px', padding: '20px',
  boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
};
const chartTitle: React.CSSProperties = { color: '#1e293b', marginBottom: '16px', fontSize: '15px' };

export default Dashboard;