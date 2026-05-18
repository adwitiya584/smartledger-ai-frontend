import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../api/axios';

const FREE_ROUTES = ['/pricing', '/settings', '/'];

const SubscriptionGuard = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkAccess = async () => {
      try {
        const res = await api.get('/subscription/status');
        if (!res.data.hasAccess && !FREE_ROUTES.includes(location.pathname)) {
          navigate('/pricing');
        }
      } catch {}
    };
    checkAccess();
  }, [location.pathname, navigate]);

  return <>{children}</>;
};

export default SubscriptionGuard;