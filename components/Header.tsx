import React from 'react';
import { useAuth } from '../hooks/useAuth';

const LockIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
    </svg>
);


const Header: React.FC = () => {
  const { user, logout } = useAuth();
  
  const userName = user?.displayName?.split(' ')[0] || 'User';

  return (
    <header className="sticky top-0 z-30 bg-black/70 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 border-b border-gray-800">
          <div className="flex items-center">
             <h1 className="text-xl font-semibold text-white">
                Welcome, {userName}
            </h1>
          </div>
          <div className="flex items-center">
             <button 
                onClick={logout}
                className="flex items-center gap-2 text-sm font-medium text-gray-300 hover:text-white bg-gray-800/50 hover:bg-gray-800 px-4 py-2 rounded-lg transition-colors duration-200 border border-gray-700"
                aria-label="Lock wallet and sign out"
             >
                <LockIcon />
                <span>Lock</span>
             </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;