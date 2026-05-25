'use client';

import { useState, useEffect } from 'react';
import GlassCard from '@/components/ui/GlassCard';

export default function AnalyticsPage() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch('/api/analytics')
      .then(res => res.json())
      .then(setData);
  }, []);

  if (!data) return <div style={{ padding: 40, textAlign: 'center' }}>Loading Cosmological Data Warehouse...</div>;
  if (data.error) return <div style={{ padding: 40, textAlign: 'center', color: 'var(--color-danger)' }}>Failed to load Data Warehouse: {data.error}</div>;
  if (!data.national) return <div style={{ padding: 40, textAlign: 'center' }}>Initializing Cosmological Matrix...</div>;

  return (
    <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
      <div style={{ marginBottom: 'var(--space-xl)' }}>
        <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, marginBottom: 'var(--space-xs)' }}>
          Cosmological Data Warehouse
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: 'var(--text-sm)' }}>
          National-level anonymized operational signals (k-anonymity: {data.k_anonymity_level})
        </p>
      </div>

      {/* Global Rollup */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--space-lg)', marginBottom: 'var(--space-xl)' }}>
        {[
          { label: 'Total Network Students', value: data.national.totalStudents.toLocaleString(), icon: '🌐' },
          { label: 'Network Attendance', value: `${data.national.avgAttendance}%`, icon: '◎' },
          { label: 'Global Placement Rate', value: `${data.national.placementRate}%`, icon: '◈' },
          { label: 'Avg Friction Risk', value: data.national.avgFrictionRisk, icon: '⚡' },
        ].map((stat, i) => (
          <GlassCard key={i} padding="md">
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <p style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 8 }}>{stat.label}</p>
                <p style={{ fontSize: '1.5rem', fontWeight: 800, fontFamily: 'var(--font-mono)' }}>{stat.value}</p>
              </div>
              <div style={{ fontSize: '1.5rem', opacity: 0.5 }}>{stat.icon}</div>
            </div>
          </GlassCard>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-lg)' }}>
        {/* Regional Breakdown */}
        <GlassCard padding="lg" hover={false}>
          <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 'var(--space-lg)' }}>
            Regional Energy Signals
          </h3>
          
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--glass-border)', color: 'var(--text-muted)', textAlign: 'left' }}>
                <th style={{ padding: '12px 0' }}>Region</th>
                <th style={{ padding: '12px 0' }}>Nodes</th>
                <th style={{ padding: '12px 0' }}>Attendance</th>
                <th style={{ padding: '12px 0' }}>Placement</th>
                <th style={{ padding: '12px 0' }}>High Risk</th>
              </tr>
            </thead>
            <tbody>
              {data.regions.map((r: any, i: number) => (
                <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '12px 0', fontWeight: 600 }}>{r.region}</td>
                  <td style={{ padding: '12px 0' }}>{Math.round(r.metrics.student_count / 5000)}</td>
                  <td style={{ padding: '12px 0', color: 'var(--color-success)' }}>{r.metrics.avg_attendance.toFixed(1)}%</td>
                  <td style={{ padding: '12px 0', color: 'var(--accent-primary)' }}>{r.metrics.placement_rate.toFixed(1)}%</td>
                  <td style={{ padding: '12px 0', color: 'var(--color-danger)' }}>{r.metrics.high_risk_students.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </GlassCard>

        {/* Anonymity Notice */}
        <GlassCard padding="lg" hover={false} glow="info">
           <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 'var(--space-md)' }}>
            Identity Gravity Stripped
          </h3>
          <div style={{ padding: 'var(--space-md)', background: 'rgba(255,255,255,0.05)', borderRadius: 'var(--radius-md)', border: '1px solid var(--glass-border)' }}>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: 'var(--space-sm)' }}>
              All queries to the Cosmological Data Warehouse run through strict k-anonymity parameters.
            </p>
            <ul style={{ fontSize: '11px', color: 'var(--text-muted)', paddingLeft: 16 }}>
              <li>Minimum cluster size: {data.k_anonymity_level} identities</li>
              <li>PII fields automatically dropped at ingestion</li>
              <li>Spatial vectors generalized to regional level</li>
            </ul>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
