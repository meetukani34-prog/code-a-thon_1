import Sidebar from '@/components/ui/Sidebar';
import TopBar from '@/components/ui/TopBar';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { ParticleHero } from '@/components/ui/particle-hero';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createServerSupabaseClient();
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    redirect('/');
  }

  const role = session.user.user_metadata?.role || 'student';

  return (
    <ParticleHero>
      <div style={{ display: 'flex', minHeight: '100vh', width: '100%' }}>
        <Sidebar role={role} />
        <div style={{
          flex: 1,
          marginLeft: 'var(--sidebar-width)',
          paddingTop: 'var(--topbar-height)',
        }}>
          <TopBar role={role} title="Campus Portal" />
          <main style={{
            padding: 'var(--space-xl)',
            position: 'relative',
            zIndex: 1,
          }}>
            {children}
          </main>
        </div>
      </div>
    </ParticleHero>
  );
}
