import React from 'react';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, Lock, LogOut, UserCheck } from 'lucide-react';

export default function Navbar() {
  const { user, token, logout } = useAuth();

  return (
    <nav className="navbar">
      <div className="nav-brand">
        <div className="nav-brand-icon">
          <ShieldCheck size={24} />
        </div>
        <div>
          <div className="nav-title">JWT Auth & Session Manager</div>
          <div className="nav-subtitle">EX-1.3.1 • Stateless Authentication System</div>
        </div>
      </div>

      <div className="nav-actions">
        {token ? (
          <div className="session-badge">
            <span className="status-dot"></span>
            <span>Session Active ({user?.role?.toUpperCase() || 'USER'})</span>
          </div>
        ) : (
          <div className="session-badge logged-out">
            <span className="status-dot"></span>
            <span>Unauthenticated</span>
          </div>
        )}

        {token && (
          <button onClick={logout} className="btn btn-danger" title="Invalidate token & logout">
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        )}
      </div>
    </nav>
  );
}
