'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import GlassCard from '@/components/ui/GlassCard';
import { createClient } from '@/lib/supabase/client';
import Webcam from 'react-webcam';

export default function AttendancePage() {
  const [role, setRole] = useState('student');
  const [alerts, setAlerts] = useState<any[]>([]);
  
  // Faculty State
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  
  // Student State
  const [isCapturing, setIsCapturing] = useState(false);
  const [captureStatus, setCaptureStatus] = useState<string | null>(null);

  // Admin State
  const [qrToken, setQrToken] = useState('GENERATING_SECURE_TOKEN...');
  const [timeLeft, setTimeLeft] = useState(4);
  const [logs, setLogs] = useState<any[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<'idle'|'success'|'error'>('idle');
  const [studentName, setStudentName] = useState('');
  const webcamRef = useRef<Webcam>(null);

  useEffect(() => {
    const fetchRole = async () => {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setRole(session.user.user_metadata?.role || 'student');
      }
    };
    fetchRole();
  }, []);

  // --- ADMIN LOGIC ---
  const startScan = useCallback(() => {
    setIsScanning(true);
    setScanResult('idle');
    setTimeout(() => {
      setIsScanning(false);
      setScanResult('success');
      setLogs(prev => [
        { users: { full_name: studentName.trim() || 'Authorized Admin (Face ID)' }, geo_verified: true, method: 'Biometric Face Match' },
        ...prev
      ].slice(0, 6));
      setStudentName('');
      setTimeout(() => setScanResult('idle'), 5000);
    }, 3000);
  }, [studentName]);

  useEffect(() => {
    if (role !== 'admin' && role !== 'superadmin') return;

    setLogs([
      { users: { full_name: 'Anjali Desai' }, geo_verified: true, method: 'QR + GeoFencing' },
      { users: { full_name: 'Rahul Sharma' }, geo_verified: false, method: 'Location Mismatch' }
    ]);

    const interval = setInterval(() => {
      const isVerified = Math.random() > 0.2;
      const methods = ['QR + GeoFencing', 'BLE Beacon', 'Campus WiFi'];
      const failMethods = ['GPS Spoof Detected', 'IP Mismatch', 'Token Expired'];
      const newLog = {
        users: { full_name: `Node ${Math.floor(Math.random() * 9000) + 1000}` },
        geo_verified: isVerified,
        method: isVerified ? methods[Math.floor(Math.random() * methods.length)] : failMethods[Math.floor(Math.random() * failMethods.length)]
      };
      setLogs(prev => [newLog, ...prev].slice(0, 6));
    }, 10000);
      
    return () => clearInterval(interval);
  }, [role]);

  // --- FACULTY LOGIC ---
  const startBroadcast = () => {
    setIsBroadcasting(true);
    setTimeout(() => {
      setIsBroadcasting(false);
    }, 10000); // 10s broadcast
  };

  // --- STUDENT LOGIC ---
  const captureAttendance = () => {
    setIsCapturing(true);
    setCaptureStatus('Scanning for Bluetooth Beacons...');
    setTimeout(() => {
      setCaptureStatus('Attendance Captured Successfully!');
      setIsCapturing(false);
      setTimeout(() => setCaptureStatus(null), 3000);
    }, 2000);
  };
  const attended = 42;
  const missed = 3;
  const total = attended + missed;
  const attendanceRate = ((attended / total) * 100).toFixed(1);

  // --- RENDER ---
  if (role === 'faculty') {
    return (
      <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
        <div style={{ marginBottom: 'var(--space-xl)' }}>
          <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, marginBottom: 'var(--space-xs)' }}>
            Faculty Attendance Portal
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 'var(--text-sm)' }}>
            Broadcast secure attendance token to students in proximity
          </p>
        </div>

        <GlassCard padding="lg" hover={false}>
          <div style={{ textAlign: 'center', padding: 'var(--space-2xl) 0' }}>
            <div style={{
              width: 120, height: 120, borderRadius: '50%', background: isBroadcasting ? 'var(--color-success)' : 'var(--glass-bg)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto var(--space-xl)',
              boxShadow: isBroadcasting ? '0 0 30px var(--color-success)' : 'none',
              transition: 'all 0.3s ease',
            }}>
              <i className={isBroadcasting ? "bx bx-broadcast" : "bx bx-bluetooth"} style={{ fontSize: '48px', color: isBroadcasting ? '#000' : 'var(--accent-primary)' }}></i>
            </div>
            <h2 style={{ fontSize: '24px', marginBottom: 'var(--space-md)' }}>
              {isBroadcasting ? 'Broadcasting Token...' : 'Session Inactive'}
            </h2>
            <button
              onClick={startBroadcast}
              disabled={isBroadcasting}
              style={{
                padding: '12px 32px',
                background: isBroadcasting ? 'transparent' : 'var(--accent-primary)',
                border: isBroadcasting ? '1px solid var(--glass-border)' : 'none',
                color: 'white',
                borderRadius: 'var(--radius-md)',
                fontWeight: 700,
                cursor: isBroadcasting ? 'not-allowed' : 'pointer',
              }}
            >
              {isBroadcasting ? 'Broadcasting (10s left)' : 'Start Attendance Broadcast'}
            </button>
          </div>
        </GlassCard>
      </div>
    );
  }

  if (role === 'admin' || role === 'superadmin') {
    return (
      <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
        <div style={{ marginBottom: 'var(--space-xl)' }}>
          <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, marginBottom: 'var(--space-xs)' }}>
            Spatial Attendance
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 'var(--text-sm)' }}>
            Luminous Rolling Tokenization with Geo-fence validation
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 'var(--space-lg)' }}>
          {/* Faculty View: QR Projector */}
          <GlassCard padding="lg" hover={false}>
            <div style={{ textAlign: 'center' }}>
              <h3 style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 'var(--space-xl)' }}>
                Biometric Liveness Detection
              </h3>

              {/* Webcam Scanner */}
              <div style={{
                width: 280,
                height: 280,
                margin: '0 auto',
                background: 'black',
                borderRadius: 'var(--radius-xl)',
                position: 'relative',
                overflow: 'hidden',
                boxShadow: scanResult === 'success' ? '0 0 40px var(--color-success)' : 'var(--glow-primary)',
                border: `2px solid ${scanResult === 'success' ? 'var(--color-success)' : 'var(--glass-border)'}`,
                transition: 'all 0.5s ease'
              }}>
                <Webcam
                  ref={webcamRef}
                  audio={false}
                  screenshotFormat="image/jpeg"
                  videoConstraints={{ facingMode: "user" }}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />

                {/* Grid overlay */}
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: `repeating-linear-gradient(transparent, transparent 2px, rgba(0,0,0,0.2) 3px, rgba(0,0,0,0.2) 4px)`,
                  pointerEvents: 'none',
                  opacity: 0.5,
                }} />

                {/* Scanning laser line */}
                {isScanning && (
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 3,
                    background: 'var(--accent-secondary)',
                    boxShadow: '0 0 20px 4px var(--accent-secondary)',
                    animation: 'scan 1.5s ease-in-out infinite alternate',
                    zIndex: 10,
                  }} />
                )}

                {/* Facial alignment guides */}
                <div style={{
                  position: 'absolute',
                  top: '20%', bottom: '20%', left: '20%', right: '20%',
                  border: `2px dashed ${scanResult === 'success' ? 'var(--color-success)' : isScanning ? 'var(--accent-secondary)' : 'rgba(255,255,255,0.3)'}`,
                  borderRadius: '50%',
                  transition: 'border-color 0.3s ease',
                }} />
                
                {/* Success Overlay */}
                {scanResult === 'success' && (
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'rgba(16, 185, 129, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backdropFilter: 'blur(2px)',
                  }}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '3rem', marginBottom: '8px' }}>✅</div>
                      <p style={{ color: 'white', fontWeight: 'bold', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>IDENTITY VERIFIED</p>
                    </div>
                  </div>
                )}
              </div>

              <div style={{ marginTop: 'var(--space-xl)', display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
                <input
                  type="text"
                  placeholder="Enter Student Name..."
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  disabled={isScanning || scanResult === 'success'}
                  style={{
                    width: '100%',
                    padding: '10px 16px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid var(--glass-border)',
                    borderRadius: 'var(--radius-md)',
                    color: 'white',
                    fontSize: '14px',
                    outline: 'none',
                    transition: 'border-color 0.3s',
                  }}
                  onFocus={(e) => e.target.style.borderColor = 'var(--accent-primary)'}
                  onBlur={(e) => e.target.style.borderColor = 'var(--glass-border)'}
                />
                <button
                  onClick={startScan}
                  disabled={isScanning || scanResult === 'success'}
                  style={{
                    padding: '12px 24px',
                    background: isScanning ? 'transparent' : 'var(--accent-primary)',
                    border: isScanning ? '1px solid var(--accent-primary)' : 'none',
                    color: 'white',
                    borderRadius: 'var(--radius-md)',
                    fontWeight: 700,
                    letterSpacing: '1px',
                    cursor: isScanning || scanResult === 'success' ? 'not-allowed' : 'pointer',
                    textTransform: 'uppercase',
                    fontSize: '12px',
                    boxShadow: isScanning ? 'none' : 'var(--glow-primary)',
                    transition: 'all 0.3s',
                    width: '100%',
                  }}
                >
                  {isScanning ? 'Extracting Vector Nodes...' : scanResult === 'success' ? 'Node Verified' : 'Initialize Face Scan'}
                </button>
              </div>
            </div>
          </GlassCard>

          {/* Live Tracking */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
            <GlassCard padding="lg" hover={false}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-lg)' }}>
                <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>
                  Live Validation Stream
                </h3>
                <span className="badge badge-success">Accepting</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
                {logs.length > 0 ? logs.map((record, i) => {
                  const verified = record.geo_verified || record.wifi_verified;
                  return (
                  <div key={i} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '12px 16px',
                    background: 'rgba(0,0,0,0.2)',
                    border: '1px solid var(--glass-border)',
                    borderRadius: 'var(--radius-md)',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
                      <div style={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        background: verified ? 'var(--color-success)' : 'var(--color-danger)'
                      }} />
                      <span style={{ fontSize: 'var(--text-sm)', fontWeight: 600 }}>{record.users?.full_name}</span>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{
                        fontSize: '11px',
                        color: verified ? 'var(--color-success)' : 'var(--color-danger)',
                        textTransform: 'uppercase',
                        fontWeight: 700,
                        display: 'block',
                      }}>
                        {verified ? 'verified' : 'rejected'}
                      </span>
                      <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{record.method}</span>
                    </div>
                  </div>
                )}) : <p style={{ fontSize: '12px', color: 'var(--text-muted)', textAlign: 'center', padding: 'var(--space-md)' }}>No active validations</p>}
              </div>
            </GlassCard>

            <GlassCard padding="lg" hover={false} glow="danger">
              <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 'var(--space-md)' }}>
                Threshold Alerts
              </h3>
              <div style={{ padding: 'var(--space-md)', background: 'rgba(255, 60, 60, 0.1)', borderRadius: 'var(--radius-md)' }}>
                <p style={{ fontSize: '13px', color: 'var(--text-primary)', marginBottom: 8 }}>
                  <strong>Rahul Sharma</strong> (CS-204) dropped to 68.5%
                </p>
                <p style={{ fontSize: '11px', color: 'var(--color-danger)' }}>
                  Cascading Ripple executed: Placements frozen. Warden notified.
                </p>
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    );
  }

  // Student View Tab State
  const [activeTab, setActiveTab] = useState('attendance');

  // Student View
  return (
    <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
      <div style={{ marginBottom: 'var(--space-xl)' }}>
        <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, marginBottom: 'var(--space-xs)' }}>
          <span style={{ color: 'var(--accent-primary)', marginRight: 8 }}>◎</span>
          Academics Hub
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: 'var(--text-sm)' }}>
          Manage your attendance, class schedules, and academic assignments.
        </p>
      </div>

      {/* Navigation Tabs */}
      <div style={{ display: 'flex', gap: 'var(--space-sm)', marginBottom: 'var(--space-xl)', borderBottom: '1px solid var(--glass-border)', paddingBottom: 'var(--space-sm)' }}>
        {['attendance', 'timetable', 'assignments'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '8px 16px',
              background: activeTab === tab ? 'var(--accent-primary)' : 'transparent',
              color: activeTab === tab ? '#000' : 'var(--text-secondary)',
              borderRadius: 'var(--radius-md)',
              fontWeight: activeTab === tab ? 700 : 500,
              border: 'none',
              cursor: 'pointer',
              textTransform: 'capitalize',
              transition: 'all 0.2s ease'
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'attendance' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 'var(--space-lg)', animation: 'fadeIn 0.3s ease-out' }}>
          <GlassCard padding="lg" hover={false}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ fontSize: 'var(--text-md)', fontWeight: 700, marginBottom: '4px' }}>Capture Live Attendance</h3>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>Scan for faculty Bluetooth beacon to log your presence.</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
                {captureStatus && <span style={{ fontSize: '12px', color: 'var(--color-success)', fontWeight: 600 }}>{captureStatus}</span>}
                <button
                  onClick={captureAttendance}
                  disabled={isCapturing}
                  style={{
                    padding: '10px 24px',
                    background: isCapturing ? 'transparent' : 'var(--accent-primary)',
                    border: isCapturing ? '1px solid var(--accent-primary)' : 'none',
                    color: '#000',
                    borderRadius: 'var(--radius-md)',
                    fontWeight: 700,
                    cursor: isCapturing ? 'not-allowed' : 'pointer',
                  }}
                >
                  {isCapturing ? 'Scanning...' : 'Capture Attendance'}
                </button>
              </div>
            </div>
          </GlassCard>

          <GlassCard padding="lg" hover={false}>
            <h3 style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 'var(--space-xl)' }}>
              Semester Overview
            </h3>
            
            <div style={{ display: 'flex', gap: 'var(--space-3xl)', justifyContent: 'center', marginBottom: 'var(--space-2xl)' }}>
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: '4rem', fontWeight: 800, color: 'var(--color-success)', lineHeight: 1 }}>{attended}</p>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginTop: '8px' }}>Classes Attended</p>
              </div>
              
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: '4rem', fontWeight: 800, color: 'var(--color-danger)', lineHeight: 1 }}>{missed}</p>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginTop: '8px' }}>Classes Missed</p>
              </div>
            </div>
            
            <div style={{
              background: 'rgba(0,0,0,0.2)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--glass-border)',
              padding: 'var(--space-md)',
              textAlign: 'center'
            }}>
              <p style={{ fontSize: '16px', color: 'var(--text-secondary)' }}>
                Overall Attendance Rate: <strong style={{ color: 'var(--color-success)', fontSize: '18px' }}>{attendanceRate}%</strong>
              </p>
            </div>
          </GlassCard>
        </div>
      )}

      {activeTab === 'timetable' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)', animation: 'fadeIn 0.3s ease-out' }}>
          <GlassCard padding="lg" hover={false}>
            <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, marginBottom: 'var(--space-lg)' }}>Today's Schedule</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
              {[
                { time: '09:00 AM - 10:30 AM', subject: 'Data Structures (CS301)', type: 'Lecture', room: 'LH-1' },
                { time: '11:00 AM - 01:00 PM', subject: 'OS Lab (CS302L)', type: 'Lab', room: 'Lab 4' },
                { time: '02:00 PM - 03:00 PM', subject: 'Machine Learning (CS401)', type: 'Lecture', room: 'LH-3' },
              ].map((cls, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-md)', padding: 'var(--space-md)' }}>
                  <div style={{ width: '150px', borderRight: '1px solid var(--glass-border)', paddingRight: 'var(--space-md)' }}>
                    <p style={{ fontSize: '12px', fontWeight: 600, color: 'var(--accent-primary)' }}>{cls.time}</p>
                  </div>
                  <div style={{ paddingLeft: 'var(--space-md)', flex: 1 }}>
                    <p style={{ fontSize: '14px', fontWeight: 700 }}>{cls.subject}</p>
                    <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: 4 }}>{cls.type} • Room: {cls.room}</p>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      )}

      {activeTab === 'assignments' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-lg)', animation: 'fadeIn 0.3s ease-out' }}>
          {/* Pending */}
          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-md)' }}>
            <h4 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-danger)', marginBottom: 'var(--space-md)', display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--color-danger)' }} /> Pending
            </h4>
            <div style={{ background: 'rgba(0,0,0,0.3)', padding: 'var(--space-md)', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(255,60,60,0.2)' }}>
              <p style={{ fontSize: '13px', fontWeight: 600 }}>OS CPU Scheduling Project</p>
              <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: 4 }}>Due: Tomorrow, 11:59 PM</p>
              <button style={{ marginTop: 'var(--space-md)', width: '100%', padding: '6px', background: 'rgba(255,60,60,0.1)', color: 'var(--color-danger)', border: '1px solid rgba(255,60,60,0.3)', borderRadius: 4, fontSize: '11px', fontWeight: 700, cursor: 'pointer' }}>Submit Now</button>
            </div>
          </div>

          {/* Submitted */}
          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-md)' }}>
            <h4 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--accent-primary)', marginBottom: 'var(--space-md)', display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--accent-primary)' }} /> Submitted
            </h4>
            <div style={{ background: 'rgba(0,0,0,0.3)', padding: 'var(--space-md)', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(0,255,255,0.2)' }}>
              <p style={{ fontSize: '13px', fontWeight: 600 }}>ML Regression Assignment</p>
              <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: 4 }}>Submitted: 2 days ago</p>
              <p style={{ fontSize: '11px', color: 'var(--accent-primary)', marginTop: 8 }}>Awaiting Grade</p>
            </div>
          </div>

          {/* Graded */}
          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-md)' }}>
            <h4 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-success)', marginBottom: 'var(--space-md)', display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--color-success)' }} /> Graded
            </h4>
            <div style={{ background: 'rgba(0,0,0,0.3)', padding: 'var(--space-md)', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(16,185,129,0.2)', marginBottom: 'var(--space-sm)' }}>
              <p style={{ fontSize: '13px', fontWeight: 600 }}>DS Trees & Graphs</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
                <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Score:</p>
                <p style={{ fontSize: '14px', fontWeight: 800, color: 'var(--color-success)' }}>9.5 / 10</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
