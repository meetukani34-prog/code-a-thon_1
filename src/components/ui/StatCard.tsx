'use client';

import { useEffect, useState } from 'react';
import GlassCard from './GlassCard';

interface StatCardProps {
  label: string;
  value: number;
  suffix?: string;
  prefix?: string;
  icon: string;
  trend?: number; // +/- percentage
  color?: string;
  decimals?: number;
}

export default function StatCard({
  label,
  value,
  suffix = '',
  prefix = '',
  icon,
  trend,
  color = 'var(--accent-primary)',
  decimals = 0,
}: StatCardProps) {
  const [displayValue, setDisplayValue] = useState(0);

  // Animated counter
  useEffect(() => {
    const duration = 1200;
    const steps = 40;
    const increment = value / steps;
    let current = 0;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      current = Math.min(value, increment * step);
      setDisplayValue(current);

      if (step >= steps) {
        setDisplayValue(value);
        clearInterval(timer);
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [value]);

  return (
    <GlassCard padding="md">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <p style={{
            fontSize: 'var(--text-xs)',
            color: 'var(--text-muted)',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            fontWeight: 600,
            marginBottom: 'var(--space-sm)',
          }}>
            {label}
          </p>
          <p style={{
            fontSize: 'var(--text-3xl)',
            fontWeight: 800,
            color: 'var(--text-primary)',
            lineHeight: 1,
            fontFamily: 'var(--font-mono)',
          }}>
            {prefix}{displayValue.toFixed(decimals)}{suffix}
          </p>
          {trend !== undefined && (
            <p style={{
              fontSize: 'var(--text-xs)',
              color: trend >= 0 ? 'var(--color-success)' : 'var(--color-danger)',
              marginTop: 'var(--space-xs)',
              fontWeight: 600,
            }}>
              {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}% from last period
            </p>
          )}
        </div>
        <div style={{
          width: 48,
          height: 48,
          borderRadius: 'var(--radius-md)',
          background: `${color}15`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.5rem',
          border: `1px solid ${color}30`,
        }}>
          {icon}
        </div>
      </div>
    </GlassCard>
  );
}
