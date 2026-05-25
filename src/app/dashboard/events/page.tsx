'use client';

import { useState, useEffect } from 'react';
import GlassCard from '@/components/ui/GlassCard';
import { createBrowserClient } from '@supabase/ssr';

export default function EventsPortal() {
  const [role, setRole] = useState('student');
  const [events, setEvents] = useState<any[]>([
    { id: '1', title: 'Annual Tech Fest 2026', date: '2026-06-15', time: '09:00 AM', venue: 'Main Auditorium', type: 'Technical', description: 'Flagship technology festival with hackathons, workshops, and guest lectures.', createdBy: 'System' },
    { id: '2', title: 'Cultural Night', date: '2026-06-20', time: '06:00 PM', venue: 'Open Air Theatre', type: 'Cultural', description: 'Annual cultural extravaganza with music, dance, and drama performances.', createdBy: 'System' },
  ]);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [venue, setVenue] = useState('');
  const [eventType, setEventType] = useState('Technical');
  const [description, setDescription] = useState('');

  useEffect(() => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        setRole(data.session.user.user_metadata?.role || 'student');
      }
    });
  }, []);

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    const newEvent = {
      id: Date.now().toString(),
      title, date, time, venue,
      type: eventType,
      description,
      createdBy: 'Admin'
    };
    setEvents([newEvent, ...events]);
    setTitle(''); setDate(''); setTime(''); setVenue(''); setDescription('');
    setShowForm(false);
  };

  const typeColors: Record<string, string> = {
    'Technical': 'var(--accent-primary)',
    'Cultural': '#a855f7',
    'Sports': 'var(--color-success)',
    'Workshop': 'var(--color-warning)',
    'Seminar': '#ec4899',
  };

  const inputStyle = {
    width: '100%', padding: '12px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)',
    borderRadius: 'var(--radius-md)', color: 'white', outline: 'none', fontSize: '14px'
  };

  return (
    <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
      <div style={{ marginBottom: 'var(--space-xl)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, marginBottom: 'var(--space-xs)' }}>
            Events Portal
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 'var(--text-sm)' }}>
            {role === 'admin' ? 'Create and manage campus events' : 'Upcoming campus events and activities'}
          </p>
        </div>
        {role === 'admin' && (
          <button
            onClick={() => setShowForm(!showForm)}
            style={{
              padding: '10px 20px',
              background: showForm ? 'var(--color-danger)' : 'var(--accent-primary)',
              border: 'none', borderRadius: 'var(--radius-md)', color: 'white',
              fontWeight: 700, cursor: 'pointer', fontSize: '14px', transition: 'all 0.3s'
            }}
          >
            {showForm ? '✕ Cancel' : '+ Add Event'}
          </button>
        )}
      </div>

      {/* Admin Add Event Form */}
      {showForm && role === 'admin' && (
        <GlassCard padding="lg" hover={false} style={{ marginBottom: 'var(--space-lg)' }}>
          <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 'var(--space-lg)' }}>
            Create New Event
          </h3>
          <form onSubmit={handleAddEvent} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)' }}>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', color: 'var(--text-secondary)' }}>Event Title</label>
              <input type="text" required value={title} onChange={e => setTitle(e.target.value)} style={inputStyle} placeholder="e.g. Annual Tech Fest" />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', color: 'var(--text-secondary)' }}>Date</label>
              <input type="date" required value={date} onChange={e => setDate(e.target.value)} style={inputStyle} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', color: 'var(--text-secondary)' }}>Time</label>
              <input type="time" required value={time} onChange={e => setTime(e.target.value)} style={inputStyle} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', color: 'var(--text-secondary)' }}>Venue</label>
              <input type="text" required value={venue} onChange={e => setVenue(e.target.value)} style={inputStyle} placeholder="e.g. Main Auditorium" />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', color: 'var(--text-secondary)' }}>Event Type</label>
              <select value={eventType} onChange={e => setEventType(e.target.value)} style={{ ...inputStyle, cursor: 'pointer' }}>
                <option value="Technical">Technical</option>
                <option value="Cultural">Cultural</option>
                <option value="Sports">Sports</option>
                <option value="Workshop">Workshop</option>
                <option value="Seminar">Seminar</option>
              </select>
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', color: 'var(--text-secondary)' }}>Description</label>
              <textarea required value={description} onChange={e => setDescription(e.target.value)} style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }} placeholder="Brief description of the event..." />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <button type="submit" style={{
                width: '100%', padding: '12px', background: 'var(--accent-primary)', border: 'none',
                borderRadius: 'var(--radius-md)', color: 'white', fontWeight: 700, cursor: 'pointer', fontSize: '14px'
              }}>
                Publish Event
              </button>
            </div>
          </form>
        </GlassCard>
      )}

      {/* Events Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 'var(--space-md)' }}>
        {events.map((event) => (
          <GlassCard key={event.id} padding="lg">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-md)' }}>
              <span style={{
                padding: '4px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: 700,
                background: `${typeColors[event.type] || 'var(--accent-primary)'}20`,
                color: typeColors[event.type] || 'var(--accent-primary)',
                border: `1px solid ${typeColors[event.type] || 'var(--accent-primary)'}40`
              }}>
                {event.type}
              </span>
              {event.createdBy === 'Admin' && (
                <span style={{ fontSize: '10px', color: 'var(--color-warning)' }}>✦ Admin</span>
              )}
            </div>
            <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, marginBottom: '8px' }}>{event.title}</h3>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: 'var(--space-md)', lineHeight: 1.5 }}>{event.description}</p>
            <div style={{ borderTop: '1px solid var(--glass-border)', paddingTop: 'var(--space-sm)' }}>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>📅 {event.date} • ⏰ {event.time}</p>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>📍 {event.venue}</p>
            </div>
          </GlassCard>
        ))}
      </div>

      {events.length === 0 && (
        <GlassCard padding="lg" hover={false} style={{ textAlign: 'center' }}>
          <p style={{ color: 'var(--text-muted)' }}>No events scheduled yet.</p>
        </GlassCard>
      )}
    </div>
  );
}
