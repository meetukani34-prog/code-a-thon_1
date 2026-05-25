'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function AdminGateway() {
  const router = useRouter();
  const supabase = createClient();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [clearanceKey, setClearanceKey] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAdminAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // To prevent students from finding this URL and becoming admin, we require a clearance key.
    if (clearanceKey !== 'root123') {
      setError('Invalid Security Clearance Key.');
      setLoading(false);
      return;
    }

    // Attempt to log in first
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      // If login fails, try to create the admin account
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            role: 'admin',
            full_name: 'Super Administrator',
          },
        },
      });

      if (signUpError) {
        setError(signUpError.message);
        setLoading(false);
        return;
      }
    }

    // Success! Redirect directly to the Admin RBAC panel
    router.push('/dashboard/admin/users');
    router.refresh();
  };

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
            Super Administrator Gateway. Unauthorized access is strictly prohibited.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAdminAuth} className="space-y-4 mt-4">
            <div className="space-y-2">
              <Input 
                type="email" 
                placeholder="Admin Node Identifier (Email)" 
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
                placeholder="Enter Master Override Key" 
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
