import { NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/lib/supabase/server';

export async function GET() {
  const supabase = await createServiceRoleClient();
  
  const { data, error, count } = await supabase
    .from('event_log')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .limit(50);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ events: data || [], total: count || 0 });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const supabase = await createServiceRoleClient();
    
    const newEvent = {
      campus_id: body.campus_id || null, // Will be null if not tied to a specific campus
      event_type: body.event_type,
      severity: body.severity || 'info',
      payload: body.payload || {},
      source_service: body.source_service || 'manual',
    };
    
    const { data, error } = await supabase
      .from('event_log')
      .insert([newEvent])
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ event: data, success: true });
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
