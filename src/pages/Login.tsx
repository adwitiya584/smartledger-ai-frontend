import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('name', res.data.name);
      navigate('/');
    } catch {
      setError('Invalid email or password');
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
          💰 SmartLedger AI
        </h2>
        <p style={{ textAlign: 'center', color: '#64748b', marginBottom: '24px' }}>
          Sign in to your account
        </p>
        {error && <p style={{ color: 'red', marginBottom: '12px' }}>{error}</p>}
        <form onSubmit={handleLogin}>
          <input
            type="email" placeholder="Email" value={email}
            onChange={e => setEmail(e.target.value)}
            style={inputStyle} required
          />
          <input
            type="password" placeholder="Password" value={password}
            onChange={e => setPassword(e.target.value)}
            style={inputStyle} required
          />
          <button type="submit" style={btnStyle}>Sign In</button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '16px', color: '#64748b' }}>
          No account? <Link to="/register" style={{ color: '#3b82f6' }}>Register</Link>
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

export default Login;