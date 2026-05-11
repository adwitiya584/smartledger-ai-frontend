import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/register', form);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('name', res.data.name);
      navigate('/');
    } catch (err: any) {
  const msg = err?.response?.data?.message;
  setError(msg || 'Registration failed. Try a different email.');
}
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', background: '#f1f5f9'
    }}>
      <div style={{
        background: '#fff', padding: '40px', borderRadius: '12px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)', width: '100%', maxWidth: '400px'
      }}>
        <h2 style={{ textAlign: 'center', marginBottom: '8px', color: '#1e293b' }}>
          💰 Create Account
        </h2>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <form onSubmit={handleRegister}>
          <input placeholder="Full Name" value={form.name}
            onChange={e => setForm({...form, name: e.target.value})}
            style={inputStyle} required />
          <input type="email" placeholder="Email" value={form.email}
            onChange={e => setForm({...form, email: e.target.value})}
            style={inputStyle} required />
          <input type="password" placeholder="Password" value={form.password}
            onChange={e => setForm({...form, password: e.target.value})}
            style={inputStyle} required />
          <button type="submit" style={btnStyle}>Create Account</button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '16px', color: '#64748b' }}>
          Have account? <Link to="/login" style={{ color: '#3b82f6' }}>Login</Link>
        </p>
      </div>
    </div>
  );
};

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '12px', marginBottom: '16px',
  borderRadius: '8px', border: '1px solid #e2e8f0',
  fontSize: '14px', boxSizing: 'border-box'
};

const btnStyle: React.CSSProperties = {
  width: '100%', padding: '12px', background: '#3b82f6',
  color: '#fff', border: 'none', borderRadius: '8px',
  fontSize: '16px', cursor: 'pointer', fontWeight: 'bold'
};

export default Register;