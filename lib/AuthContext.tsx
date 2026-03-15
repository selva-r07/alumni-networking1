'use client';

import { createContext, useContext } from 'react';

type AuthResult = {
  error: { message: string } | null;
  user?: any;
};

type AuthContextType = {
  signUp: (email: string, password: string, userData: any) => Promise<AuthResult>;
  signIn: (email: string, password: string) => Promise<AuthResult>;
  signInAlumni: (email: string, password: string) => Promise<AuthResult>;
  signInAdmin: (email: string, password: string) => Promise<AuthResult>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // ✅ REGISTER
  const signUp = async (email: string, password: string, userData: any) => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, ...userData }),
      });
      const data = await res.json();
      if (!res.ok) return { error: { message: data.error } };
      return { error: null };
    } catch {
      return { error: { message: 'Network error' } };
    }
  };

  // ✅ STUDENT LOGIN
  const signIn = async (email: string, password: string) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) return { error: { message: data.message || 'Login failed' } };
      localStorage.setItem('userId', data.user._id);
      localStorage.setItem('user', JSON.stringify(data.user));
      return { error: null, user: data.user };
    } catch {
      return { error: { message: 'Network error' } };
    }
  };

  // ✅ ALUMNI LOGIN
  const signInAlumni = async (email: string, password: string) => {
  try {
    const res = await fetch('/api/auth/alumni-login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) return { error: { message: data.error || 'Login failed' } };
    localStorage.setItem("userId", data.user._id); 
    return { error: null, user: data.user };
  } catch {
    return { error: { message: 'Network error. Please try again.' } };
  }
};


  // ✅ ADMIN LOGIN (default credentials)
 const signInAdmin = async (email: string, password: string) => {
  const defaultAdmin = {
    email: 'admin@example.com',
    password: 'admin123',
  };

  if (email === defaultAdmin.email && password === defaultAdmin.password) {
    // Successful login, return user data
    return { error: null, user: { email, role: 'admin' } };
  } else {
    return { error: { message: 'Invalid Admin credentials' } };
  }
};


  return (
    <AuthContext.Provider value={{ signUp, signIn, signInAlumni, signInAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};




