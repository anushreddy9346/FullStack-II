import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Activity, Send, CheckCircle2, XCircle, ArrowUpRight } from 'lucide-react';

export default function ApiLogger() {
  const { logs } = useAuth();

  return (
    <div className="glass-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Activity size={22} style={{ color: 'var(--accent-secondary)' }} />
            HTTP Request &amp; Bearer Token Header Inspector Log
          </h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            Inspect client-server HTTP request-response cycle and outgoing <code style={{ color: 'var(--accent-secondary)' }}>Authorization: Bearer &lt;token&gt;</code> headers.
          </p>
        </div>
      </div>

      {logs.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '30px', color: 'var(--text-dim)', fontSize: '0.9rem' }}>
          No HTTP requests recorded yet. Make a login request or test API endpoints in the Dashboard.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {logs.map((log) => {
            const isSuccess = log.status >= 200 && log.status < 300;
            return (
              <div 
                key={log.id} 
                style={{
                  background: '#07090e',
                  border: `1px solid ${isSuccess ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`,
                  borderRadius: '8px',
                  padding: '14px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', flexWrap: 'wrap', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{
                      padding: '2px 8px',
                      borderRadius: '4px',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      background: log.method === 'POST' ? 'rgba(99, 102, 241, 0.2)' : 'rgba(6, 182, 212, 0.2)',
                      color: log.method === 'POST' ? 'var(--accent-primary)' : 'var(--accent-secondary)'
                    }}>
                      {log.method}
                    </span>
                    <span style={{ fontFamily: 'JetBrains Mono', fontSize: '0.9rem', fontWeight: 600 }}>
                      {log.url}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>{log.timestamp}</span>
                    <span style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      background: isSuccess ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                      color: isSuccess ? 'var(--accent-success)' : 'var(--accent-danger)'
                    }}>
                      {isSuccess ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
                      <span>HTTP {log.status}</span>
                    </span>
                  </div>
                </div>

                {/* Sent Headers */}
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '8px' }}>
                  <div style={{ color: 'var(--text-dim)', fontWeight: 600, marginBottom: '2px' }}>Request Headers:</div>
                  <div style={{ fontFamily: 'JetBrains Mono', background: 'rgba(255, 255, 255, 0.03)', padding: '6px 10px', borderRadius: '4px', overflowX: 'auto' }}>
                    {Object.entries(log.requestHeaders || {}).map(([k, v]) => (
                      <div key={k}>
                        <span style={{ color: 'var(--accent-secondary)' }}>{k}:</span>{' '}
                        <span style={{ color: k === 'Authorization' ? 'var(--accent-success)' : 'var(--text-main)' }}>
                          {v}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Response Payload */}
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '8px' }}>
                  <div style={{ color: 'var(--text-dim)', fontWeight: 600, marginBottom: '2px' }}>Response Body:</div>
                  <pre className="json-box" style={{ padding: '8px 10px', maxHeight: '150px', overflowY: 'auto' }}>
                    {JSON.stringify(log.response, null, 2)}
                  </pre>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
