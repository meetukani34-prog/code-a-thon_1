'use client';

import { ReactNode } from 'react';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  glow?: 'primary' | 'danger' | 'success' | 'warning' | 'info' | 'none';
  hover?: boolean;
  padding?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  style?: React.CSSProperties;
}

export default function GlassCard({
  children,
  className = '',
  glow = 'none',
  hover = true,
  padding = 'md',
  onClick,
  style,
}: GlassCardProps) {
  const paddingMap = {
    sm: 'var(--space-md)',
    md: 'var(--space-lg)',
    lg: 'var(--space-xl)',
  };

  const glowMap = {
    none: 'none',
    primary: 'var(--glow-primary)',
    danger: 'var(--glow-danger)',
    success: 'var(--glow-success)',
    warning: 'var(--glow-warning)',
    info: 'var(--glow-info)',
  };

  return (
    <div
      className={`glass-card ${className}`}
      onClick={onClick}
      style={{
        background: 'var(--glass-bg)',
        backdropFilter: 'blur(var(--glass-blur))',
        WebkitBackdropFilter: 'blur(var(--glass-blur))',
        border: '1px solid var(--glass-border)',
        borderRadius: 'var(--radius-lg)',
        padding: paddingMap[padding],
        transition: 'all var(--transition-normal)',
        boxShadow: glowMap[glow],
        cursor: onClick ? 'pointer' : 'default',
        position: 'relative',
        overflow: 'hidden',
        ...style,
      }}
      onMouseEnter={hover ? (e) => {
        const el = e.currentTarget;
        el.style.background = 'var(--glass-bg-hover)';
        el.style.borderColor = 'var(--glass-border-hover)';
        el.style.transform = 'translateY(-2px)';
      } : undefined}
      onMouseLeave={hover ? (e) => {
        const el = e.currentTarget;
        el.style.background = 'var(--glass-bg)';
        el.style.borderColor = 'var(--glass-border)';
        el.style.transform = 'translateY(0)';
      } : undefined}
    >
      {children}
    </div>
  );
}
