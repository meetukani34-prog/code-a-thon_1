import { getEventBus, TOPICS } from '../index';
import type { AttendanceThresholdPayload, EventPayload } from '../types';

/**
 * Placement Freeze Handler — The "Cascading Ripple"
 * 
 * When a student's attendance drops below 75%, this handler:
 * 1. Freezes all their active placement applications
 * 2. Fires a hostel alert to the warden dashboard
 * 3. Logs the cascading event
 */
export async function initPlacementFreezeHandler(): Promise<void> {
  const bus = await getEventBus();

  await bus.subscribe(TOPICS.ATTENDANCE_THRESHOLD, async (payload: EventPayload) => {
    if (payload.event !== 'attendance.threshold_breach') return;
    
    const data = payload as AttendanceThresholdPayload;
    console.log(`[CascadingRipple] ⚡ Triggered for student ${data.studentName} (${data.attendancePct}%)`);

    try {
      // 1. Freeze placement applications via API
      const freezeResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/placements/freeze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: data.studentId,
          reason: `Attendance dropped to ${data.attendancePct.toFixed(1)}% (threshold: ${data.threshold}%)`,
        }),
      });

      const freezeResult = await freezeResponse.json();
      console.log(`[CascadingRipple] Frozen ${freezeResult.frozenCount || 0} placement applications`);

      // 2. Emit hostel alert
      await bus.publish(TOPICS.HOSTEL_ALERT, {
        event: 'hostel.alert',
        studentId: data.studentId,
        studentName: data.studentName,
        alertType: 'attendance_low',
        message: `${data.studentName}'s attendance in ${data.courseName} dropped to ${data.attendancePct.toFixed(1)}%. Placement applications frozen.`,
        severity: 'critical',
        campusId: data.campusId,
        timestamp: Date.now(),
      });

      // 3. Publish placement freeze event (for console/logging)
      await bus.publish(TOPICS.PLACEMENT_FREEZE, {
        event: 'placement.freeze',
        studentId: data.studentId,
        reason: `Attendance: ${data.attendancePct.toFixed(1)}% < ${data.threshold}%`,
        frozenCount: freezeResult.frozenCount || 0,
        campusId: data.campusId,
        timestamp: Date.now(),
      });

      console.log(`[CascadingRipple] ✓ Cascade complete for ${data.studentName}`);
    } catch (error) {
      console.error('[CascadingRipple] Cascade error:', error);
    }
  });

  console.log('[CascadingRipple] Placement freeze handler initialized');
}
