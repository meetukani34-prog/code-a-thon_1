import { NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { studentId, reason } = body;

    if (!studentId) {
      return NextResponse.json({ error: 'studentId is required' }, { status: 400 });
    }

    const supabase = await createServiceRoleClient();
    
    const { data, error } = await supabase
      .from('placements')
      .update({ status: 'frozen', frozen_reason: reason, updated_at: new Date().toISOString() })
      .eq('student_id', studentId)
      .eq('status', 'active')
      .select();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const frozenCount = data?.length || 0;

    console.log(`[PlacementFreeze] ❄️ Frozen ${frozenCount} placements for student ${studentId}: ${reason}`);

    return NextResponse.json({
      success: true,
      frozenCount,
      studentId,
      reason,
      timestamp: new Date().toISOString(),
    });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
