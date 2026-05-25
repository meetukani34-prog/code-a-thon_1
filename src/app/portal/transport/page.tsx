import { createServerSupabaseClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import StudentTransportView from '@/components/transport/StudentTransportView';

export default async function TransportPortal() {
  const supabase = await createServerSupabaseClient();
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    redirect('/');
  }

  const role = session.user.user_metadata?.role?.toLowerCase() || 'student';

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
        <span style={{ color: 'var(--accent-primary)' }}>🚌</span> 
        {role === 'admin' || role === 'superadmin' ? 'Transport Administration' : 'My Transport Route'}
      </h1>
      
      {/* For hackathon prototype, we will just show the cool live map to everyone to demonstrate capability */}
      <StudentTransportView />
      
    </div>
  );
}
