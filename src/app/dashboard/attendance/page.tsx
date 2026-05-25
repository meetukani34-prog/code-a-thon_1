'use client';

import { useState, useEffect } from 'react';
import GlassCard from '@/components/ui/GlassCard';
import { createClient } from '@/lib/supabase/client';

export default function AttendancePage() {
  const [role, setRole] = useState('student');
  const [alerts, setAlerts] = useState<any[]>([]);
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [captureStatus, setCaptureStatus] = useState<string | null>(null);

  useEffect(() => {
    const fetchRole = async () => {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setRole(session.user.user_metadata?.role || 'student');
      }
    };
    fetchRole();
  }, []);

  // Mock data for student history
  const attended = 42;
  const missed = 3;
  const total = attended + missed;
  const attendanceRate = ((attended / total) * 100).toFixed(1);

  const startBroadcast = () => {
    setIsBroadcasting(true);
    setTimeout(() => {
      setIsBroadcasting(false);
    }, 10000); // 10s broadcast
  };

  const captureAttendance = () => {
    setIsCapturing(true);
    setCaptureStatus('Scanning for Bluetooth Beacons...');
    setTimeout(() => {
      setCaptureStatus('Attendance Captured Successfully!');
      setIsCapturing(false);
      setTimeout(() => setCaptureStatus(null), 3000);
    }, 2000);
  };

  if (role === 'faculty') {
    return (
      <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
        <div style={{ marginBottom: 'var(--space-xl)' }}>
          <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, marginBottom: 'var(--space-xs)' }}>
            Faculty Attendance Portal
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 'var(--text-sm)' }}>
            Broadcast secure attendance token to students in proximity
          </p>
        </div>

        <GlassCard padding="lg" hover={false}>
          <div style={{ textAlign: 'center', padding: 'var(--space-2xl) 0' }}>
            <div style={{
              width: 120, height: 120, borderRadius: '50%', background: isBroadcasting ? 'var(--color-success)' : 'var(--glass-bg)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto var(--space-xl)',
              boxShadow: isBroadcasting ? '0 0 30px var(--color-success)' : 'none',
              transition: 'all 0.3s ease',
            }}>
              <i className={isBroadcasting ? "bx bx-broadcast" : "bx bx-bluetooth"} style={{ fontSize: '48px', color: isBroadcasting ? '#000' : 'var(--accent-primary)' }}></i>
            </div>
            <h2 style={{ fontSize: '24px', marginBottom: 'var(--space-md)' }}>
              {isBroadcasting ? 'Broadcasting Token...' : 'Session Inactive'}
            </h2>
            <button
              onClick={startBroadcast}
              disabled={isBroadcasting}
              style={{
                padding: '12px 32px',
                background: isBroadcasting ? 'transparent' : 'var(--accent-primary)',
                border: isBroadcasting ? '1px solid var(--glass-border)' : 'none',
                color: 'white',
                borderRadius: 'var(--radius-md)',
                fontWeight: 700,
                cursor: isBroadcasting ? 'not-allowed' : 'pointer',
              }}
            >
              {isBroadcasting ? 'Broadcasting (10s left)' : 'Start Attendance Broadcast'}
            </button>
          </div>
        </GlassCard>
      </div>
    );
  }

  // Student & Admin View
  return (
    <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
      <div style={{ marginBottom: 'var(--space-xl)' }}>
        <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, marginBottom: 'var(--space-xs)' }}>
          Attendance Tracking
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: 'var(--text-sm)' }}>
          Track your course attendance and validate thresholds
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 'var(--space-lg)' }}>
        
        {/* Capture Attendance */}
        {role === 'student' && (
          <GlassCard padding="lg" hover={false}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ fontSize: 'var(--text-md)', fontWeight: 700, marginBottom: '4px' }}>Capture Live Attendance</h3>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>Scan for faculty Bluetooth beacon to log your presence.</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
                {captureStatus && <span style={{ fontSize: '12px', color: 'var(--color-success)', fontWeight: 600 }}>{captureStatus}</span>}
                <button
                  onClick={captureAttendance}
                  disabled={isCapturing}
                  style={{
                    padding: '10px 24px',
                    background: isCapturing ? 'transparent' : 'var(--accent-primary)',
                    border: isCapturing ? '1px solid var(--accent-primary)' : 'none',
                    color: 'white',
                    borderRadius: 'var(--radius-md)',
                    fontWeight: 600,
                    cursor: isCapturing ? 'not-allowed' : 'pointer',
                  }}
                >
                  {isCapturing ? 'Scanning...' : 'Capture Attendance'}
                </button>
              </div>
            </div>
          </GlassCard>
        )}

        {/* Student History */}
        <GlassCard padding="lg" hover={false}>
          <h3 style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 'var(--space-xl)' }}>
            Semester Overview
          </h3>
          
          <div style={{ display: 'flex', gap: 'var(--space-3xl)', justifyContent: 'center', marginBottom: 'var(--space-2xl)' }}>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '4rem', fontWeight: 800, color: 'var(--color-success)', lineHeight: 1 }}>{attended}</p>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginTop: '8px' }}>Classes Attended</p>
            </div>
            
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '4rem', fontWeight: 800, color: 'var(--color-danger)', lineHeight: 1 }}>{missed}</p>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginTop: '8px' }}>Classes Missed</p>
            </div>
          </div>
          
          <div style={{
            background: 'rgba(0,0,0,0.2)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--glass-border)',
            padding: 'var(--space-md)',
            textAlign: 'center'
          }}>
            <p style={{ fontSize: '16px', color: 'var(--text-secondary)' }}>
              Overall Attendance Rate: <strong style={{ color: 'var(--color-success)', fontSize: '18px' }}>{attendanceRate}%</strong>
            </p>
          </div>
        </GlassCard>

        {/* Alerts */}
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
  );
}
