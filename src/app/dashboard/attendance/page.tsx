'use client';

import { useState, useEffect } from 'react';
import GlassCard from '@/components/ui/GlassCard';

export default function AttendancePage() {
  const [alerts, setAlerts] = useState<any[]>([]);

  // Mock data for student history
  const attended = 42;
  const missed = 3;
  const total = attended + missed;
  const attendanceRate = ((attended / total) * 100).toFixed(1);

  return (
    <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
      <div style={{ marginBottom: 'var(--space-xl)' }}>
        <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, marginBottom: 'var(--space-xs)' }}>
          Attendance History
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: 'var(--text-sm)' }}>
          Track your course attendance and validate thresholds
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 'var(--space-lg)' }}>
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
