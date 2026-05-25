'use client';

import { useState, useEffect } from 'react';
import GlassCard from '@/components/ui/GlassCard';
import { createBrowserClient } from '@supabase/ssr';

export default function PlacementsPage() {
  const [uploading, setUploading] = useState(false);
  const [matchScore, setMatchScore] = useState<number | null>(null);
  const [applications, setApplications] = useState<any[]>([]);

  useEffect(() => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    
    supabase.from('placements')
      .select('*, users:student_id(full_name)')
      .order('created_at', { ascending: false })
      .then(({ data }) => setApplications(data || []));
  }, []);

  const handleUpload = () => {
    // Stub for dynamic upload
  };

  return (
    <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
      <div style={{ marginBottom: 'var(--space-xl)' }}>
        <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, marginBottom: 'var(--space-xs)' }}>
          Placement Operations
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: 'var(--text-sm)' }}>
          Skill-Graph Automated Sorting & Active Application Management
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-lg)' }}>
        {/* Candidate Matching Engine */}
        <GlassCard padding="lg" hover={false}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-lg)' }}>
            <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>
              Skill-Graph Engine
            </h3>
            <span className="badge badge-info">Active Reqs: 42</span>
          </div>

          <div style={{
            border: '2px dashed var(--glass-border)',
            borderRadius: 'var(--radius-md)',
            padding: 'var(--space-2xl)',
            textAlign: 'center',
            background: 'rgba(0,0,0,0.2)',
            marginBottom: 'var(--space-lg)',
            transition: 'all 0.3s',
          }}>
            <div style={{ fontSize: '3rem', marginBottom: 'var(--space-md)' }}>📄</div>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-primary)', marginBottom: 8 }}>
              Upload Resume for Auto-Sort
            </p>
            <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: 'var(--space-lg)' }}>
              PDF, DOCX up to 5MB (Processed via Cloudinary)
            </p>
            
            <button
              onClick={handleUpload}
              disabled={uploading}
              className="btn btn-primary"
              style={{ width: '100%', maxWidth: 200 }}
            >
              {uploading ? (
                <>
                  <span className="animate-spin" style={{ display: 'inline-block' }}>◓</span> Processing...
                </>
              ) : 'Select File'}
            </button>
          </div>

          {matchScore !== null && (
            <div style={{
              padding: 'var(--space-lg)',
              background: 'rgba(255,255,255,0.05)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--accent-primary)',
              animation: 'slideUp 0.4s ease-out',
            }}>
              {/* Dynamic match score will map here */}
            </div>
          )}
        </GlassCard>

        {/* Active Applications */}
        <GlassCard padding="lg" hover={false}>
          <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 'var(--space-lg)' }}>
            Pipeline Status
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
            {applications.length > 0 ? applications.map((app, i) => (
              <div key={i} style={{
                padding: 'var(--space-md)',
                background: 'rgba(0,0,0,0.2)',
                border: '1px solid',
                borderColor: app.status === 'frozen' ? 'var(--color-danger)' : 'var(--glass-border)',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
                <div>
                  <p style={{ fontSize: 'var(--text-sm)', fontWeight: 600 }}>{app.company}</p>
                  <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{app.position} • {app.users?.full_name}</p>
                </div>
                
                <div style={{ textAlign: 'right' }}>
                  {app.status === 'frozen' ? (
                    <span className="badge badge-danger">Frozen (Auto)</span>
                  ) : app.status === 'interview_scheduled' ? (
                    <span className="badge badge-success">Slotted</span>
                  ) : (
                    <span className="badge badge-info">{app.status}</span>
                  )}
                  
                  {app.frozen_reason && (
                    <p style={{ fontSize: '10px', color: 'var(--color-danger)', marginTop: 4 }}>
                      {app.frozen_reason}
                    </p>
                  )}
                </div>
              </div>
            )) : <p style={{ fontSize: '12px', color: 'var(--text-muted)', textAlign: 'center', padding: 'var(--space-md)' }}>No active applications</p>}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
