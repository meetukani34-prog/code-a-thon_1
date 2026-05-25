'use client';

import { useState, useEffect } from 'react';
import GlassCard from '@/components/ui/GlassCard';
import { createBrowserClient } from '@supabase/ssr';

export default function AttendancePage() {
  const [qrToken, setQrToken] = useState('GENERATING_SECURE_TOKEN...');
  const [timeLeft, setTimeLeft] = useState(4);
  const [logs, setLogs] = useState<any[]>([]);

  useEffect(() => {
    // Mock initial data until SQL migration for attendance table is run
    setLogs([
      { users: { full_name: 'Anjali Desai' }, geo_verified: true, method: 'QR + GeoFencing' },
      { users: { full_name: 'Rahul Sharma' }, geo_verified: false, method: 'Location Mismatch' }
    ]);

    // Mock real-time validations streaming in
    const interval = setInterval(() => {
      const isVerified = Math.random() > 0.2; // 80% chance of success
      const methods = ['QR + GeoFencing', 'BLE Beacon', 'Campus WiFi'];
      const failMethods = ['GPS Spoof Detected', 'IP Mismatch', 'Token Expired'];
      
      const newLog = {
        users: { full_name: `Node ${Math.floor(Math.random() * 9000) + 1000}` },
        geo_verified: isVerified,
        method: isVerified ? methods[Math.floor(Math.random() * methods.length)] : failMethods[Math.floor(Math.random() * failMethods.length)]
      };
      
      setLogs(prev => [newLog, ...prev].slice(0, 6));
    }, 10000);
      
    return () => clearInterval(interval);
  }, []);

  // Simulate rolling QR token (4s rotation)
  useEffect(() => {
    const generateToken = () => {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      let result = '';
      for (let i = 0; i < 32; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return `TOK_${result}`;
    };

    setQrToken(generateToken());
    setTimeLeft(4);

    const tokenInterval = setInterval(() => {
      setQrToken(generateToken());
      setTimeLeft(4);
    }, 4000);

    const countdownInterval = setInterval(() => {
      setTimeLeft(prev => Math.max(0, prev - 0.1));
    }, 100);

    return () => {
      clearInterval(tokenInterval);
      clearInterval(countdownInterval);
    };
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
              Active Session Token
            </h3>

            {/* Fake QR visualizer */}
            <div style={{
              width: 240,
              height: 240,
              margin: '0 auto',
              background: 'white',
              padding: 20,
              borderRadius: 'var(--radius-lg)',
              position: 'relative',
              boxShadow: 'var(--glow-primary)',
            }}>
              <div style={{
                width: '100%',
                height: '100%',
                background: `repeating-linear-gradient(45deg, var(--bg-primary) 0, var(--bg-primary) 10px, transparent 10px, transparent 20px),
                             repeating-linear-gradient(-45deg, var(--bg-primary) 0, var(--bg-primary) 10px, transparent 10px, transparent 20px)`,
                opacity: 0.8,
              }} />
              {/* Scanning laser line */}
              <div style={{
                position: 'absolute',
                top: '50%',
                left: 10,
                right: 10,
                height: 2,
                background: 'var(--color-danger)',
                boxShadow: 'var(--glow-danger)',
                animation: 'float 2s ease-in-out infinite',
              }} />
            </div>

            <div style={{ marginTop: 'var(--space-xl)' }}>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--accent-primary)', wordBreak: 'break-all' }}>
                {qrToken}
              </p>
            </div>

            {/* Progress bar */}
            <div style={{ marginTop: 'var(--space-md)', background: 'rgba(255,255,255,0.1)', height: 4, borderRadius: 2, overflow: 'hidden' }}>
              <div style={{
                height: '100%',
                background: timeLeft < 1.5 ? 'var(--color-danger)' : 'var(--accent-primary)',
                width: `${(timeLeft / 4) * 100}%`,
                transition: 'width 0.1s linear, background-color 0.3s ease',
              }} />
            </div>
            <p style={{ marginTop: 'var(--space-xs)', fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
              Rotates in {timeLeft.toFixed(1)}s
            </p>
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
            <div style={{ padding: 'var(--space-md)', background: 'rgba(255, 60, 60, 0.1)', borderRadius: 'var(--radius-md)' }}>
              <p style={{ fontSize: '13px', color: 'var(--text-primary)', marginBottom: 8 }}>
                <strong>Rahul Sharma</strong> (CS-204) dropped to 68.5%
              </p>
              <p style={{ fontSize: '11px', color: 'var(--color-danger)' }}>
                Cascading Ripple executed: Placements frozen. Warden notified.
              </p>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
