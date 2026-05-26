import Link from 'next/link';

export default function AboutUs() {
  return (
    <div style={{ minHeight: '100vh', background: '#050505', color: '#fff', padding: '40px 20px', fontFamily: 'var(--font-sans)' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)', borderRadius: '16px', padding: '40px' }}>
        <div style={{ marginBottom: '30px' }}>
          <Link href="/login" style={{ color: 'var(--accent-primary)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
            &larr; Back to Login
          </Link>
        </div>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '20px' }}>About SARVAM</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '20px', lineHeight: 1.6, fontSize: '1.1rem' }}>Engineered for Excellence.</p>
        
        <div style={{ color: 'var(--text-muted)', lineHeight: 1.8 }}>
          <h2 style={{ color: '#fff', fontSize: '1.5rem', marginTop: '30px', marginBottom: '15px' }}>Our Mission</h2>
          <p style={{ marginBottom: '15px' }}>Our mission is to bridge the gap between traditional educational administration and next-generation technology. We believe that campus operations should be invisible, frictionless, and secure, allowing students and faculty to focus entirely on learning and research.</p>
          
          <h2 style={{ color: '#fff', fontSize: '1.5rem', marginTop: '30px', marginBottom: '15px' }}>Core Technologies</h2>
          <p style={{ marginBottom: '15px' }}>SARVAM leverages modern web architecture including Next.js 14, Supabase Auth for Role-Based Access Control, and real-time database subscriptions to keep all campus nodes perfectly synchronized. From BLE Beacon attendance to AI-driven Placement matching, we bring cutting-edge solutions to everyday campus challenges.</p>
          
          <h2 style={{ color: '#fff', fontSize: '1.5rem', marginTop: '30px', marginBottom: '15px' }}>The Team</h2>
          <p style={{ marginBottom: '15px' }}>Built by a passionate team of developers for the 2026 Code-A-Thon, SARVAM represents the future of institutional management systems.</p>
        </div>
      </div>
    </div>
  );
}
