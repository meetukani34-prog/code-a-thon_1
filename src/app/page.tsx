'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function LandingPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [particlePositions, setParticlePositions] = useState<Array<{x: number; y: number; size: number; delay: number}>>([]);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [usn, setUsn] = useState('');
  const [fullName, setFullName] = useState('');
  const [branch, setBranch] = useState('DS(Data Science)');
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    const supabase = createClient();

    if (isLogin) {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setError(error.message);
      else router.push('/dashboard');
    } else {
      const { error, data } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          data: {
            full_name: fullName,
            usn,
            branch,
            role: 'student'
          }
        }
      });
      if (error) {
        setError(error.message);
      } else {
        if (data.session) {
          router.push('/dashboard');
        } else {
          setMessage('Registration successful! Check your email to confirm if required.');
        }
      }
    }
    setLoading(false);
  };


  useEffect(() => {
    setMounted(true);
    // Generate particle positions on client side only
    setParticlePositions(
      Array.from({ length: 30 }, () => ({
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 3 + 1,
        delay: Math.random() * 5,
      }))
    );
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Animated particles */}
      {mounted && particlePositions.map((p, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            borderRadius: '50%',
            background: 'var(--accent-primary)',
            opacity: 0.3,
            animation: `float ${3 + p.delay}s ease-in-out infinite`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}

      {/* Hero Card */}
      <div style={{
        position: 'relative',
        zIndex: 10,
        textAlign: 'center',
        maxWidth: 560,
        padding: 'var(--space-3xl) var(--space-2xl)',
        animation: mounted ? 'slideUp 0.8s ease-out' : 'none',
        opacity: mounted ? 1 : 0,
      }}>
        {/* Logo */}
        <div style={{
          width: 80,
          height: 80,
          borderRadius: 'var(--radius-xl)',
          background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary), var(--accent-tertiary))',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '2.5rem',
          margin: '0 auto var(--space-xl)',
          boxShadow: '0 0 40px hsla(210, 100%, 60%, 0.4), 0 0 80px hsla(280, 80%, 65%, 0.2)',
          animation: 'float 4s ease-in-out infinite',
        }}>
          ◊
        </div>

        <h1 style={{
          fontSize: 'var(--text-5xl)',
          fontWeight: 900,
          marginBottom: 'var(--space-md)',
          lineHeight: 1.1,
        }}>
          <span className="text-gradient">Campus OS</span>
        </h1>

        <p style={{
          fontSize: 'var(--text-xs)',
          color: 'var(--accent-primary)',
          textTransform: 'uppercase',
          letterSpacing: '4px',
          fontWeight: 600,
          marginBottom: 'var(--space-lg)',
        }}>
          Ecosystem Singularity
        </p>

        <p style={{
          fontSize: 'var(--text-base)',
          color: 'var(--text-secondary)',
          lineHeight: 1.7,
          marginBottom: 'var(--space-2xl)',
          maxWidth: 440,
          margin: '0 auto var(--space-2xl)',
        }}>
          Decentralized data topologies. Real-time reactive event streams. 
          Localized cognitive engines. Zero operational friction.
        </p>

        {/* Login/Signup Card */}
        <form onSubmit={handleAuth} style={{
          background: 'var(--glass-bg)',
          backdropFilter: 'blur(var(--glass-blur-heavy))',
          WebkitBackdropFilter: 'blur(var(--glass-blur-heavy))',
          border: '1px solid var(--glass-border)',
          borderRadius: 'var(--radius-xl)',
          padding: 'var(--space-xl)',
          textAlign: 'left',
        }}>
          {!isLogin && (
            <div style={{ textAlign: 'center', marginBottom: 'var(--space-xl)' }}>
              <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 800, marginBottom: 4 }}>Student Hub</h2>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Campus Nexus</p>
            </div>
          )}

          {!isLogin && (
            <div style={{ marginBottom: 'var(--space-md)' }}>
              <label style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: 6 }}>
                USN No
              </label>
              <input
                type="text"
                placeholder="e.g. 1RV21CS001"
                value={usn}
                onChange={(e) => setUsn(e.target.value)}
                required={!isLogin}
                className="glass-input"
                style={{ width: '100%', padding: '10px 14px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-md)', color: 'white', fontSize: '14px', outline: 'none', transition: 'all 0.2s' }}
              />
            </div>
          )}

          {!isLogin && (
            <div style={{ marginBottom: 'var(--space-md)' }}>
              <label style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: 6 }}>
                Full Name
              </label>
              <input
                type="text"
                placeholder="John Doe"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required={!isLogin}
                style={{ width: '100%', padding: '10px 14px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-md)', color: 'white', fontSize: '14px', outline: 'none', transition: 'all 0.2s' }}
              />
            </div>
          )}

          <div style={{ marginBottom: 'var(--space-md)' }}>
            <label style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: 6 }}>
              {isLogin ? 'Node Identifier (Email)' : 'Email Address'}
            </label>
            <input
              type="email"
              placeholder="student@campus.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ width: '100%', padding: '10px 14px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-md)', color: 'white', fontSize: '14px', outline: 'none', transition: 'all 0.2s' }}
            />
          </div>

          <div style={{ marginBottom: isLogin ? 'var(--space-xl)' : 'var(--space-md)' }}>
            <label style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: 6 }}>
              {isLogin ? 'Access Key' : 'Password'}
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ width: '100%', padding: '10px 14px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-md)', color: 'white', fontSize: '14px', outline: 'none', transition: 'all 0.2s' }}
            />
          </div>

          {!isLogin && (
            <div style={{ marginBottom: 'var(--space-xl)' }}>
              <label style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: 6 }}>
                Branch / Track
              </label>
              <select
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                style={{ width: '100%', padding: '10px 14px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-md)', color: 'white', fontSize: '14px', outline: 'none', appearance: 'none', cursor: 'pointer' }}
              >
                <option value="DS(Data Science)" style={{ color: 'black' }}>DS (Data Science)</option>
                <option value="CS(Computer Science)" style={{ color: 'black' }}>CS (Computer Science)</option>
                <option value="EC(Electronics)" style={{ color: 'black' }}>EC (Electronics)</option>
                <option value="ME(Mechanical)" style={{ color: 'black' }}>ME (Mechanical)</option>
              </select>
            </div>
          )}


          {error && (
            <p style={{ color: 'var(--color-danger)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-md)', textAlign: 'center' }}>
              {error}
            </p>
          )}

          {message && (
            <p style={{ color: 'var(--color-success)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-md)', textAlign: 'center' }}>
              {message}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              display: 'block',
              width: '100%',
              padding: '14px',
              background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-primary-dim))',
              border: 'none',
              borderRadius: 'var(--radius-md)',
              color: 'white',
              fontSize: 'var(--text-sm)',
              fontWeight: 700,
              textAlign: 'center',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all var(--transition-normal)',
              textDecoration: 'none',
              letterSpacing: '1px',
              textTransform: 'uppercase',
              boxShadow: 'var(--glow-primary)',
              opacity: loading ? 0.7 : 1,
            }}
            onMouseEnter={(e) => {
              if (loading) return;
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 0 30px hsla(210, 100%, 60%, 0.5), 0 0 80px hsla(210, 100%, 60%, 0.2)';
            }}
            onMouseLeave={(e) => {
              if (loading) return;
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'var(--glow-primary)';
            }}
          >
            {loading ? 'Processing...' : (isLogin ? 'Initialize Session →' : 'SECURE SIGN IN')}
          </button>
          
          <button
            type="button"
            onClick={() => {
              setIsLogin(!isLogin);
              setError(null);
              setMessage(null);
            }}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--accent-secondary)',
              fontSize: '12px',
              cursor: 'pointer',
              display: 'block',
              width: '100%',
              marginTop: 'var(--space-md)',
              textDecoration: 'underline',
              fontFamily: 'var(--font-mono)'
            }}
          >
            {isLogin ? "Don't have an account? Register" : "Back to Login"}
          </button>

          <p style={{
            textAlign: 'center',
            fontSize: 'var(--text-xs)',
            color: 'var(--text-muted)',
            marginTop: 'var(--space-md)',
            fontFamily: 'var(--font-mono)',
          }}>
            AES-256 Encrypted • RBAC Protected • Campus Isolated
          </p>
        </form>

        {/* Stats ribbon */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: 'var(--space-2xl)',
          marginTop: 'var(--space-2xl)',
          flexWrap: 'wrap',
        }}>
          {[
            { label: 'Campus Nodes', value: '3' },
            { label: 'Event Throughput', value: '12K/s' },
            { label: 'Latency', value: '<50ms' },
          ].map(stat => (
            <div key={stat.label} style={{ textAlign: 'center' }}>
              <p style={{
                fontSize: 'var(--text-xl)',
                fontWeight: 800,
                color: 'var(--accent-primary)',
                fontFamily: 'var(--font-mono)',
              }}>{stat.value}</p>
              <p style={{
                fontSize: 'var(--text-xs)',
                color: 'var(--text-muted)',
                textTransform: 'uppercase',
                letterSpacing: '1px',
              }}>{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
