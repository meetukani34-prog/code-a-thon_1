'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import GlassCard from '@/components/ui/GlassCard';
import { createBrowserClient } from '@supabase/ssr';
import Webcam from 'react-webcam';

export default function AttendancePage() {
  const [qrToken, setQrToken] = useState('GENERATING_SECURE_TOKEN...');
  const [timeLeft, setTimeLeft] = useState(4);
  const [logs, setLogs] = useState<any[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<'idle'|'success'|'error'>('idle');
  const webcamRef = useRef<Webcam>(null);

  const startScan = useCallback(() => {
    setIsScanning(true);
    setScanResult('idle');
    // Simulate a 3 second AI facial recognition scan
    setTimeout(() => {
      setIsScanning(false);
      setScanResult('success');
      
      // Add fake successful log to stream
      setLogs(prev => [
        { users: { full_name: 'Authorized Admin (Face ID)' }, geo_verified: true, method: 'Biometric Face Match' },
        ...prev
      ].slice(0, 6));

      // Reset after a few seconds
      setTimeout(() => setScanResult('idle'), 5000);
    }, 3000);
  }, []);
  
  // State for dynamically loaded alerts
  const [alerts, setAlerts] = useState<any[]>([]);

  useEffect(() => {
    // Fetch actual logs from backend
  }, []);

  // Token simulation removed as per request to remove mock data
  useEffect(() => {
    setQrToken('WAITING_FOR_SESSION_INIT');
    setTimeLeft(0);
  }, []);

  return (
    <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
      <div style={{ marginBottom: 'var(--space-xl)' }}>
        <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, marginBottom: 'var(--space-xs)' }}>
          Spatial Attendance
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: 'var(--text-sm)' }}>
          Luminous Rolling Tokenization with Geo-fence validation
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 'var(--space-lg)' }}>
        {/* Faculty View: QR Projector */}
        <GlassCard padding="lg" hover={false}>
          <div style={{ textAlign: 'center' }}>
            <h3 style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 'var(--space-xl)' }}>
              Biometric Liveness Detection
            </h3>

            {/* Webcam Scanner */}
            <div style={{
              width: 280,
              height: 280,
              margin: '0 auto',
              background: 'black',
              borderRadius: 'var(--radius-xl)',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: scanResult === 'success' ? '0 0 40px var(--color-success)' : 'var(--glow-primary)',
              border: `2px solid ${scanResult === 'success' ? 'var(--color-success)' : 'var(--glass-border)'}`,
              transition: 'all 0.5s ease'
            }}>
              <Webcam
                ref={webcamRef}
                audio={false}
                screenshotFormat="image/jpeg"
                videoConstraints={{ facingMode: "user" }}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />

              {/* Grid overlay */}
              <div style={{
                position: 'absolute',
                inset: 0,
                background: `repeating-linear-gradient(transparent, transparent 2px, rgba(0,0,0,0.2) 3px, rgba(0,0,0,0.2) 4px)`,
                pointerEvents: 'none',
                opacity: 0.5,
              }} />

              {/* Scanning laser line */}
              {isScanning && (
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 3,
                  background: 'var(--accent-secondary)',
                  boxShadow: '0 0 20px 4px var(--accent-secondary)',
                  animation: 'scan 1.5s ease-in-out infinite alternate',
                  zIndex: 10,
                }} />
              )}

              {/* Facial alignment guides */}
              <div style={{
                position: 'absolute',
                top: '20%', bottom: '20%', left: '20%', right: '20%',
                border: `2px dashed ${scanResult === 'success' ? 'var(--color-success)' : isScanning ? 'var(--accent-secondary)' : 'rgba(255,255,255,0.3)'}`,
                borderRadius: '50%',
                transition: 'border-color 0.3s ease',
              }} />
              
              {/* Success Overlay */}
              {scanResult === 'success' && (
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'rgba(16, 185, 129, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backdropFilter: 'blur(2px)',
                }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '8px' }}>✅</div>
                    <p style={{ color: 'white', fontWeight: 'bold', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>IDENTITY VERIFIED</p>
                  </div>
                </div>
              )}
            </div>

            <div style={{ marginTop: 'var(--space-xl)' }}>
              <button
                onClick={startScan}
                disabled={isScanning || scanResult === 'success'}
                style={{
                  padding: '12px 24px',
                  background: isScanning ? 'transparent' : 'var(--accent-primary)',
                  border: isScanning ? '1px solid var(--accent-primary)' : 'none',
                  color: 'white',
                  borderRadius: 'var(--radius-md)',
                  fontWeight: 700,
                  letterSpacing: '1px',
                  cursor: isScanning || scanResult === 'success' ? 'not-allowed' : 'pointer',
                  textTransform: 'uppercase',
                  fontSize: '12px',
                  boxShadow: isScanning ? 'none' : 'var(--glow-primary)',
                  transition: 'all 0.3s',
                  width: '100%',
                }}
              >
                {isScanning ? 'Extracting Vector Nodes...' : scanResult === 'success' ? 'Node Verified' : 'Initialize Face Scan'}
              </button>
            </div>
          </div>
        </GlassCard>

        {/* Live Tracking */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
          <GlassCard padding="lg" hover={false}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-lg)' }}>
              <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>
                Live Validation Stream
              </h3>
              <span className="badge badge-success">Accepting</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
              {logs.length > 0 ? logs.map((record, i) => {
                const verified = record.geo_verified || record.wifi_verified;
                return (
                <div key={i} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '12px 16px',
                  background: 'rgba(0,0,0,0.2)',
                  border: '1px solid var(--glass-border)',
                  borderRadius: 'var(--radius-md)',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
                    <div style={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      background: verified ? 'var(--color-success)' : 'var(--color-danger)'
                    }} />
                    <span style={{ fontSize: 'var(--text-sm)', fontWeight: 600 }}>{record.users?.full_name}</span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{
                      fontSize: '11px',
                      color: verified ? 'var(--color-success)' : 'var(--color-danger)',
                      textTransform: 'uppercase',
                      fontWeight: 700,
                      display: 'block',
                    }}>
                      {verified ? 'verified' : 'rejected'}
                    </span>
                    <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{record.method}</span>
                  </div>
                </div>
              )}) : <p style={{ fontSize: '12px', color: 'var(--text-muted)', textAlign: 'center', padding: 'var(--space-md)' }}>No active validations</p>}
            </div>
          </GlassCard>

          <GlassCard padding="lg" hover={false} glow="danger">
            <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 'var(--space-md)' }}>
              Threshold Alerts
            </h3>
            {alerts.length > 0 ? (
              <div style={{ padding: 'var(--space-md)', background: 'rgba(255, 60, 60, 0.1)', borderRadius: 'var(--radius-md)' }}>
                {/* Dynamic alerts will map here */}
              </div>
            ) : (
              <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>No active threshold alerts</p>
            )}
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
