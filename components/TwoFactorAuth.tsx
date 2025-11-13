
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';
import Spinner from './Spinner';

interface TwoFactorAuthProps {
  email: string;
}

const TwoFactorAuth: React.FC<TwoFactorAuthProps> = ({ email }) => {
  const [code, setCode] = useState<string[]>(new Array(6).fill(''));
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { verify2FA } = useAuth();
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputsRef.current[0]?.focus();
  }, []);

  const submitCode = useCallback(async () => {
    const fullCode = code.join('');
    // Prevent submission if code is incomplete or already submitting
    if (fullCode.length !== 6 || loading) {
      return;
    }
    
    setError('');
    setLoading(true);
    const success = await verify2FA(fullCode);
    if (!success) {
      setError('Invalid code. Please try again.');
      setCode(new Array(6).fill(''));
      inputsRef.current[0]?.focus();
      setLoading(false); // Only on failure
    }
    // On success, component unmounts.
  }, [code, loading, verify2FA]);

  // Auto-submit when code is complete
  useEffect(() => {
    const fullCode = code.join('');
    if (fullCode.length === 6) {
      submitCode();
    }
  }, [code, submitCode]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    // Handle backspace
    if (e.key === 'Backspace') {
        e.preventDefault();
        const newCode = [...code];
        if (newCode[index]) {
            newCode[index] = '';
            setCode(newCode);
        } else if (index > 0) {
            inputsRef.current[index - 1]?.focus();
        }
        return;
    }

    // Allow navigation and meta keys
    if (e.key.length > 1 || e.metaKey || e.ctrlKey) {
        return;
    }

    // Handle numbers
    if (e.key >= '0' && e.key <= '9') {
        e.preventDefault();
        const newCode = [...code];
        newCode[index] = e.key;
        setCode(newCode);

        if (index < 5) {
            inputsRef.current[index + 1]?.focus();
        }
        return;
    }
    
    // Prevent all other characters
    e.preventDefault();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitCode();
  };
  
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const paste = e.clipboardData.getData('text').replace(/[^0-9]/g, '').slice(0, 6);
    if (paste.length > 0) {
        const newCode = new Array(6).fill('');
        for (let i = 0; i < paste.length; i++) {
            newCode[i] = paste[i];
        }
        setCode(newCode);
        const focusIndex = Math.min(paste.length, 5);
        inputsRef.current[focusIndex]?.focus();
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-md bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-gray-700">
        <h2 className="text-2xl font-bold text-center text-white mb-2">Two-Factor Authentication</h2>
        <p className="text-center text-gray-400 mb-6">Enter the code that appears on your Google Authenticator app.</p>

        <form onSubmit={handleSubmit}>
          {error && <p className="bg-red-500/20 text-red-300 p-3 rounded-lg mb-4 text-center">{error}</p>}
          
          <div className="flex justify-center gap-2 mb-6" onPaste={handlePaste}>
            {code.map((digit, index) => (
              <input
                key={index}
                ref={el => inputsRef.current[index] = el}
                type="text"
                inputMode="numeric"
                value={digit ? '*' : ''}
                onKeyDown={(e) => handleKeyDown(e, index)}
                onChange={() => {}}
                className="w-12 h-14 bg-gray-700 text-white text-center text-2xl font-bold border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            ))}
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:shadow-outline transition-all duration-300 disabled:bg-blue-800 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {loading ? <Spinner /> : 'Verify Code'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default TwoFactorAuth;
