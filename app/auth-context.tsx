'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/lib/types';
import { getUserByEmail } from '@/lib/data-loader';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  signup: (email: string, password: string, displayName: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('auth_user');
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem('auth_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Fetch user from JSON data
      const dbUser = await getUserByEmail(email);

      if (!dbUser) {
        throw new Error('Invalid credentials');
      }

      // Simple password check (in production, use bcrypt)
      const userWithPassword = dbUser as any;
      if (userWithPassword.password !== password) {
        throw new Error('Invalid credentials');
      }

      // Remove password from client-side storage
      const { password: _, ...userWithoutPassword } = userWithPassword;

      setUser(userWithoutPassword as User);
      localStorage.setItem('auth_user', JSON.stringify(userWithoutPassword));
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (email: string, password: string, displayName: string) => {
    setIsLoading(true);
    try {
      // Get buildingId from pending invite if present in URL
      const searchParams = new URLSearchParams(window.location.search);
      const code = searchParams.get('code');
      let buildingId = 'bldg-001'; // Default

      if (code) {
        const inviteResponse = await fetch(`/api/invites?code=${code}`);
        if (inviteResponse.ok) {
          const inviteData = await inviteResponse.json();
          buildingId = inviteData.invite.buildingId;
        }
      }

      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          displayName,
          role: 'resident',
          buildingId,
          facilitiesOfInterest: [],
          timePreferences: [],
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Signup failed');
      }

      const data = await response.json();
      const { password: _, ...userWithoutPassword } = data.user;

      setUser(userWithoutPassword);
      localStorage.setItem('auth_user', JSON.stringify(userWithoutPassword));
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('auth_user');
  };

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      isAuthenticated: !!user,
      login,
      logout,
      signup,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
