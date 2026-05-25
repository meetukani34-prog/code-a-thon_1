'use client';

import { useState, useEffect } from 'react';
import GlassCard from '@/components/ui/GlassCard';
import { createBrowserClient } from '@supabase/ssr';

export default function PlacementsPage() {
  const [role, setRole] = useState('student');
  const [isFrozen, setIsFrozen] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    
    // Check current user role & placement status
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        const userRole = data.session.user.user_metadata?.role || 'student';
        const frozen = data.session.user.user_metadata?.placement_frozen === true;
        setRole(userRole);
        setIsFrozen(frozen);

        if (userRole === 'admin') {
          fetchUsers();
        } else {
          setLoading(false);
        }
      }
    });
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/admin/users');
      const data = await res.json();
      if (data.users) {
        setUsers(data.users.filter((u: any) => u.user_metadata?.role !== 'admin'));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFreeze = async (userId: string, currentStatus: boolean) => {
    setActionLoading(userId);
    try {
      const res = await fetch('/api/placements/freeze', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, placement_frozen: !currentStatus })
      });
      if (res.ok) {
        setUsers(users.map(u => 
          u.id === userId 
            ? { ...u, user_metadata: { ...u.user_metadata, placement_frozen: !currentStatus } } 
            : u
        ));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return <div style={{ color: 'var(--text-muted)' }}>Loading Placements Data...</div>;
  }

  return (
    <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
      <div style={{ marginBottom: 'var(--space-xl)' }}>
        <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, marginBottom: 'var(--space-xs)' }}>
          Placement Operations
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: 'var(--text-sm)' }}>
          {role === 'admin' ? 'Manage Student Eligibility & Defaulters' : 'Active Recruitment Drives & Eligibility'}
        </p>
      </div>

      {role === 'admin' ? (
        // ADMIN VIEW
        <GlassCard padding="lg" hover={false}>
          <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 'var(--space-lg)' }}>
            Student Placement Status Matrix
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
            {users.length > 0 ? users.map((user) => {
              const isUserFrozen = user.user_metadata?.placement_frozen === true;
              return (
                <div key={user.id} style={{
                  padding: 'var(--space-md)',
                  background: isUserFrozen ? 'rgba(255, 60, 60, 0.05)' : 'rgba(0,0,0,0.2)',
                  border: '1px solid',
                  borderColor: isUserFrozen ? 'var(--color-danger)' : 'var(--glass-border)',
                  borderRadius: 'var(--radius-md)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                  <div>
                    <p style={{ fontSize: 'var(--text-md)', fontWeight: 600 }}>{user.user_metadata?.full_name || user.email}</p>
                    <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{user.email}</p>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
                    <span className={`badge ${isUserFrozen ? 'badge-danger' : 'badge-success'}`}>
                      {isUserFrozen ? 'Frozen' : 'Active'}
                    </span>
                    <button
                      onClick={() => handleToggleFreeze(user.id, isUserFrozen)}
                      disabled={actionLoading === user.id}
                      style={{
                        padding: '6px 12px',
                        background: isUserFrozen ? 'var(--color-success)' : 'var(--color-danger)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        fontSize: '11px',
                        fontWeight: 'bold',
                        cursor: actionLoading === user.id ? 'not-allowed' : 'pointer',
                        opacity: actionLoading === user.id ? 0.5 : 1
                      }}
                    >
                      {actionLoading === user.id ? 'Updating...' : (isUserFrozen ? 'Unfreeze Student' : 'Freeze Placement')}
                    </button>
                  </div>
                </div>
              );
            }) : (
              <p style={{ color: 'var(--text-muted)', fontSize: '12px' }}>No students found.</p>
            )}
          </div>
        </GlassCard>
      ) : (
        // STUDENT VIEW
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 'var(--space-lg)' }}>
          {isFrozen ? (
            <GlassCard padding="lg" hover={false} glow="danger" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '4rem', marginBottom: 'var(--space-md)' }}>🛑</div>
              <h2 style={{ fontSize: '2rem', color: 'var(--color-danger)', fontWeight: 900, marginBottom: 'var(--space-sm)' }}>
                PLACEMENTS FROZEN
              </h2>
              <p style={{ color: 'var(--text-secondary)', maxWidth: 400, margin: '0 auto', lineHeight: 1.6 }}>
                Your placement privileges have been temporarily suspended due to attendance threshold breaches or disciplinary action. Please contact the Chief Warden immediately.
              </p>
            </GlassCard>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-lg)' }}>
              <GlassCard padding="lg">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-lg)' }}>
                  <div>
                    <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 700 }}>Google (Alphabet Inc.)</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '12px' }}>Software Engineer, L3</p>
                  </div>
                  <span className="badge badge-success">Accepting</span>
                </div>
                <div style={{ background: 'rgba(0,0,0,0.2)', padding: 'var(--space-sm)', borderRadius: 'var(--radius-sm)', marginBottom: 'var(--space-md)' }}>
                  <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Eligibility:</p>
                  <p style={{ fontSize: '13px', fontWeight: 600 }}>&gt; 8.0 CGPA, No Backlogs</p>
                </div>
                <button className="btn btn-primary" style={{ width: '100%' }}>Apply with Auto-Resume</button>
              </GlassCard>

              <GlassCard padding="lg">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-lg)' }}>
                  <div>
                    <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 700 }}>Microsoft</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '12px' }}>Cloud Solution Architect</p>
                  </div>
                  <span className="badge badge-info">Interviewing</span>
                </div>
                <div style={{ background: 'rgba(0,0,0,0.2)', padding: 'var(--space-sm)', borderRadius: 'var(--radius-sm)', marginBottom: 'var(--space-md)' }}>
                  <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Status:</p>
                  <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--accent-primary)' }}>Round 1 Cleared</p>
                </div>
                <button className="btn btn-outline" style={{ width: '100%' }} disabled>View Details</button>
              </GlassCard>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
