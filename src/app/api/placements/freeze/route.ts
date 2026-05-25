import { NextResponse } from 'next/server';
import { createServiceRoleClient, createServerSupabaseClient } from '@/lib/supabase/server';

export async function PATCH(req: Request) {
  const supabase = await createServerSupabaseClient();
  const { data: { session } } = await supabase.auth.getSession();
  
  // Verify Admin Role
  if (session?.user.user_metadata?.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized. Admin access required.' }, { status: 403 });
  }

  const { userId, placement_frozen } = await req.json();
  const adminClient = await createServiceRoleClient();
  
  // Update user_metadata with new placement_frozen status
  const { error } = await adminClient.auth.admin.updateUserById(userId, {
    user_metadata: { placement_frozen }
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, placement_frozen });
}
