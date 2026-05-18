import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';

type Step = 'email' | 'otp' | 'details';

const Register = () => {
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [form, setForm] = useState({ name: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const navigate = useNavigate();

  const sendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.post('/auth/send-otp', { email });
      setStep('otp');
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to send OTP');
    }
    setLoading(false);
  };

  const verifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (otp.length !== 6) {
      setError('Please enter the 6-digit OTP');
      return;
    }
    setStep('details');
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (!agreed) {
      setError('Please agree to Terms & Conditions');
      return;
    }
    setLoading(true);
    try {
      const res = await api.post('/auth/register', {
        email,
        otp,
        name: form.name,
        password: form.password
      });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('name', res.data.name);
      navigate('/');
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Registration failed');
      setStep('otp'); // go back to OTP step
    }
    setLoading(false);
  };

  const inputClass = "w-full bg-white/5 border border-white/10 text-white placeholder-slate-500 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition text-sm";

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center px-4">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse-slow"></div>
        <div className="absolute bottom-20 left-20 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse-slow"></div>
      </div>

      <div className="w-full max-w-md animate-fade-in relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl balance-gradient mb-4 shadow-lg shadow-indigo-500/30">
            <span className="text-2xl">💎</span>
          </div>
          <h1 className="text-3xl font-bold text-white">Paisa<span className="gradient-text">Nest</span></h1>
          <p className="text-slate-400 mt-2 text-sm">Your trusted finance companion</p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-2 mb-6 justify-center">
          {['Email', 'Verify OTP', 'Create Account'].map((s, i) => (
            <React.Fragment key={s}>
              <div className={`flex items-center gap-1.5`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition
                  ${i === 0 && step === 'email' ? 'balance-gradient text-white' :
                    i === 1 && step === 'otp' ? 'balance-gradient text-white' :
                    i === 2 && step === 'details' ? 'balance-gradient text-white' :
                    (i === 0 && (step === 'otp' || step === 'details')) ||
                    (i === 1 && step === 'details')
                      ? 'bg-green-500 text-white' : 'glass text-slate-500'
                  }`}>
                  {(i === 0 && (step === 'otp' || step === 'details')) ||
                   (i === 1 && step === 'details') ? '✓' : i + 1}
                </div>
                <span className={`text-xs hidden sm:block ${
                  (i === 0 && step === 'email') ||
                  (i === 1 && step === 'otp') ||
                  (i === 2 && step === 'details') ? 'text-white' : 'text-slate-500'
                }`}>{s}</span>
              </div>
              {i < 2 && <div className={`flex-1 h-px max-w-8 ${
                (i === 0 && (step === 'otp' || step === 'details')) ||
                (i === 1 && step === 'details') ? 'bg-green-500' : 'bg-white/10'
              }`}></div>}
            </React.Fragment>
          ))}
        </div>

        <div className="glass rounded-2xl p-8 shadow-2xl">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl px-4 py-3 mb-4 text-sm">
              {error}
            </div>
          )}

          {/* Step 1 — Email */}
          {step === 'email' && (
            <form onSubmit={sendOtp} className="space-y-4">
              <div>
                <h2 className="text-xl font-semibold text-white mb-1">Create Account</h2>
                <p className="text-slate-400 text-sm mb-4">Enter your email to get started</p>
              </div>
              <div>
                <label className="text-slate-400 text-xs mb-1 block">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className={inputClass}
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full balance-gradient text-white font-semibold py-3 rounded-xl hover:opacity-90 transition shadow-lg shadow-indigo-500/30 disabled:opacity-50"
              >
                {loading ? 'Sending OTP...' : 'Send OTP →'}
              </button>
            </form>
          )}

          {/* Step 2 — OTP */}
          {step === 'otp' && (
            <form onSubmit={verifyOtp} className="space-y-4">
              <div>
                <h2 className="text-xl font-semibold text-white mb-1">Verify Email</h2>
                <p className="text-slate-400 text-sm mb-4">
                  Enter the 6-digit OTP sent to <span className="text-indigo-400">{email}</span>
                </p>
              </div>
              <div>
                <label className="text-slate-400 text-xs mb-1 block">OTP Code</label>
                <input
                  type="text"
                  value={otp}
                  onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="000000"
                  maxLength={6}
                  required
                  className={`${inputClass} text-center text-2xl tracking-widest font-bold`}
                />
                <p className="text-slate-500 text-xs mt-1 text-center">Valid for 10 minutes</p>
              </div>
              <button
                type="submit"
                className="w-full balance-gradient text-white font-semibold py-3 rounded-xl hover:opacity-90 transition shadow-lg shadow-indigo-500/30"
              >
                Verify OTP →
              </button>
              <button
                type="button"
                onClick={() => { setStep('email'); setOtp(''); setError(''); }}
                className="w-full glass text-slate-400 py-2.5 rounded-xl text-sm hover:text-white transition"
              >
                ← Change Email
              </button>
              <button
                type="button"
                onClick={sendOtp}
                disabled={loading}
                className="w-full text-indigo-400 text-sm hover:text-indigo-300 transition disabled:opacity-50"
              >
                {loading ? 'Sending...' : 'Resend OTP'}
              </button>
            </form>
          )}

          {/* Step 3 — Details */}
          {step === 'details' && (
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <h2 className="text-xl font-semibold text-white mb-1">Almost there!</h2>
                <p className="text-slate-400 text-sm mb-4">Complete your profile</p>
              </div>
              <div>
                <label className="text-slate-400 text-xs mb-1 block">Full Name</label>
                <input
                  placeholder="Mohit Pandey"
                  value={form.name}
                  onChange={e => setForm({...form, name: e.target.value})}
                  required
                  className={inputClass}
                />
              </div>
              <div>
                <label className="text-slate-400 text-xs mb-1 block">Password</label>
                <input
                  type="password"
                  placeholder="Min 8 characters"
                  value={form.password}
                  onChange={e => setForm({...form, password: e.target.value})}
                  minLength={8}
                  required
                  className={inputClass}
                />
              </div>
              <div>
                <label className="text-slate-400 text-xs mb-1 block">Confirm Password</label>
                <input
                  type="password"
                  placeholder="Repeat password"
                  value={form.confirmPassword}
                  onChange={e => setForm({...form, confirmPassword: e.target.value})}
                  required
                  className={inputClass}
                />
              </div>
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="terms"
                  checked={agreed}
                  onChange={e => setAgreed(e.target.checked)}
                  className="mt-1 accent-indigo-500"
                />
                <label htmlFor="terms" className="text-slate-400 text-xs leading-relaxed">
                  I agree to the{' '}
                  <Link to="/terms" target="_blank" className="text-indigo-400 hover:text-indigo-300">
                    Terms & Conditions
                  </Link>{' '}
                  and{' '}
                  <Link to="/privacy" target="_blank" className="text-indigo-400 hover:text-indigo-300">
                    Privacy Policy
                  </Link>
                </label>
              </div>
              <button
                type="submit"
                disabled={loading || !agreed}
                className="w-full balance-gradient text-white font-semibold py-3 rounded-xl hover:opacity-90 transition shadow-lg shadow-indigo-500/30 disabled:opacity-50"
              >
                {loading ? 'Creating Account...' : 'Create Account 🎉'}
              </button>
            </form>
          )}

          <p className="text-center text-slate-400 text-sm mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;