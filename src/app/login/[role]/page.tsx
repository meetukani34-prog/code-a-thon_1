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
        } else {
            // Check if existing user actually has the required role
            const userRole = signInData?.user?.user_metadata?.role?.toLowerCase();
            if (userRole !== 'admin' && userRole !== 'superadmin') {
                setError(`Unauthorized. This account is registered as ${userRole || 'student'}.`);
                await supabase.auth.signOut();
                setLoading(false);
                return;
            }
        }

        router.push(roleParam === 'superadmin' ? '/superadmin' : '/admin');
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
            <div className="min-h-screen flex items-center justify-center bg-background/95 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]">
              <div className="absolute inset-0 bg-primary/5 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-background to-background"></div>
              
              <Card className="w-full max-w-md relative z-10 bg-background/60 backdrop-blur-xl border-destructive/30 shadow-[0_0_40px_rgba(220,38,38,0.15)]">
                <CardHeader className="text-center pb-2">
                  <div className="mx-auto w-12 h-12 mb-4 rounded-full bg-destructive/10 flex items-center justify-center border border-destructive/30 shadow-[0_0_20px_rgba(220,38,38,0.3)]">
                    <span className="text-destructive text-xl">⚠️</span>
                  </div>
                  <CardTitle className="text-2xl font-black tracking-widest text-destructive">RESTRICTED AREA</CardTitle>
                  <CardDescription className="text-muted-foreground mt-2">
                    {displayTitle} Gateway. Unauthorized access is strictly prohibited.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleAdminAuth} className="space-y-4 mt-4">
                    <div className="space-y-2">
                      <Input 
                        type="email" 
                        placeholder="Node Identifier (Email)" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="bg-background/50 border-destructive/20 focus-visible:ring-destructive"
                        required 
                      />
                    </div>
                    <div className="space-y-2">
                      <Input 
                        type="password" 
                        placeholder="Access Key (Password)" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="bg-background/50 border-destructive/20 focus-visible:ring-destructive"
                        required 
                      />
                    </div>
                    <div className="space-y-2 pt-4 border-t border-destructive/10">
                      <label className="text-xs font-mono text-destructive/80 uppercase tracking-widest">Security Clearance Key</label>
                      <Input 
                        type="password" 
                        placeholder="Enter Master Override Key (hint: root123)" 
                        value={clearanceKey}
                        onChange={(e) => setClearanceKey(e.target.value)}
                        className="bg-background/50 border-destructive/50 focus-visible:ring-destructive"
                        required 
                      />
                    </div>
        
                    {error && (
                      <div className="p-3 rounded-md bg-destructive/10 border border-destructive/30 text-destructive text-sm text-center font-mono">
                        {error}
                      </div>
                    )}
        
                    <Button 
                      type="submit" 
                      className="w-full bg-destructive hover:bg-destructive/90 text-white font-bold tracking-widest mt-6"
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
