
import React from 'react';
import { useAuth } from './hooks/useAuth';
import Login from './components/Login';
import TwoFactorAuth from './components/TwoFactorAuth';
import Dashboard from './components/Dashboard';

const App: React.FC = () => {
  const { isAuthenticated, is2FAVerified, user } = useAuth();

  return (
    <div className="min-h-screen bg-black font-sans">
      {isAuthenticated && is2FAVerified && user ? (
        <Dashboard />
      ) : isAuthenticated && user ? (
        <TwoFactorAuth email={user.email} />
      ) : (
        <Login />
      )}
    </div>
  );
};

export default App;