// src/pages/Login.tsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface LoginProps {
  onLogin?: (token: string, username: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (onLogin) {
      onLogin('demo_access_token_nutrilens', 'Demo User');
    }
    navigate('/dashboard', { replace: true });
  }, [navigate, onLogin]);

  return null;
};

export default Login;
