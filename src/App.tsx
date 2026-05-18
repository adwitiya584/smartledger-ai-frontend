import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import BudgetPage from './pages/BudgetPage';
import AIAdvisor from './pages/AIAdvisor';
import SavingsGoals from './pages/SavingsGoals';
import RecurringPage from './pages/RecurringPage';
import InvestmentPage from './pages/InvestmentPage';
import LoanPage from './pages/LoanPage';
import TaxCalculator from './pages/TaxCalculator';
import AnomalyPage from './pages/AnomalyPage';
import TermsPage from './pages/TermsPage';
import SettingsPage from './pages/SettingsPage';
import PricingPage from './pages/PricingPage';
import Layout from './components/Layout';
import InstallPrompt from './components/InstallPrompt';
import SubscriptionGuard from './components/SubscriptionGuard';

const isAuthenticated = () => !!localStorage.getItem('token');

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  return isAuthenticated() ? <>{children}</> : <Navigate to="/login" />;
};

// Routes that need active subscription
const GuardedRoute = ({ children }: { children: React.ReactNode }) => (
  <PrivateRoute>
    <Layout>
      <SubscriptionGuard>
        {children}
      </SubscriptionGuard>
    </Layout>
  </PrivateRoute>
);

// Routes accessible without subscription
const FreeRoute = ({ children }: { children: React.ReactNode }) => (
  <PrivateRoute>
    <Layout>
      {children}
    </Layout>
  </PrivateRoute>
);

function App() {
  return (
    <div className="dark">
      <BrowserRouter>
        <InstallPrompt />
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/privacy" element={<TermsPage />} />

          {/* Free routes — no subscription needed */}
          <Route path="/" element={<FreeRoute><Dashboard /></FreeRoute>} />
          <Route path="/pricing" element={<FreeRoute><PricingPage /></FreeRoute>} />
          <Route path="/settings" element={<FreeRoute><SettingsPage /></FreeRoute>} />

          {/* Guarded routes — need active subscription */}
          <Route path="/transactions" element={<GuardedRoute><Transactions /></GuardedRoute>} />
          <Route path="/budget" element={<GuardedRoute><BudgetPage /></GuardedRoute>} />
          <Route path="/goals" element={<GuardedRoute><SavingsGoals /></GuardedRoute>} />
          <Route path="/recurring" element={<GuardedRoute><RecurringPage /></GuardedRoute>} />
          <Route path="/investments" element={<GuardedRoute><InvestmentPage /></GuardedRoute>} />
          <Route path="/loans" element={<GuardedRoute><LoanPage /></GuardedRoute>} />
          <Route path="/tax" element={<GuardedRoute><TaxCalculator /></GuardedRoute>} />
          <Route path="/anomaly" element={<GuardedRoute><AnomalyPage /></GuardedRoute>} />
          <Route path="/ai" element={<GuardedRoute><AIAdvisor /></GuardedRoute>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;