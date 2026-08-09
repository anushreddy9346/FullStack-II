import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, KeyRound, AlertCircle, Sparkles, Clock } from 'lucide-react';

export default function LoginForm() {
  const { login, loading, authError } = useAuth();
  const [email, setEmail] = useState('admin@example.com');
  const [password, setPassword] = useState('password123');
  const [expiresIn, setExpiresIn] = useState('1h');

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(email, password, expiresIn);
  };

  const setPreset = (presetEmail, presetPass) => {
    setEmail(presetEmail);
    setPassword(presetPass);
  };

  return (
    <div className="glass-card" style={{ maxWidth: '520px', margin: '40px auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <div style={{
          display: 'inline-flex',
          padding: '12px',
          borderRadius: '50%',
          background: 'rgba(99, 102, 241, 0.15)',
          color: 'var(--accent-primary)',
          marginBottom: '12px'
        }}>
          <KeyRound size={32} />
        </div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Authenticate & Obtain Token</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '4px' }}>
          Enter credentials to generate a signed JSON Web Token (JWT)
        </p>
      </div>

      {authError && (
        <div className="alert alert-error">
          <AlertCircle size={20} style={{ flexShrink: 0 }} />
          <div>{authError}</div>
        </div>
      )}

      <div style={{ marginBottom: '20px' }}>
        <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--text-dim)', fontWeight: 600, marginBottom: '8px' }}>
          Demo Preset Credentials:
        </div>
        <div className="preset-pills">
          <button 
            type="button" 
            className="pill-btn" 
            onClick={() => setPreset('admin@example.com', 'password123')}
          >
            <div className="pill-role" style={{ color: 'var(--accent-warning)' }}>👑 Admin Role</div>
            <div className="pill-email">admin@example.com</div>
          </button>

          <button 
            type="button" 
            className="pill-btn" 
            onClick={() => setPreset('user@example.com', 'user123')}
          >
            <div className="pill-role" style={{ color: 'var(--accent-secondary)' }}>👤 Standard User</div>
            <div className="pill-email">user@example.com</div>
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Email Address</label>
          <div className="input-wrapper">
            <Mail className="input-icon" size={18} />
            <input
              type="email"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Password</label>
          <div className="input-wrapper">
            <Lock className="input-icon" size={18} />
            <input
              type="password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Clock size={16} /> Token Expiration Lifetime (exp claim)
          </label>
          <select
            className="form-input"
            value={expiresIn}
            onChange={(e) => setExpiresIn(e.target.value)}
            style={{ appearance: 'auto' }}
          >
            <option value="1m">1 Minute (Quick Expire Demo)</option>
            <option value="15m">15 Minutes</option>
            <option value="1h">1 Hour (Standard)</option>
            <option value="24h">24 Hours</option>
          </select>
        </div>

        <button
          type="submit"
          className="btn btn-primary"
          style={{ width: '100%', marginTop: '8px', padding: '14px' }}
          disabled={loading}
        >
          {loading ? (
            <span>Signing JWT...</span>
          ) : (
            <>
              <Sparkles size={18} />
              <span>Login & Sign JWT Token</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
