import { getEventBus, TOPICS } from '../index';
import type { EventPayload, TimetableRecrystallizePayload } from '../types';

/**
 * Timetable Re-crystallization Handler
 * 
 * When a faculty state changes (e.g., emergency leave), this handler:
 * 1. Triggers the CSP solver to re-optimize the timetable
 * 2. Pushes updates to affected students via WebSocket
 */
export async function initTimetableRecrystallizeHandler(): Promise<void> {
  const bus = await getEventBus();

  await bus.subscribe(TOPICS.TIMETABLE_RECRYSTALLIZE, async (payload: EventPayload) => {
    if (payload.event !== 'timetable.recrystallize') return;

    const data = payload as TimetableRecrystallizePayload;
    console.log(`[Recrystallize] ⚡ Timetable recrystallization triggered: ${data.reason}`);

    try {
      // Trigger CSP solver via API
      const solveResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/timetable/solve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          campusId: data.campusId,
          affectedCourseIds: data.affectedCourseIds,
          reason: data.reason,
        }),
      });

      if (solveResponse.ok) {
        const result = await solveResponse.json();
        console.log(`[Recrystallize] ✓ Timetable re-solved with ${result.clashScore || 0} remaining clashes`);
      } else {
        console.error('[Recrystallize] Solver API returned error:', solveResponse.status);
      }
    } catch (error) {
      console.error('[Recrystallize] Error:', error);
    }
  });

  console.log('[Recrystallize] Timetable handler initialized');
}
