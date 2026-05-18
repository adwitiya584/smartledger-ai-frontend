import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { PlusCircle, Trash2, CreditCard, Clock, CheckCircle, Calculator } from 'lucide-react';

const LOAN_TYPES = [
  { value: 'HOME', label: '🏠 Home Loan', color: '#6366f1' },
  { value: 'CAR', label: '🚗 Car Loan', color: '#10b981' },
  { value: 'PERSONAL', label: '💼 Personal Loan', color: '#f59e0b' },
  { value: 'EDUCATION', label: '🎓 Education Loan', color: '#06b6d4' },
  { value: 'CREDIT_CARD', label: '💳 Credit Card', color: '#ef4444' },
  { value: 'GOLD', label: '🥇 Gold Loan', color: '#fbbf24' },
  { value: 'BUSINESS', label: '🏢 Business Loan', color: '#8b5cf6' },
  { value: 'OTHER', label: '📋 Other', color: '#94a3b8' },
];


const LoanPage = () => {
  const [data, setData] = useState<any>(null);
  const [showForm, setShowForm] = useState(false);
  const [showEmiCalc, setShowEmiCalc] = useState(false);
  const [calcForm, setCalcForm] = useState({ principal: '', rate: '', tenure: '' });
  const [calcResult, setCalcResult] = useState<any>(null);
  const [form, setForm] = useState({
    name: '', type: 'HOME', principalAmount: '',
    outstandingAmount: '', emiAmount: '', interestRate: '',
    tenureMonths: '', emiDueDay: '1', startDate: '',
    endDate: '', lender: ''
  });

  const load = () => api.get('/loans').then(res => setData(res.data));
  useEffect(() => { load(); }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.post('/loans', {
      ...form,
      principalAmount: parseFloat(form.principalAmount),
      outstandingAmount: form.outstandingAmount ? parseFloat(form.outstandingAmount) : null,
      emiAmount: parseFloat(form.emiAmount),
      interestRate: form.interestRate ? parseFloat(form.interestRate) : null,
      tenureMonths: form.tenureMonths ? parseInt(form.tenureMonths) : null,
      emiDueDay: parseInt(form.emiDueDay),
    });
    setShowForm(false);
    setForm({
      name: '', type: 'HOME', principalAmount: '',
      outstandingAmount: '', emiAmount: '', interestRate: '',
      tenureMonths: '', emiDueDay: '1', startDate: '',
      endDate: '', lender: ''
    });
    load();
  };

  const handlePayEmi = async (id: number) => {
    if (window.confirm('Mark this month\'s EMI as paid?')) {
      await api.post(`/loans/${id}/pay-emi`);
      load();
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Remove this loan?')) {
      await api.delete(`/loans/${id}`);
      load();
    }
  };

  // EMI Calculator
  const calculateEmi = () => {
    const p = parseFloat(calcForm.principal);
    const r = parseFloat(calcForm.rate) / 12 / 100;
    const n = parseInt(calcForm.tenure);
    if (!p || !r || !n) return;
    const emi = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalPayment = emi * n;
    const totalInterest = totalPayment - p;
    setCalcResult({
      emi: Math.round(emi),
      totalPayment: Math.round(totalPayment),
      totalInterest: Math.round(totalInterest)
    });
  };

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Loans & EMI Manager</h1>
          <p className="text-slate-400 mt-1">Track all your loans and monthly EMIs</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowEmiCalc(!showEmiCalc)}
            className="flex items-center gap-2 glass text-slate-300 px-4 py-2.5 rounded-xl font-medium hover:text-white transition"
          >
            <Calculator size={18} />
            EMI Calculator
          </button>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 balance-gradient text-white px-4 py-2.5 rounded-xl font-medium hover:opacity-90 transition shadow-lg shadow-indigo-500/20"
          >
            <PlusCircle size={18} />
            Add Loan
          </button>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className="glass rounded-xl p-4">
          <p className="text-slate-400 text-xs mb-1">Total Outstanding</p>
          <p className="text-red-400 font-bold text-lg">
            ₹{Number(data?.totalOutstanding || 0).toLocaleString()}
          </p>
        </div>
        <div className="glass rounded-xl p-4">
          <p className="text-slate-400 text-xs mb-1">Monthly EMI Burden</p>
          <p className="text-amber-400 font-bold text-lg">
            ₹{Number(data?.totalMonthlyEmi || 0).toLocaleString()}
          </p>
        </div>
        <div className="glass rounded-xl p-4">
          <p className="text-slate-400 text-xs mb-1">Active Loans</p>
          <p className="text-white font-bold text-lg">
            {data?.loans?.length || 0}
          </p>
        </div>
      </div>

      {/* EMI Calculator */}
      {showEmiCalc && (
        <div className="glass rounded-2xl p-6 animate-slide-up">
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <Calculator size={18} className="text-indigo-400" />
            EMI Calculator
          </h3>
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div>
              <label className="text-slate-400 text-xs mb-1 block">Loan Amount (₹)</label>
              <input
                type="number"
                placeholder="500000"
                value={calcForm.principal}
                onChange={e => setCalcForm({...calcForm, principal: e.target.value})}
                className="w-full bg-white/5 border border-white/10 text-white placeholder-slate-500 rounded-xl px-4 py-2.5 focus:outline-none focus:border-indigo-500 text-sm"
              />
            </div>
            <div>
              <label className="text-slate-400 text-xs mb-1 block">Interest Rate (% per year)</label>
              <input
                type="number"
                placeholder="8.5"
                value={calcForm.rate}
                onChange={e => setCalcForm({...calcForm, rate: e.target.value})}
                className="w-full bg-white/5 border border-white/10 text-white placeholder-slate-500 rounded-xl px-4 py-2.5 focus:outline-none focus:border-indigo-500 text-sm"
              />
            </div>
            <div>
              <label className="text-slate-400 text-xs mb-1 block">Tenure (months)</label>
              <input
                type="number"
                placeholder="240"
                value={calcForm.tenure}
                onChange={e => setCalcForm({...calcForm, tenure: e.target.value})}
                className="w-full bg-white/5 border border-white/10 text-white placeholder-slate-500 rounded-xl px-4 py-2.5 focus:outline-none focus:border-indigo-500 text-sm"
              />
            </div>
          </div>
          <button
            onClick={calculateEmi}
            className="balance-gradient text-white px-6 py-2.5 rounded-xl font-medium hover:opacity-90 transition mb-4"
          >
            Calculate EMI
          </button>
          {calcResult && (
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-4 text-center">
                <p className="text-slate-400 text-xs mb-1">Monthly EMI</p>
                <p className="text-indigo-400 font-bold text-xl">₹{calcResult.emi.toLocaleString()}</p>
              </div>
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-center">
                <p className="text-slate-400 text-xs mb-1">Total Interest</p>
                <p className="text-red-400 font-bold text-xl">₹{calcResult.totalInterest.toLocaleString()}</p>
              </div>
              <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 text-center">
                <p className="text-slate-400 text-xs mb-1">Total Payment</p>
                <p className="text-green-400 font-bold text-xl">₹{calcResult.totalPayment.toLocaleString()}</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Add Loan Form */}
      {showForm && (
        <div className="glass rounded-2xl p-6 animate-slide-up">
          <h3 className="text-white font-semibold mb-4">Add New Loan</h3>
          <form onSubmit={handleCreate}>
            {/* Type selector */}
            <div className="mb-4">
              <label className="text-slate-400 text-xs mb-2 block">Loan Type</label>
              <div className="grid grid-cols-4 gap-2">
                {LOAN_TYPES.map(t => (
                  <button
                    key={t.value} type="button"
                    onClick={() => setForm({...form, type: t.value})}
                    className={`py-2 px-3 rounded-xl text-xs font-medium transition text-center
                      ${form.type === t.value ? 'text-white border-2' : 'glass text-slate-400 hover:text-white border border-white/10'}`}
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
                <label className="text-slate-400 text-xs mb-1 block">Loan Name</label>
                <input
                  placeholder="e.g. SBI Home Loan"
                  value={form.name}
                  onChange={e => setForm({...form, name: e.target.value})}
                  required
                  className="w-full bg-white/5 border border-white/10 text-white placeholder-slate-500 rounded-xl px-4 py-2.5 focus:outline-none focus:border-indigo-500 text-sm"
                />
              </div>
              <div>
                <label className="text-slate-400 text-xs mb-1 block">Lender / Bank</label>
                <input
                  placeholder="e.g. SBI, HDFC, ICICI"
                  value={form.lender}
                  onChange={e => setForm({...form, lender: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 text-white placeholder-slate-500 rounded-xl px-4 py-2.5 focus:outline-none focus:border-indigo-500 text-sm"
                />
              </div>
              <div>
                <label className="text-slate-400 text-xs mb-1 block">Principal Amount (₹)</label>
                <input
                  type="number" placeholder="2000000"
                  value={form.principalAmount}
                  onChange={e => setForm({...form, principalAmount: e.target.value})}
                  required
                  className="w-full bg-white/5 border border-white/10 text-white placeholder-slate-500 rounded-xl px-4 py-2.5 focus:outline-none focus:border-indigo-500 text-sm"
                />
              </div>
              <div>
                <label className="text-slate-400 text-xs mb-1 block">Outstanding Amount (₹)</label>
                <input
                  type="number" placeholder="Leave blank if same as principal"
                  value={form.outstandingAmount}
                  onChange={e => setForm({...form, outstandingAmount: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 text-white placeholder-slate-500 rounded-xl px-4 py-2.5 focus:outline-none focus:border-indigo-500 text-sm"
                />
              </div>
              <div>
                <label className="text-slate-400 text-xs mb-1 block">Monthly EMI (₹)</label>
                <input
                  type="number" placeholder="18000"
                  value={form.emiAmount}
                  onChange={e => setForm({...form, emiAmount: e.target.value})}
                  required
                  className="w-full bg-white/5 border border-white/10 text-white placeholder-slate-500 rounded-xl px-4 py-2.5 focus:outline-none focus:border-indigo-500 text-sm"
                />
              </div>
              <div>
                <label className="text-slate-400 text-xs mb-1 block">Interest Rate (% p.a.)</label>
                <input
                  type="number" placeholder="8.5"
                  value={form.interestRate}
                  onChange={e => setForm({...form, interestRate: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 text-white placeholder-slate-500 rounded-xl px-4 py-2.5 focus:outline-none focus:border-indigo-500 text-sm"
                />
              </div>
              <div>
                <label className="text-slate-400 text-xs mb-1 block">Tenure (months)</label>
                <input
                  type="number" placeholder="240"
                  value={form.tenureMonths}
                  onChange={e => setForm({...form, tenureMonths: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 text-white placeholder-slate-500 rounded-xl px-4 py-2.5 focus:outline-none focus:border-indigo-500 text-sm"
                />
              </div>
              <div>
                <label className="text-slate-400 text-xs mb-1 block">EMI Due Day</label>
                <input
                  type="number" placeholder="1-31" min="1" max="31"
                  value={form.emiDueDay}
                  onChange={e => setForm({...form, emiDueDay: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 text-white placeholder-slate-500 rounded-xl px-4 py-2.5 focus:outline-none focus:border-indigo-500 text-sm"
                />
              </div>
              <div>
                <label className="text-slate-400 text-xs mb-1 block">Start Date</label>
                <input
                  type="date" value={form.startDate}
                  onChange={e => setForm({...form, startDate: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-2.5 focus:outline-none focus:border-indigo-500 text-sm"
                />
              </div>
              <div>
                <label className="text-slate-400 text-xs mb-1 block">End Date</label>
                <input
                  type="date" value={form.endDate}
                  onChange={e => setForm({...form, endDate: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-2.5 focus:outline-none focus:border-indigo-500 text-sm"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-4">
              <button type="submit" className="flex-1 balance-gradient text-white py-2.5 rounded-xl font-medium hover:opacity-90 transition">
                Add Loan
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="px-6 glass text-slate-400 py-2.5 rounded-xl hover:text-white transition">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Loans List */}
      {data?.loans?.length > 0 ? (
        <div className="space-y-4">
          {data.loans.map((loan: any) => {
            const typeInfo = LOAN_TYPES.find(t => t.value === loan.type);
            return (
              <div
                key={loan.id}
                className={`glass rounded-2xl p-6 card-hover border
                  ${loan.emiDueSoon ? 'border-amber-500/30' : 'border-white/5'}`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl"
                      style={{ background: `${typeInfo?.color}20` }}
                    >
                      {typeInfo?.label.split(' ')[0]}
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">{loan.name}</h3>
                      <p className="text-slate-500 text-xs">
                        {loan.lender && `${loan.lender} • `}
                        {loan.interestRate && `${loan.interestRate}% p.a. • `}
                        {loan.tenureMonths && `${loan.tenureMonths} months`}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {loan.emiDueSoon && (
                      <span className="flex items-center gap-1 text-amber-400 text-xs glass px-2 py-1 rounded-full">
                        <Clock size={12} /> EMI Due Soon
                      </span>
                    )}
                    <button
                      onClick={() => handleDelete(loan.id)}
                      className="text-slate-600 hover:text-red-400 transition"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mb-3">
                  <div className="flex justify-between text-xs text-slate-400 mb-1">
                    <span>Repaid: {loan.paidPercentage.toFixed(1)}%</span>
                    <span>{loan.monthsRemaining} months remaining</span>
                  </div>
                  <div className="w-full bg-white/5 rounded-full h-2">
                    <div
                      className="h-2 rounded-full transition-all duration-700"
                      style={{
                        width: `${loan.paidPercentage}%`,
                        background: `linear-gradient(90deg, ${typeInfo?.color}, ${typeInfo?.color}aa)`
                      }}
                    />
                  </div>
                </div>

                {/* Details */}
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div>
                    <p className="text-slate-500 text-xs">Outstanding</p>
                    <p className="text-red-400 font-semibold">₹{Number(loan.outstandingAmount).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-slate-500 text-xs">Monthly EMI</p>
                    <p className="text-amber-400 font-semibold">₹{Number(loan.emiAmount).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-slate-500 text-xs">Next EMI</p>
                    <p className="text-white font-semibold text-sm">
                      {loan.nextEmiDate
                        ? `Day ${loan.emiDueDay} (${loan.daysUntilEmi} days)`
                        : '—'}
                    </p>
                  </div>
                </div>

                {/* Pay EMI button */}
                <button
                  onClick={() => handlePayEmi(loan.id)}
                  className="w-full py-2 rounded-xl text-sm font-medium transition flex items-center justify-center gap-2"
                  style={{
                    background: `${typeInfo?.color}15`,
                    color: typeInfo?.color,
                    border: `1px solid ${typeInfo?.color}30`
                  }}
                >
                  <CheckCircle size={16} />
                  Mark EMI Paid This Month
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="glass rounded-2xl p-12 text-center">
          <CreditCard size={40} className="text-slate-600 mx-auto mb-4" />
          <p className="text-slate-400 font-medium">No loans added yet</p>
          <p className="text-slate-600 text-sm mt-1">Add your loans to track EMIs and outstanding balance</p>
        </div>
      )}
    </div>
  );
};

export default LoanPage;