import React, { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('jwt_token') || null);
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('jwt_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [claims, setClaims] = useState(null);
  const [tokenParts, setTokenParts] = useState({ header: '', payload: '', signature: '' });
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState(null);

  // Helper to parse JWT parts & claims
  const parseToken = (rawToken) => {
    if (!rawToken) {
      setClaims(null);
      setTokenParts({ header: '', payload: '', signature: '' });
      return;
    }

    try {
      const decoded = jwtDecode(rawToken);
      setClaims(decoded);

      const parts = rawToken.split('.');
      if (parts.length === 3) {
        setTokenParts({
          header: parts[0],
          payload: parts[1],
          signature: parts[2]
        });
      }
    } catch (e) {
      console.error('Invalid token structure:', e);
      setClaims(null);
    }
  };

  // Sync token changes
  useEffect(() => {
    if (token) {
      localStorage.setItem('jwt_token', token);
      parseToken(token);
    } else {
      localStorage.removeItem('jwt_token');
      localStorage.removeItem('jwt_user');
      setClaims(null);
      setTokenParts({ header: '', payload: '', signature: '' });
    }
  }, [token]);

  // Log API interaction
  const addLog = (logEntry) => {
    setLogs(prev => [
      {
        id: Date.now() + Math.random(),
        timestamp: new Date().toLocaleTimeString(),
        ...logEntry
      },
      ...prev.slice(0, 19) // keep last 20 logs
    ]);
  };

  // Login action
  const login = async (email, password, expiresIn = '1h') => {
    setLoading(true);
    setAuthError(null);

    const reqHeaders = { 'Content-Type': 'application/json' };
    const reqBody = { email, password, expiresIn };

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: reqHeaders,
        body: JSON.stringify(reqBody)
      });

      const data = await response.json();

      addLog({
        method: 'POST',
        url: '/api/login',
        status: response.status,
        requestHeaders: reqHeaders,
        requestBody: reqBody,
        response: data
      });

      if (!response.ok || !data.success) {
        setAuthError(data.message || 'Login failed');
        setLoading(false);
        return false;
      }

      setToken(data.token);
      setUser(data.user);
      localStorage.setItem('jwt_user', JSON.stringify(data.user));
      setLoading(false);
      return true;
    } catch (err) {
      console.error('Login request failed:', err);
      setAuthError('Server error or network failure');
      addLog({
        method: 'POST',
        url: '/api/login',
        status: 500,
        requestHeaders: reqHeaders,
        response: { error: err.message }
      });
      setLoading(false);
      return false;
    }
  };

  // Fetch Protected Profile
  const fetchProfile = async () => {
    if (!token) return null;

    const reqHeaders = {
      'Authorization': `Bearer ${token}`
    };

    try {
      const response = await fetch('/api/user/profile', {
        headers: reqHeaders
      });

      const data = await response.json();

      addLog({
        method: 'GET',
        url: '/api/user/profile',
        status: response.status,
        requestHeaders: reqHeaders,
        response: data
      });

      return data;
    } catch (err) {
      addLog({
        method: 'GET',
        url: '/api/user/profile',
        status: 500,
        requestHeaders: reqHeaders,
        response: { error: err.message }
      });
      return null;
    }
  };

  // Fetch Admin Stats
  const fetchAdminStats = async () => {
    if (!token) return null;

    const reqHeaders = {
      'Authorization': `Bearer ${token}`
    };

    try {
      const response = await fetch('/api/admin/stats', {
        headers: reqHeaders
      });

      const data = await response.json();

      addLog({
        method: 'GET',
        url: '/api/admin/stats',
        status: response.status,
        requestHeaders: reqHeaders,
        response: data
      });

      return data;
    } catch (err) {
      addLog({
        method: 'GET',
        url: '/api/admin/stats',
        status: 500,
        requestHeaders: reqHeaders,
        response: { error: err.message }
      });
      return null;
    }
  };

  // Tamper Token Test (modifies payload string)
  const tamperToken = () => {
    if (!token) return;
    const parts = token.split('.');
    if (parts.length === 3) {
      // Intentionally alter payload characters to break HMAC signature match
      const tamperedPayload = parts[1].substring(0, parts[1].length - 4) + 'XXXX';
      const corruptedToken = `${parts[0]}.${tamperedPayload}.${parts[2]}`;
      setToken(corruptedToken);
    }
  };

  // Logout action
  const logout = () => {
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{
      token,
      user,
      claims,
      tokenParts,
      logs,
      loading,
      authError,
      login,
      logout,
      fetchProfile,
      fetchAdminStats,
      tamperToken,
      addLog
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
