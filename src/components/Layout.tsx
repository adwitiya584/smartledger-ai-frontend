import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, ArrowLeftRight, Target,
   LogOut, FileDown, Menu, X, TrendingUp,
  PiggyBank, Repeat
} from 'lucide-react';
import { TrendingUp as InvestIcon } from 'lucide-react';
import { CreditCard } from 'lucide-react';
import { Receipt } from 'lucide-react';
import { ShieldAlert } from 'lucide-react';
import { Settings } from 'lucide-react';
import { Crown, Clock } from 'lucide-react';
import api from '../api/axios';


const Layout = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const name = localStorage.getItem('name') || 'User';

  const logout = () => {
    localStorage.clear();
    navigate('/login');
  };

const TrialBadge = () => {
  const [status, setStatus] = React.useState<any>(null);

  React.useEffect(() => {
    api.get('/subscription/status').then(res => setStatus(res.data)).catch(() => {});
  }, []);

  if (!status || status.plan !== 'FREE_TRIAL') return null;

  return (
    <div className={`rounded-xl p-3 mb-4 text-xs
      ${status.trialActive
        ? 'bg-amber-500/10 border border-amber-500/20'
        : 'bg-red-500/10 border border-red-500/20'
      }`}>
      <div className="flex items-center gap-2 mb-1">
        <Clock size={12} className={status.trialActive ? 'text-amber-400' : 'text-red-400'} />
        <span className={status.trialActive ? 'text-amber-400 font-medium' : 'text-red-400 font-medium'}>
          {status.trialActive ? `Trial: ${status.hoursLeft}h left` : 'Trial Expired'}
        </span>
      </div>
      <Link to="/pricing" className="text-indigo-400 hover:text-indigo-300 transition">
        Upgrade now →
      </Link>
    </div>
  );
};

const downloadPdf = async (year?: number) => {
  const url = year ? `/reports/pdf/${year}` : '/reports/pdf';
  const response = await api.get(url, { responseType: 'blob' });
  const blobUrl = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement('a');
  link.href = blobUrl;
  link.setAttribute('download', year
    ? `smartledger-report-${year}.pdf`
    : 'smartledger-report.pdf'
  );
  document.body.appendChild(link);
  link.click();
};

 const navItems = [
  { path: '/', icon: <LayoutDashboard size={18} />, label: 'Dashboard' },
  { path: '/transactions', icon: <ArrowLeftRight size={18} />, label: 'Transactions' },
  { path: '/budget', icon: <Target size={18} />, label: 'Budget' },
  { path: '/investments', icon: <InvestIcon size={18} />, label: 'Investments' },
  { path: '/goals', icon: <PiggyBank size={18} />, label: 'Savings Goals' },
  { path: '/recurring', icon: <Repeat size={18} />, label: 'Recurring' },
  { path: '/loans', icon: <CreditCard size={18} />, label: 'Loans & EMI' },
  { path: '/tax', icon: <Receipt size={18} />, label: 'Tax Calculator' },
  { path: '/anomaly', icon: <ShieldAlert size={18} />, label: 'AI Insights' },
  { path: '/settings', icon: <Settings size={18} />, label: 'Settings' },
  { path: '/pricing', icon: <Crown size={18} />, label: 'Upgrade' },
];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="flex min-h-screen bg-[#0f172a]">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} transition-all duration-300 bg-[#1e293b] border-r border-white/5 flex flex-col py-6 px-4 relative`}>
        {/* Toggle button */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="absolute -right-3 top-8 w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center text-white shadow-lg hover:bg-indigo-600 transition z-10"
        >
          {sidebarOpen ? <X size={12} /> : <Menu size={12} />}
        </button>

        {/* Logo */}
        <div className="flex items-center gap-3 mb-8 px-2">
          <div className="w-9 h-9 rounded-xl balance-gradient flex items-center justify-center flex-shrink-0 shadow-lg shadow-indigo-500/30">
            <span className="text-lg">💰</span>
          </div>
          {sidebarOpen && (
            <div>
              <p className="font-bold text-white text-sm">PaisaNest</p>
              <p className="text-indigo-400 text-xs font-medium">AI</p>
            </div>
          )}
        </div>

        {/* User info */}
        {sidebarOpen && (
          <div className="glass rounded-xl p-3 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full balance-gradient flex items-center justify-center text-sm font-bold text-white">
                {name.charAt(0).toUpperCase()}
              </div>
              <div className="overflow-hidden">
                <p className="text-white text-sm font-medium truncate">{name}</p>
                <p className="text-slate-400 text-xs">Personal Account</p>
              </div>
            </div>
          </div>
        )}
        {/* Trial warning */}
{sidebarOpen && (
  <TrialBadge />
)}       

        {/* Nav items */}
        <nav className="flex-1 space-y-1">
          {navItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group
                ${isActive(item.path)
                  ? 'balance-gradient text-white shadow-lg shadow-indigo-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
            >
              <span className="flex-shrink-0">{item.icon}</span>
              {sidebarOpen && <span className="text-sm font-medium">{item.label}</span>}
            </Link>
          ))}
        </nav>

        {/* Bottom actions */}
        {/* <div className="space-y-1 mt-4">
          <button
            onClick={downloadPdf}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition"
          >
            <FileDown size={18} className="flex-shrink-0" />
            {sidebarOpen && <span className="text-sm">Download PDF</span>}
          </button>
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-500/5 transition"
          >
            <LogOut size={18} className="flex-shrink-0" />
            {sidebarOpen && <span className="text-sm">Logout</span>}
          </button>
        </div> */}
      {/* Bottom actions */}
<div className="space-y-1 mt-4">
  <div className="relative group">
    <button
      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition"
    >
      <FileDown size={18} className="flex-shrink-0" />
      {sidebarOpen && <span className="text-sm">Download PDF</span>}
    </button>
    {sidebarOpen && (
      <div className="hidden group-hover:flex flex-col absolute left-full bottom-0 ml-2 glass rounded-xl p-2 z-50 min-w-40 shadow-xl">
        <button
          onClick={() => downloadPdf()}
          className="text-left text-sm text-slate-300 hover:text-white px-3 py-2 rounded-lg hover:bg-white/5 transition"
        >
          📄 All time report
        </button>
        {[2024, 2025, 2026].map(y => (
          <button
            key={y}
            onClick={() => downloadPdf(y)}
            className="text-left text-sm text-slate-300 hover:text-white px-3 py-2 rounded-lg hover:bg-white/5 transition"
          >
            📅 Year {y} report
          </button>
        ))}
      </div>
    )}
  </div>
  <button
    onClick={logout}
    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-500/5 transition"
  >
    <LogOut size={18} className="flex-shrink-0" />
    {sidebarOpen && <span className="text-sm">Logout</span>}
  </button>
</div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        {/* Top bar */}
        <div className="bg-[#1e293b]/50 border-b border-white/5 px-8 py-4 flex items-center justify-between backdrop-blur-sm sticky top-0 z-10">
          <div className="flex items-center gap-2 text-slate-400 text-sm">
            <TrendingUp size={16} className="text-indigo-400" />
            <span>Personal Finance Dashboard</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
            <span className="text-slate-400 text-xs">Live</span>
          </div>
        </div>

        {/* Page content */}
        <div className="p-8 animate-fade-in">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;