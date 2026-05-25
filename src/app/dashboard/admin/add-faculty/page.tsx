'use client';

import { useState, useEffect } from 'react';
import GlassCard from '@/components/ui/GlassCard';
import { createClient } from '@/lib/supabase/client';

export default function AddAdminPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [collegeName, setCollegeName] = useState('');
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [history, setHistory] = useState<any[]>([]);

  // Load history from existing admin users
  useEffect(() => {
    fetchAdminHistory();
  }, []);

  const fetchAdminHistory = async () => {
    try {
      const res = await fetch('/api/admin/users');
      const data = await res.json();
      if (data.users) {
        const admins = data.users.filter((u: any) => u.user_metadata?.role === 'admin');
        setHistory(admins);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const supabase = createClient();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          college_name: collegeName,
          location: location,
          role: 'admin',
        }
      }
    });

    if (error) {
      setMessage({ type: 'error', text: error.message });
    } else {
      setMessage({ type: 'success', text: 'Admin account created successfully.' });
      setFullName('');
      setEmail('');
      setPassword('');
      setCollegeName('');
      setLocation('');
      // Refresh history
      setTimeout(() => fetchAdminHistory(), 1000);
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
          Add Admin
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: 'var(--text-sm)' }}>
          Provision a new admin account with full administrative privileges.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-lg)' }}>
        {/* Form */}
        <GlassCard padding="lg" hover={false}>
          <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 'var(--space-lg)' }}>
            New Admin Registration
          </h3>
          <form onSubmit={handleAddAdmin} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
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
              type="submit"
              disabled={loading}
              style={{
                marginTop: 'var(--space-md)',
                padding: '12px',
                background: 'var(--accent-primary)',
                border: 'none',
                borderRadius: 'var(--radius-md)',
                color: 'white',
                fontWeight: 600,
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1
              }}
            >
              {loading ? 'Creating...' : 'Create Admin Account'}
            </button>
          </form>
        </GlassCard>

        {/* History */}
        <GlassCard padding="lg" hover={false}>
          <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 'var(--space-lg)' }}>
            Admin History
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
            {history.length > 0 ? history.map((admin, i) => (
              <div key={admin.id || i} style={{
                padding: 'var(--space-md)',
                background: 'rgba(0,0,0,0.2)',
                border: '1px solid var(--glass-border)',
                borderRadius: 'var(--radius-md)',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <p style={{ fontSize: 'var(--text-md)', fontWeight: 600 }}>{admin.user_metadata?.full_name || 'Unnamed'}</p>
                  <span className="badge badge-success" style={{ fontSize: '10px' }}>Admin</span>
                </div>
                <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{admin.email}</p>
                {admin.user_metadata?.college_name && (
                  <p style={{ fontSize: '11px', color: 'var(--accent-primary)', marginTop: '4px' }}>
                    🏛️ {admin.user_metadata.college_name} • 📍 {admin.user_metadata?.location || 'N/A'}
                  </p>
                )}
                <p style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '4px', fontFamily: 'var(--font-mono)' }}>
                  Created: {new Date(admin.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            )) : (
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', textAlign: 'center', padding: 'var(--space-lg)' }}>No admin accounts created yet.</p>
            )}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
