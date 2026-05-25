import { z } from 'zod';

// =====================
// Event Schemas (Zod validated)
// =====================
export const AttendanceThresholdEvent = z.object({
  event: z.literal('attendance.threshold_breach'),
  studentId: z.string().uuid(),
  studentName: z.string(),
  courseId: z.string().uuid(),
  courseName: z.string(),
  attendancePct: z.number(),
  threshold: z.number().default(75),
  campusId: z.string().uuid(),
  timestamp: z.number(),
});

export const PlacementFreezeEvent = z.object({
  event: z.literal('placement.freeze'),
  studentId: z.string().uuid(),
  reason: z.string(),
  frozenCount: z.number(),
  campusId: z.string().uuid(),
  timestamp: z.number(),
});

export const HostelAlertEvent = z.object({
  event: z.literal('hostel.alert'),
  studentId: z.string().uuid(),
  studentName: z.string(),
  alertType: z.enum(['attendance_low', 'academic_probation', 'disciplinary', 'health', 'general']),
  message: z.string(),
  severity: z.enum(['info', 'warning', 'critical']),
  campusId: z.string().uuid(),
  timestamp: z.number(),
});

export const TimetableRecrystallizeEvent = z.object({
  event: z.literal('timetable.recrystallize'),
  reason: z.string(),
  affectedCourseIds: z.array(z.string().uuid()),
  campusId: z.string().uuid(),
  timestamp: z.number(),
});

export const TransportTelemetryEvent = z.object({
  event: z.literal('transport.telemetry'),
  vehicleId: z.string().uuid(),
  lat: z.number(),
  lng: z.number(),
  speed: z.number(),
  heading: z.number(),
  campusId: z.string().uuid(),
  timestamp: z.number(),
});

export type AttendanceThresholdPayload = z.infer<typeof AttendanceThresholdEvent>;
export type PlacementFreezePayload = z.infer<typeof PlacementFreezeEvent>;
export type HostelAlertPayload = z.infer<typeof HostelAlertEvent>;
export type TimetableRecrystallizePayload = z.infer<typeof TimetableRecrystallizeEvent>;
export type TransportTelemetryPayload = z.infer<typeof TransportTelemetryEvent>;

export type EventPayload =
  | AttendanceThresholdPayload
  | PlacementFreezePayload
  | HostelAlertPayload
  | TimetableRecrystallizePayload
  | TransportTelemetryPayload;

// =====================
// Event Bus Interface
// =====================
export type EventHandler = (payload: EventPayload) => Promise<void>;

export interface IEventBus {
  publish(topic: string, payload: EventPayload): Promise<void>;
  subscribe(topic: string, handler: EventHandler): Promise<void>;
  disconnect(): Promise<void>;
}

// =====================
// Topics
// =====================
export const TOPICS = {
  ATTENDANCE_THRESHOLD: 'attendance.threshold_breach',
  PLACEMENT_FREEZE: 'placement.freeze',
  HOSTEL_ALERT: 'hostel.alert',
  TIMETABLE_RECRYSTALLIZE: 'timetable.recrystallize',
  TRANSPORT_TELEMETRY: 'transport.telemetry',
} as const;
