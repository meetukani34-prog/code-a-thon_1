'use client';

import { useState, useEffect } from 'react';
import StatCard from '@/components/ui/StatCard';
import GlassCard from '@/components/ui/GlassCard';
import { createBrowserClient } from '@supabase/ssr';
import { useRouter } from 'next/navigation';

export default function FacultyPage() {
  const [role, setRole] = useState('');
  const [userName, setUserName] = useState('');
  const [mounted, setMounted] = useState(false);
  const [loadingRole, setLoadingRole] = useState(true);
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
        
        if (roleLower !== 'faculty' && roleLower !== 'admin' && roleLower !== 'superadmin') {
          router.push(`/${roleLower === 'superadmin' ? 'superadmin' : roleLower}`);
        }
      } else {
        router.push('/');
      }
      setLoadingRole(false);
    });
  }, [router]);

  if (!mounted || loadingRole || (role !== 'faculty' && role !== 'admin' && role !== 'superadmin')) {
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
          Faculty Dashboard
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: 'var(--text-sm)' }}>
          Welcome, <strong style={{ color: 'var(--accent-primary)' }}>{userName}</strong>. Manage your classes and students.
        </p>
      </div>

      <div className="grid-stats" style={{ marginBottom: 'var(--space-xl)' }}>
        <StatCard label="Classes Today" value={3} icon="📚" color="var(--accent-primary)" />
        <StatCard label="Avg Attendance" value={85} suffix="%" icon="📈" color="var(--color-success)" />
        <StatCard label="Pending Assignments" value={12} icon="⏳" color="var(--color-warning)" />
        <StatCard label="Total Students" value={145} icon="👥" color="var(--accent-secondary)" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-lg)' }}>
        {/* Today's Schedule */}
        <GlassCard padding="lg" hover={false}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-lg)' }}>
            <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>
              Today's Classes
            </h3>
            <a href="/portal/attendance" style={{ 
              background: 'transparent', border: 'none', color: 'var(--accent-primary)', 
              fontSize: 'var(--text-xs)', fontWeight: 600, cursor: 'pointer', textDecoration: 'none' 
            }}>
              View Full Schedule →
            </a>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
            {[
              { time: '09:00 AM', subject: 'Data Structures (CS-301)', location: 'Room 402', students: 45 },
              { time: '11:30 AM', subject: 'Algorithms Lab (CS-302)', location: 'Lab 2', students: 30 },
              { time: '02:00 PM', subject: 'Machine Learning (CS-401)', location: 'Room 305', students: 50 },
            ].map((cls, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 'var(--space-md)',
                padding: '12px 16px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)',
                borderRadius: 'var(--radius-md)',
              }}>
                <div style={{ width: 80, fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--accent-primary)' }}>
                  {cls.time}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: '14px', fontWeight: 600 }}>{cls.subject}</p>
                  <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{cls.location} • {cls.students} Students</p>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Quick Actions */}
        <GlassCard padding="lg" hover={false}>
          <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 'var(--space-lg)' }}>
            Quick Actions
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)' }}>
            {[
              { label: 'Mark Attendance', icon: '📝', color: 'var(--accent-primary)', path: '/portal/attendance' },
              { label: 'Upload Grades', icon: '📊', color: 'var(--color-success)', path: '/portal/exams' },
              { label: 'Add Assignment', icon: '📎', color: 'var(--color-warning)', path: '/portal/attendance' },
              { label: 'Message Students', icon: '💬', color: 'var(--accent-secondary)', path: '/portal/attendance' },
            ].map(action => (
              <a key={action.label} href={action.path} style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                padding: 'var(--space-lg)', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)',
                borderRadius: 'var(--radius-md)', textDecoration: 'none', color: 'inherit',
                transition: 'all 0.3s', cursor: 'pointer', gap: 'var(--space-sm)'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = action.color; e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--glass-border)'; e.currentTarget.style.transform = 'translateY(0)'; }}>
                <span style={{ fontSize: '24px' }}>{action.icon}</span>
                <span style={{ fontSize: '12px', fontWeight: 600, textAlign: 'center' }}>{action.label}</span>
              </a>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
