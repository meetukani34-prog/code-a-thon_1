'use client';
import Link from 'next/link';
import './auth.css';
import NeuralBackground from '@/components/ui/flow-field-background';

export default function AuthPortalSelection() {
    return (
        <div className="relative min-h-screen w-full overflow-hidden bg-black">
            <NeuralBackground 
                color="#00d4ff" 
                trailOpacity={0.15} 
                particleCount={800} 
                speed={0.8} 
                className="absolute inset-0 z-0" 
            />
            <div className="auth-body relative z-20" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', overflowX: 'hidden', width: '100%' }}>
                <div className="background-shape"></div>
                <div className="secondary-shape"></div>
                
                {/* Header Section */}
                <header style={{ width: '100%', padding: '24px 5%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 10, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{
                            width: 32, height: 32, borderRadius: '8px',
                            background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '16px', fontWeight: 900,
                            boxShadow: 'var(--glow-primary)', color: '#fff'
                        }}>
                            ◊
                        </div>
                        <span style={{ fontSize: '1.2rem', fontWeight: 800, letterSpacing: '1px' }}>CAMPUS OS</span>
                    </div>
                    <nav style={{ display: 'flex', gap: '20px' }}>
                        <span style={{ fontSize: '12px', color: 'var(--accent-primary)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700, border: '1px solid var(--accent-primary)', padding: '6px 12px', borderRadius: '20px' }}>Code-A-Thon Prototype</span>
                    </nav>
                </header>
    
                {/* Main Content */}
                <main style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 20px', zIndex: 10 }}>
                    
                    {/* Project Description (Hero Section) */}
                    <div style={{ textAlign: 'center', maxWidth: '900px', marginBottom: '60px' }}>
                        <h1 style={{ fontSize: '3.5rem', fontWeight: 900, marginBottom: '20px', background: 'linear-gradient(to right, #fff, #9ca3af)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', lineHeight: 1.1 }}>
                            The Future of Institutional Management
                        </h1>
                        <p style={{ fontSize: '1.15rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '30px', maxWidth: '800px', margin: '0 auto 30px' }}>
                            A centralized, role-based operating system designed to streamline campus operations. Featuring <strong>Biometric Face ID Attendance</strong>, <strong>Live Synchronized Timetables</strong>, <strong>Dynamic Placement Tracking</strong>, and granular <strong>Identity Access Management (RBAC)</strong> across multiple campus nodes.
                        </p>
                        
                        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
                            <span style={{ padding: '8px 16px', background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.3)', borderRadius: '20px', fontSize: '13px', color: 'var(--accent-primary)', fontWeight: 600 }}>Biometric Face ID</span>
                            <span style={{ padding: '8px 16px', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '20px', fontSize: '13px', color: 'var(--color-success)', fontWeight: 600 }}>RBAC Security</span>
                            <span style={{ padding: '8px 16px', background: 'rgba(234, 179, 8, 0.1)', border: '1px solid rgba(234, 179, 8, 0.3)', borderRadius: '20px', fontSize: '13px', color: 'var(--color-warning)', fontWeight: 600 }}>Live Timetable Sync</span>
                            <span style={{ padding: '8px 16px', background: 'rgba(168, 85, 247, 0.1)', border: '1px solid rgba(168, 85, 247, 0.3)', borderRadius: '20px', fontSize: '13px', color: '#a855f7', fontWeight: 600 }}>Placement Tracking</span>
                        </div>
                    </div>
    
                    {/* Login Modal */}
                    <div style={{
                        background: 'rgba(10, 10, 15, 0.8)',
                        backdropFilter: 'blur(20px)',
                        WebkitBackdropFilter: 'blur(20px)',
                        padding: '40px',
                        borderRadius: '16px',
                        border: '1px solid var(--glass-border)',
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), 0 0 40px rgba(59, 130, 246, 0.1)',
                        textAlign: 'center',
                        maxWidth: '600px',
                        width: '100%',
                    }}>
                        <h2 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '10px', color: '#fff' }}>Access Portal</h2>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '30px', fontSize: '14px' }}>Select your security clearance level to continue</p>
                        
                        {/* Student & Faculty Buttons */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                            <Link href="/login/student" style={{ textDecoration: 'none' }}>
                                <div style={{
                                    padding: '24px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px',
                                    border: '1px solid var(--glass-border)', transition: 'all 0.3s',
                                    cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center'
                                }}
                                onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--accent-primary)'; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; }}
                                onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--glass-border)'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; }}>
                                    <i className="bx bxs-graduation" style={{ fontSize: '32px', color: 'var(--accent-primary)', marginBottom: '12px' }}></i>
                                    <h3 style={{ color: '#fff', fontSize: '16px', fontWeight: 600 }}>Student Portal</h3>
                                </div>
                            </Link>
                            
                            <Link href="/login/faculty" style={{ textDecoration: 'none' }}>
                                <div style={{
                                    padding: '24px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px',
                                    border: '1px solid var(--glass-border)', transition: 'all 0.3s',
                                    cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center'
                                }}
                                onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--accent-secondary)'; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; }}
                                onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--glass-border)'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; }}>
                                    <i className="bx bxs-chalkboard" style={{ fontSize: '32px', color: 'var(--accent-secondary)', marginBottom: '12px' }}></i>
                                    <h3 style={{ color: '#fff', fontSize: '16px', fontWeight: 600 }}>Faculty Portal</h3>
                                </div>
                            </Link>
                        </div>
                    </div>
                </main>
    
                {/* Footer Section */}
                <footer style={{ width: '100%', padding: '30px 5%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.05)', zIndex: 10, color: 'var(--text-muted)', fontSize: '13px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
                        <span>&copy; 2026 Campus OS. Engineered for Excellence.</span>
                        <div style={{ display: 'flex', gap: '15px' }}>
                            <Link href="/privacy-policy" style={{ color: 'var(--text-secondary)', textDecoration: 'none', transition: 'color 0.2s' }}>Privacy Policy</Link>
                            <Link href="/terms-conditions" style={{ color: 'var(--text-secondary)', textDecoration: 'none', transition: 'color 0.2s' }}>Terms & Conditions</Link>
                            <Link href="/about-us" style={{ color: 'var(--text-secondary)', textDecoration: 'none', transition: 'color 0.2s' }}>About Us</Link>
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: '20px', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>
                        <span>Next.js 14</span>
                        <span>Supabase Auth</span>
                        <span>Realtime DB</span>
                    </div>
                </footer>
            </div>
        </div>
    );
}
