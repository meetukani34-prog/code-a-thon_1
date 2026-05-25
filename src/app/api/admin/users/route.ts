import { NextResponse } from 'next/server';
import { createServiceRoleClient, createServerSupabaseClient } from '@/lib/supabase/server';

export async function GET() {
  const supabase = await createServerSupabaseClient();
  const { data: { session } } = await supabase.auth.getSession();
  
  const userRole = session?.user.user_metadata?.role;
  const userCollege = session?.user.user_metadata?.college_name;

  if (userRole !== 'admin' && userRole !== 'superadmin') {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 403 });
  }

  const adminClient = await createServiceRoleClient();
  const { data, error } = await adminClient.auth.admin.listUsers();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  let usersToReturn = data.users;

  if (userRole === 'admin') {
    // Admin only sees faculty, students, pending from their own college
    // Note: if userCollege is missing on admin, they won't see anyone until they have one
    usersToReturn = usersToReturn.filter(u => {
      const uRole = u.user_metadata?.role || 'pending';
      const uCollege = u.user_metadata?.college_name;
      const isTargetRole = uRole === 'student' || uRole === 'faculty' || uRole === 'pending';
      return isTargetRole && uCollege === userCollege;
    });
  }

  return NextResponse.json({ users: usersToReturn, currentUserRole: userRole });
}

export async function PATCH(req: Request) {
  const supabase = await createServerSupabaseClient();
  const { data: { session } } = await supabase.auth.getSession();
  
  const userRole = session?.user.user_metadata?.role;
  if (userRole !== 'admin' && userRole !== 'superadmin') {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 403 });
  }

  const { userId, role } = await req.json();

  // If admin, they can only set role to student or faculty
  if (userRole === 'admin' && !['student', 'faculty', 'pending'].includes(role)) {
    return NextResponse.json({ error: 'Admin can only assign Student or Faculty roles.' }, { status: 403 });
  }

  const adminClient = await createServiceRoleClient();
  
  const { error } = await adminClient.auth.admin.updateUserById(userId, {
    user_metadata: { role }
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
