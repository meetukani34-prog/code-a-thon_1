import { NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/lib/supabase/server';

export async function GET() {
  const supabase = await createServiceRoleClient();

  const { data, error } = await supabase
    .from('anonymized_analytics')
    .select('*')
    .order('recorded_at', { ascending: false })
    .limit(10);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Format real data into the expected shape, or fallback to an empty state if no data exists
  const hasData = data && data.length > 0;

  const analytics = hasData ? {
    national: {
      totalStudents: data.find(d => d.metric_type === 'total_students' && d.region === 'National')?.value || 0,
      avgAttendance: data.find(d => d.metric_type === 'avg_attendance' && d.region === 'National')?.value || 0,
      placementRate: data.find(d => d.metric_type === 'placement_rate' && d.region === 'National')?.value || 0,
      avgFrictionRisk: data.find(d => d.metric_type === 'avg_friction_risk' && d.region === 'National')?.value || 0,
      activeCampuses: data.find(d => d.metric_type === 'active_campuses' && d.region === 'National')?.value || 0,
    },
    regions: data.filter(d => d.region !== 'National' && d.metric_type === 'regional_summary').map(r => ({
      region: r.region,
      metrics: r.dimensions || {}
    })),
    k_anonymity_level: 5,
    period: 'monthly',
    generated_at: new Date().toISOString(),
  } : {
    national: { totalStudents: 0, avgAttendance: 0, placementRate: 0, avgFrictionRisk: 0, activeCampuses: 0 },
    regions: [],
    k_anonymity_level: 5,
    period: 'monthly',
    generated_at: new Date().toISOString(),
  };

  return NextResponse.json(analytics);
}
