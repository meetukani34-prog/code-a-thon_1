import { NextResponse } from 'next/server';
import { solveTimetable } from '@/lib/ai/csp-solver';
import { createServiceRoleClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const campusId = body.campusId;
    
    if (!campusId) {
      return NextResponse.json({ error: 'campusId is required' }, { status: 400 });
    }

    const supabase = await createServiceRoleClient();

    // Fetch real courses and rooms from Supabase
    const [coursesRes, roomsRes] = await Promise.all([
      supabase.from('courses').select('*').eq('campus_id', campusId),
      supabase.from('rooms').select('*').eq('campus_id', campusId),
    ]);

    if (coursesRes.error) throw coursesRes.error;
    if (roomsRes.error) throw roomsRes.error;

    const courses = coursesRes.data.map(c => ({
      id: c.id,
      name: c.name,
      facultyId: c.faculty_id,
      requiredCapacity: c.max_students || 60,
      duration: 1, // Defaulting to 1 for MVP
      studentTrack: c.semester || 'Generic'
    }));

    const rooms = roomsRes.data.map(r => ({
      id: r.id,
      name: r.name,
      capacity: r.capacity || 30
    }));

    // If no data, return empty solve
    if (courses.length === 0 || rooms.length === 0) {
       return NextResponse.json({
          assignments: [],
          clashScore: 0,
          campusId: campusId,
          reason: 'No courses or rooms found in database',
          timestamp: new Date().toISOString(),
        });
    }

    const weights = body.weights || { w1: 1.0, w2: 0.8, w3: 1.2 };
    
    const result = solveTimetable(courses, rooms, weights);

    // Ideally, we would insert the result into `timetable_slots` here.
    // For now, we return it to the client.

    return NextResponse.json({
      ...result,
      campusId: campusId,
      reason: body.reason,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('[CSP Solver] Error:', error);
    return NextResponse.json({ error: 'Solver failed' }, { status: 500 });
  }
}
