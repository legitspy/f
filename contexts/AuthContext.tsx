
import React, { createContext, useState, useEffect, useCallback } from 'react';
import type { User } from '../types';
import { auth, onAuthStateChanged } from '../services/firebase';
import { verify2FACode as verifyApi2FA } from '../services/apiService';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  is2FAVerified: boolean;
  loading: boolean;
  logout: () => Promise<void>;
  verify2FA: (code: string) => Promise<boolean>;
  loginWithPin: (pin: string) => Promise<User>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [is2FAVerified, set2FAVerified] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged((user) => {
      setUser(user);
      set2FAVerified(false); // Reset 2FA on auth state change
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);
  
  const logout = async () => {
    await auth.signOut();
    setUser(null);
    set2FAVerified(false);
  };

  const verify2FA = useCallback(async (code: string): Promise<boolean> => {
    if (!user) {
      console.error("2FA verification attempt without a user.");
      return false;
    }
    try {
      const isValid = await verifyApi2FA(user.email, code);
      if (isValid) {
        set2FAVerified(true);
      }
      return isValid;
    } catch (error) {
      console.error("2FA verification failed:", error);
      return false;
    }
  }, [user]);

  const loginWithPin = async (pin: string): Promise<User> => {
    // @ts-ignore - This method exists on our mock service
    const userCredential = await auth.signInWithPin(pin);
    const loggedInUser = {
      uid: userCredential.user.uid,
      email: userCredential.user.email!,
      displayName: userCredential.user.displayName || undefined
    };
    setUser(loggedInUser);
    return loggedInUser;
  };


  const value = {
    user,
    isAuthenticated: !!user,
    is2FAVerified,
    loading,
    logout,
    verify2FA,
    loginWithPin,
  };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};