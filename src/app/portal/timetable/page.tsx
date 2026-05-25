'use client';

import React, { useState, useEffect, Fragment } from 'react';
import GlassCard from '@/components/ui/GlassCard';
import { createBrowserClient } from '@supabase/ssr';

export default function TimetablePage() {
  const [userRole, setUserRole] = useState('student');
  const [slots, setSlots] = useState<any[]>([]);
  
  // Form State
  const [day, setDay] = useState('Mon');
  const [time, setTime] = useState('10:00');
  const [subject, setSubject] = useState('');
  const [faculty, setFaculty] = useState('');
  const [branch, setBranch] = useState('CS');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    // Get user role
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        setUserRole(data.session.user.user_metadata?.role || 'student');
      }
    });

    // Fetch existing slots
    supabase.from('timetable_slots').select('*').then(({ data, error }) => {
      if (data && !error) setSlots(data);
    });

    // Real-time subscription
    const channel = supabase.channel('timetable_updates')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'timetable_slots' }, (payload) => {
        setSlots(prev => [...prev, payload.new]);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleAddSlot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !faculty) return;
    setIsSubmitting(true);
    
    await supabase.from('timetable_slots').insert([
      { day, hour: time, subject, faculty, branch }
    ]);
    
    setSubject('');
    setFaculty('');
    setIsSubmitting(false);
  };

  return (
    <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-xl)' }}>
        <div>
          <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, marginBottom: 'var(--space-xs)' }}>
            Space-Time Matrix
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 'var(--text-sm)' }}>
            Live Synchronized Timetable
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: userRole === 'admin' ? '1fr 3fr' : '1fr', gap: 'var(--space-lg)' }}>
        
        {/* Admin Panel - Only visible to Admins */}
        {userRole === 'admin' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
            <GlassCard padding="lg" hover={false}>
              <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 'var(--space-lg)' }}>
                Allocate Slot
              </h3>
              
              <form onSubmit={handleAddSlot} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
                <div>
                  <label style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Day</label>
                  <select 
                    value={day} onChange={e => setDay(e.target.value)}
                    style={{ width: '100%', padding: '8px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)', color: 'white', borderRadius: '4px', marginTop: '4px' }}
                  >
                    <option value="Mon">Monday</option>
                    <option value="Tue">Tuesday</option>
                    <option value="Wed">Wednesday</option>
                    <option value="Thu">Thursday</option>
                    <option value="Fri">Friday</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Time</label>
                  <select 
                    value={time} onChange={e => setTime(e.target.value)}
                    style={{ width: '100%', padding: '8px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)', color: 'white', borderRadius: '4px', marginTop: '4px' }}
                  >
                    {['8:00', '9:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00'].map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Branch</label>
                  <select 
                    value={branch} onChange={e => setBranch(e.target.value)}
                    style={{ width: '100%', padding: '8px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)', color: 'white', borderRadius: '4px', marginTop: '4px' }}
                  >
                    <option value="CS">Computer Science</option>
                    <option value="DS">Data Science</option>
                    <option value="EC">Electronics</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Subject</label>
                  <input 
                    type="text" required placeholder="e.g. Data Structures"
                    value={subject} onChange={e => setSubject(e.target.value)}
                    style={{ width: '100%', padding: '8px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)', color: 'white', borderRadius: '4px', marginTop: '4px' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Faculty</label>
                  <input 
                    type="text" required placeholder="e.g. Dr. Smith"
                    value={faculty} onChange={e => setFaculty(e.target.value)}
                    style={{ width: '100%', padding: '8px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)', color: 'white', borderRadius: '4px', marginTop: '4px' }}
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  style={{
                    padding: '10px',
                    background: 'var(--accent-primary)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    fontWeight: 'bold',
                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                    marginTop: '8px'
                  }}
                >
                  {isSubmitting ? 'Publishing...' : 'Publish to Matrix'}
                </button>
              </form>
            </GlassCard>
          </div>
        )}

        {/* Timetable Grid */}
        <GlassCard padding="md" hover={false}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '60px repeat(5, 1fr)',
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
            {['8:00', '9:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00'].map(hour => (
              <Fragment key={hour}>
                <div key={`time-${hour}`} style={{ background: 'var(--bg-elevated)', padding: 12, textAlign: 'right', fontSize: '11px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                  {hour}
                </div>
                
                {/* Dynamic slots map here */}
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map(d => {
                  const cellSlots = slots.filter(s => s.day === d && s.hour === hour);
                  return (
                    <div key={`${d}-${hour}`} style={{
                      background: cellSlots.length > 0 ? 'rgba(59, 130, 246, 0.1)' : 'var(--bg-elevated)',
                      border: cellSlots.length > 0 ? '1px solid rgba(59, 130, 246, 0.3)' : '1px solid transparent',
                      padding: 8,
                      transition: 'all 0.3s',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 4,
                      minHeight: '60px'
                    }}>
                      {cellSlots.map((slot, idx) => (
                        <div key={idx} style={{ 
                          background: 'rgba(0,0,0,0.3)', 
                          padding: '6px', 
                          borderRadius: '4px', 
                          borderLeft: '3px solid var(--accent-primary)' 
                        }}>
                          <strong style={{ color: 'white', fontSize: '11px', display: 'block', marginBottom: '2px' }}>{slot.subject}</strong>
                          <div style={{ color: 'var(--accent-primary)', fontSize: '9px', fontWeight: 'bold' }}>{slot.branch}</div>
                          <div style={{ color: 'var(--text-muted)', fontSize: '9px' }}>{slot.faculty}</div>
                        </div>
                      ))}
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
