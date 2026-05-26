import Link from 'next/link';

export default function PrivacyPolicy() {
  return (
    <div style={{ minHeight: '100vh', background: '#050505', color: '#fff', padding: '40px 20px', fontFamily: 'var(--font-sans)' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)', borderRadius: '16px', padding: '40px' }}>
        <div style={{ marginBottom: '30px' }}>
          <Link href="/login" style={{ color: 'var(--accent-primary)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
            &larr; Back to Login
          </Link>
        </div>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '20px' }}>Privacy Policy</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '20px', lineHeight: 1.6 }}>Last updated: May 2026</p>
        
        <div style={{ color: 'var(--text-muted)', lineHeight: 1.8 }}>
          <h2 style={{ color: '#fff', fontSize: '1.5rem', marginTop: '30px', marginBottom: '15px' }}>1. Data Collection</h2>
          <p style={{ marginBottom: '15px' }}>At SARVAM, we collect and process biometric data, location data, and academic records solely for the purpose of maintaining a secure and efficient campus environment. Your Face ID embeddings are cryptographically hashed and never stored as raw images.</p>
          
          <h2 style={{ color: '#fff', fontSize: '1.5rem', marginTop: '30px', marginBottom: '15px' }}>2. Data Usage</h2>
          <p style={{ marginBottom: '15px' }}>Your data is used to automatically record attendance, verify identity at security checkpoints, and match your profile with prospective employers via our AI Placement Engine. We do not sell your personal data to third parties.</p>
          
          <h2 style={{ color: '#fff', fontSize: '1.5rem', marginTop: '30px', marginBottom: '15px' }}>3. Security</h2>
          <p style={{ marginBottom: '15px' }}>SARVAM utilizes military-grade encryption (AES-256) and Role-Based Access Control (RBAC) to ensure that only authorized personnel can view specific subsets of your data.</p>
        </div>
      </div>
    </div>
  );
}
