'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import type { AuthContextType } from '@/types';
import { authService } from '@/services/auth.service';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<AuthContextType['user']>(null);
  const [loading, setLoading] = useState(false);

  const login = useCallback(async (email: string, password: string) => {
    setLoading(true);
    try {
      if (!email || !password) {
        throw new Error('Email y contraseña son requeridos');
      }

      const response = await authService.login({ email, password });
      
      const token = response.token || response.access || response.access_token;
      if (token && response.user) {
        localStorage.setItem('auth_token', token);
        localStorage.setItem('user_data', JSON.stringify(response.user));
      }

      setUser(response.user);
      setIsAuthenticated(true);
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  // Verificar autenticación al montar
  React.useEffect(() => {
    const token = localStorage.getItem('auth_token');
    const userDataStr = localStorage.getItem('user_data');
    if (token && userDataStr) {
      try {
        const user = JSON.parse(userDataStr);
        setUser(user);
        setIsAuthenticated(true);
      } catch (error) {
        logout();
      }
    }
  }, [logout]);

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
}
