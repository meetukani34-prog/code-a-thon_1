'use client';

import { useState, useEffect } from 'react';
import StatCard from '@/components/ui/StatCard';
import GlassCard from '@/components/ui/GlassCard';
import { createBrowserClient } from '@supabase/ssr';

interface EventItem {
  id: string;
  event_type: string;
  severity: string;
  payload: Record<string, unknown>;
  source_service: string;
  created_at: string;
}

export default function DashboardPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [stats, setStats] = useState({ students: 0, attendance: 0, placements: 0 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetchData();
  }, []);

  async function fetchData() {
    try {
      // Temporarily mock data to prevent 404 console errors until we run the SQL migrations for event_log and public.users
      setEvents([]);
      setStats(prev => ({ ...prev, students: 243, attendance: 92.5, placements: 88.4 }));
    } catch (e) {
      console.error('Failed to fetch data:', e);
    }
  }

  const severityColors: Record<string, string> = {
    critical: 'var(--color-danger)',
    warning: 'var(--color-warning)',
    info: 'var(--color-info)',
    debug: 'var(--color-debug)',
  };

  if (!mounted) return null;

  return (
    <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
      {/* Header */}
      <div style={{ marginBottom: 'var(--space-xl)' }}>
        <h1 style={{
          fontSize: 'var(--text-2xl)',
          fontWeight: 800,
          marginBottom: 'var(--space-xs)',
        }}>
          Command Center
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: 'var(--text-sm)' }}>
          Real-time operational metrics across all campus nodes
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid-stats" style={{ marginBottom: 'var(--space-xl)' }}>
        <StatCard label="Active Students" value={stats.students} icon="◉" color="var(--accent-primary)" />
        <StatCard label="Avg Attendance" value={stats.attendance} suffix="%" icon="◎" color="var(--color-success)" decimals={1} />
        <StatCard label="Placement Rate" value={stats.placements} suffix="%" icon="◈" color="var(--accent-secondary)" decimals={1} />
        <StatCard label="Active Alerts" value={events.filter(e => e.severity === 'critical' || e.severity === 'warning').length} icon="⚡" color="var(--color-danger)" />
      </div>

      {/* Two Column Layout */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 'var(--space-lg)',
      }}>
        {/* Event Feed */}
        <GlassCard padding="lg" hover={false}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 'var(--space-lg)',
          }}>
            <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>
              Live Event Feed
            </h3>
            <div style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: 'var(--color-success)',
              boxShadow: '0 0 8px var(--color-success)',
              animation: 'pulseGlow 2s ease-in-out infinite',
            }} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
            {events.map((event, idx) => (
              <div
                key={event.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-md)',
                  padding: 'var(--space-sm) var(--space-md)',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(0,0,0,0.2)',
                  border: `1px solid ${severityColors[event.severity]}20`,
                  animation: `slideUp 0.3s ease-out ${idx * 0.1}s both`,
                }}
              >
                <div style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: severityColors[event.severity],
                  boxShadow: `0 0 8px ${severityColors[event.severity]}`,
                  flexShrink: 0,
                }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{
                    fontSize: 'var(--text-xs)',
                    fontFamily: 'var(--font-mono)',
                    color: severityColors[event.severity],
                    fontWeight: 600,
                  }}>
                    {event.event_type}
                  </p>
                  <p style={{
                    fontSize: '11px',
                    color: 'var(--text-muted)',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}>
                    {JSON.stringify(event.payload).slice(0, 80)}...
                  </p>
                </div>
                <span style={{
                  fontSize: '10px',
                  color: 'var(--text-muted)',
                  fontFamily: 'var(--font-mono)',
                  flexShrink: 0,
                }}>
                  {new Date(event.created_at).toLocaleTimeString()}
                </span>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Campus Nodes */}
        <GlassCard padding="lg" hover={false}>
          <h3 style={{
            fontSize: 'var(--text-sm)',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '1px',
            marginBottom: 'var(--space-lg)',
          }}>
            Campus Node Status
          </h3>

          {[
            { name: 'NIT Surathkal', code: 'NIT-SUR', region: 'South', students: 15800, status: 'online', health: 98 },
            { name: 'IIT Bombay', code: 'IIT-BOM', region: 'West', students: 18400, status: 'online', health: 95 },
            { name: 'DTU Delhi', code: 'DTU-DEL', region: 'North', students: 11000, status: 'online', health: 92 },
          ].map((campus, idx) => (
            <div
              key={campus.code}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: 'var(--space-md)',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(0,0,0,0.2)',
                border: '1px solid var(--glass-border)',
                marginBottom: 'var(--space-sm)',
                animation: `slideInLeft 0.3s ease-out ${idx * 0.1}s both`,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
                <div style={{
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  background: 'var(--color-success)',
                  boxShadow: '0 0 8px var(--color-success)',
                }} />
                <div>
                  <p style={{ fontSize: 'var(--text-sm)', fontWeight: 600 }}>{campus.name}</p>
                  <p style={{
                    fontSize: 'var(--text-xs)',
                    color: 'var(--text-muted)',
                    fontFamily: 'var(--font-mono)',
                  }}>
                    {campus.code} • {campus.region} • {campus.students.toLocaleString()} students
                  </p>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{
                  fontSize: 'var(--text-sm)',
                  fontWeight: 700,
                  color: 'var(--color-success)',
                  fontFamily: 'var(--font-mono)',
                }}>
                  {campus.health}%
                </p>
                <p style={{
                  fontSize: '10px',
                  color: 'var(--text-muted)',
                  textTransform: 'uppercase',
                }}>Health</p>
              </div>
            </div>
          ))}
        </GlassCard>
      </div>

      {/* System Architecture Overview */}
      <GlassCard padding="lg" hover={false} className="animate-slide-up" >
        <h3 style={{
          fontSize: 'var(--text-sm)',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '1px',
          marginBottom: 'var(--space-lg)',
          marginTop: 'var(--space-lg)',
        }}>
          Architecture Telemetry
        </h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          gap: 'var(--space-md)',
        }}>
          {[
            { label: 'Event Bus', value: 'Active', color: 'var(--color-success)', icon: '⚡' },
            { label: 'CSP Solver', value: 'Idle', color: 'var(--accent-primary)', icon: '▦' },
            { label: 'Risk Engine', value: 'Processing', color: 'var(--color-warning)', icon: '◈' },
            { label: 'Encryption', value: 'AES-256', color: 'var(--accent-tertiary)', icon: '🔒' },
            { label: 'RBAC', value: '6 Roles', color: 'var(--accent-secondary)', icon: '🛡️' },
          ].map(sys => (
            <div key={sys.label} style={{
              textAlign: 'center',
              padding: 'var(--space-md)',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(0,0,0,0.2)',
              border: '1px solid var(--glass-border)',
            }}>
              <p style={{ fontSize: '1.5rem', marginBottom: 'var(--space-xs)' }}>{sys.icon}</p>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginBottom: 2 }}>{sys.label}</p>
              <p style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: sys.color, fontFamily: 'var(--font-mono)' }}>{sys.value}</p>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}
