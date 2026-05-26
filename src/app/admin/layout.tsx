import Sidebar from '@/components/ui/Sidebar';
import TopBar from '@/components/ui/TopBar';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { AiAssistantWidget } from '@/components/ui/AiAssistantWidget';
import LightRaysBackground from '@/components/ui/light-rays-background';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createServerSupabaseClient();
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    redirect('/');
  }

  const rawRole = session.user.user_metadata?.role || 'student';
  const role = rawRole.toLowerCase();

  if (role !== 'admin' && role !== 'superadmin') {
    redirect(`/${role === 'superadmin' ? 'superadmin' : role}`);
  }

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
        <TopBar role={role} title="Admin Command Center" />
        <main style={{
          padding: 'var(--space-xl)',
          position: 'relative',
          zIndex: 1,
        }}>
          {children}
        </main>
        <AiAssistantWidget contextType="admin" />
      </div>
      </div>
    </div>
  );
}
