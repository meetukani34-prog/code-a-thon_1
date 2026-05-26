'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';

const navItems = [
  { id: 'superadmin', label: 'Superadmin Center', icon: '◉', path: '/superadmin', allowedRoles: ['superadmin'] },
  { id: 'admin', label: 'Admin Center', icon: '◉', path: '/admin', allowedRoles: ['admin'] },
  { id: 'faculty', label: 'Faculty Center', icon: '◉', path: '/faculty', allowedRoles: ['faculty'] },
  { id: 'student', label: 'Dashboard', icon: '◉', path: '/student', allowedRoles: ['student'] },
  { id: 'admin-users', label: 'Identity (RBAC)', icon: '👥', path: '/admin/users', allowedRoles: ['admin', 'superadmin'] },
  { id: 'add-faculty', label: 'Manage Users', icon: '🛡️', path: '/admin/add-faculty', allowedRoles: ['admin', 'superadmin'] },
  { id: 'add-admin', label: 'Add Admin', icon: '👑', path: '/superadmin/add-admin', allowedRoles: ['superadmin'] },
  { id: 'exams', label: 'Exam Portal', icon: '✎', path: '/portal/exams' },
  { id: 'hostel', label: 'Hostel Module', icon: '🏨', path: '/portal/hostel' },
  { id: 'transport', label: 'Transport Live', icon: '🚌', path: '/portal/transport' },
  { id: 'events', label: 'Events Portal', icon: '★', path: '/portal/events' },
  { id: 'attendance', label: 'Academics', icon: '◎', path: '/portal/attendance' },
  { id: 'placements', label: 'Placements', icon: '◈', path: '/portal/placements' },
  { id: 'analytics', label: 'Analytics', icon: '◫', path: '/portal/analytics' },
];

export default function Sidebar({ role = 'student' }: { role?: string }) {
  const pathname = usePathname();

  return (
    <aside style={{
      position: 'fixed',
      left: 0,
      top: 0,
      bottom: 0,
      width: 'var(--sidebar-width)',
      background: 'rgba(26, 26, 46, 0.85)',
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
            SARVAM
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
        gap: '12px',
        overflowY: 'auto',
      }}>
        {navItems.map((item) => {
          // RBAC Check
          if (item.allowedRoles && !item.allowedRoles.includes(role)) return null;
          if ((item as any).hideRoles && (item as any).hideRoles.includes(role)) return null;
          
          const isActive = pathname === item.path || (item.path !== '/dashboard' && pathname?.startsWith(item.path));
          
          return (
            <Link
              key={item.id}
              href={item.path}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-md)',
                padding: '14px 18px',
                borderRadius: '16px',
                color: isActive ? '#ffffff' : 'rgba(255, 255, 255, 0.7)',
                background: isActive 
                  ? 'linear-gradient(90deg, rgba(0, 212, 255, 0.8) 0%, rgba(157, 0, 255, 0.6) 100%)' 
                  : 'rgba(255, 255, 255, 0.03)',
                border: isActive 
                  ? '1px solid rgba(255, 255, 255, 0.4)' 
                  : '1px solid rgba(255, 255, 255, 0.05)',
                boxShadow: isActive 
                  ? '0 8px 32px 0 rgba(0, 212, 255, 0.3), inset 0 0 12px rgba(255, 255, 255, 0.2)' 
                  : '0 4px 12px 0 rgba(0, 0, 0, 0.2)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                textDecoration: 'none',
                fontSize: '0.95rem',
                fontWeight: isActive ? 600 : 500,
                position: 'relative',
                overflow: 'hidden',
                transform: 'translateZ(0)', // Force GPU acceleration for smooth floating
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.color = '#ffffff';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.color = 'rgba(255, 255, 255, 0.7)';
                }
              }}
            >
              {isActive && (
                <div style={{
                  position: 'absolute',
                  left: 4,
                  top: '15%',
                  bottom: '15%',
                  width: 4,
                  borderRadius: '10px',
                  background: '#ffffff',
                  boxShadow: '0 0 10px #ffffff, 0 0 20px #00d4ff',
                }} />
              )}
              <span style={{ 
                fontSize: '1.2rem', 
                opacity: isActive ? 1 : 0.7,
                filter: isActive ? 'drop-shadow(0 0 8px rgba(255,255,255,0.8))' : 'none',
              }}>
                {item.icon}
              </span>
              <span style={{
                textShadow: isActive ? '0 0 10px rgba(255,255,255,0.4)' : 'none'
              }}>
                {item.label}
              </span>
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
