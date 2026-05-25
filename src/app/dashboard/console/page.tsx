'use client';

import { useState, useEffect, useRef } from 'react';
import { createBrowserClient } from '@supabase/ssr';

interface LogEvent {
  id: string;
  event_type: string;
  severity: 'critical' | 'warning' | 'info' | 'debug';
  payload: Record<string, unknown>;
  source_service: string;
  created_at: string;
}

export default function ConsolePage() {
  const [logs, setLogs] = useState<LogEvent[]>([]);
  const [filter, setFilter] = useState<'all' | 'critical' | 'warning' | 'info' | 'debug'>('all');
  const [autoScroll, setAutoScroll] = useState(true);
  const [selectedLog, setSelectedLog] = useState<LogEvent | null>(null);
  const endOfListRef = useRef<HTMLDivElement>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Mock initial data to prevent 404 until we run the SQL migrations for event_log
    setLogs([
      {
        id: 'evt-1001',
        event_type: 'system.node_connected',
        severity: 'info',
        payload: { node: 'NIT-SUR', latency: 45 },
        source_service: 'api_gateway',
        created_at: new Date(Date.now() - 60000).toISOString()
      },
      {
        id: 'evt-1002',
        event_type: 'auth.admin_override',
        severity: 'warning',
        payload: { user: 'admin@campus.edu', method: 'root_key' },
        source_service: 'rbac_engine',
        created_at: new Date(Date.now() - 30000).toISOString()
      }
    ]);
    setIsConnected(true);

    // Mock real-time streaming
    const interval = setInterval(() => {
      const severities: Array<'info'|'warning'|'critical'|'debug'> = ['info', 'warning', 'critical', 'debug'];
      const randomSeverity = severities[Math.floor(Math.random() * severities.length)];
      const newEvent: LogEvent = {
        id: `evt-${Date.now()}`,
        event_type: randomSeverity === 'critical' ? 'attendance.threshold_breach' : 'network.ping',
        severity: randomSeverity,
        payload: { status: 'processed', value: Math.random() * 100 },
        source_service: randomSeverity === 'critical' ? 'risk_engine' : 'telemetry',
        created_at: new Date().toISOString()
      };
      setLogs(prev => [...prev.slice(-499), newEvent]);
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  // Auto-scroll mechanism
  useEffect(() => {
    if (autoScroll && endOfListRef.current) {
      endOfListRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs, autoScroll]);

  const filteredLogs = logs.filter(log => filter === 'all' || log.severity === filter);

  const severityGlows = {
    critical: 'var(--glow-danger)',
    warning: 'var(--glow-warning)',
    info: 'var(--glow-info)',
    debug: 'var(--glow-debug)',
  };

  const severityColors = {
    critical: 'var(--color-danger)',
    warning: 'var(--color-warning)',
    info: 'var(--color-info)',
    debug: 'var(--color-debug)',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 120px)' }}>
      {/* Console Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 'var(--space-md) var(--space-lg)',
        background: 'rgba(5, 7, 12, 0.8)',
        border: '1px solid var(--glass-border)',
        borderBottom: 'none',
        borderTopLeftRadius: 'var(--radius-lg)',
        borderTopRightRadius: 'var(--radius-lg)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
          <div style={{
            width: 12,
            height: 12,
            borderRadius: '50%',
            background: isConnected ? 'var(--color-success)' : 'var(--color-danger)',
            boxShadow: isConnected ? 'var(--glow-success)' : 'none',
            animation: isConnected ? 'pulseGlow 2s infinite' : 'none',
          }} />
          <h2 style={{
            fontSize: 'var(--text-lg)',
            fontFamily: 'var(--font-mono)',
            fontWeight: 700,
            letterSpacing: '2px',
            textTransform: 'uppercase',
            color: 'var(--text-primary)',
          }}>
            Event Mesh Console
          </h2>
          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
            ({logs.length} events logged)
          </span>
        </div>

        <div style={{ display: 'flex', gap: 'var(--space-md)' }}>
          {/* Filters */}
          <div style={{ display: 'flex', background: 'var(--glass-bg)', borderRadius: 'var(--radius-md)', padding: 2 }}>
            {(['all', 'critical', 'warning', 'info', 'debug'] as const).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                style={{
                  padding: '4px 12px',
                  background: filter === f ? 'rgba(255,255,255,0.1)' : 'transparent',
                  border: 'none',
                  borderRadius: 'var(--radius-sm)',
                  color: filter === f ? 'var(--text-primary)' : 'var(--text-muted)',
                  fontSize: 'var(--text-xs)',
                  fontFamily: 'var(--font-mono)',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                {f}
              </button>
            ))}
          </div>

          <button
            onClick={() => setAutoScroll(!autoScroll)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '6px 12px',
              background: autoScroll ? 'rgba(255,255,255,0.1)' : 'transparent',
              border: '1px solid var(--glass-border)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--text-primary)',
              fontSize: 'var(--text-xs)',
              fontFamily: 'var(--font-mono)',
              cursor: 'pointer',
            }}
          >
            {autoScroll ? '⤓ Auto-scroll ON' : '⇥ Auto-scroll OFF'}
          </button>
        </div>
      </div>

      {/* Main Console Area */}
      <div style={{
        flex: 1,
        display: 'flex',
        border: '1px solid var(--glass-border)',
        borderBottomLeftRadius: 'var(--radius-lg)',
        borderBottomRightRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        background: 'rgba(5, 7, 12, 0.95)',
      }}>
        {/* Log List */}
        <div style={{
          flex: selectedLog ? '0 0 60%' : '1',
          overflowY: 'auto',
          padding: 'var(--space-md)',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-sm)',
          transition: 'all 0.3s ease',
          fontFamily: 'var(--font-mono)',
        }}>
          {filteredLogs.map(log => {
            const isSelected = selectedLog?.id === log.id;
            return (
              <div
                key={log.id}
                onClick={() => setSelectedLog(isSelected ? null : log)}
                style={{
                  padding: '12px 16px',
                  borderRadius: 'var(--radius-md)',
                  background: isSelected ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.02)',
                  border: '1px solid',
                  borderColor: isSelected ? severityColors[log.severity] : 'rgba(255,255,255,0.05)',
                  boxShadow: isSelected ? severityGlows[log.severity] : 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  gap: 'var(--space-lg)',
                  transition: 'all 0.2s',
                  animation: 'fadeIn 0.3s ease-out',
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                    e.currentTarget.style.borderColor = severityColors[log.severity] + '80';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.02)';
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)';
                  }
                }}
              >
                <div style={{
                  minWidth: 100,
                  fontSize: '11px',
                  color: 'var(--text-muted)',
                }}>
                  {new Date(log.created_at).toLocaleTimeString(undefined, {
                    hour12: false,
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    fractionalSecondDigits: 3,
                  })}
                </div>
                
                <div style={{
                  minWidth: 80,
                  fontSize: '11px',
                  color: severityColors[log.severity],
                  textTransform: 'uppercase',
                  fontWeight: 700,
                  letterSpacing: '1px',
                }}>
                  [{log.severity}]
                </div>

                <div style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 4,
                  minWidth: 0,
                }}>
                  <div style={{
                    fontSize: '13px',
                    color: 'var(--text-primary)',
                    fontWeight: 600,
                  }}>
                    {log.event_type}
                  </div>
                  <div style={{
                    fontSize: '12px',
                    color: 'var(--text-muted)',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}>
                    {JSON.stringify(log.payload)}
                  </div>
                </div>

                <div style={{
                  fontSize: '11px',
                  color: 'var(--text-secondary)',
                  opacity: 0.7,
                }}>
                  {log.source_service}
                </div>
              </div>
            );
          })}
          <div ref={endOfListRef} style={{ height: 1 }} />
        </div>

        {/* Selected Log Details (Slide-out) */}
        {selectedLog && (
          <div style={{
            flex: '1',
            borderLeft: '1px solid var(--glass-border)',
            background: 'rgba(0,0,0,0.3)',
            padding: 'var(--space-xl)',
            overflowY: 'auto',
            animation: 'slideInLeft 0.3s ease-out',
            fontFamily: 'var(--font-mono)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-xl)' }}>
              <h3 style={{ fontSize: '1rem', color: severityColors[selectedLog.severity] }}>
                Event Inspection
              </h3>
              <button
                onClick={() => setSelectedLog(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  fontSize: '1.2rem',
                }}
              >
                ×
              </button>
            </div>

            <div style={{ display: 'grid', gap: 'var(--space-lg)' }}>
              <div>
                <p style={{ fontSize: '10px', color: 'var(--text-muted)', marginBottom: 4, textTransform: 'uppercase' }}>Event ID</p>
                <p style={{ fontSize: '13px', color: 'var(--text-primary)' }}>{selectedLog.id}</p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)' }}>
                <div>
                  <p style={{ fontSize: '10px', color: 'var(--text-muted)', marginBottom: 4, textTransform: 'uppercase' }}>Timestamp</p>
                  <p style={{ fontSize: '13px', color: 'var(--text-primary)' }}>{new Date(selectedLog.created_at).toISOString()}</p>
                </div>
                <div>
                  <p style={{ fontSize: '10px', color: 'var(--text-muted)', marginBottom: 4, textTransform: 'uppercase' }}>Source Service</p>
                  <p style={{ fontSize: '13px', color: 'var(--text-primary)' }}>{selectedLog.source_service}</p>
                </div>
              </div>

              <div>
                <p style={{ fontSize: '10px', color: 'var(--text-muted)', marginBottom: 8, textTransform: 'uppercase' }}>Payload Data</p>
                <pre style={{
                  padding: 'var(--space-md)',
                  background: 'rgba(0,0,0,0.5)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--glass-border)',
                  fontSize: '12px',
                  color: 'var(--accent-tertiary)',
                  overflowX: 'auto',
                }}>
                  {JSON.stringify(selectedLog.payload, null, 2)}
                </pre>
              </div>

              {selectedLog.event_type === 'attendance.threshold_breach' && (
                <div style={{
                  padding: 'var(--space-md)',
                  background: 'rgba(255, 60, 60, 0.1)',
                  border: '1px solid var(--color-danger)',
                  borderRadius: 'var(--radius-md)',
                  marginTop: 'var(--space-md)',
                }}>
                  <p style={{ fontSize: '12px', color: 'var(--color-danger)', fontWeight: 600, marginBottom: 8 }}>
                    ⚡ CASCADING RIPPLE TRIGGERED
                  </p>
                  <ul style={{ fontSize: '11px', color: 'var(--text-primary)', paddingLeft: 20 }}>
                    <li>Placement applications frozen</li>
                    <li>Hostel warden notified</li>
                    <li>Advisor alert queued</li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
