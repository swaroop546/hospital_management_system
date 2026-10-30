import React, { useState, useEffect } from 'react';
import { authApi } from '../api/authApi';
import { DEMO_USERS } from '../utils/constants';
import { AuthContext } from './contextValue';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [backendOnline, setBackendOnline] = useState(false);

  // Check health and existing session on mount
  useEffect(() => {
    let mounted = true;

    const initAuth = async () => {
      try {
        // First check backend health
        await authApi.checkHealth();
        if (mounted) setBackendOnline(true);

        // Try getting existing session from server
        const meRes = await authApi.getMe();
        if (meRes.success && meRes.data?.user && mounted) {
          setUser(meRes.data.user);
        }
      } catch {
        // Session not active or backend down
        // Check if there's a cached dev session in localStorage for smooth offline UX
        const saved = localStorage.getItem('medicore_user');
        if (saved && mounted) {
          try {
            setUser(JSON.parse(saved));
          } catch {
            localStorage.removeItem('medicore_user');
          }
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    initAuth();

    // Periodic health check every 15s
    const healthInterval = setInterval(async () => {
      try {
        await authApi.checkHealth();
        if (mounted) setBackendOnline(true);
      } catch {
        if (mounted) setBackendOnline(false);
      }
    }, 15000);

    return () => {
      mounted = false;
      clearInterval(healthInterval);
    };
  }, []);

  const login = async (email, password) => {
    const normalizedEmail = email.trim().toLowerCase();
    try {
      const res = await authApi.login(normalizedEmail, password);
      if (res.success && res.data?.user) {
        setUser(res.data.user);
        localStorage.setItem('medicore_user', JSON.stringify(res.data.user));
        return { success: true, user: res.data.user };
      }
      throw new Error(res.message || 'Login failed');
    } catch (err) {
      // Fallback: check if matches demo user
      const demoMatch = DEMO_USERS.find(
        (u) => u.email.toLowerCase() === normalizedEmail && u.password === password
      );
      if (demoMatch) {
        const fallbackUser = {
          id: `usr-${demoMatch.role}`,
          email: demoMatch.email,
          firstName: demoMatch.name.split(' ')[0],
          lastName: demoMatch.name.split(' ').slice(1).join(' '),
          role: demoMatch.role,
          department: demoMatch.department,
        };
        setUser(fallbackUser);
        localStorage.setItem('medicore_user', JSON.stringify(fallbackUser));
        return { success: true, user: fallbackUser };
      }
      throw err;
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch (err) {
      // Even if network fails, clear local state
      console.warn('Logout API error:', err.message);
    } finally {
      setUser(null);
      localStorage.removeItem('medicore_user');
    }
  };

  // Instant switcher for testing any role
  const switchDemoRole = async (targetRole) => {
    const demo = DEMO_USERS.find((u) => u.role === targetRole);
    if (!demo) return;
    try {
      await login(demo.email, demo.password);
    } catch {
      // Direct local set
      const fallbackUser = {
        id: `usr-${demo.role}`,
        email: demo.email,
        firstName: demo.name.split(' ')[0],
        lastName: demo.name.split(' ').slice(1).join(' '),
        role: demo.role,
        department: demo.department,
      };
      setUser(fallbackUser);
      localStorage.setItem('medicore_user', JSON.stringify(fallbackUser));
    }
  };

  const value = {
    user,
    role: user?.role || null,
    isAuthenticated: !!user,
    loading,
    backendOnline,
    login,
    logout,
    switchDemoRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
