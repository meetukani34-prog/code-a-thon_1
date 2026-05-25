'use client';

import { useState, useEffect } from 'react';
import StatCard from '@/components/ui/StatCard';
import GlassCard from '@/components/ui/GlassCard';
import NeuralBackground from '@/components/ui/flow-field-background';
import { createBrowserClient } from '@supabase/ssr';

export default function DashboardPage() {
  const [role, setRole] = useState('');
  const [userName, setUserName] = useState('');
  const [mounted, setMounted] = useState(false);
  const [loadingRole, setLoadingRole] = useState(true);
  const [userCount, setUserCount] = useState(0);
  const [adminCount, setAdminCount] = useState(0);
  const [facultyCount, setFacultyCount] = useState(0);
  const [studentCount, setStudentCount] = useState(0);

  useEffect(() => {
    setMounted(true);
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        const rawRole = data.session.user.user_metadata?.role || 'student';
        setRole(rawRole.toLowerCase());
        setUserName(data.session.user.user_metadata?.full_name || data.session.user.email?.split('@')[0] || 'User');
      } else {
        setRole('student');
      }
      setLoadingRole(false);
    });

    // Fetch user stats for admin
    fetch('/api/admin/users').then(r => r.json()).then(data => {
      if (data.users) {
        setUserCount(data.users.length);
        setAdminCount(data.users.filter((u: any) => u.user_metadata?.role?.toLowerCase() === 'admin').length);
        setFacultyCount(data.users.filter((u: any) => u.user_metadata?.role?.toLowerCase() === 'faculty').length);
        setStudentCount(data.users.filter((u: any) => u.user_metadata?.role?.toLowerCase() === 'student' || !u.user_metadata?.role).length);
      }
    }).catch(() => {});
  }, []);

  if (!mounted || loadingRole) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <div style={{ width: '40px', height: '40px', borderRadius: '50%', border: '3px solid var(--glass-border)', borderTopColor: 'var(--accent-primary)', animation: 'spin 1s linear infinite' }} />
      </div>
    );
  }

  // ==================== SUPERADMIN DASHBOARD ====================
  if (role === 'superadmin') {
    if (typeof window !== 'undefined') {
      window.location.href = '/superadmin';
    }
    return null;
  }

  // ==================== ADMIN DASHBOARD ====================
  if (role === 'admin') {
    return (
      <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
        <div style={{ marginBottom: 'var(--space-xl)' }}>
          <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, marginBottom: 'var(--space-xs)' }}>
            Admin Command Center
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 'var(--text-sm)' }}>
            Welcome back, <strong style={{ color: 'var(--color-warning)' }}>{userName}</strong>. Real-time operational metrics across all campus nodes.
          </p>
        </div>

        {/* Admin Stat Cards */}
        <div className="grid-stats" style={{ marginBottom: 'var(--space-xl)' }}>
          <StatCard label="Total Users" value={userCount} icon="👥" color="var(--accent-primary)" />
          <StatCard label="Admin Accounts" value={adminCount} icon="🛡️" color="var(--color-warning)" />
          <StatCard label="Faculty Members" value={facultyCount} icon="👩‍🏫" color="var(--accent-secondary)" />
          <StatCard label="Students Enrolled" value={studentCount} icon="🎓" color="var(--color-success)" />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-lg)' }}>
          {/* Quick Actions */}
          <GlassCard padding="lg" hover={false}>
            <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 'var(--space-lg)' }}>
              Quick Actions
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
              {[
                { label: 'Manage Users', path: '/dashboard/admin/add-faculty', icon: '🛡️', desc: 'Add admin or faculty accounts' },
                { label: 'Identity (RBAC)', path: '/dashboard/admin/users', icon: '👥', desc: 'Approve roles & permissions' },
                { label: 'Mark Attendance', path: '/dashboard/attendance', icon: '◎', desc: 'Biometric face scan attendance' },
                { label: 'Manage Placements', path: '/dashboard/placements', icon: '◈', desc: 'Freeze/unfreeze student placements' },
                { label: 'Events Portal', path: '/dashboard/events', icon: '★', desc: 'Create & manage campus events' },
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

          {/* System Status */}
          <GlassCard padding="lg" hover={false}>
            <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 'var(--space-lg)' }}>
              System Status
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
              {[
                { label: 'Supabase Auth', status: 'Operational', color: 'var(--color-success)' },
                { label: 'Realtime DB', status: 'Operational', color: 'var(--color-success)' },
                { label: 'Face ID Module', status: 'Operational', color: 'var(--color-success)' },
                { label: 'Placement Engine', status: 'Operational', color: 'var(--color-success)' },
                { label: 'Event Bus', status: 'Active • 3 Nodes', color: 'var(--color-success)' },
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

        {/* Architecture Telemetry */}
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
              { icon: '⚡', label: 'Event Bus', value: '3 NODES', color: 'var(--color-warning)' },
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

  // ==================== FACULTY DASHBOARD ====================
  if (role === 'faculty') {
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

        {/* Faculty Stat Cards */}
        <div className="grid-stats" style={{ marginBottom: 'var(--space-xl)' }}>
          <StatCard label="Classes Today" value={3} icon="📅" color="var(--accent-secondary)" />
          <StatCard label="Avg Attendance" value={88.5} suffix="%" icon="◎" color="var(--color-success)" decimals={1} />
          <StatCard label="Pending Assignments" value={12} icon="✎" color="var(--color-warning)" />
          <StatCard label="Messages" value={5} icon="✉️" color="var(--accent-primary)" />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-lg)' }}>
          {/* Today's Classes */}
          <GlassCard padding="lg" hover={false}>
            <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 'var(--space-lg)' }}>
              Today's Classes
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
              {[
                { time: '09:00 AM', subject: 'Data Structures', room: 'CS-301', students: 60 },
                { time: '11:00 AM', subject: 'Algorithms Lab', room: 'Lab-1', students: 30 },
                { time: '02:00 PM', subject: 'Mentoring Session', room: 'Cabin 4', students: 5 },
              ].map((cls, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: 'var(--space-md)', padding: '12px 16px',
                  background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-md)',
                }}>
                  <span style={{ fontSize: '12px', fontFamily: 'var(--font-mono)', color: 'var(--accent-primary)', fontWeight: 700, minWidth: '80px' }}>{cls.time}</span>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: '14px', fontWeight: 600 }}>{cls.subject}</p>
                    <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{cls.room} • {cls.students} Students</p>
                  </div>
                  <button style={{
                    padding: '6px 12px', background: 'var(--accent-primary)', color: 'white', border: 'none', borderRadius: '4px', fontSize: '12px', cursor: 'pointer'
                  }}>Start</button>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Quick Actions */}
          <GlassCard padding="lg" hover={false}>
            <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 'var(--space-lg)' }}>
              Quick Actions
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
              {[
                { label: 'Mark Attendance', path: '/dashboard/attendance', icon: '◎', desc: 'Initialize class attendance' },
                { label: 'Exam Grading', path: '/dashboard/exams', icon: '✎', desc: 'Update student marks' },
                { label: 'Events', path: '/dashboard/events', icon: '★', desc: 'View upcoming events' },
                { label: 'Class Analytics', path: '/dashboard/analytics', icon: '▦', desc: 'Student performance metrics' },
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
        </div>
      </div>
    );
  }

  // ==================== STUDENT DASHBOARD ====================
  return (
    <>
      {/* 3D Fluid Canvas Background */}
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: -1 }}>
        <NeuralBackground 
          color="#818cf8" 
          trailOpacity={0.1} 
          speed={0.8}
        />
      </div>

      <div className="content-front" style={{ animation: 'fadeIn 0.5s ease-out' }}>
        {/* Header */}
        <div style={{ marginBottom: 'var(--space-xl)', textAlign: 'center', marginTop: 'var(--space-xl)' }}>
          <h1 style={{
            fontFamily: '"Playfair Display", serif',
            fontSize: '4rem',
            fontWeight: 400,
            letterSpacing: '-1px',
            marginBottom: 'var(--space-sm)',
            textShadow: '0 10px 30px rgba(0,0,0,0.5)'
          }}>
            Welcome to Campus
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', letterSpacing: '0.5px' }}>
            A <span style={{ fontStyle: 'italic', color: '#fff' }}>Creative</span> hub for your academics.
          </p>
          
          <div style={{ marginTop: 'var(--space-xl)', display: 'flex', gap: 'var(--space-md)', justifyContent: 'center' }}>
            <button style={{
              background: '#fff', color: '#000', padding: '12px 32px', borderRadius: '30px', 
              fontWeight: 500, fontSize: '0.9rem', border: 'none', cursor: 'pointer',
              transition: 'transform 0.2s', boxShadow: '0 4px 15px rgba(255,255,255,0.1)'
            }} onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
              See Schedule
            </button>
            <button style={{
              background: 'transparent', color: '#fff', padding: '12px 32px', borderRadius: '30px', 
              fontWeight: 500, fontSize: '0.9rem', border: '1px solid rgba(255,255,255,0.2)', cursor: 'pointer',
              transition: 'all 0.2s'
            }} onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.transform = 'scale(1.05)'; }} onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.transform = 'scale(1)'; }}>
              Reach out...
            </button>
          </div>
        </div>

        <div style={{
          textAlign: 'center', margin: '4rem 0', color: 'rgba(255,255,255,0.3)',
          fontSize: '0.7rem', letterSpacing: '4px', textTransform: 'uppercase',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px'
        }}>
          <span>Scroll</span>
          <div style={{ width: '1px', height: '30px', background: 'rgba(255,255,255,0.3)' }}></div>
        </div>

        {/* Student Stat Cards */}
        <div className="grid-stats" style={{ marginBottom: 'var(--space-xl)' }}>
          <StatCard label="Attendance Rate" value={93.3} suffix="%" icon="◎" color="var(--color-success)" decimals={1} />
          <StatCard label="CGPA" value={8.4} icon="📊" color="var(--accent-primary)" decimals={1} />
          <StatCard label="Classes Today" value={4} icon="📅" color="var(--accent-secondary)" />
          <StatCard label="Placement Status" value="Active" icon="◈" color="var(--color-success)" />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-lg)' }}>
          {/* Today's Schedule */}
          <GlassCard padding="lg" hover={false}>
            <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 'var(--space-lg)' }}>
              Today's Schedule
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
              {[
                { time: '09:00 AM', subject: 'Data Structures', faculty: 'Dr. Kumar', room: 'CS-301' },
                { time: '10:30 AM', subject: 'Operating Systems', faculty: 'Prof. Sharma', room: 'CS-302' },
                { time: '12:00 PM', subject: 'Database Management', faculty: 'Dr. Patel', room: 'CS-Lab 1' },
                { time: '02:00 PM', subject: 'Software Engineering', faculty: 'Prof. Reddy', room: 'CS-201' },
              ].map((cls, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: 'var(--space-md)', padding: '12px 16px',
                  background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-md)',
                }}>
                  <span style={{ fontSize: '12px', fontFamily: 'var(--font-mono)', color: 'var(--accent-primary)', fontWeight: 700, minWidth: '80px' }}>{cls.time}</span>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: '14px', fontWeight: 600 }}>{cls.subject}</p>
                    <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{cls.faculty} • {cls.room}</p>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Quick Links */}
          <GlassCard padding="lg" hover={false}>
            <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 'var(--space-lg)' }}>
              Quick Access
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
              {[
                { label: 'Mark Attendance', path: '/dashboard/attendance', icon: '◎', desc: 'Capture via Bluetooth beacon' },
                { label: 'View Placements', path: '/dashboard/placements', icon: '◈', desc: 'Check placement drives & status' },
                { label: 'Exam Portal', path: '/dashboard/exams', icon: '✎', desc: 'View exam schedule & results' },
                { label: 'Events', path: '/dashboard/events', icon: '★', desc: 'Upcoming campus events' },
                { label: 'Analytics', path: '/dashboard/analytics', icon: '▦', desc: 'Your performance trends' },
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
        </div>

        {/* Recent Notifications */}
        <GlassCard padding="lg" hover={false} style={{ marginTop: 'var(--space-lg)' }}>
          <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 'var(--space-lg)' }}>
            Recent Notifications
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
            {[
              { title: 'Placement Drive: Google', msg: 'Google campus placement drive scheduled for June 25. Eligibility: > 8.0 CGPA', type: 'info', time: '2 hours ago' },
              { title: 'Attendance Warning', msg: 'Your attendance in Operating Systems is at 76%. Maintain above 75%.', type: 'warning', time: '1 day ago' },
              { title: 'Exam Schedule Released', msg: 'Mid-semester exam schedule for Semester 4 has been published.', type: 'info', time: '3 days ago' },
            ].map((notif, i) => (
              <div key={i} style={{
                padding: '12px 16px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)',
                borderRadius: 'var(--radius-md)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'
              }}>
                <div>
                  <p style={{ fontSize: '14px', fontWeight: 600, marginBottom: '4px' }}>
                    {notif.type === 'warning' ? '⚠️' : 'ℹ️'} {notif.title}
                  </p>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{notif.msg}</p>
                </div>
                <span style={{ fontSize: '10px', color: 'var(--text-muted)', whiteSpace: 'nowrap', marginLeft: '16px' }}>{notif.time}</span>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </>
  );
}
