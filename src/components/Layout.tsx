import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, ArrowLeftRight, Target, Bot, LogOut, FileDown } from 'lucide-react';
import api from '../api/axios';

const Layout = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const logout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const downloadPdf = async () => {
    const response = await api.get('/reports/pdf', { responseType: 'blob' });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'smartledger-report.pdf');
    document.body.appendChild(link);
    link.click();
  };

  const navItems = [
    { path: '/', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { path: '/transactions', icon: <ArrowLeftRight size={20} />, label: 'Transactions' },
    { path: '/budget', icon: <Target size={20} />, label: 'Budget' },
    { path: '/ai', icon: <Bot size={20} />, label: 'AI Advisor' },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      {/* Sidebar */}
      <div style={{
        width: '220px', background: '#1e293b', color: '#fff',
        display: 'flex', flexDirection: 'column', padding: '24px 16px'
      }}>
        <div style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '32px', color: '#38bdf8' }}>
          💰 SmartLedger
        </div>
        {navItems.map(item => (
          <Link key={item.path} to={item.path} style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            padding: '10px 12px', borderRadius: '8px', marginBottom: '4px',
            textDecoration: 'none', color: location.pathname === item.path ? '#38bdf8' : '#cbd5e1',
            background: location.pathname === item.path ? '#0f172a' : 'transparent',
          }}>
            {item.icon}{item.label}
          </Link>
        ))}
        <div style={{ marginTop: 'auto' }}>
          <button onClick={downloadPdf} style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            padding: '10px 12px', borderRadius: '8px', marginBottom: '8px',
            background: 'transparent', border: 'none', color: '#cbd5e1',
            cursor: 'pointer', width: '100%', fontSize: '14px'
          }}>
            <FileDown size={20} /> Download PDF
          </button>
          <button onClick={logout} style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            padding: '10px 12px', borderRadius: '8px',
            background: 'transparent', border: 'none', color: '#f87171',
            cursor: 'pointer', width: '100%', fontSize: '14px'
          }}>
            <LogOut size={20} /> Logout
          </button>
        </div>
      </div>

      {/* Main content */}
      <div style={{ flex: 1, background: '#f1f5f9', padding: '32px', overflowY: 'auto' }}>
        {children}
      </div>
    </div>
  );
};

export default Layout;