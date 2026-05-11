import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import BudgetPage from './pages/BudgetPage';
import AIAdvisor from './pages/AIAdvisor';
import Layout from './components/Layout';

const isAuthenticated = () => !!localStorage.getItem('token');

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  return isAuthenticated() ? <>{children}</> : <Navigate to="/login" />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={
          <PrivateRoute>
            <Layout>
              <Dashboard />
            </Layout>
          </PrivateRoute>
        } />
        <Route path="/transactions" element={
          <PrivateRoute>
            <Layout>
              <Transactions />
            </Layout>
          </PrivateRoute>
        } />
        <Route path="/budget" element={
          <PrivateRoute>
            <Layout>
              <BudgetPage />
            </Layout>
          </PrivateRoute>
        } />
        <Route path="/ai" element={
          <PrivateRoute>
            <Layout>
              <AIAdvisor />
            </Layout>
          </PrivateRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;