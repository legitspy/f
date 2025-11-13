
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';
import Spinner from './Spinner';
import { useFullscreen } from '../hooks/useFullscreen';

const Logo = () => (
  <div className="flex flex-col items-center" aria-label="BitPrivacy Logo">
    <div className="w-24 h-24 mb-4">
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{stopColor: '#14B8A6'}} /> 
            <stop offset="100%" style={{stopColor: '#0891B2'}} />
          </linearGradient>
        </defs>
        {/* Shield Shape */}
        <path d="M50 2.5 C50 2.5 95 20 95 50 C95 80 50 97.5 50 97.5 C50 97.5 5 80 5 50 C5 20 50 2.5 50 2.5 Z" fill="url(#logoGradient)" />
        
        {/* Abstract Fingerprint/Node Pattern */}
        <g stroke="white" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.9">
          <path d="M35 65 Q50 80 65 65" />
          <path d="M40 55 Q50 65 60 55" />
          <path d="M45 45 Q50 50 55 45" />
          <path d="M30 42 Q50 25 70 42" />
        </g>
      </svg>
    </div>
    <h1 className="text-4xl font-bold text-white tracking-tight">Bit<span className="font-light text-teal-400">Privacy</span></h1>
  </div>
);


const Login: React.FC = () => {
    const { loginWithPin } = useAuth();
    const { enterFullscreen } = useFullscreen();
    const [pin, setPin] = useState<string[]>(new Array(4).fill(''));
    const [pinError, setPinError] = useState('');
    const [pinLoading, setPinLoading] = useState(false);
    const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

    useEffect(() => {
        if (inputsRef.current[0]) {
            // Delay focus slightly to ensure browser has entered fullscreen
            setTimeout(() => inputsRef.current[0]?.focus(), 100);
        }
    }, []);

    const attemptLogin = useCallback(async (fullPin: string) => {
        if (pinLoading || fullPin.length !== 4) return;

        setPinError('');
        setPinLoading(true);
        try {
            await loginWithPin(fullPin);
        } catch (err: any) {
            setPinError(err.message || "An error occurred.");
            setPin(new Array(4).fill(''));
            inputsRef.current[0]?.focus();
        } finally {
            setPinLoading(false);
        }
    }, [loginWithPin, pinLoading]);

    useEffect(() => {
        const fullPin = pin.join('');
        if (fullPin.length === 4) {
            attemptLogin(fullPin);
        }
    }, [pin, attemptLogin]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        enterFullscreen();
        // Handle backspace
        if (e.key === 'Backspace') {
            e.preventDefault();
            const newPin = [...pin];
            if (newPin[index]) {
                newPin[index] = '';
                setPin(newPin);
            } else if (index > 0) {
                inputsRef.current[index - 1]?.focus();
            }
            return;
        }

        // Allow navigation and meta keys (for copy/paste)
        if (e.key.length > 1 || e.metaKey || e.ctrlKey) {
            return;
        }

        // Handle numbers
        if (e.key >= '0' && e.key <= '9') {
            e.preventDefault();
            const newPin = [...pin];
            newPin[index] = e.key;
            setPin(newPin);

            if (index < 3) {
                inputsRef.current[index + 1]?.focus();
            }
            return;
        }
        
        // Prevent all other characters
        e.preventDefault();
    };

    const handlePinPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        enterFullscreen();
        e.preventDefault();
        const paste = e.clipboardData.getData('text').replace(/[^0-9]/g, '').slice(0, 4);
        if (paste.length > 0) {
            const newPin = new Array(4).fill('');
            for (let i = 0; i < paste.length; i++) {
                newPin[i] = paste[i];
            }
            setPin(newPin);
            if (paste.length < 4) {
              const focusIndex = Math.min(paste.length, 3);
              inputsRef.current[focusIndex]?.focus();
            }
        }
    };
    
    const handlePinSubmit = async (e: React.FormEvent) => {
        enterFullscreen();
        e.preventDefault();
        const fullPin = pin.join('');
        if (fullPin.length !== 4) {
          setPinError('Please enter the full 4-digit PIN.');
          return;
        }
        attemptLogin(fullPin);
    };

    return (
        <div className="flex items-center justify-center min-h-screen p-4">
            <div className="w-full max-w-sm bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-gray-700">
                <div className="flex flex-col items-center text-center">
                    <div className="mb-6">
                      <Logo />
                    </div>
                    
                    <h2 className="text-2xl font-semibold text-gray-200 mb-1">Welcome Back</h2>
                    <p className="text-lg text-gray-400 mb-8">BTCSG LTD</p>
                    
                    <form onSubmit={handlePinSubmit} className="w-full">
                        {pinError && <p className="bg-red-500/20 text-red-300 p-3 rounded-lg mb-4 w-full">{pinError}</p>}

                        <div className="flex justify-center gap-3 mb-6" onPaste={handlePinPaste}>
                            {pin.map((digit, index) => (
                                <input
                                    key={index}
                                    ref={el => inputsRef.current[index] = el}
                                    type="text"
                                    inputMode="numeric"
                                    value={digit ? '•' : ''}
                                    onKeyDown={(e) => handleKeyDown(e, index)}
                                    onChange={() => {}}
                                    className="w-14 h-16 bg-gray-700 text-white text-center text-3xl font-bold border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                                    required
                                    disabled={pinLoading}
                                />
                            ))}
                        </div>

                        <button
                            type="submit"
                            disabled={pinLoading}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:shadow-outline transition-all duration-300 disabled:bg-blue-800 disabled:cursor-not-allowed flex items-center justify-center"
                        >
                            {pinLoading ? <Spinner /> : 'Unlock'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
