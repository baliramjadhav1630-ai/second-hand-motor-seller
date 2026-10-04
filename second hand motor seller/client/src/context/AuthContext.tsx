import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types/index.js';
import { apiRequest } from '../api/client.js';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password?: string) => Promise<void>;
  register: (name: string, email: string, password?: string) => Promise<void>;
  logout: () => void;
  quickDemoLogin: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('motorvault_token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadUser() {
      if (!token) {
        // Auto-login as demo seller for frictionless local demo experience
        try {
          const res = await apiRequest<{ user: User; token: string }>('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email: 'demo@motorvault.com', password: 'password123' })
          });
          setUser(res.user);
          setToken(res.token);
          localStorage.setItem('motorvault_token', res.token);
        } catch (e) {
          console.warn('Initial demo auth failed:', e);
        } finally {
          setIsLoading(false);
        }
        return;
      }

      try {
        const res = await apiRequest<{ user: User }>('/auth/me');
        setUser(res.user);
      } catch (err) {
        console.warn('Session expired, clearing token');
        localStorage.removeItem('motorvault_token');
        setToken(null);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    }

    loadUser();
  }, [token]);

  const login = async (email: string, password = 'password123') => {
    const res = await apiRequest<{ user: User; token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    setUser(res.user);
    setToken(res.token);
    localStorage.setItem('motorvault_token', res.token);
  };

  const quickDemoLogin = async (email: string) => {
    await login(email, 'password123');
  };

  const register = async (name: string, email: string, password = 'password123') => {
    const res = await apiRequest<{ user: User; token: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password })
    });
    setUser(res.user);
    setToken(res.token);
    localStorage.setItem('motorvault_token', res.token);
  };

  const logout = () => {
    localStorage.removeItem('motorvault_token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, register, logout, quickDemoLogin }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
