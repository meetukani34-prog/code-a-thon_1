'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function AdminLogin() {
  const router = useRouter();
  const supabase = createClient();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError(signInError.message);
      setLoading(false);
      return;
    }

    // Verify admin role
    const role = data.user?.user_metadata?.role;
    if (role !== 'admin') {
      setError('Access Denied. This account does not have Admin privileges.');
      await supabase.auth.signOut();
      setLoading(false);
      return;
    }

    // Success! Redirect to admin dashboard
    router.push('/dashboard');
    router.refresh();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background/95 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]">
      <div className="absolute inset-0 bg-primary/5 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-background to-background"></div>
      
      <Card className="w-full max-w-md relative z-10 bg-background/60 backdrop-blur-xl border-yellow-500/30 shadow-[0_0_40px_rgba(234,179,8,0.15)]">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto w-12 h-12 mb-4 rounded-full bg-yellow-500/10 flex items-center justify-center border border-yellow-500/30 shadow-[0_0_20px_rgba(234,179,8,0.3)]">
            <span className="text-yellow-500 text-xl">🛡️</span>
          </div>
          <CardTitle className="text-2xl font-black tracking-widest text-yellow-500">ADMIN PORTAL</CardTitle>
          <CardDescription className="text-muted-foreground mt-2">
            Administrative access only. Sign in with your admin credentials.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAdminLogin} className="space-y-4 mt-4">
            <div className="space-y-2">
              <Input 
                type="email" 
                placeholder="Admin Email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-background/50 border-yellow-500/20 focus-visible:ring-yellow-500"
                required 
              />
            </div>
            <div className="space-y-2">
              <Input 
                type="password" 
                placeholder="Password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-background/50 border-yellow-500/20 focus-visible:ring-yellow-500"
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
              className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-bold tracking-widest mt-6"
              disabled={loading}
            >
              {loading ? 'AUTHENTICATING...' : 'ADMIN LOGIN →'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
