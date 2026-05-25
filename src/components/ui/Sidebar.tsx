'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: '◉', path: '/dashboard' },
  { id: 'console', label: 'Event Console', icon: '⚡', path: '/dashboard/console' },
  { id: 'attendance', label: 'Attendance', icon: '◎', path: '/dashboard/attendance' },
  { id: 'placements', label: 'Placements', icon: '◈', path: '/dashboard/placements' },
  { id: 'timetable', label: 'Timetable', icon: '▦', path: '/dashboard/timetable' },
  { id: 'transport', label: 'Transport', icon: '◬', path: '/dashboard/transport' },
  { id: 'analytics', label: 'Analytics', icon: '◫', path: '/dashboard/analytics' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside style={{
      position: 'fixed',
      left: 0,
      top: 0,
      bottom: 0,
      width: 'var(--sidebar-width)',
      background: 'rgba(10, 12, 20, 0.85)',
      backdropFilter: 'blur(40px)',
      WebkitBackdropFilter: 'blur(40px)',
      borderRight: '1px solid var(--glass-border)',
      display: 'flex',
      flexDirection: 'column',
      zIndex: 100,
      overflow: 'hidden',
    }}>
      {/* Logo */}
      <div style={{
        padding: 'var(--space-lg)',
        borderBottom: '1px solid var(--glass-border)',
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-md)',
      }}>
        <div style={{
          width: 40,
          height: 40,
          borderRadius: 'var(--radius-md)',
          background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.2rem',
          fontWeight: 900,
          boxShadow: 'var(--glow-primary)',
        }}>
          ◊
        </div>
        <div>
          <h1 style={{
            fontSize: 'var(--text-sm)',
            fontWeight: 800,
            letterSpacing: '1px',
            lineHeight: 1.2,
          }}>
            CAMPUS OS
          </h1>
          <p style={{
            fontSize: '10px',
            color: 'var(--text-muted)',
            letterSpacing: '2px',
            textTransform: 'uppercase',
          }}>
            Singularity v1.0
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav style={{
        flex: 1,
        padding: 'var(--space-md)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-xs)',
        overflowY: 'auto',
      }}>
        {navItems.map((item) => {
          const isActive = pathname === item.path || (item.path !== '/dashboard' && pathname?.startsWith(item.path));
          return (
            <Link
              key={item.id}
              href={item.path}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-md)',
                padding: '10px var(--space-md)',
                borderRadius: 'var(--radius-md)',
                color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                background: isActive ? 'var(--glass-bg-hover)' : 'transparent',
                border: isActive ? '1px solid var(--glass-border-hover)' : '1px solid transparent',
                transition: 'all var(--transition-normal)',
                textDecoration: 'none',
                fontSize: 'var(--text-sm)',
                fontWeight: isActive ? 600 : 400,
                position: 'relative',
                overflow: 'hidden',
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = 'var(--glass-bg)';
                  e.currentTarget.style.color = 'var(--text-primary)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = 'var(--text-secondary)';
                }
              }}
            >
              {isActive && (
                <div style={{
                  position: 'absolute',
                  left: 0,
                  top: '20%',
                  bottom: '20%',
                  width: 3,
                  borderRadius: 'var(--radius-full)',
                  background: 'var(--accent-primary)',
                  boxShadow: '0 0 10px var(--accent-primary)',
                }} />
              )}
              <span style={{ fontSize: '1.1rem', opacity: isActive ? 1 : 0.6 }}>{item.icon}</span>
              <span>{item.label}</span>
              {item.id === 'console' && (
                <span style={{
                  marginLeft: 'auto',
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: 'var(--color-danger)',
                  boxShadow: '0 0 8px var(--color-danger)',
                  animation: 'pulseGlow 2s ease-in-out infinite',
                }} />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Status */}
      <div style={{
        padding: 'var(--space-md) var(--space-lg)',
        borderTop: '1px solid var(--glass-border)',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-sm)',
          fontSize: 'var(--text-xs)',
          color: 'var(--text-muted)',
        }}>
          <div style={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            background: 'var(--color-success)',
            boxShadow: '0 0 8px var(--color-success)',
          }} />
          <span>System Nominal</span>
        </div>
        <p style={{
          fontSize: '10px',
          color: 'var(--text-muted)',
          marginTop: 4,
          fontFamily: 'var(--font-mono)',
        }}>
          Event Bus: Active • 3 Nodes
        </p>
      </div>
    </aside>
  );
}
