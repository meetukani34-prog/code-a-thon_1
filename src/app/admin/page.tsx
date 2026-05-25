'use client';

import { useState, useEffect } from 'react';
import StatCard from '@/components/ui/StatCard';
import GlassCard from '@/components/ui/GlassCard';
import { createBrowserClient } from '@supabase/ssr';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
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
        
        if (roleLower !== 'admin' && roleLower !== 'superadmin') {
          router.push(`/${roleLower === 'superadmin' ? 'superadmin' : roleLower}`);
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

  if (!mounted || loadingRole || (role !== 'admin' && role !== 'superadmin')) {
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
          Admin Command Center
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: 'var(--text-sm)' }}>
          Welcome back, <strong style={{ color: 'var(--color-warning)' }}>{userName}</strong>. College-specific operational overview.
        </p>
      </div>

      <div className="grid-stats" style={{ marginBottom: 'var(--space-xl)' }}>
        <StatCard label="Total Identities" value={userCount} icon="👥" color="var(--accent-primary)" />
        <StatCard label="Faculty Enrolled" value={facultyCount} icon="👨‍🏫" color="var(--color-warning)" />
        <StatCard label="Students Enrolled" value={studentCount} icon="🎓" color="var(--color-success)" />
        <StatCard label="Active Alerts" value={3} icon="🔔" color="var(--color-danger)" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-lg)' }}>
        {/* Quick Actions for Admin */}
        <GlassCard padding="lg" hover={false}>
          <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 'var(--space-lg)' }}>
            Administrative Actions
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
            {[
              { label: 'Manage Identity', path: '/admin/users', icon: '👥', desc: 'College RBAC configuration' },
              { label: 'Manage Faculty/Students', path: '/admin/add-faculty', icon: '🛡️', desc: 'Provision users for your college' },
              { label: 'College Analytics', path: '/portal/analytics', icon: '◫', desc: 'Local telemetry' },
              { label: 'Local Placements', path: '/portal/placements', icon: '◈', desc: 'College placement monitoring' },
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

        {/* Local System Status */}
        <GlassCard padding="lg" hover={false}>
          <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 'var(--space-lg)' }}>
            College System Status
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
            {[
              { label: 'Local Databases', status: 'Operational', color: 'var(--color-success)' },
              { label: 'Face ID Hardware', status: '2 Offline', color: 'var(--color-warning)' },
              { label: 'Local Network', status: 'Stable', color: 'var(--color-success)' },
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
    </div>
  );
}
