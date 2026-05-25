'use client';

import React, { useState, Fragment } from 'react';
import GlassCard from '@/components/ui/GlassCard';

export default function TimetablePage() {
  const [solving, setSolving] = useState(false);
  const [clashScore, setClashScore] = useState(0);

  const handleRecrystallize = () => {
    setSolving(true);
    setTimeout(() => {
      setSolving(false);
      setClashScore(0);
    }, 2000);
  };

  return (
    <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-xl)' }}>
        <div>
          <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, marginBottom: 'var(--space-xs)' }}>
            Space-Time Matrix
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 'var(--text-sm)' }}>
            CSP Autonomous Timetable Solver
          </p>
        </div>
        
        <button 
          onClick={handleRecrystallize}
          disabled={solving}
          className="btn btn-primary"
        >
          {solving ? 'Solving Matrix...' : 'Re-crystallize Timeline'}
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 3fr', gap: 'var(--space-lg)' }}>
        {/* Status Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
          <GlassCard padding="lg" hover={false}>
            <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 'var(--space-lg)' }}>
              Constraint Tensor
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Faculty Overlaps (w1)</span>
                  <span style={{ fontSize: '12px', color: clashScore > 0 ? 'var(--color-danger)' : 'var(--color-success)' }}>0</span>
                </div>
                <div style={{ height: 4, background: 'rgba(255,255,255,0.1)', borderRadius: 2 }}>
                  <div style={{ height: '100%', width: clashScore > 0 ? '10%' : '0%', background: 'var(--color-danger)' }} />
                </div>
              </div>
              
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Capacity Breaches (w2)</span>
                  <span style={{ fontSize: '12px', color: clashScore > 0 ? 'var(--color-danger)' : 'var(--color-success)' }}>0</span>
                </div>
                <div style={{ height: 4, background: 'rgba(255,255,255,0.1)', borderRadius: 2 }}>
                  <div style={{ height: '100%', width: '0%', background: 'var(--color-danger)' }} />
                </div>
              </div>
              
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Track Clashes (w3)</span>
                  <span style={{ fontSize: '12px', color: clashScore > 0 ? 'var(--color-danger)' : 'var(--color-success)' }}>0</span>
                </div>
                <div style={{ height: 4, background: 'rgba(255,255,255,0.1)', borderRadius: 2 }}>
                  <div style={{ height: '100%', width: '0%', background: 'var(--color-danger)' }} />
                </div>
              </div>
            </div>
            
            <div style={{ marginTop: 'var(--space-xl)', paddingTop: 'var(--space-md)', borderTop: '1px solid var(--glass-border)', textAlign: 'center' }}>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 4 }}>Global Clash Score</p>
              <p style={{ fontSize: '2rem', fontWeight: 800, color: clashScore > 0 ? 'var(--color-warning)' : 'var(--color-success)', fontFamily: 'var(--font-mono)' }}>
                {clashScore}
              </p>
            </div>
          </GlassCard>
        </div>

        {/* Timetable Grid */}
        <GlassCard padding="md" hover={false}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '80px repeat(5, 1fr)',
            gap: 1,
            background: 'var(--glass-border)',
            borderRadius: 'var(--radius-md)',
            overflow: 'hidden',
          }}>
            {/* Headers */}
            <div style={{ background: 'var(--bg-elevated)', padding: 12 }} />
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map(day => (
              <div key={day} style={{ background: 'var(--bg-elevated)', padding: 12, textAlign: 'center', fontSize: '12px', fontWeight: 700 }}>
                {day}
              </div>
            ))}

            {/* Time Rows */}
            {[8, 9, 10, 11, 12, 14, 15, 16].map(hour => (
              <Fragment key={hour}>
                <div key={`time-${hour}`} style={{ background: 'var(--bg-elevated)', padding: 12, textAlign: 'right', fontSize: '11px', color: 'var(--text-muted)' }}>
                  {hour}:00
                </div>
                
                {/* Simulated slots for Mon-Fri */}
                {[0, 1, 2, 3, 4].map(day => {
                  // Deterministic psuedo-randomness to prevent SSR hydration errors
                  const pseudoRandom1 = (day * 13 + hour * 7) % 100;
                  const pseudoRandom2 = (day * 17 + hour * 11) % 300;
                  const pseudoRandom3 = (day * 23 + hour * 19) % 50;
                  const hasClass = pseudoRandom1 > 60;
                  
                  return (
                    <div key={`${day}-${hour}`} style={{
                      background: hasClass && !solving ? 'var(--glass-bg)' : 'var(--bg-elevated)',
                      padding: 8,
                      transition: 'all 0.3s',
                      opacity: solving ? 0.3 : 1,
                    }}>
                      {hasClass && !solving && (
                        <div style={{
                          height: '100%',
                          background: 'rgba(255,255,255,0.05)',
                          borderLeft: '2px solid var(--accent-primary)',
                          padding: 6,
                          borderRadius: 4,
                        }}>
                          <p style={{ fontSize: '11px', fontWeight: 600 }}>CS-{100 + pseudoRandom2}</p>
                          <p style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Room {101 + pseudoRandom3}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </Fragment>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
