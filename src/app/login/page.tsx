'use client';
import Link from 'next/link';
import './auth.css';

export default function AuthPortalSelection() {
    return (
        <div className="auth-body" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
            <div className="background-shape"></div>
            <div className="secondary-shape"></div>
            
            <div style={{
                background: 'rgba(26, 26, 46, 0.85)',
                backdropFilter: 'blur(20px)',
                padding: '40px',
                borderRadius: '16px',
                border: '1px solid var(--glass-border)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                textAlign: 'center',
                maxWidth: '600px',
                width: '90%',
                zIndex: 10
            }}>
                <div style={{
                    width: 60, height: 60, borderRadius: '12px',
                    background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 24px', fontSize: '24px', fontWeight: 900,
                    boxShadow: 'var(--glow-primary)', color: '#fff'
                }}>
                    ◊
                </div>
                
                <h1 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '10px', color: '#fff' }}>CAMPUS OS</h1>
                <p style={{ color: 'var(--text-muted)', marginBottom: '40px', fontSize: '14px' }}>Select your portal clearance to continue</p>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <Link href="/login/student" style={{ textDecoration: 'none' }}>
                        <div style={{
                            padding: '24px', background: 'rgba(0,0,0,0.3)', borderRadius: '12px',
                            border: '1px solid var(--glass-border)', transition: 'all 0.3s',
                            cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--accent-primary)'}
                        onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--glass-border)'}>
                            <i className="bx bxs-graduation" style={{ fontSize: '32px', color: 'var(--accent-primary)', marginBottom: '12px' }}></i>
                            <h3 style={{ color: '#fff', fontSize: '16px', fontWeight: 600 }}>Student Portal</h3>
                        </div>
                    </Link>
                    
                    <Link href="/login/faculty" style={{ textDecoration: 'none' }}>
                        <div style={{
                            padding: '24px', background: 'rgba(0,0,0,0.3)', borderRadius: '12px',
                            border: '1px solid var(--glass-border)', transition: 'all 0.3s',
                            cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--accent-secondary)'}
                        onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--glass-border)'}>
                            <i className="bx bxs-chalkboard" style={{ fontSize: '32px', color: 'var(--accent-secondary)', marginBottom: '12px' }}></i>
                            <h3 style={{ color: '#fff', fontSize: '16px', fontWeight: 600 }}>Faculty Portal</h3>
                        </div>
                    </Link>

                    <Link href="/login/admin" style={{ textDecoration: 'none' }}>
                        <div style={{
                            padding: '24px', background: 'rgba(0,0,0,0.3)', borderRadius: '12px',
                            border: '1px solid var(--glass-border)', transition: 'all 0.3s',
                            cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--color-warning)'}
                        onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--glass-border)'}>
                            <i className="bx bxs-shield-alt-2" style={{ fontSize: '32px', color: 'var(--color-warning)', marginBottom: '12px' }}></i>
                            <h3 style={{ color: '#fff', fontSize: '16px', fontWeight: 600 }}>Admin Portal</h3>
                        </div>
                    </Link>

                    <Link href="/login/superadmin" style={{ textDecoration: 'none' }}>
                        <div style={{
                            padding: '24px', background: 'rgba(0,0,0,0.3)', borderRadius: '12px',
                            border: '1px solid var(--glass-border)', transition: 'all 0.3s',
                            cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--color-danger)'}
                        onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--glass-border)'}>
                            <i className="bx bxs-crown" style={{ fontSize: '32px', color: 'var(--color-danger)', marginBottom: '12px' }}></i>
                            <h3 style={{ color: '#fff', fontSize: '16px', fontWeight: 600 }}>Superadmin Portal</h3>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    );
}
