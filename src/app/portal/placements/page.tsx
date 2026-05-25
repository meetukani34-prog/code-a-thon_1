'use client';

import { useState, useEffect } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function PlacementsPage() {
  const [role, setRole] = useState('student');
  const [isFrozen, setIsFrozen] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Student specific state
  const [resumeUploaded, setResumeUploaded] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [matchScore, setMatchScore] = useState<number | null>(null);

  useEffect(() => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        const userRole = data.session.user.user_metadata?.role || 'student';
        const frozen = data.session.user.user_metadata?.placement_frozen === true;
        setRole(userRole);
        setIsFrozen(frozen);

        if (userRole === 'admin' || userRole === 'superadmin') {
          fetchUsers();
        } else {
          setLoading(false);
        }
      }
    });
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/admin/users');
      const data = await res.json();
      if (data.users) {
        const students = data.users
          .filter((u: any) => u.user_metadata?.role !== 'admin' && u.user_metadata?.role !== 'superadmin')
          .map((u: any) => {
            let hash = 0;
            for (let i = 0; i < u.id.length; i++) hash += u.id.charCodeAt(i);
            const fakeAttendance = 60 + (hash % 39);
            return { ...u, mock_attendance: fakeAttendance };
          });
        setUsers(students);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFreeze = async (userId: string, currentStatus: boolean) => {
    setActionLoading(userId);
    try {
      const res = await fetch('/api/placements/freeze', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, placement_frozen: !currentStatus })
      });
      if (res.ok) {
        setUsers(users.map(u => 
          u.id === userId 
            ? { ...u, user_metadata: { ...u.user_metadata, placement_frozen: !currentStatus } } 
            : u
        ));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setActionLoading(null);
    }
  };

  const simulateAIAnalysis = () => {
    setAnalyzing(true);
    setTimeout(() => {
      setAnalyzing(false);
      setMatchScore(82); // Mock score as requested by user
    }, 2500);
  };

  if (loading) {
    return <div className="text-muted-foreground p-8">Loading Placements Data...</div>;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">
          <span className="text-accent-primary mr-2">◈</span>
          Placement Cell
        </h1>
        <p className="text-muted-foreground">
          {role === 'admin' || role === 'superadmin' ? 'Manage Student Eligibility & Defaulters' : 'Active Recruitment Drives & AI Match'}
        </p>
      </div>

      {role === 'admin' || role === 'superadmin' ? (
        // ADMIN VIEW
        <Card className="bg-background/50 backdrop-blur-xl border-glass-border">
          <CardHeader>
            <CardTitle className="uppercase tracking-widest text-sm">Student Placement Status Matrix</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {users.length > 0 ? users.map((user) => {
                const isUserFrozen = user.user_metadata?.placement_frozen === true;
                return (
                  <div key={user.id} className={`p-4 rounded-lg border flex justify-between items-center transition-colors ${
                    isUserFrozen ? 'bg-destructive/5 border-destructive/30' : 'bg-black/20 border-white/5'
                  }`}>
                    <div>
                      <p className="font-semibold">{user.user_metadata?.full_name || user.email}</p>
                      <div className="flex gap-4 items-center mt-1">
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                        {/* Attendance globally hidden
                        <p className={`text-xs font-bold ${user.mock_attendance < 75 ? 'text-destructive' : 'text-emerald-400'}`}>
                          Attendance: {user.mock_attendance}% {user.mock_attendance < 75 && ' ⚠️'}
                        </p>
                        */}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <Badge variant={isUserFrozen ? 'destructive' : 'default'} className={!isUserFrozen ? 'bg-emerald-500/20 text-emerald-400' : ''}>
                        {isUserFrozen ? 'Frozen' : 'Active'}
                      </Badge>
                      <Button
                        onClick={() => handleToggleFreeze(user.id, isUserFrozen)}
                        disabled={actionLoading === user.id}
                        size="sm"
                        variant={isUserFrozen ? 'default' : 'destructive'}
                        className={isUserFrozen ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : ''}
                      >
                        {actionLoading === user.id ? 'Updating...' : (isUserFrozen ? 'Unfreeze' : 'Freeze')}
                      </Button>
                    </div>
                  </div>
                );
              }) : (
                <p className="text-xs text-muted-foreground">No students found.</p>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        // STUDENT VIEW
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {isFrozen ? (
            <Card className="col-span-1 md:col-span-2 bg-destructive/5 border-destructive/30 backdrop-blur-xl text-center py-12">
              <div className="text-6xl mb-4">🛑</div>
              <h2 className="text-3xl font-black text-destructive mb-2">PLACEMENTS FROZEN</h2>
              <p className="text-muted-foreground max-w-md mx-auto">
                Your placement privileges have been temporarily suspended due to academic probation or disciplinary action. Please contact the Placement Cell immediately.
              </p>
            </Card>
          ) : (
            <>
              {/* AI Resume Matcher */}
              <Card className="bg-background/50 backdrop-blur-xl border-glass-border relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-accent-primary/20 rounded-full blur-3xl -mr-10 -mt-10"></div>
                <CardHeader>
                  <CardTitle className="text-accent-primary flex items-center gap-2">
                    🤖 AI Resume Matcher
                  </CardTitle>
                  <CardDescription>Upload your resume to check eligibility against company profiles.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {!resumeUploaded ? (
                    <div className="border-2 border-dashed border-glass-border rounded-lg p-8 text-center bg-black/20 hover:bg-black/40 transition-colors cursor-pointer" onClick={() => setResumeUploaded(true)}>
                      <div className="text-3xl mb-2">📄</div>
                      <p className="text-sm font-medium">Click to upload your latest Resume (PDF)</p>
                      <p className="text-xs text-muted-foreground mt-1">Max file size: 5MB</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-3 bg-black/20 rounded-lg border border-white/5">
                        <div className="flex items-center gap-3">
                          <div className="text-2xl">📄</div>
                          <div>
                            <div className="text-sm font-medium">meet_ukani_resume_v2.pdf</div>
                            <div className="text-xs text-emerald-400 font-bold">✓ Parsed Successfully</div>
                          </div>
                        </div>
                        <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => { setResumeUploaded(false); setMatchScore(null); }}>Replace</Button>
                      </div>

                      <div className="p-4 bg-accent-primary/10 border border-accent-primary/30 rounded-lg">
                        <h4 className="text-sm font-semibold text-accent-primary mb-3">Google - Software Engineer Role Match</h4>
                        
                        {analyzing ? (
                          <div className="text-center py-4 space-y-3">
                            <div className="w-8 h-8 border-4 border-accent-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
                            <p className="text-xs text-muted-foreground animate-pulse">AI is analyzing your skills...</p>
                          </div>
                        ) : matchScore === null ? (
                          <Button className="w-full bg-accent-primary/20 text-accent-primary hover:bg-accent-primary/30" onClick={simulateAIAnalysis}>
                            Run AI Match Analysis
                          </Button>
                        ) : (
                          <div className="space-y-4">
                            <div className="flex items-center justify-center gap-4">
                              <div className="relative w-20 h-20 flex items-center justify-center">
                                <svg className="w-full h-full transform -rotate-90">
                                  <circle cx="40" cy="40" r="36" fill="transparent" stroke="rgba(255,255,255,0.1)" strokeWidth="6" />
                                  <circle cx="40" cy="40" r="36" fill="transparent" stroke="var(--accent-primary)" strokeWidth="6" strokeDasharray="226" strokeDashoffset={226 - (226 * matchScore) / 100} className="transition-all duration-1000" />
                                </svg>
                                <div className="absolute text-lg font-black text-accent-primary">{matchScore}%</div>
                              </div>
                              <div className="flex-1">
                                <p className="text-xs text-muted-foreground mb-1">Keywords Found:</p>
                                <div className="flex flex-wrap gap-1">
                                  <Badge className="bg-accent-primary/20 text-accent-primary hover:bg-accent-primary/20">Python</Badge>
                                  <Badge className="bg-accent-primary/20 text-accent-primary hover:bg-accent-primary/20">SQL</Badge>
                                  <Badge className="bg-accent-primary/20 text-accent-primary hover:bg-accent-primary/20">Machine Learning</Badge>
                                </div>
                              </div>
                            </div>
                            <div className="text-xs text-emerald-400 bg-emerald-500/10 p-2 rounded text-center">
                              You have a high probability of being shortlisted!
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Applications Timeline */}
              <div className="space-y-6">
                <Card className="bg-background/50 backdrop-blur-xl border-glass-border">
                  <CardContent className="p-5">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-bold">Google (Alphabet Inc.)</h3>
                        <p className="text-muted-foreground text-xs">Software Engineer, L3</p>
                      </div>
                      <Badge className="bg-emerald-500/20 text-emerald-400">Accepting</Badge>
                    </div>
                    <div className="bg-black/20 p-3 rounded-md mb-4 border border-white/5">
                      <p className="text-[11px] text-muted-foreground">Eligibility Criteria:</p>
                      <p className="text-[13px] font-semibold mt-1">&gt; 8.0 CGPA, No Active Backlogs</p>
                    </div>
                    <Button className="w-full bg-primary/20 text-primary hover:bg-primary/30 border border-primary/50" disabled={!resumeUploaded || (matchScore !== null && matchScore < 60)}>
                      {resumeUploaded ? 'Apply with Profile' : 'Upload Resume First'}
                    </Button>
                  </CardContent>
                </Card>

                <Card className="bg-background/50 backdrop-blur-xl border-glass-border opacity-90">
                  <CardContent className="p-5">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-bold">Microsoft</h3>
                        <p className="text-muted-foreground text-xs">Cloud Solution Architect</p>
                      </div>
                      <Badge className="bg-blue-500/20 text-blue-400">Interviewing</Badge>
                    </div>
                    <div className="bg-black/20 p-3 rounded-md mb-4 border border-white/5">
                      <p className="text-[11px] text-muted-foreground">Current Status:</p>
                      <p className="text-[13px] font-semibold mt-1 text-blue-400">Round 1 Cleared • Technical Interview Scheduled</p>
                      <p className="text-xs mt-2">Slot: Tomorrow, 10:00 AM (Virtual)</p>
                    </div>
                    <Button variant="outline" className="w-full border-blue-500/30 text-blue-400 hover:bg-blue-500/10">
                      View Interview Details
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
