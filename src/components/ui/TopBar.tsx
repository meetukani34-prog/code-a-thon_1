'use client';

interface TopBarProps {
  title?: string;
  role?: string;
}

export default function TopBar({ title = 'Dashboard', role = 'student' }: TopBarProps) {
  return (
    <header style={{
      position: 'fixed',
      top: 0,
      left: 'var(--sidebar-width)',
      right: 0,
      height: 'var(--topbar-height)',
      background: 'rgba(10, 12, 20, 0.7)',
      backdropFilter: 'blur(30px)',
      WebkitBackdropFilter: 'blur(30px)',
      borderBottom: '1px solid var(--glass-border)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 var(--space-xl)',
      zIndex: 90,
    }}>
      <h2 style={{
        fontSize: 'var(--text-lg)',
        fontWeight: 700,
        color: 'var(--text-primary)',
      }}>
        {title}
      </h2>

      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-lg)',
      }}>
        {/* Search */}
        <div style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
        }}>
          <input
            type="text"
            placeholder="Search nodes..."
            style={{
              width: 220,
              padding: '8px 16px 8px 36px',
              background: 'var(--glass-bg)',
              border: '1px solid var(--glass-border)',
              borderRadius: 'var(--radius-full)',
              color: 'var(--text-primary)',
              fontSize: 'var(--text-sm)',
              fontFamily: 'var(--font-sans)',
              outline: 'none',
              transition: 'all var(--transition-normal)',
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = 'var(--accent-primary)';
              e.currentTarget.style.boxShadow = '0 0 0 3px hsla(210, 100%, 60%, 0.1)';
              e.currentTarget.style.width = '300px';
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = 'var(--glass-border)';
              e.currentTarget.style.boxShadow = 'none';
              e.currentTarget.style.width = '220px';
            }}
          />
          <span style={{
            position: 'absolute',
            left: 12,
            fontSize: 'var(--text-sm)',
            color: 'var(--text-muted)',
            pointerEvents: 'none',
          }}>⌕</span>
        </div>

        {/* Notifications */}
        <button style={{
          position: 'relative',
          width: 36,
          height: 36,
          borderRadius: 'var(--radius-md)',
          background: 'var(--glass-bg)',
          border: '1px solid var(--glass-border)',
          color: 'var(--text-secondary)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1rem',
          transition: 'all var(--transition-normal)',
        }}>
          🔔
          <span style={{
            position: 'absolute',
            top: -2,
            right: -2,
            width: 16,
            height: 16,
            borderRadius: '50%',
            background: 'var(--color-danger)',
            color: 'white',
            fontSize: '9px',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 8px var(--color-danger)',
            animation: 'pulseGlow 2s ease-in-out infinite',
          }}>
            3
          </span>
        </button>

        {/* User Avatar & Logout */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-sm)',
            padding: '4px 12px 4px 4px',
            borderRadius: 'var(--radius-full)',
            background: 'var(--glass-bg)',
            border: '1px solid var(--glass-border)',
            cursor: 'pointer',
            transition: 'all var(--transition-normal)',
          }}>
            <div style={{
              width: 28,
              height: 28,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '12px',
              fontWeight: 700,
              textTransform: 'uppercase',
            }}>
              {role.charAt(0)}
            </div>
            <span style={{
              fontSize: 'var(--text-xs)',
              color: 'var(--text-secondary)',
              fontWeight: 500,
              textTransform: 'capitalize',
            }}>
              {role}
            </span>
          </div>

          <button
            onClick={async () => {
              const { createClient } = await import('@/lib/supabase/client');
              const supabase = createClient();
              await supabase.auth.signOut();
              window.location.href = '/login';
            }}
            style={{
              padding: '6px 12px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--color-danger)',
              color: 'white',
              fontSize: 'var(--text-xs)',
              fontWeight: 600,
              border: 'none',
              cursor: 'pointer',
              opacity: 0.8,
              transition: 'opacity 0.2s',
            }}
            onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
            onMouseLeave={(e) => e.currentTarget.style.opacity = '0.8'}
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
