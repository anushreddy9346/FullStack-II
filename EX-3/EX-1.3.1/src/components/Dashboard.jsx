import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Shield, Server, CheckCircle2, XCircle, HardDrive, RefreshCw, Lock, Sparkles } from 'lucide-react';

export default function Dashboard() {
  const { user, claims, fetchProfile, fetchAdminStats, token } = useAuth();
  const [profileResult, setProfileResult] = useState(null);
  const [adminResult, setAdminResult] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [loadingAdmin, setLoadingAdmin] = useState(false);

  const handleTestProfile = async () => {
    setLoadingProfile(true);
    const res = await fetchProfile();
    setProfileResult(res);
    setLoadingProfile(false);
  };

  const handleTestAdmin = async () => {
    setLoadingAdmin(true);
    const res = await fetchAdminStats();
    setAdminResult(res);
    setLoadingAdmin(false);
  };

  return (
    <div className="grid-2">
      {/* User Profile Card */}
      <div className="glass-card">
        <div className="user-profile-header">
          <div style={{
            width: '52px',
            height: '52px',
            borderRadius: '50%',
            background: user?.role === 'admin' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(6, 182, 212, 0.15)',
            border: `2px solid ${user?.role === 'admin' ? 'var(--accent-warning)' : 'var(--accent-secondary)'}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: user?.role === 'admin' ? 'var(--accent-warning)' : 'var(--accent-secondary)',
            flexShrink: 0
          }}>
            <User size={26} />
          </div>
          <div>
            <div className="user-name">{user?.name}</div>
            <div className="user-email">{user?.email}</div>
            <div style={{ marginTop: '6px' }}>
              <span className={`badge ${user?.role === 'admin' ? 'badge-admin' : 'badge-user'}`}>
                {user?.role === 'admin' ? '👑 Admin Role' : '👤 Standard User'}
              </span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginLeft: '10px' }}>
                Dept: {user?.department || 'Engineering'}
              </span>
            </div>
          </div>
        </div>

        <h3 style={{ fontSize: '1.05rem', fontWeight: 600, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <HardDrive size={18} style={{ color: 'var(--accent-secondary)' }} />
          Client Token Storage Location
        </h3>

        <div style={{ background: '#07090e', padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '0.85rem', marginBottom: '20px' }}>
          <div style={{ color: 'var(--text-dim)', marginBottom: '4px' }}>Storage Key: <code style={{ color: 'var(--accent-secondary)' }}>localStorage.getItem('jwt_token')</code></div>
          <div style={{ color: 'var(--accent-success)', wordBreak: 'break-all', fontFamily: 'JetBrains Mono' }}>
            {token ? `${token.substring(0, 40)}...${token.substring(token.length - 20)}` : 'No Token'}
          </div>
        </div>

        <div style={{ background: 'rgba(99, 102, 241, 0.08)', padding: '14px', borderRadius: '8px', border: '1px solid rgba(99, 102, 241, 0.2)', fontSize: '0.875rem' }}>
          <div style={{ fontWeight: 600, color: 'var(--accent-primary)', marginBottom: '4px' }}>
            💡 Stateless Session Architecture
          </div>
          The server does NOT keep a session database record for this user. Every incoming HTTP request carries the signed JWT token in the <code style={{ color: '#f43f5e' }}>Authorization: Bearer &lt;token&gt;</code> header for verification.
        </div>
      </div>

      {/* Protected API Endpoint Tester */}
      <div className="glass-card">
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Server size={20} style={{ color: 'var(--accent-primary)' }} />
          Protected Route Authorization Tester
        </h3>

        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
          Test server-side token authorization and role-based middleware validation.
        </p>

        {/* Test 1: User Profile Endpoint */}
        <div style={{ marginBottom: '24px', padding: '16px', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <div>
              <span style={{ fontFamily: 'JetBrains Mono', color: 'var(--accent-secondary)', fontWeight: 600 }}>GET /api/user/profile</span>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Requires any valid non-expired JWT</div>
            </div>
            <button onClick={handleTestProfile} className="btn btn-secondary" style={{ padding: '8px 14px', fontSize: '0.85rem' }} disabled={loadingProfile}>
              <RefreshCw size={14} className={loadingProfile ? 'spin' : ''} />
              <span>Test Request</span>
            </button>
          </div>

          {profileResult && (
            <div className="json-box">
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px', color: profileResult.success ? 'var(--accent-success)' : 'var(--accent-danger)', fontWeight: 600 }}>
                {profileResult.success ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
                <span>Status: {profileResult.success ? '200 OK (Authorized)' : '401 Unauthorized'}</span>
              </div>
              <pre>{JSON.stringify(profileResult, null, 2)}</pre>
            </div>
          )}
        </div>

        {/* Test 2: Admin Stats Endpoint */}
        <div style={{ padding: '16px', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <div>
              <span style={{ fontFamily: 'JetBrains Mono', color: 'var(--accent-warning)', fontWeight: 600 }}>GET /api/admin/stats</span>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Requires valid JWT + Admin Role</div>
            </div>
            <button onClick={handleTestAdmin} className="btn btn-secondary" style={{ padding: '8px 14px', fontSize: '0.85rem' }} disabled={loadingAdmin}>
              <Shield size={14} />
              <span>Test Admin Access</span>
            </button>
          </div>

          {adminResult && (
            <div className="json-box">
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px', color: adminResult.success ? 'var(--accent-success)' : 'var(--accent-danger)', fontWeight: 600 }}>
                {adminResult.success ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
                <span>Status: {adminResult.success ? '200 OK (Admin Granted)' : '403 Forbidden'}</span>
              </div>
              <pre>{JSON.stringify(adminResult, null, 2)}</pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
