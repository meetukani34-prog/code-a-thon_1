import Sidebar from '@/components/ui/Sidebar';
import TopBar from '@/components/ui/TopBar';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import LightRaysBackground from '@/components/ui/light-rays-background';

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
    <div className="relative min-h-screen w-full overflow-hidden bg-[#050505]">
      <LightRaysBackground className="absolute inset-0 z-0 fixed" />
      <div className="relative z-10 w-full min-h-screen" style={{ display: 'flex' }}>
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
    </div>
  );
}
