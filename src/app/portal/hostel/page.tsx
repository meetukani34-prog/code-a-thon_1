import { createServerSupabaseClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import StudentHostelView from '@/components/hostel/StudentHostelView';
import WardenHostelView from '@/components/hostel/WardenHostelView';

export default async function HostelPortal() {
  const supabase = await createServerSupabaseClient();
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    redirect('/');
  }

  const role = session.user.user_metadata?.role?.toLowerCase() || 'student';

  // For Admin and Faculty, they shouldn't typically access the hostel unless they are wardens.
  // We'll show the Warden view for admins/superadmins for demonstration purposes.
  const isWardenOrAdmin = role === 'warden' || role === 'admin' || role === 'superadmin';

  return (
    <div>
      <h1 style={{
        fontSize: 'var(--text-xl)',
        fontWeight: 700,
        marginBottom: 'var(--space-xl)',
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-sm)'
      }}>
        <span style={{ color: 'var(--accent-primary)' }}>🏨</span> 
        {isWardenOrAdmin ? 'Hostel Administration (Warden)' : 'My Hostel Portal'}
      </h1>
      
      {isWardenOrAdmin ? <WardenHostelView /> : <StudentHostelView />}
      
    </div>
  );
}
