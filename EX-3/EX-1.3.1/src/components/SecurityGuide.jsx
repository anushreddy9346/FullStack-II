import React from 'react';
import { BookOpen, ShieldCheck, Lock, Cpu, Server, Check, X, Info } from 'lucide-react';

export default function SecurityGuide() {
  return (
    <div className="glass-card">
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.3rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <BookOpen size={24} style={{ color: 'var(--accent-primary)' }} />
          JWT Authentication & Session Management Theory (EX-1.3.1)
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '4px' }}>
          Essential concepts for understanding stateless token-based security in modern web applications.
        </p>
      </div>

      <div className="grid-2" style={{ marginBottom: '24px' }}>
        {/* Session vs JWT Comparison */}
        <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--accent-secondary)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Server size={18} /> Traditional Session-Based Auth
          </h3>
          <ul style={{ fontSize: '0.875rem', color: 'var(--text-muted)', paddingLeft: '18px', lineHeight: '1.7' }}>
            <li><strong>Stateful:</strong> Server stores session records in memory or database (Redis/SQL).</li>
            <li><strong>Scalability Bottleneck:</strong> Distributed servers require centralized session replication.</li>
            <li><strong>Identifier:</strong> Sends Session ID in a Cookie (e.g. <code>JSESSIONID</code>).</li>
          </ul>
        </div>

        <div style={{ background: 'rgba(99, 102, 241, 0.05)', padding: '16px', borderRadius: '8px', border: '1px solid rgba(99, 102, 241, 0.2)' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--accent-primary)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Cpu size={18} /> JWT Token-Based Auth (Stateless)
          </h3>
          <ul style={{ fontSize: '0.875rem', color: 'var(--text-muted)', paddingLeft: '18px', lineHeight: '1.7' }}>
            <li><strong>Stateless:</strong> Server stores NO session data. Token holds self-contained user claims.</li>
            <li><strong>High Scalability:</strong> Any backend server with the Secret Key can instantly verify the token signature.</li>
            <li><strong>Identifier:</strong> Sends token in HTTP Header (<code>Authorization: Bearer &lt;token&gt;</code>).</li>
          </ul>
        </div>
      </div>

      {/* Storage Comparison */}
      <h3 style={{ fontSize: '1.05rem', fontWeight: 600, marginBottom: '12px' }}>
        Client Token Storage Options & Security Trade-offs
      </h3>

      <div style={{ overflowX: 'auto', marginBottom: '24px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-main)' }}>
              <th style={{ padding: '10px' }}>Storage Method</th>
              <th style={{ padding: '10px' }}>Persistence</th>
              <th style={{ padding: '10px' }}>XSS Risk</th>
              <th style={{ padding: '10px' }}>CSRF Risk</th>
              <th style={{ padding: '10px' }}>Best Used For</th>
            </tr>
          </thead>
          <tbody style={{ color: 'var(--text-muted)' }}>
            <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
              <td style={{ padding: '10px', color: 'var(--accent-secondary)', fontWeight: 600 }}>localStorage</td>
              <td style={{ padding: '10px' }}>Persists across tabs &amp; restarts</td>
              <td style={{ padding: '10px', color: 'var(--accent-danger)' }}>Vulnerable (JS readable)</td>
              <td style={{ padding: '10px', color: 'var(--accent-success)' }}>Immune</td>
              <td style={{ padding: '10px' }}>Lab demos, Mobile Apps, SPAs</td>
            </tr>
            <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
              <td style={{ padding: '10px', color: 'var(--accent-warning)', fontWeight: 600 }}>sessionStorage</td>
              <td style={{ padding: '10px' }}>Cleared when tab is closed</td>
              <td style={{ padding: '10px', color: 'var(--accent-danger)' }}>Vulnerable (JS readable)</td>
              <td style={{ padding: '10px', color: 'var(--accent-success)' }}>Immune</td>
              <td style={{ padding: '10px' }}>Single-tab banking sessions</td>
            </tr>
            <tr>
              <td style={{ padding: '10px', color: 'var(--accent-success)', fontWeight: 600 }}>HttpOnly Cookie</td>
              <td style={{ padding: '10px' }}>Managed by browser cookies</td>
              <td style={{ padding: '10px', color: 'var(--accent-success)' }}>Protected (JS cannot read)</td>
              <td style={{ padding: '10px', color: 'var(--accent-warning)' }}>Requires SameSite &amp; CSRF tokens</td>
              <td style={{ padding: '10px' }}>Production Enterprise Web Apps</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="alert alert-info">
        <Info size={20} style={{ flexShrink: 0 }} />
        <div>
          <strong>Learning Takeaway:</strong> JWT tokens provide signature verification so the server knows the token hasn't been altered. However, JWT payloads are Base64 encoded (NOT encrypted), so confidential passwords or secret keys should NEVER be placed in token payload claims!
        </div>
      </div>
    </div>
  );
}
