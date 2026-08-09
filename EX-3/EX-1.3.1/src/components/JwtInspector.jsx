import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { FileCode, AlertTriangle, ShieldAlert, Clock, CheckCircle, RefreshCw, Layers } from 'lucide-react';

export default function JwtInspector() {
  const { token, claims, tokenParts, tamperToken, fetchProfile } = useAuth();
  const [headerJson, setHeaderJson] = useState(null);
  const [secondsLeft, setSecondsLeft] = useState(null);
  const [tamperMessage, setTamperMessage] = useState(null);

  // Decode Header (base64url)
  useEffect(() => {
    if (tokenParts.header) {
      try {
        const decodedStr = atob(tokenParts.header.replace(/-/g, '+').replace(/_/g, '/'));
        setHeaderJson(JSON.parse(decodedStr));
      } catch (e) {
        setHeaderJson({ alg: 'HS256', typ: 'JWT' });
      }
    } else {
      setHeaderJson(null);
    }
  }, [tokenParts.header]);

  // Expiration timer countdown
  useEffect(() => {
    if (!claims || !claims.exp) {
      setSecondsLeft(null);
      return;
    }

    const interval = setInterval(() => {
      const remaining = claims.exp - Math.floor(Date.now() / 1000);
      setSecondsLeft(remaining > 0 ? remaining : 0);
    }, 1000);

    setSecondsLeft(claims.exp - Math.floor(Date.now() / 1000));

    return () => clearInterval(interval);
  }, [claims]);

  const handleTamperTest = async () => {
    tamperToken();
    setTamperMessage('Token string corrupted! Now testing server verification response...');
    const result = await fetchProfile();
    if (result && !result.success) {
      setTamperMessage(`Server Rejected Corrupted Token! Error: "${result.error}" (${result.message})`);
    }
  };

  if (!token) {
    return (
      <div className="glass-card" style={{ textAlign: 'center', padding: '40px' }}>
        <Layers size={48} style={{ color: 'var(--text-dim)', marginBottom: '16px' }} />
        <h3>No Active JWT Token</h3>
        <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>
          Please log in to generate and inspect a signed JSON Web Token.
        </p>
      </div>
    );
  }

  return (
    <div className="glass-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileCode size={24} style={{ color: 'var(--accent-primary)' }} />
            JWT Structure Visualizer &amp; Claims Inspector
          </h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            JWTs consist of 3 dot-separated Base64Url string parts: <span style={{ color: 'var(--jwt-header-color)' }}>Header</span>.<span style={{ color: 'var(--jwt-payload-color)' }}>Payload</span>.<span style={{ color: 'var(--jwt-signature-color)' }}>Signature</span>
          </p>
        </div>

        {secondsLeft !== null && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            borderRadius: '20px',
            background: secondsLeft > 60 ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
            border: `1px solid ${secondsLeft > 60 ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
            color: secondsLeft > 60 ? 'var(--accent-success)' : 'var(--accent-danger)',
            fontSize: '0.9rem',
            fontWeight: 600
          }}>
            <Clock size={16} />
            <span>Token Lifetime: {Math.floor(secondsLeft / 60)}m {secondsLeft % 60}s</span>
          </div>
        )}
      </div>

      {/* Raw Token Breakdown */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px' }}>
          Raw Base64 Encoded Signed JWT String:
        </div>
        <div className="token-container">
          <span className="token-header-part">{tokenParts.header}</span>
          <span className="token-dot">.</span>
          <span className="token-payload-part">{tokenParts.payload}</span>
          <span className="token-dot">.</span>
          <span className="token-signature-part">{tokenParts.signature}</span>
        </div>
      </div>

      {/* 3 Color Coded Sections */}
      <div className="grid-2" style={{ gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '24px' }}>
        {/* Section 1: Header */}
        <div style={{ background: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: '8px', padding: '16px' }}>
          <div style={{ color: 'var(--jwt-header-color)', fontWeight: 700, fontSize: '0.95rem', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span>1. HEADER</span>
            <span style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--text-dim)' }}>(Algorithm &amp; Token Type)</span>
          </div>
          <pre className="json-box" style={{ borderColor: 'rgba(239, 68, 68, 0.3)' }}>
            {JSON.stringify(headerJson || { alg: 'HS256', typ: 'JWT' }, null, 2)}
          </pre>
        </div>

        {/* Section 2: Payload */}
        <div style={{ background: 'rgba(168, 85, 247, 0.05)', border: '1px solid rgba(168, 85, 247, 0.2)', borderRadius: '8px', padding: '16px' }}>
          <div style={{ color: 'var(--jwt-payload-color)', fontWeight: 700, fontSize: '0.95rem', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span>2. PAYLOAD (Claims)</span>
            <span style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--text-dim)' }}>(User Data &amp; Timestamps)</span>
          </div>
          <pre className="json-box" style={{ borderColor: 'rgba(168, 85, 247, 0.3)' }}>
            {JSON.stringify(claims, null, 2)}
          </pre>
        </div>

        {/* Section 3: Signature */}
        <div style={{ background: 'rgba(6, 182, 212, 0.05)', border: '1px solid rgba(6, 182, 212, 0.2)', borderRadius: '8px', padding: '16px' }}>
          <div style={{ color: 'var(--jwt-signature-color)', fontWeight: 700, fontSize: '0.95rem', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span>3. VERIFY SIGNATURE</span>
            <span style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--text-dim)' }}>(HMAC SHA256)</span>
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
            HMACSHA256(<br/>
            &nbsp;&nbsp;base64UrlEncode(<span style={{ color: 'var(--jwt-header-color)' }}>Header</span>) + "." +<br/>
            &nbsp;&nbsp;base64UrlEncode(<span style={{ color: 'var(--jwt-payload-color)' }}>Payload</span>),<br/>
            &nbsp;&nbsp;<span style={{ color: 'var(--accent-warning)' }}>secret_key</span><br/>
            )
          </div>
          <div style={{ marginTop: '12px', fontSize: '0.75rem', color: 'var(--accent-success)', wordBreak: 'break-all', fontFamily: 'JetBrains Mono' }}>
            ✓ Signed with server secret key
          </div>
        </div>
      </div>

      {/* Security Demonstration: Tamper Token Test */}
      <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '20px', marginTop: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <ShieldAlert size={18} style={{ color: 'var(--accent-danger)' }} />
              Security Integrity Demonstration: Test Token Tampering
            </h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Corrupt the payload claims string to verify that the Express server detects signature mismatch and returns 401 Unauthorized.
            </p>
          </div>

          <button onClick={handleTamperTest} className="btn btn-danger" style={{ padding: '10px 16px', fontSize: '0.85rem' }}>
            <AlertTriangle size={16} />
            <span>Corrupt Token &amp; Test Server</span>
          </button>
        </div>

        {tamperMessage && (
          <div className="alert alert-error" style={{ marginTop: '14px' }}>
            <AlertTriangle size={18} />
            <div>{tamperMessage}</div>
          </div>
        )}
      </div>
    </div>
  );
}
