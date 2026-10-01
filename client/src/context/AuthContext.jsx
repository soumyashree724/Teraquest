import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('terraquest_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('terraquest_token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('terraquest_token');
      if (storedToken) {
        try {
          const res = await authAPI.getMe();
          if (res.data && res.data.user) {
            setUser(res.data.user);
            localStorage.setItem('terraquest_user', JSON.stringify(res.data.user));
          } else {
            // Token present but server returned no user — clear everything
            localStorage.removeItem('terraquest_token');
            localStorage.removeItem('terraquest_user');
            setUser(null);
            setToken(null);
          }
        } catch (error) {
          // Token invalid or expired (e.g. after DB migration) — silently clear
          console.warn('Stale session cleared:', error.message);
          localStorage.removeItem('terraquest_token');
          localStorage.removeItem('terraquest_user');
          setUser(null);
          setToken(null);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    const res = await authAPI.login({ email, password });
    if (res.data.success) {
      const { token: receivedToken, user: receivedUser } = res.data;
      setToken(receivedToken);
      setUser(receivedUser);
      localStorage.setItem('terraquest_token', receivedToken);
      localStorage.setItem('terraquest_user', JSON.stringify(receivedUser));
      return { success: true, user: receivedUser };
    }
    return { success: false, message: res.data.message };
  };

  const register = async (name, email, password, role = 'USER') => {
    const res = await authAPI.register({ name, email, password, role });
    if (res.data.success) {
      const { token: receivedToken, user: receivedUser } = res.data;
      setToken(receivedToken);
      setUser(receivedUser);
      localStorage.setItem('terraquest_token', receivedToken);
      localStorage.setItem('terraquest_user', JSON.stringify(receivedUser));
      return { success: true, user: receivedUser };
    }
    return { success: false, message: res.data.message };
  };

  const loginAsDemoTraveler = async () => {
    return login('user@travel.com', 'Traveler123!');
  };

  const loginAsDemoAdmin = async () => {
    return login('admin@travel.com', 'Admin123!');
  };

  const logout = () => {
    try {
      authAPI.logout();
    } catch (e) {}
    setUser(null);
    setToken(null);
    localStorage.removeItem('terraquest_token');
    localStorage.removeItem('terraquest_user');
  };

  const isAdmin = user?.role === 'ADMIN';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAdmin,
        loading,
        login,
        register,
        loginAsDemoTraveler,
        loginAsDemoAdmin,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
