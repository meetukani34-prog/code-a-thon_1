import { NextResponse } from 'next/server';
import { createServiceRoleClient, createServerSupabaseClient } from '@/lib/supabase/server';

export async function POST(req: Request) {
  const supabase = await createServerSupabaseClient();
  const { data: { session } } = await supabase.auth.getSession();
  
  const userRole = session?.user.user_metadata?.role?.toLowerCase();
  if (userRole !== 'admin' && userRole !== 'superadmin') {
    return NextResponse.json({ error: 'Unauthorized. Admin access required.' }, { status: 403 });
  }

  const { email, password, full_name, role, college_name, location, region } = await req.json();

  // If Admin, they can only create Faculty or Student
  if (userRole === 'admin' && !['faculty', 'student'].includes(role)) {
    return NextResponse.json({ error: 'Admins can only create Faculty or Student accounts.' }, { status: 403 });
  }

  const adminClient = await createServiceRoleClient();
  
  const { data, error } = await adminClient.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: {
      full_name,
      role,
      college_name,
      location,
      region
    }
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, user: data.user });
}
