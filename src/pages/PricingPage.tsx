import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { CheckCircle, Zap, Clock, AlertTriangle, Shield } from 'lucide-react';

declare global {
  interface Window { Razorpay: any; }
}

const PricingPage = () => {
  const [status, setStatus] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get('/subscription/status').then(res => setStatus(res.data));
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    document.body.appendChild(script);
  }, []);

  const handleSubscribe = async () => {
    setLoading(true);
    try {
      const orderRes = await api.post('/subscription/create-order', { plan: 'PRO' });
      const { orderId, amount, keyId } = orderRes.data;

      if (!window.Razorpay) {
        alert('Razorpay not loaded. Please refresh the page.');
        setLoading(false);
        return;
      }

      const options = {
        key: keyId,
        amount: amount,
        currency: 'INR',
        name: 'Verity Ledger',
        description: 'Pro Plan — Monthly Subscription',
        order_id: orderId,
        handler: async (response: any) => {
          try {
            const verifyRes = await api.post('/subscription/verify-payment', {
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
              plan: 'PRO'
            });
            if (verifyRes.data.success) {
              const statusRes = await api.get('/subscription/status');
              setStatus(statusRes.data);
            }
          } catch {
            alert('Payment verification failed. Contact support@verityledger.com');
          }
        },
        prefill: {
          name: localStorage.getItem('name') || '',
          email: status?.email || '',
        },
        theme: { color: '#6366f1' },
        modal: { ondismiss: () => setLoading(false) }
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', (response: any) => {
        alert('Payment failed: ' + response.error.description);
        setLoading(false);
      });
      rzp.open();

    } catch (err: any) {
      alert('Error: ' + (err?.response?.data?.message || 'Failed to initiate payment'));
    }
    setLoading(false);
  };

  const freeFeatures = [
    'All features for 52 hours',
    'Unlimited transactions',
    'AI Financial Advisor',
    'Investment tracker',
    'Loan & EMI manager',
    'PDF reports',
    'Tax calculator',
  ];

  const proFeatures = [
    'Everything in Free Trial',
    'Unlimited access forever',
    'AI Anomaly Detection',
    'AI Spending Predictions',
    'Savings goals tracking',
    'Recurring transactions',
    'Monthly & yearly PDF reports',
    'Priority support',
  ];

  return (
    <div className="space-y-6 animate-slide-up max-w-3xl mx-auto">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white mb-2">
          Simple <span className="gradient-text">Pricing</span>
        </h1>
        <p className="text-slate-400 text-sm">
          Start free for 52 hours. Upgrade anytime for just ₹99/month.
        </p>
      </div>

      {/* Status banner */}
      {status?.plan === 'FREE_TRIAL' && (
        <div className={`glass rounded-2xl p-4 border flex items-center gap-4
          ${status.trialActive
            ? 'border-amber-500/30 bg-amber-500/5'
            : 'border-red-500/30 bg-red-500/5'}`}>
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0
            ${status.trialActive ? 'bg-amber-500/20' : 'bg-red-500/20'}`}>
            {status.trialActive
              ? <Clock size={20} className="text-amber-400" />
              : <AlertTriangle size={20} className="text-red-400" />}
          </div>
          <div className="flex-1">
            <p className={`font-medium text-sm ${status.trialActive ? 'text-amber-400' : 'text-red-400'}`}>
              {status.trialActive
                ? `⏰ Free Trial: ${status.hoursLeft} hours remaining`
                : '🔒 Free Trial Expired — Upgrade to continue'}
            </p>
            <p className="text-slate-400 text-xs mt-0.5">{status.message}</p>
          </div>
        </div>
      )}

      {status?.plan === 'PRO' && status?.hasAccess && (
        <div className="glass rounded-2xl p-4 border border-green-500/30 bg-green-500/5 flex items-center gap-4">
          <CheckCircle size={24} className="text-green-400 flex-shrink-0" />
          <div>
            <p className="text-green-400 font-medium">Pro Plan Active ✅</p>
            <p className="text-slate-400 text-xs">
              Valid until {new Date(status.subscriptionEndDate).toLocaleDateString('en-IN', {
                day: 'numeric', month: 'long', year: 'numeric'
              })}
            </p>
          </div>
        </div>
      )}

      {/* Plans */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Free Trial */}
        <div className="glass rounded-2xl p-6 border border-slate-500/30 card-hover">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-slate-500/20 flex items-center justify-center">
              <Clock size={24} className="text-slate-400" />
            </div>
            <div>
              <h3 className="text-white font-bold text-lg">Free Trial</h3>
              <div className="flex items-baseline gap-1">
                <span className="text-white font-bold text-2xl">₹0</span>
                <span className="text-slate-400 text-xs">/52 hours</span>
              </div>
            </div>
          </div>

          <ul className="space-y-2 mb-6">
            {freeFeatures.map(f => (
              <li key={f} className="flex items-center gap-2 text-sm">
                <CheckCircle size={14} className="text-green-400 flex-shrink-0" />
                <span className="text-slate-300">{f}</span>
              </li>
            ))}
            <li className="flex items-center gap-2 text-sm">
              <AlertTriangle size={14} className="text-amber-400 flex-shrink-0" />
              <span className="text-amber-400">Expires after 52 hours</span>
            </li>
          </ul>

          <div className="w-full py-3 rounded-xl font-semibold text-sm text-center glass text-slate-400">
            {status?.plan === 'FREE_TRIAL'
              ? status?.trialActive
                ? `${status?.hoursLeft}h remaining`
                : 'Trial Expired'
              : 'Auto-activated on signup'
            }
          </div>
        </div>

        {/* Pro Plan */}
        <div className="glass rounded-2xl p-6 border border-indigo-500/40 bg-indigo-500/5 card-hover relative">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2">
            <span className="balance-gradient text-white text-xs px-4 py-1 rounded-full font-medium shadow-lg">
              ⭐ Most Popular
            </span>
          </div>

          {status?.plan === 'PRO' && (
            <div className="absolute -top-3 right-4">
              <span className="bg-green-500 text-white text-xs px-3 py-1 rounded-full font-medium">
                Active
              </span>
            </div>
          )}

          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl balance-gradient flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Zap size={24} className="text-white" />
            </div>
            <div>
              <h3 className="text-white font-bold text-lg">Pro</h3>
              <div className="flex items-baseline gap-1">
                <span className="text-white font-bold text-2xl">₹99</span>
                <span className="text-slate-400 text-xs">/month</span>
              </div>
            </div>
          </div>

          <ul className="space-y-2 mb-6">
            {proFeatures.map(f => (
              <li key={f} className="flex items-center gap-2 text-sm">
                <CheckCircle size={14} className="text-green-400 flex-shrink-0" />
                <span className="text-slate-300">{f}</span>
              </li>
            ))}
          </ul>

          <button
            onClick={handleSubscribe}
            disabled={loading || status?.plan === 'PRO'}
            className="w-full balance-gradient text-white py-3 rounded-xl font-semibold hover:opacity-90 transition shadow-lg shadow-indigo-500/20 disabled:opacity-60 text-sm"
          >
            {loading ? 'Opening payment...' :
             status?.plan === 'PRO' ? '✅ Already Subscribed' :
             'Subscribe — ₹99/month'}
          </button>
        </div>
      </div>

      {/* Trust badges */}
      <div className="glass rounded-2xl p-5">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="flex flex-col items-center gap-2">
            <Shield size={20} className="text-green-400" />
            <p className="text-white text-xs font-medium">Secure Payments</p>
            <p className="text-slate-500 text-xs">Powered by Razorpay</p>
          </div>
          <div className="flex flex-col items-center gap-2">
            <CheckCircle size={20} className="text-indigo-400" />
            <p className="text-white text-xs font-medium">Cancel Anytime</p>
            <p className="text-slate-500 text-xs">No long-term commitment</p>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Zap size={20} className="text-amber-400" />
            <p className="text-white text-xs font-medium">Instant Activation</p>
            <p className="text-slate-500 text-xs">Access within seconds</p>
          </div>
        </div>
        <p className="text-slate-500 text-xs text-center mt-4">
          UPI • Cards • Net Banking • Wallets — all Indian payment methods supported
        </p>
      </div>
    </div>
  );
};

export default PricingPage;