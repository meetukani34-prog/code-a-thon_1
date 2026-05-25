'use client';

import { useState, useEffect } from 'react';
import GlassCard from '@/components/ui/GlassCard';
import { createClient } from '@/lib/supabase/client';

export default function ManageUsersPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [collegeName, setCollegeName] = useState('');
  const [location, setLocation] = useState('');
  const [selectedRole, setSelectedRole] = useState<'admin' | 'faculty'>('faculty');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await fetch('/api/admin/users');
      const data = await res.json();
      if (data.users) {
        const managed = data.users.filter((u: any) => 
          u.user_metadata?.role === 'admin' || u.user_metadata?.role === 'faculty'
        );
        setHistory(managed);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch('/api/admin/create-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          full_name: fullName,
          college_name: collegeName,
          location,
          role: selectedRole
        })
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage({ type: 'error', text: data.error || 'Failed to create account.' });
      } else {
        setMessage({ type: 'success', text: `${selectedRole === 'admin' ? 'Admin' : 'Faculty'} account created successfully.` });
        setFullName('');
        setEmail('');
        setPassword('');
        setCollegeName('');
        setLocation('');
        setTimeout(() => fetchHistory(), 1000);
      }
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'An error occurred' });
    }
    
    setLoading(false);
  };

  const inputStyle = {
    width: '100%', padding: '12px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)',
    borderRadius: 'var(--radius-md)', color: 'white', outline: 'none'
  };

  return (
    <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
      <div style={{ marginBottom: 'var(--space-xl)' }}>
        <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, marginBottom: 'var(--space-xs)' }}>
          Manage Users
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: 'var(--text-sm)' }}>
          Create Admin or Faculty accounts for your college.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-lg)' }}>
        {/* Form */}
        <GlassCard padding="lg" hover={false}>
          <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 'var(--space-lg)' }}>
            New User Registration
          </h3>

          {/* Role Selector */}
          <div style={{ display: 'flex', gap: '10px', marginBottom: 'var(--space-lg)' }}>
            <button
              type="button"
              onClick={() => setSelectedRole('faculty')}
              style={{
                flex: 1, padding: '10px', borderRadius: 'var(--radius-md)', border: '1px solid',
                borderColor: selectedRole === 'faculty' ? 'var(--accent-primary)' : 'var(--glass-border)',
                background: selectedRole === 'faculty' ? 'rgba(59, 130, 246, 0.15)' : 'rgba(0,0,0,0.2)',
                color: selectedRole === 'faculty' ? 'var(--accent-primary)' : 'var(--text-muted)',
                cursor: 'pointer', fontWeight: 700, fontSize: '14px', transition: 'all 0.3s'
              }}
            >
              👩‍🏫 Faculty
            </button>
            <button
              type="button"
              onClick={() => setSelectedRole('admin')}
              style={{
                flex: 1, padding: '10px', borderRadius: 'var(--radius-md)', border: '1px solid',
                borderColor: selectedRole === 'admin' ? 'var(--color-warning)' : 'var(--glass-border)',
                background: selectedRole === 'admin' ? 'rgba(234, 179, 8, 0.15)' : 'rgba(0,0,0,0.2)',
                color: selectedRole === 'admin' ? 'var(--color-warning)' : 'var(--text-muted)',
                cursor: 'pointer', fontWeight: 700, fontSize: '14px', transition: 'all 0.3s'
              }}
            >
              🛡️ Admin
            </button>
          </div>

          <form onSubmit={handleAddUser} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'var(--text-secondary)' }}>Full Name</label>
              <input type="text" required value={fullName} onChange={e => setFullName(e.target.value)} style={inputStyle} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'var(--text-secondary)' }}>Email Address</label>
              <input type="email" required value={email} onChange={e => setEmail(e.target.value)} style={inputStyle} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'var(--text-secondary)' }}>College Name</label>
                <input type="text" required value={collegeName} onChange={e => setCollegeName(e.target.value)} style={inputStyle} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'var(--text-secondary)' }}>Location</label>
                <input type="text" required value={location} onChange={e => setLocation(e.target.value)} style={inputStyle} />
              </div>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'var(--text-secondary)' }}>Temporary Password</label>
              <input type="password" required value={password} onChange={e => setPassword(e.target.value)} style={inputStyle} />
            </div>

            {message && (
              <div style={{
                padding: '12px', borderRadius: 'var(--radius-md)', fontSize: '14px',
                background: message.type === 'error' ? 'rgba(255, 76, 76, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                color: message.type === 'error' ? 'var(--color-danger)' : 'var(--color-success)',
                border: `1px solid ${message.type === 'error' ? 'var(--color-danger)' : 'var(--color-success)'}`
              }}>
                {message.text}
              </div>
            )}

            <button 
              type="submit" disabled={loading}
              style={{
                marginTop: 'var(--space-md)', padding: '12px',
                background: selectedRole === 'admin' ? 'var(--color-warning)' : 'var(--accent-primary)',
                border: 'none', borderRadius: 'var(--radius-md)', color: 'white', fontWeight: 600,
                cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, transition: 'background 0.3s'
              }}
            >
              {loading ? 'Creating...' : `Create ${selectedRole === 'admin' ? 'Admin' : 'Faculty'} Account`}
            </button>
          </form>
        </GlassCard>

        {/* History */}
        <GlassCard padding="lg" hover={false}>
          <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 'var(--space-lg)' }}>
            User History
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)', maxHeight: '500px', overflowY: 'auto' }}>
            {history.length > 0 ? history.map((user, i) => (
              <div key={user.id || i} style={{
                padding: 'var(--space-md)', background: 'rgba(0,0,0,0.2)',
                border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-md)',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <p style={{ fontSize: 'var(--text-md)', fontWeight: 600 }}>{user.user_metadata?.full_name || 'Unnamed'}</p>
                  <span className={`badge ${user.user_metadata?.role === 'admin' ? 'badge-warning' : 'badge-info'}`} style={{ fontSize: '10px' }}>
                    {user.user_metadata?.role === 'admin' ? 'Admin' : 'Faculty'}
                  </span>
                </div>
                <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{user.email}</p>
                {user.user_metadata?.college_name && (
                  <p style={{ fontSize: '11px', color: 'var(--accent-primary)', marginTop: '4px' }}>
                    🏛️ {user.user_metadata.college_name} • 📍 {user.user_metadata?.location || 'N/A'}
                  </p>
                )}
                <p style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '4px', fontFamily: 'var(--font-mono)' }}>
                  Created: {new Date(user.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            )) : (
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', textAlign: 'center', padding: 'var(--space-lg)' }}>No users created yet.</p>
            )}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
