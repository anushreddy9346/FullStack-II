import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import LoginForm from './components/LoginForm';
import Dashboard from './components/Dashboard';
import JwtInspector from './components/JwtInspector';
import ApiLogger from './components/ApiLogger';
import { LayoutDashboard, FileCode, Activity } from 'lucide-react';

function MainApp() {
  const { token } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="app-container">
      <Navbar />

      {/* Main Navigation Tabs */}
      <div className="tabs-container">
        <button
          className={`tab-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          <LayoutDashboard size={18} />
          <span>{token ? 'Protected Dashboard' : 'Login Authentication'}</span>
        </button>

        <button
          className={`tab-btn ${activeTab === 'inspector' ? 'active' : ''}`}
          onClick={() => setActiveTab('inspector')}
        >
          <FileCode size={18} />
          <span>JWT Inspector & Visualizer</span>
        </button>

        <button
          className={`tab-btn ${activeTab === 'network' ? 'active' : ''}`}
          onClick={() => setActiveTab('network')}
        >
          <Activity size={18} />
          <span>Network & Header Log</span>
        </button>
      </div>

      {/* Tab Contents */}
      {activeTab === 'dashboard' && (
        token ? <Dashboard /> : <LoginForm />
      )}

      {activeTab === 'inspector' && <JwtInspector />}

      {activeTab === 'network' && <ApiLogger />}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
