'use client';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import '../auth.css';

export default function RoleAuthPage() {
    const params = useParams();
    const roleParam = (params?.role as string) || 'student';
    const isAdminRole = roleParam === 'admin' || roleParam === 'superadmin';
    
    // States for standard users
    const [isToggled, setIsToggled] = useState(false);
    const [showSigninPassword, setShowSigninPassword] = useState(false);
    const [showSignupPassword, setShowSignupPassword] = useState(false);
    
    const [usn, setUsn] = useState('');
    const [fullName, setFullName] = useState('');
    const [branch, setBranch] = useState('');
    
    // Shared states
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);
    
    // Admin specific state
    const [clearanceKey, setClearanceKey] = useState('');

    const displayTitle = roleParam === 'superadmin' ? 'Super Admin' : 
                         roleParam.charAt(0).toUpperCase() + roleParam.slice(1);

    const handleStandardAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setMessage(null);

        const supabase = createClient();

        if (!isToggled) {
            const { error, data } = await supabase.auth.signInWithPassword({ email, password });
            if (error) {
                setError(error.message);
                setLoading(false);
            } else {
                const userRole = data.user?.user_metadata?.role?.toLowerCase() || 'student';
                if (roleParam !== 'student' && userRole !== roleParam) {
                    setError(`Unauthorized. This account is registered as ${userRole}.`);
                    await supabase.auth.signOut();
                    setLoading(false);
                    return;
                }
                router.push(`/${userRole}`);
            }
        } else {
            const { error, data } = await supabase.auth.signUp({ 
                email, 
                password,
                options: {
                    data: {
                        full_name: fullName,
                        usn,
                        branch,
                        role: roleParam
                    }
                }
            });
            if (error) {
                setError(error.message);
            } else {
                if (data.session) {
                    const userRole = data.user?.user_metadata?.role?.toLowerCase() || 'student';
                    router.push(`/${userRole}`);
                } else {
                    setMessage('Registration successful! Check your email to confirm if required.');
                    setIsToggled(false);
                }
            }
        }
        setLoading(false);
    };

    const handleAdminAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (clearanceKey !== 'root123') {
            setError('Invalid Security Clearance Key.');
            setLoading(false);
            return;
        }

        const supabase = createClient();
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (signInError) {
            const { data, error: signUpError } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        role: roleParam,
                        full_name: `${displayTitle} Account`,
                    },
                },
            });

            if (signUpError) {
                setError(signUpError.message);
                setLoading(false);
                return;
            }
        }
        let finalRole = roleParam;
        if (signInData && !signInError) {
            // Check if existing user actually has the required role
            const userRole = signInData?.user?.user_metadata?.role?.toLowerCase();
            if (userRole !== roleParam) {
                setError(`Unauthorized for this portal. This account is registered as a ${userRole || 'student'}. Please use the /login/${userRole || 'student'} portal.`);
                await supabase.auth.signOut();
                setLoading(false);
                return;
            }
            finalRole = userRole;
        }

        router.push(`/${finalRole}`);
        router.refresh();
    };

    useEffect(() => {
        if (!isAdminRole) {
            const link = document.createElement('link');
            link.href = 'https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css';
            link.rel = 'stylesheet';
            document.head.appendChild(link);
            return () => {
                if (document.head.contains(link)) document.head.removeChild(link);
            };
        }
    }, [isAdminRole]);

    // Admin UI
    if (isAdminRole) {
        return (
            <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[#050505]">
              <style>{`
                .admin-grid {
                  position: absolute;
                  inset: 0;
                  background-image: 
                    linear-gradient(to right, rgba(220, 38, 38, 0.05) 1px, transparent 1px),
                    linear-gradient(to bottom, rgba(220, 38, 38, 0.05) 1px, transparent 1px);
                  background-size: 40px 40px;
                  mask-image: radial-gradient(circle at center, black 40%, transparent 80%);
                  pointer-events: none;
                }
                .admin-card {
                  background: rgba(10, 0, 0, 0.7);
                  backdrop-filter: blur(20px);
                  -webkit-backdrop-filter: blur(20px);
                  border: 1px solid rgba(220, 38, 38, 0.2);
                  box-shadow: 0 0 40px rgba(220, 38, 38, 0.15), inset 0 0 20px rgba(220, 38, 38, 0.05);
                  position: relative;
                  overflow: hidden;
                }
                .admin-card::before {
                  content: '';
                  position: absolute;
                  top: 0; left: -100%; width: 50%; height: 2px;
                  background: linear-gradient(90deg, transparent, rgba(220, 38, 38, 0.8), transparent);
                  animation: scan-line 3s linear infinite;
                }
                @keyframes scan-line {
                  0% { left: -100%; }
                  100% { left: 200%; }
                }
                .admin-input {
                  background: rgba(220, 38, 38, 0.03) !important;
                  border: 1px solid rgba(220, 38, 38, 0.1) !important;
                  color: #ffb3b3 !important;
                  transition: all 0.3s ease !important;
                }
                .admin-input:focus {
                  background: rgba(220, 38, 38, 0.08) !important;
                  border-color: rgba(220, 38, 38, 0.5) !important;
                  box-shadow: 0 0 15px rgba(220, 38, 38, 0.2) !important;
                  outline: none !important;
                }
                .admin-input::placeholder {
                  color: rgba(220, 38, 38, 0.3) !important;
                }
                .admin-btn {
                  background: linear-gradient(90deg, #991b1b, #dc2626, #991b1b) !important;
                  background-size: 200% auto !important;
                  border: 1px solid rgba(255, 100, 100, 0.4) !important;
                  color: white !important;
                  text-shadow: 0 0 5px rgba(255,255,255,0.5) !important;
                  transition: all 0.4s ease !important;
                  box-shadow: 0 4px 15px rgba(220, 38, 38, 0.3) !important;
                }
                .admin-btn:hover {
                  background-position: right center !important;
                  box-shadow: 0 0 25px rgba(220, 38, 38, 0.6) !important;
                  transform: translateY(-2px) !important;
                }
                .warning-icon {
                  animation: pulse-warning 2s infinite;
                }
                @keyframes pulse-warning {
                  0%, 100% { filter: drop-shadow(0 0 5px rgba(220, 38, 38, 0.5)); transform: scale(1); }
                  50% { filter: drop-shadow(0 0 15px rgba(220, 38, 38, 0.8)); transform: scale(1.05); }
                }
                .glitch-text {
                  text-shadow: 0 0 15px rgba(220, 38, 38, 0.6);
                  letter-spacing: 4px;
                }
              `}</style>

              <div className="admin-grid"></div>
              
              <Card className="w-full max-w-md relative z-10 admin-card border-0 rounded-xl sm:p-2">
                <CardHeader className="text-center pb-2 pt-6">
                  <div className="mx-auto w-14 h-14 mb-4 rounded-full bg-red-950/40 flex items-center justify-center border border-red-500/30 warning-icon">
                    <span className="text-red-500 text-2xl">⚠️</span>
                  </div>
                  <CardTitle className="text-3xl font-black text-red-500 glitch-text uppercase">RESTRICTED AREA</CardTitle>
                  <CardDescription className="text-red-400/60 mt-3 font-mono text-xs uppercase tracking-widest">
                    {displayTitle} Gateway • Unauthorized access logged
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleAdminAuth} className="space-y-5 mt-4">
                    <div className="space-y-2 relative group">
                      <div className="absolute -inset-0.5 bg-red-500/20 blur opacity-0 group-hover:opacity-100 transition duration-500 rounded-lg"></div>
                      <Input 
                        type="email" 
                        placeholder="Node Identifier (Email)" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="admin-input relative h-12 px-4 rounded-lg font-mono text-sm"
                        required 
                      />
                    </div>
                    <div className="space-y-2 relative group">
                      <div className="absolute -inset-0.5 bg-red-500/20 blur opacity-0 group-hover:opacity-100 transition duration-500 rounded-lg"></div>
                      <Input 
                        type="password" 
                        placeholder="Access Key (Password)" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="admin-input relative h-12 px-4 rounded-lg font-mono text-sm"
                        required 
                      />
                    </div>
                    <div className="space-y-2 pt-6 mt-4 border-t border-red-900/30 relative group">
                      <label className="text-[10px] font-mono text-red-500/80 uppercase tracking-[0.2em] mb-2 block">Security Clearance Key</label>
                      <div className="absolute -inset-0.5 bg-red-500/20 blur opacity-0 group-hover:opacity-100 transition duration-500 rounded-lg top-8"></div>
                      <Input 
                        type="password" 
                        placeholder="Master Override Key (hint: root123)" 
                        value={clearanceKey}
                        onChange={(e) => setClearanceKey(e.target.value)}
                        className="admin-input relative h-12 px-4 rounded-lg font-mono text-center tracking-widest"
                        required 
                      />
                    </div>
        
                    {error && (
                      <div className="p-3 mt-4 rounded-md bg-red-950/60 border border-red-500/40 text-red-400 text-xs text-center font-mono shadow-[0_0_10px_rgba(220,38,38,0.2)]">
                        ACCESS DENIED: {error}
                      </div>
                    )}
        
                    <Button 
                      type="submit" 
                      className="admin-btn w-full h-12 rounded-lg font-bold tracking-[0.2em] mt-8 text-sm"
                      disabled={loading}
                    >
                      {loading ? 'AUTHENTICATING...' : 'INITIALIZE OVERRIDE →'}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          );
    }

    // Standard UI (Student/Faculty)
    return (
        <div className="auth-body">
            <div className={`auth-wrapper ${isToggled ? 'toggled' : ''}`}>
                <div className="background-shape"></div>
                <div className="secondary-shape"></div>

                <div className="credentials-panel signin">
                    <h2 className="slide-element">{displayTitle} Login</h2>
                    <form className="slide-element" onSubmit={handleStandardAuth}>
                        <div className="field-wrapper">
                            <input type="email" id="signin-email" name="signin-email" placeholder=" " required value={email} onChange={e => setEmail(e.target.value)} />
                            <label htmlFor="signin-email">Email Address</label>
                            <i className="bx bxs-envelope"></i>
                        </div>
                        <div className="field-wrapper">
                            <input type={showSigninPassword ? "text" : "password"} id="signin-password" name="signin-password" placeholder=" " required value={password} onChange={e => setPassword(e.target.value)} />
                            <label htmlFor="signin-password">Password</label>
                            <i 
                                className={`bx ${showSigninPassword ? 'bx-show' : 'bx-hide'} password-toggle`} 
                                onClick={() => setShowSigninPassword(!showSigninPassword)}
                            ></i>
                        </div>
                        {error && !isToggled && <p style={{color: '#ff4c4c', fontSize: '12px', marginTop: '10px'}}>{error}</p>}
                        {message && !isToggled && <p style={{color: '#00d4ff', fontSize: '12px', marginTop: '10px'}}>{message}</p>}
                        <button type="submit" className="submit-button" disabled={loading}>{loading ? 'Processing...' : 'Login'}</button>
                    </form>
                    <div className="switch-link slide-element">
                        Don't have a {displayTitle} account? <a href="#" onClick={(e) => { e.preventDefault(); setIsToggled(true); }}>Sign Up</a>
                    </div>
                </div>

                <div className="credentials-panel signup">
                    <h2 className="slide-element">{displayTitle} Register</h2>
                    <form className="slide-element" onSubmit={handleStandardAuth}>
                        <div className="field-wrapper">
                            <input type="text" id="signup-usn" name="signup-usn" placeholder=" " required value={usn} onChange={e => setUsn(e.target.value)} />
                            <label htmlFor="signup-usn">Employee/Student ID</label>
                            <i className="bx bxs-id-card"></i>
                        </div>
                        <div className="field-wrapper">
                            <input type="text" id="signup-name" name="signup-name" placeholder=" " required value={fullName} onChange={e => setFullName(e.target.value)} />
                            <label htmlFor="signup-name">Full Name</label>
                            <i className="bx bxs-user"></i>
                        </div>
                        <div className="field-wrapper">
                            <input type="email" id="signup-email" name="signup-email" placeholder=" " required value={email} onChange={e => setEmail(e.target.value)} />
                            <label htmlFor="signup-email">Email Address</label>
                            <i className="bx bxs-envelope"></i>
                        </div>
                        <div className="field-wrapper">
                            <input type={showSignupPassword ? "text" : "password"} id="signup-password" name="signup-password" placeholder=" " required value={password} onChange={e => setPassword(e.target.value)} />
                            <label htmlFor="signup-password">Password</label>
                            <i 
                                className={`bx ${showSignupPassword ? 'bx-show' : 'bx-hide'} password-toggle`} 
                                onClick={() => setShowSignupPassword(!showSignupPassword)}
                            ></i>
                        </div>
                        <div className="field-wrapper">
                            <select id="signup-branch" name="signup-branch" required value={branch} onChange={e => setBranch(e.target.value)}>
                                <option value="" disabled hidden></option>
                                <option value="cy">Cyber Security</option>
                                <option value="cs">Computer Science (CSE)</option>
                                <option value="is">Information Science (ISE)</option>
                                <option value="ai">AI & ML</option>
                                <option value="ec">Electronics & Comm (ECE)</option>
                                <option value="me">Mechanical Engineering</option>
                                <option value="cv">Civil Engineering</option>
                            </select>
                            <label htmlFor="signup-branch">Department/Branch</label>
                            <i className="bx bxs-graduation"></i>
                        </div>
                        {error && isToggled && <p style={{color: '#ff4c4c', fontSize: '12px', marginTop: '10px'}}>{error}</p>}
                        {message && isToggled && <p style={{color: '#00d4ff', fontSize: '12px', marginTop: '10px'}}>{message}</p>}
                        <button type="submit" className="submit-button" disabled={loading}>{loading ? 'Processing...' : 'Register'}</button>
                    </form>
                    <div className="switch-link slide-element">
                        Already have a {displayTitle} account? <a href="#" onClick={(e) => { e.preventDefault(); setIsToggled(false); }}>Sign In</a>
                    </div>
                </div>

                <div className="welcome-section signin">
                    <h2 className="slide-element">{displayTitle} Portal</h2>
                    <p className="slide-element">Log in to access your {displayTitle} dashboard.</p>
                </div>

                <div className="welcome-section signup">
                    <h2 className="slide-element">Join as {displayTitle}</h2>
                    <p className="slide-element">Create your clearance credentials to proceed.</p>
                </div>
            </div>
        </div>
    );
}
