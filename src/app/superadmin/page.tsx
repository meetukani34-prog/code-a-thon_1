'use client';

import { useState, useEffect } from 'react';
import StatCard from '@/components/ui/StatCard';
import GlassCard from '@/components/ui/GlassCard';
import { createBrowserClient } from '@supabase/ssr';
import { useRouter } from 'next/navigation';

export default function SuperadminPage() {
  const [role, setRole] = useState('');
  const [userName, setUserName] = useState('');
  const [mounted, setMounted] = useState(false);
  const [loadingRole, setLoadingRole] = useState(true);
  const [userCount, setUserCount] = useState(0);
  const [adminCount, setAdminCount] = useState(0);
  const [facultyCount, setFacultyCount] = useState(0);
  const [studentCount, setStudentCount] = useState(0);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        const rawRole = data.session.user.user_metadata?.role || 'student';
        const roleLower = rawRole.toLowerCase();
        setRole(roleLower);
        setUserName(data.session.user.user_metadata?.full_name || data.session.user.email?.split('@')[0] || 'User');
        if (roleLower !== 'superadmin') {
          router.push(`/${roleLower}`);
        }
      } else {
        router.push('/');
      }
      setLoadingRole(false);
    });

    fetch('/api/admin/users').then(r => r.json()).then(data => {
      if (data.users) {
        setUserCount(data.users.length);
        setAdminCount(data.users.filter((u: any) => u.user_metadata?.role?.toLowerCase() === 'admin').length);
        setFacultyCount(data.users.filter((u: any) => u.user_metadata?.role?.toLowerCase() === 'faculty').length);
        setStudentCount(data.users.filter((u: any) => u.user_metadata?.role?.toLowerCase() === 'student' || !u.user_metadata?.role).length);
      }
    }).catch(() => {});
  }, [router]);

  if (!mounted || loadingRole || role !== 'superadmin') {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <div style={{ width: '40px', height: '40px', borderRadius: '50%', border: '3px solid var(--glass-border)', borderTopColor: 'var(--accent-primary)', animation: 'spin 1s linear infinite' }} />
      </div>
    );
  }

  return (
    <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
      <div style={{ marginBottom: 'var(--space-xl)' }}>
        <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, marginBottom: 'var(--space-xs)' }}>
          Superadmin Command Center
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: 'var(--text-sm)' }}>
          Welcome back, <strong style={{ color: 'var(--color-warning)' }}>{userName}</strong>. Global operational overview across all instances.
        </p>
      </div>

      <div className="grid-stats" style={{ marginBottom: 'var(--space-xl)' }}>
        <StatCard label="Total Nodes" value={userCount} icon="🌐" color="var(--accent-primary)" />
        <StatCard label="Global Admins" value={adminCount} icon="🛡️" color="var(--color-warning)" />
        <StatCard label="Active Students" value={studentCount} icon="🎓" color="var(--color-success)" />
        <StatCard label="System Health" value={100} suffix="%" icon="⚡" color="var(--color-success)" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-lg)' }}>
        <GlassCard padding="lg" hover={false}>
          <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 'var(--space-lg)' }}>
            Quick Actions
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
            {[
              { label: 'Provision Admin', path: '/superadmin/add-admin', icon: '👑', desc: 'Create new administrator accounts' },
              { label: 'Manage Identity', path: '/admin/users', icon: '👥', desc: 'Global RBAC configuration' },
              { label: 'Manage Placements', path: '/portal/placements', icon: '◈', desc: 'Global placement monitoring' },
              { label: 'System Analytics', path: '/portal/analytics', icon: '◫', desc: 'Platform-wide telemetry' },
            ].map(action => (
              <a key={action.path} href={action.path} style={{
                display: 'flex', alignItems: 'center', gap: 'var(--space-md)', padding: '12px 16px',
                background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-md)',
                textDecoration: 'none', color: 'inherit', transition: 'all 0.3s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--accent-primary)'; e.currentTarget.style.transform = 'translateX(4px)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--glass-border)'; e.currentTarget.style.transform = 'translateX(0)'; }}>
                <span style={{ fontSize: '20px' }}>{action.icon}</span>
                <div>
                  <p style={{ fontSize: '14px', fontWeight: 600 }}>{action.label}</p>
                  <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{action.desc}</p>
                </div>
              </a>
            ))}
          </div>
        </GlassCard>

        <GlassCard padding="lg" hover={false}>
          <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 'var(--space-lg)' }}>
            Global System Status
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
            {[
              { label: 'Authentication Services', status: 'Operational', color: 'var(--color-success)' },
              { label: 'Database Clusters', status: 'Operational', color: 'var(--color-success)' },
              { label: 'Face ID Verification', status: 'Operational', color: 'var(--color-success)' },
              { label: 'Event Message Bus', status: 'Active • 9 Nodes', color: 'var(--color-success)' },
              { label: 'Analytics Pipeline', status: 'Operational', color: 'var(--color-success)' },
            ].map(sys => (
              <div key={sys.label} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '12px 16px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)',
                borderRadius: 'var(--radius-md)',
              }}>
                <span style={{ fontSize: '14px', fontWeight: 600 }}>{sys.label}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: sys.color, boxShadow: `0 0 8px ${sys.color}` }} />
                  <span style={{ fontSize: '12px', color: sys.color, fontWeight: 600 }}>{sys.status}</span>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      <GlassCard padding="lg" hover={false} style={{ marginTop: 'var(--space-lg)' }}>
        <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 'var(--space-lg)' }}>
          Architecture Telemetry
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 'var(--space-md)' }}>
          {[
            { icon: '🔐', label: 'Auth Engine', value: 'ACTIVE', color: 'var(--color-success)' },
            { icon: '📡', label: 'Realtime WS', value: 'CONNECTED', color: 'var(--color-success)' },
            { icon: '🧬', label: 'Face ID', value: 'READY', color: 'var(--accent-primary)' },
            { icon: '📊', label: 'Analytics', value: 'STREAMING', color: 'var(--accent-secondary)' },
            { icon: '⚡', label: 'Event Bus', value: '9 NODES', color: 'var(--color-warning)' },
          ].map(sys => (
            <div key={sys.label} style={{
              textAlign: 'center', padding: 'var(--space-md)', borderRadius: 'var(--radius-md)',
              background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)',
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
