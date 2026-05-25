export type UserRole = 'admin' | 'faculty' | 'student' | 'warden' | 'transport' | 'placement_officer';

export type Resource =
  | 'dashboard'
  | 'attendance'
  | 'placements'
  | 'timetable'
  | 'transport'
  | 'analytics'
  | 'console'
  | 'hostel_alerts'
  | 'student_metrics'
  | 'student_medical'
  | 'users'
  | 'settings';

export type Action = 'read' | 'write' | 'delete' | 'admin';

/**
 * RBAC Permission Matrix
 * Defines which roles can perform which actions on which resources.
 */
const PERMISSION_MATRIX: Record<UserRole, Partial<Record<Resource, Action[]>>> = {
  admin: {
    dashboard: ['read', 'write', 'admin'],
    attendance: ['read', 'write', 'delete', 'admin'],
    placements: ['read', 'write', 'delete', 'admin'],
    timetable: ['read', 'write', 'delete', 'admin'],
    transport: ['read', 'write', 'admin'],
    analytics: ['read', 'write', 'admin'],
    console: ['read', 'admin'],
    hostel_alerts: ['read', 'write', 'admin'],
    student_metrics: ['read', 'admin'],
    student_medical: ['read', 'admin'],
    users: ['read', 'write', 'delete', 'admin'],
    settings: ['read', 'write', 'admin'],
  },
  faculty: {
    dashboard: ['read'],
    attendance: ['read', 'write'],
    placements: ['read'],
    timetable: ['read'],
    analytics: ['read'],
    console: ['read'],
    student_metrics: ['read'],
    users: ['read'],
  },
  student: {
    dashboard: ['read'],
    attendance: ['read'],
    placements: ['read', 'write'],
    timetable: ['read'],
    transport: ['read'],
    student_metrics: ['read'],
  },
  warden: {
    dashboard: ['read'],
    attendance: ['read'],
    hostel_alerts: ['read', 'write'],
    student_metrics: ['read'],
    console: ['read'],
    users: ['read'],
  },
  transport: {
    dashboard: ['read'],
    transport: ['read', 'write'],
    // Transport operators CANNOT access student data
  },
  placement_officer: {
    dashboard: ['read'],
    placements: ['read', 'write', 'delete'],
    student_metrics: ['read'],
    analytics: ['read'],
    console: ['read'],
    users: ['read'],
  },
};

/**
 * Check if a role has permission to perform an action on a resource.
 */
export function checkPermission(
  role: UserRole,
  resource: Resource,
  action: Action
): boolean {
  const rolePermissions = PERMISSION_MATRIX[role];
  if (!rolePermissions) return false;

  const resourceActions = rolePermissions[resource];
  if (!resourceActions) return false;

  return resourceActions.includes(action);
}

/**
 * Get all accessible resources for a role.
 */
export function getAccessibleResources(role: UserRole): Resource[] {
  const rolePermissions = PERMISSION_MATRIX[role];
  if (!rolePermissions) return [];
  return Object.keys(rolePermissions) as Resource[];
}

/**
 * Get navigation items for a role.
 */
export function getNavItems(role: UserRole) {
  const items = [
    { id: 'dashboard', label: 'Dashboard', icon: '◉', path: '/dashboard', resource: 'dashboard' as Resource },
    { id: 'console', label: 'Event Console', icon: '⚡', path: '/dashboard/console', resource: 'console' as Resource },
    { id: 'attendance', label: 'Attendance', icon: '◎', path: '/dashboard/attendance', resource: 'attendance' as Resource },
    { id: 'placements', label: 'Placements', icon: '◈', path: '/dashboard/placements', resource: 'placements' as Resource },
    { id: 'timetable', label: 'Timetable', icon: '▦', path: '/dashboard/timetable', resource: 'timetable' as Resource },
    { id: 'transport', label: 'Transport', icon: '◬', path: '/dashboard/transport', resource: 'transport' as Resource },
    { id: 'analytics', label: 'Analytics', icon: '◫', path: '/dashboard/analytics', resource: 'analytics' as Resource },
  ];

  return items.filter(item => checkPermission(role, item.resource, 'read'));
}
