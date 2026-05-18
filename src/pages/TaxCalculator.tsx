import React, { useState, useEffect } from 'react';
import { Calculator, TrendingDown, FileText, Info } from 'lucide-react';
import api from '../api/axios';

const TaxCalculator = () => {
  const [regime, setRegime] = useState<'old' | 'new'>('new');
  const [income, setIncome] = useState({
    salary: '',
    houseProperty: '',
    business: '',
    capitalGains: '',
    otherSources: '',
  });
  const [deductions, setDeductions] = useState({
    sec80C: '',        // PPF, ELSS, LIC, EPF max 1.5L
    sec80D: '',        // Health Insurance max 25k/50k
    sec80CCD: '',      // NPS additional 50k
    hra: '',           // HRA exemption
    homeLoanInterest: '', // Section 24 max 2L
    educationLoan: '', // Section 80E
    donations: '',     // Section 80G
    standardDeduction: '50000', // Fixed 50k for salaried
  });
  const [result, setResult] = useState<any>(null);

  // Auto-fetch income from transactions
  useEffect(() => {
    api.get('/transactions/summary').then(res => {
      const data = res.data;
      if (data.totalIncome) {
        setIncome(prev => ({ ...prev, salary: Math.round(data.totalIncome).toString() }));
      }
    }).catch(() => {});
  }, []);

  const calculateTax = () => {
    const sal = parseFloat(income.salary) || 0;
    const hp = parseFloat(income.houseProperty) || 0;
    const biz = parseFloat(income.business) || 0;
    const cg = parseFloat(income.capitalGains) || 0;
    const other = parseFloat(income.otherSources) || 0;

    const grossIncome = sal + hp + biz + cg + other;

    // ---- NEW REGIME ----
    const newStdDeduction = 75000; // New regime standard deduction FY2024-25
    const newTaxableIncome = Math.max(grossIncome - newStdDeduction, 0);

    const newTaxSlabs = [
      { min: 0, max: 300000, rate: 0 },
      { min: 300000, max: 600000, rate: 5 },
      { min: 600000, max: 900000, rate: 10 },
      { min: 900000, max: 1200000, rate: 15 },
      { min: 1200000, max: 1500000, rate: 20 },
      { min: 1500000, max: Infinity, rate: 30 },
    ];

    let newTax = 0;
    for (const slab of newTaxSlabs) {
      if (newTaxableIncome > slab.min) {
        const taxableInSlab = Math.min(newTaxableIncome, slab.max) - slab.min;
        newTax += (taxableInSlab * slab.rate) / 100;
      }
    }
    // Rebate u/s 87A new regime — if income <= 7L, tax = 0
    if (newTaxableIncome <= 700000) newTax = 0;
    const newCess = newTax * 0.04;
    const newTotalTax = newTax + newCess;

    // ---- OLD REGIME ----
    const d80C = Math.min(parseFloat(deductions.sec80C) || 0, 150000);
    const d80D = Math.min(parseFloat(deductions.sec80D) || 0, 50000);
    const d80CCD = Math.min(parseFloat(deductions.sec80CCD) || 0, 50000);
    const dHRA = parseFloat(deductions.hra) || 0;
    const dHomeLoan = Math.min(parseFloat(deductions.homeLoanInterest) || 0, 200000);
    const dEduLoan = parseFloat(deductions.educationLoan) || 0;
    const dDonations = parseFloat(deductions.donations) || 0;
    const stdDeduction = 50000;

    const totalDeductions = d80C + d80D + d80CCD + dHRA + dHomeLoan +
                           dEduLoan + dDonations + stdDeduction;

    const oldTaxableIncome = Math.max(grossIncome - totalDeductions, 0);

    const oldTaxSlabs = [
      { min: 0, max: 250000, rate: 0 },
      { min: 250000, max: 500000, rate: 5 },
      { min: 500000, max: 1000000, rate: 20 },
      { min: 1000000, max: Infinity, rate: 30 },
    ];

    let oldTax = 0;
    for (const slab of oldTaxSlabs) {
      if (oldTaxableIncome > slab.min) {
        const taxableInSlab = Math.min(oldTaxableIncome, slab.max) - slab.min;
        oldTax += (taxableInSlab * slab.rate) / 100;
      }
    }
    // Rebate u/s 87A old regime — if income <= 5L, tax = 0
    if (oldTaxableIncome <= 500000) oldTax = 0;
    const oldCess = oldTax * 0.04;
    const oldTotalTax = oldTax + oldCess;

    const recommended = newTotalTax <= oldTotalTax ? 'new' : 'old';
    const savings = Math.abs(oldTotalTax - newTotalTax);

    setResult({
      grossIncome,
      // New regime
      newTaxableIncome,
      newTax,
      newCess,
      newTotalTax,
      // Old regime
      oldTaxableIncome,
      totalDeductions,
      oldTax,
      oldCess,
      oldTotalTax,
      // Recommendation
      recommended,
      savings,
      // Monthly breakdown
      newMonthlyTax: newTotalTax / 12,
      oldMonthlyTax: oldTotalTax / 12,
    });
  };

  const inputClass = "w-full bg-white/5 border border-white/10 text-white placeholder-slate-500 rounded-xl px-4 py-2.5 focus:outline-none focus:border-indigo-500 text-sm";

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Income Tax Calculator</h1>
        <p className="text-slate-400 mt-1">FY 2024-25 • Compare Old vs New Tax Regime</p>
      </div>

      {/* Regime Toggle */}
      <div className="glass rounded-2xl p-4 flex items-center gap-4">
        <span className="text-slate-400 text-sm">Calculate for:</span>
        <div className="flex gap-2">
          {(['new', 'old'] as const).map(r => (
            <button
              key={r}
              onClick={() => setRegime(r)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition
                ${regime === r ? 'balance-gradient text-white' : 'glass text-slate-400 hover:text-white'}`}
            >
              {r === 'new' ? '🆕 New Regime' : '📋 Old Regime'}
            </button>
          ))}
          <button
            onClick={() => setRegime('new')}
            className="px-4 py-2 rounded-xl text-sm font-medium glass text-indigo-400 hover:text-white transition"
          >
            🔄 Compare Both
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left — Inputs */}
        <div className="space-y-4">
          {/* Income Sources */}
          <div className="glass rounded-2xl p-6">
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <TrendingDown size={18} className="text-green-400" />
              Income Sources (Annual)
            </h3>
            <div className="space-y-3">
              <div>
                <label className="text-slate-400 text-xs mb-1 block">
                  Salary / Pension (₹)
                  <span className="text-indigo-400 ml-1 text-xs">
                    {income.salary && '← auto-filled from transactions'}
                  </span>
                </label>
                <input
                  type="number"
                  placeholder="600000"
                  value={income.salary}
                  onChange={e => setIncome({...income, salary: e.target.value})}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="text-slate-400 text-xs mb-1 block">House Property / Rental Income (₹)</label>
                <input type="number" placeholder="0" value={income.houseProperty}
                  onChange={e => setIncome({...income, houseProperty: e.target.value})}
                  className={inputClass} />
              </div>
              <div>
                <label className="text-slate-400 text-xs mb-1 block">Business / Profession Income (₹)</label>
                <input type="number" placeholder="0" value={income.business}
                  onChange={e => setIncome({...income, business: e.target.value})}
                  className={inputClass} />
              </div>
              <div>
                <label className="text-slate-400 text-xs mb-1 block">Capital Gains (₹)</label>
                <input type="number" placeholder="0" value={income.capitalGains}
                  onChange={e => setIncome({...income, capitalGains: e.target.value})}
                  className={inputClass} />
              </div>
              <div>
                <label className="text-slate-400 text-xs mb-1 block">Other Sources — FD interest, dividends (₹)</label>
                <input type="number" placeholder="0" value={income.otherSources}
                  onChange={e => setIncome({...income, otherSources: e.target.value})}
                  className={inputClass} />
              </div>
            </div>
          </div>

          {/* Deductions — Old Regime Only */}
          <div className="glass rounded-2xl p-6">
            <h3 className="text-white font-semibold mb-1 flex items-center gap-2">
              <FileText size={18} className="text-amber-400" />
              Deductions
            </h3>
            <p className="text-slate-500 text-xs mb-4">Used for Old Regime only. New Regime ignores these.</p>
            <div className="space-y-3">
              <div>
                <label className="text-slate-400 text-xs mb-1 block flex items-center gap-1">
                  Section 80C — PPF, ELSS, LIC, EPF (Max ₹1,50,000)
                </label>
                <input type="number" placeholder="150000" value={deductions.sec80C}
                  onChange={e => setDeductions({...deductions, sec80C: e.target.value})}
                  className={inputClass} />
              </div>
              <div>
                <label className="text-slate-400 text-xs mb-1 block">Section 80D — Health Insurance (Max ₹50,000)</label>
                <input type="number" placeholder="25000" value={deductions.sec80D}
                  onChange={e => setDeductions({...deductions, sec80D: e.target.value})}
                  className={inputClass} />
              </div>
              <div>
                <label className="text-slate-400 text-xs mb-1 block">Section 80CCD(1B) — NPS (Max ₹50,000)</label>
                <input type="number" placeholder="50000" value={deductions.sec80CCD}
                  onChange={e => setDeductions({...deductions, sec80CCD: e.target.value})}
                  className={inputClass} />
              </div>
              <div>
                <label className="text-slate-400 text-xs mb-1 block">HRA Exemption (₹)</label>
                <input type="number" placeholder="0" value={deductions.hra}
                  onChange={e => setDeductions({...deductions, hra: e.target.value})}
                  className={inputClass} />
              </div>
              <div>
                <label className="text-slate-400 text-xs mb-1 block">Section 24 — Home Loan Interest (Max ₹2,00,000)</label>
                <input type="number" placeholder="0" value={deductions.homeLoanInterest}
                  onChange={e => setDeductions({...deductions, homeLoanInterest: e.target.value})}
                  className={inputClass} />
              </div>
              <div>
                <label className="text-slate-400 text-xs mb-1 block">Section 80E — Education Loan Interest (₹)</label>
                <input type="number" placeholder="0" value={deductions.educationLoan}
                  onChange={e => setDeductions({...deductions, educationLoan: e.target.value})}
                  className={inputClass} />
              </div>
              <div>
                <label className="text-slate-400 text-xs mb-1 block">Section 80G — Donations (₹)</label>
                <input type="number" placeholder="0" value={deductions.donations}
                  onChange={e => setDeductions({...deductions, donations: e.target.value})}
                  className={inputClass} />
              </div>
            </div>
          </div>

          <button
            onClick={calculateTax}
            className="w-full balance-gradient text-white py-3 rounded-xl font-semibold hover:opacity-90 transition shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2"
          >
            <Calculator size={20} />
            Calculate Tax
          </button>
        </div>

        {/* Right — Results */}
        <div className="space-y-4">
          {result ? (
            <>
              {/* Recommendation Banner */}
              <div className={`rounded-2xl p-5 border ${
                result.recommended === 'new'
                  ? 'bg-green-500/10 border-green-500/30'
                  : 'bg-amber-500/10 border-amber-500/30'
              }`}>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">{result.recommended === 'new' ? '🆕' : '📋'}</span>
                  <div>
                    <p className="text-white font-semibold">
                      {result.recommended === 'new' ? 'New Regime' : 'Old Regime'} is better for you!
                    </p>
                    <p className={`text-sm ${result.recommended === 'new' ? 'text-green-400' : 'text-amber-400'}`}>
                      You save ₹{Math.round(result.savings).toLocaleString()} by choosing {result.recommended} regime
                    </p>
                  </div>
                </div>
              </div>

              {/* Gross Income */}
              <div className="glass rounded-2xl p-5">
                <div className="flex justify-between items-center">
                  <p className="text-slate-400 text-sm">Gross Total Income</p>
                  <p className="text-white font-bold text-xl">₹{result.grossIncome.toLocaleString()}</p>
                </div>
              </div>

              {/* Side by side comparison */}
              <div className="grid grid-cols-2 gap-4">
                {/* New Regime */}
                <div className={`rounded-2xl p-5 border ${
                  result.recommended === 'new'
                    ? 'border-green-500/40 bg-green-500/5'
                    : 'glass border-white/5'
                }`}>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-lg">🆕</span>
                    <p className="text-white font-semibold text-sm">New Regime</p>
                    {result.recommended === 'new' && (
                      <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full">Best</span>
                    )}
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Std. Deduction</span>
                      <span className="text-white">₹75,000</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Taxable Income</span>
                      <span className="text-white">₹{result.newTaxableIncome.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Income Tax</span>
                      <span className="text-white">₹{Math.round(result.newTax).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Health & Ed. Cess (4%)</span>
                      <span className="text-white">₹{Math.round(result.newCess).toLocaleString()}</span>
                    </div>
                    <div className="border-t border-white/10 pt-2 flex justify-between">
                      <span className="text-slate-300 font-medium">Total Tax</span>
                      <span className="text-red-400 font-bold">₹{Math.round(result.newTotalTax).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Monthly TDS</span>
                      <span className="text-amber-400">₹{Math.round(result.newMonthlyTax).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Effective Rate</span>
                      <span className="text-white">
                        {result.grossIncome > 0
                          ? ((result.newTotalTax / result.grossIncome) * 100).toFixed(2)
                          : 0}%
                      </span>
                    </div>
                  </div>
                </div>

                {/* Old Regime */}
                <div className={`rounded-2xl p-5 border ${
                  result.recommended === 'old'
                    ? 'border-amber-500/40 bg-amber-500/5'
                    : 'glass border-white/5'
                }`}>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-lg">📋</span>
                    <p className="text-white font-semibold text-sm">Old Regime</p>
                    {result.recommended === 'old' && (
                      <span className="text-xs bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full">Best</span>
                    )}
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Total Deductions</span>
                      <span className="text-white">₹{result.totalDeductions.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Taxable Income</span>
                      <span className="text-white">₹{result.oldTaxableIncome.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Income Tax</span>
                      <span className="text-white">₹{Math.round(result.oldTax).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Health & Ed. Cess (4%)</span>
                      <span className="text-white">₹{Math.round(result.oldCess).toLocaleString()}</span>
                    </div>
                    <div className="border-t border-white/10 pt-2 flex justify-between">
                      <span className="text-slate-300 font-medium">Total Tax</span>
                      <span className="text-red-400 font-bold">₹{Math.round(result.oldTotalTax).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Monthly TDS</span>
                      <span className="text-amber-400">₹{Math.round(result.oldMonthlyTax).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Effective Rate</span>
                      <span className="text-white">
                        {result.grossIncome > 0
                          ? ((result.oldTotalTax / result.grossIncome) * 100).toFixed(2)
                          : 0}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tax Saving Tips */}
              <div className="glass rounded-2xl p-5">
                <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                  <Info size={16} className="text-indigo-400" />
                  Tax Saving Tips
                </h3>
                <div className="space-y-2 text-xs text-slate-400">
                  {(parseFloat(deductions.sec80C) || 0) < 150000 && (
                    <p>💡 You can save more tax by maximizing Section 80C investments up to ₹1,50,000 (PPF, ELSS, LIC)</p>
                  )}
                  {(parseFloat(deductions.sec80D) || 0) < 25000 && (
                    <p>💡 Get health insurance to claim Section 80D deduction up to ₹25,000</p>
                  )}
                  {(parseFloat(deductions.sec80CCD) || 0) < 50000 && (
                    <p>💡 Invest in NPS to get additional ₹50,000 deduction under Section 80CCD(1B)</p>
                  )}
                  {result.recommended === 'new' && (
                    <p>✅ New regime is better for you — simpler filing with no deduction tracking needed</p>
                  )}
                  {result.recommended === 'old' && (
                    <p>✅ Keep investing in 80C instruments — they're saving you real money!</p>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="glass rounded-2xl p-12 text-center h-full flex flex-col items-center justify-center">
              <Calculator size={48} className="text-slate-600 mb-4" />
              <p className="text-slate-400 font-medium">Fill in your income details</p>
              <p className="text-slate-600 text-sm mt-1">Click Calculate Tax to see Old vs New regime comparison</p>
              <div className="mt-4 text-xs text-slate-600 space-y-1">
                <p>✓ Auto-fills salary from your transactions</p>
                <p>✓ Compares Old vs New regime</p>
                <p>✓ Shows which regime saves more money</p>
                <p>✓ Personalized tax saving tips</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaxCalculator;