import Link from 'next/link';

export default function TermsConditions() {
  return (
    <div style={{ minHeight: '100vh', background: '#050505', color: '#fff', padding: '40px 20px', fontFamily: 'var(--font-sans)' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)', borderRadius: '16px', padding: '40px' }}>
        <div style={{ marginBottom: '30px' }}>
          <Link href="/login" style={{ color: 'var(--accent-primary)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
            &larr; Back to Login
          </Link>
        </div>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '20px' }}>Terms & Conditions</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '20px', lineHeight: 1.6 }}>Last updated: May 2026</p>
        
        <div style={{ color: 'var(--text-muted)', lineHeight: 1.8 }}>
          <h2 style={{ color: '#fff', fontSize: '1.5rem', marginTop: '30px', marginBottom: '15px' }}>1. Acceptance of Terms</h2>
          <p style={{ marginBottom: '15px' }}>By accessing and using SARVAM, you agree to comply with and be bound by these Terms and Conditions. These terms apply to all students, faculty, administrators, and staff of the institution.</p>
          
          <h2 style={{ color: '#fff', fontSize: '1.5rem', marginTop: '30px', marginBottom: '15px' }}>2. User Responsibilities</h2>
          <p style={{ marginBottom: '15px' }}>You are responsible for maintaining the confidentiality of your account credentials. You agree not to attempt to bypass the Biometric Face ID checks or GeoFencing validation through spoofing, VPNs, or unauthorized devices.</p>
          
          <h2 style={{ color: '#fff', fontSize: '1.5rem', marginTop: '30px', marginBottom: '15px' }}>3. Termination of Access</h2>
          <p style={{ marginBottom: '15px' }}>The institution reserves the right to suspend or terminate your access to SARVAM if you are found to be violating these terms, engaging in academic dishonesty, or manipulating the placement tracking system.</p>
        </div>
      </div>
    </div>
  );
}
