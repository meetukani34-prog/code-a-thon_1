'use client';

import { useState } from 'react';
import GlassCard from '@/components/ui/GlassCard';
import { createClient } from '@/lib/supabase/client';

export default function AddAdminPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

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
    }
    setLoading(false);
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

      <GlassCard padding="lg" hover={false} style={{ maxWidth: '600px' }}>
        <form onSubmit={handleAddAdmin} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'var(--text-secondary)' }}>Full Name</label>
            <input 
              type="text" 
              required 
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              style={{
                width: '100%', padding: '12px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)',
                borderRadius: 'var(--radius-md)', color: 'white', outline: 'none'
              }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'var(--text-secondary)' }}>Email Address</label>
            <input 
              type="email" 
              required 
              value={email}
              onChange={e => setEmail(e.target.value)}
              style={{
                width: '100%', padding: '12px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)',
                borderRadius: 'var(--radius-md)', color: 'white', outline: 'none'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'var(--text-secondary)' }}>Temporary Password</label>
            <input 
              type="password" 
              required 
              value={password}
              onChange={e => setPassword(e.target.value)}
              style={{
                width: '100%', padding: '12px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)',
                borderRadius: 'var(--radius-md)', color: 'white', outline: 'none'
              }}
            />
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
    </div>
  );
}
