import { NextResponse } from 'next/server';
import { createServiceRoleClient, createServerSupabaseClient } from '@/lib/supabase/server';

export async function GET() {
  const supabase = await createServerSupabaseClient();
  const { data: { session } } = await supabase.auth.getSession();
  
  // Verify Admin Role
  if (session?.user.user_metadata?.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized. Admin access required.' }, { status: 403 });
  }

  // Use Service Role to query Supabase Auth directly
  const adminClient = await createServiceRoleClient();
  const { data, error } = await adminClient.auth.admin.listUsers();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ users: data.users });
}

export async function PATCH(req: Request) {
  const supabase = await createServerSupabaseClient();
  const { data: { session } } = await supabase.auth.getSession();
  
  if (session?.user.user_metadata?.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized. Admin access required.' }, { status: 403 });
  }

  const { userId, role } = await req.json();
  const adminClient = await createServiceRoleClient();
  
  const { error } = await adminClient.auth.admin.updateUserById(userId, {
    user_metadata: { role }
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
