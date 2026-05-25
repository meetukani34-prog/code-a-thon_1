'use client';

import { useState, useEffect } from 'react';
import GlassCard from '@/components/ui/GlassCard';

interface Vehicle {
  id: string;
  name: string;
  route: string;
  lat: number;
  lng: number;
  speed: number;
}

export default function TransportPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);

  // Simulation removed as per request. Dynamic Socket.io connection goes here.
  useEffect(() => {
    // Connect to actual telemetry socket
  }, []);

  return (
    <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
      <div style={{ marginBottom: 'var(--space-xl)' }}>
        <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, marginBottom: 'var(--space-xs)' }}>
          Transit Telemetry
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: 'var(--text-sm)' }}>
          Real-time spatial drift rendering via Socket.io
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '3fr 1fr', gap: 'var(--space-lg)' }}>
        {/* Minimalist High-Blur Map */}
        <GlassCard padding="lg" hover={false} style={{ height: 600, position: 'relative', overflow: 'hidden' }}>
          {/* Fake map background */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(circle at center, var(--bg-elevated) 0%, var(--bg-primary) 100%)',
            opacity: 0.5,
          }}>
            {/* Grid lines */}
            <div style={{ width: '100%', height: '100%', backgroundSize: '40px 40px', backgroundImage: 'linear-gradient(to right, rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.02) 1px, transparent 1px)' }} />
          </div>

          {/* Markers */}
          {vehicles.map(v => (
            <div key={v.id} style={{
              position: 'absolute',
              left: `${v.lng}%`,
              top: `${v.lat}%`,
              transform: 'translate(-50%, -50%)',
              transition: 'all 2s linear',
            }}>
              <div style={{
                width: 16,
                height: 16,
                borderRadius: '50%',
                background: 'var(--accent-primary)',
                boxShadow: 'var(--glow-primary)',
                animation: 'pulseGlow 1.5s infinite',
              }} />
              <div style={{
                position: 'absolute',
                top: 24,
                left: '50%',
                transform: 'translateX(-50%)',
                background: 'rgba(0,0,0,0.8)',
                padding: '4px 8px',
                borderRadius: 4,
                fontSize: '10px',
                whiteSpace: 'nowrap',
                color: 'white',
              }}>
                {v.name} • {Math.round(v.speed)}km/h
              </div>
            </div>
          ))}

          {/* Map Overlay Text */}
          <div style={{ position: 'absolute', bottom: 20, left: 20 }}>
            <p style={{ fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase' }}>
              Spatial Coordinate Stream Active
            </p>
          </div>
        </GlassCard>

        {/* Active Fleet List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
          <GlassCard padding="md" hover={false}>
            <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 'var(--space-md)' }}>
              Active Fleet
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
              {vehicles.length > 0 ? (
                vehicles.map(v => (
                  <div key={v.id} style={{
                    padding: 'var(--space-sm) var(--space-md)',
                    background: 'rgba(255,255,255,0.05)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--glass-border)',
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span style={{ fontSize: '12px', fontWeight: 600 }}>{v.name}</span>
                      <span style={{ fontSize: '12px', color: 'var(--accent-primary)', fontFamily: 'var(--font-mono)' }}>{Math.round(v.speed)} km/h</span>
                    </div>
                    <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{v.route}</div>
                  </div>
                ))
              ) : (
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', textAlign: 'center' }}>No active vehicles</p>
              )}
            </div>
          </GlassCard>

          <GlassCard padding="md" hover={false} glow="info">
            <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 'var(--space-md)' }}>
              RBAC Firewall
            </h3>
            <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              Your current node role is <strong style={{color: 'white'}}>Transport Operator</strong>. 
              Querying student medical or performance logs is digitally prohibited.
            </p>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
