'use client';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import GridGlowBackground from '@/components/ui/grid-glow-background';
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
            <GridGlowBackground backgroundColor="#050505" glowColors={["#00d4ff", "#9d00ff", "#00d4ff"]}>
              <style>{`
                .glowing-outer {
                  width: 100%;
                  max-width: 420px;
                  position: relative;
                  border-radius: 16px;
                  padding: 1px;
                  overflow: hidden;
                  background: rgba(255, 255, 255, 0.03);
                  box-shadow: 0 0 40px rgba(0, 212, 255, 0.15);
                }
                .glowing-dot {
                  position: absolute;
                  width: 100px;
                  height: 100px;
                  background: radial-gradient(circle, rgba(0, 212, 255, 0.8) 0%, rgba(157, 0, 255, 0.5) 40%, transparent 70%);
                  filter: blur(8px);
                  animation: moveDot 6s linear infinite;
                  z-index: 0;
                  border-radius: 50%;
                  pointer-events: none;
                }
                @keyframes moveDot {
                  0%, 100% { top: -30px; right: -30px; }
                  25% { top: -30px; right: calc(100% - 70px); }
                  50% { top: calc(100% - 70px); right: calc(100% - 70px); }
                  75% { top: calc(100% - 70px); right: -30px; }
                }
                .glowing-card {
                  position: relative;
                  background: rgba(10, 5, 10, 0.95);
                  backdrop-filter: blur(20px);
                  -webkit-backdrop-filter: blur(20px);
                  border-radius: 15px;
                  z-index: 1;
                  padding: 2.5rem;
                }
                .clean-input {
                  background: rgba(255, 255, 255, 0.03) !important;
                  border: 1px solid rgba(255, 255, 255, 0.1) !important;
                  color: white !important;
                  transition: all 0.3s ease !important;
                }
                .clean-input:focus {
                  border-color: #00d4ff !important;
                  box-shadow: 0 0 15px rgba(0, 212, 255, 0.2) !important;
                }
                .admin-btn {
                  background: linear-gradient(135deg, #00d4ff, #9d00ff);
                  color: white;
                  font-weight: 700;
                  letter-spacing: 1px;
                  border: none;
                  transition: all 0.3s ease;
                }
                .admin-btn:hover {
                  transform: translateY(-2px);
                  box-shadow: 0 0 20px rgba(0, 212, 255, 0.4);
                }
              `}</style>

              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(0,212,255,0.05)_0%,_rgba(0,0,0,0)_70%)] pointer-events-none"></div>
              
              <div className="flex min-h-screen w-full items-center justify-center">
                <div className="glowing-outer z-10">
                  <div className="glowing-dot"></div>
                  <div className="glowing-card">
                    
                    <div className="text-center mb-8 relative z-20">
                      <div className="mx-auto w-12 h-12 mb-4 rounded-full bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center border border-cyan-500/30">
                        <span className="text-cyan-400 text-xl">🛡️</span>
                      </div>
                      <h2 className="text-2xl font-bold text-white tracking-wide">
                        ADMIN GATEWAY
                      </h2>
                      <p className="text-slate-400 mt-2 text-sm">
                        Secure authentication required
                      </p>
                    </div>
                    
                    <form onSubmit={handleAdminAuth} className="space-y-5 relative z-20">
                      <div className="space-y-2">
                        <Input 
                          type="email" 
                          placeholder="Email Address" 
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="clean-input h-12 px-4 rounded-xl"
                          required 
                        />
                      </div>
                      <div className="space-y-2">
                        <Input 
                          type="password" 
                          placeholder="Access Key" 
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="clean-input h-12 px-4 rounded-xl"
                          required 
                        />
                      </div>
                      
                      <div className="pt-4 border-t border-white/10 mt-2">
                        <label className="text-[11px] font-medium text-slate-400 uppercase tracking-wider mb-2 block">
                          Security Clearance
                        </label>
                        <Input 
                          type="password" 
                          placeholder="Override Key (hint: root123)" 
                          value={clearanceKey}
                          onChange={(e) => setClearanceKey(e.target.value)}
                          className="clean-input h-12 px-4 rounded-xl text-center"
                          required 
                        />
                      </div>
          
                      {error && (
                        <div className="p-3 mt-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
                          {error}
                        </div>
                      )}
          
                      <Button 
                        type="submit" 
                        className="admin-btn w-full h-12 rounded-xl mt-6 tracking-wide"
                        disabled={loading}
                      >
                        {loading ? 'AUTHENTICATING...' : 'INITIALIZE OVERRIDE →'}
                      </Button>
                    </form>
                  </div>
                </div>
              </div>
            </GridGlowBackground>
          );
    }

    // Standard UI (Student/Faculty)
    return (
        <GridGlowBackground backgroundColor="#050505" glowColors={["#00d4ff", "#9d00ff", "#00d4ff"]}>
            <div className={`auth-wrapper relative z-20 mx-auto ${isToggled ? 'toggled' : ''}`}>
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
                        Don't have an account? <button type="button" onClick={() => setIsToggled(true)}>Sign up</button>
                    </div>
                </div>

                <div className="credentials-panel signup">
                    <h2 className="slide-element">{displayTitle} Sign Up</h2>
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
        </GridGlowBackground>
    );
}
