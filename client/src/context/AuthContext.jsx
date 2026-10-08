import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api.js';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('freshcart_user');
    try {
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem('freshcart_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      if (token) {
        try {
          const res = await api.get('/auth/me');
          if (res.success && res.user) {
            setUser(res.user);
            localStorage.setItem('freshcart_user', JSON.stringify(res.user));
          }
        } catch (err) {
          console.warn('Session expired or invalid token:', err.message);
          logout(false);
        }
      }
      setLoading(false);
    }
    checkAuth();
  }, [token]);

  const login = async (email, password) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      if (res.success) {
        setToken(res.token);
        setUser(res.user);
        localStorage.setItem('freshcart_token', res.token);
        localStorage.setItem('freshcart_user', JSON.stringify(res.user));
        toast.success(res.message || `Welcome back, ${res.user.name}!`);
        return { success: true, user: res.user };
      }
    } catch (err) {
      toast.error(err.message || 'Login failed');
      return { success: false, message: err.message };
    }
  };

  const register = async (userData) => {
    try {
      const res = await api.post('/auth/register', userData);
      if (res.success) {
        setToken(res.token);
        setUser(res.user);
        localStorage.setItem('freshcart_token', res.token);
        localStorage.setItem('freshcart_user', JSON.stringify(res.user));
        toast.success(res.message || 'Account created successfully!');
        return { success: true, user: res.user };
      }
    } catch (err) {
      toast.error(err.message || 'Registration failed');
      return { success: false, message: err.message };
    }
  };

  const logout = (showToast = true) => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('freshcart_token');
    localStorage.removeItem('freshcart_user');
    if (showToast) {
      toast.success('Logged out successfully');
    }
  };

  const updateProfile = async (data) => {
    try {
      const res = await api.put('/auth/profile', data);
      if (res.success) {
        setUser(res.user);
        localStorage.setItem('freshcart_user', JSON.stringify(res.user));
        toast.success(res.message || 'Profile updated!');
        return { success: true, user: res.user };
      }
    } catch (err) {
      toast.error(err.message || 'Failed to update profile');
      return { success: false, message: err.message };
    }
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!user && !!token,
    isAdmin: user?.role === 'admin',
    login,
    register,
    logout,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
