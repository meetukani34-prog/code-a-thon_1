/**
 * Space-Time CSP Matrix Solver — Timetable Optimization
 * 
 * Minimize Clashes (C) = w1(Faculty Overlaps) + w2(Room Capacity Breaches) + w3(Student Track Clashes)
 * 
 * Uses backtracking with constraint propagation (arc consistency) to find
 * collision-free schedules from thousands of permutations.
 */

interface Course {
  id: string;
  name: string;
  facultyId: string;
  requiredCapacity: number;
  duration: number; // in slots (1 slot = 1 hour)
  studentTrack: string; // e.g., "CS-3rd-year"
}

interface Room {
  id: string;
  name: string;
  capacity: number;
}

interface TimeSlot {
  day: number;      // 0-6 (Mon-Sun)
  startHour: number; // 8-18
}

interface ScheduleAssignment {
  courseId: string;
  roomId: string;
  day: number;
  startHour: number;
  endHour: number;
}

interface CSPResult {
  assignments: ScheduleAssignment[];
  clashScore: number;
  facultyOverlaps: number;
  roomCapacityBreaches: number;
  studentTrackClashes: number;
  solved: boolean;
  permutationsChecked: number;
}

interface CSPWeights {
  w1: number; // Faculty overlap weight
  w2: number; // Room capacity breach weight
  w3: number; // Student track clash weight
}

const DEFAULT_WEIGHTS: CSPWeights = { w1: 1.0, w2: 0.8, w3: 1.2 };
const DAYS = [0, 1, 2, 3, 4, 5]; // Monday-Saturday
const HOURS = [8, 9, 10, 11, 12, 14, 15, 16, 17]; // Available hours (lunch break 13:00)

/**
 * Check if two time ranges overlap.
 */
function timeOverlaps(
  day1: number, start1: number, end1: number,
  day2: number, start2: number, end2: number
): boolean {
  if (day1 !== day2) return false;
  return start1 < end2 && start2 < end1;
}

/**
 * Calculate the constraint violation score for a set of assignments.
 */
function calculateClashScore(
  assignments: ScheduleAssignment[],
  courses: Course[],
  rooms: Room[],
  weights: CSPWeights
): { total: number; facultyOverlaps: number; roomCapacityBreaches: number; studentTrackClashes: number } {
  let facultyOverlaps = 0;
  let roomCapacityBreaches = 0;
  let studentTrackClashes = 0;

  const courseMap = new Map(courses.map(c => [c.id, c]));
  const roomMap = new Map(rooms.map(r => [r.id, r]));

  for (let i = 0; i < assignments.length; i++) {
    const a = assignments[i];
    const courseA = courseMap.get(a.courseId)!;
    const roomA = roomMap.get(a.roomId);

    // Check room capacity
    if (roomA && courseA.requiredCapacity > roomA.capacity) {
      roomCapacityBreaches++;
    }

    for (let j = i + 1; j < assignments.length; j++) {
      const b = assignments[j];
      const courseB = courseMap.get(b.courseId)!;

      if (timeOverlaps(a.day, a.startHour, a.endHour, b.day, b.startHour, b.endHour)) {
        // Faculty overlap check
        if (courseA.facultyId === courseB.facultyId) {
          facultyOverlaps++;
        }

        // Room overlap check (same room, same time)
        if (a.roomId === b.roomId) {
          facultyOverlaps++; // Counts as a collision too
        }

        // Student track clash
        if (courseA.studentTrack === courseB.studentTrack) {
          studentTrackClashes++;
        }
      }
    }
  }

  const total =
    weights.w1 * facultyOverlaps +
    weights.w2 * roomCapacityBreaches +
    weights.w3 * studentTrackClashes;

  return { total, facultyOverlaps, roomCapacityBreaches, studentTrackClashes };
}

/**
 * Generate all possible time slots for a course.
 */
function generateDomains(course: Course): TimeSlot[] {
  const slots: TimeSlot[] = [];
  for (const day of DAYS) {
    for (const hour of HOURS) {
      if (hour + course.duration <= 18) { // Don't exceed end of day
        slots.push({ day, startHour: hour });
      }
    }
  }
  return slots;
}

/**
 * CSP Solver with backtracking and forward checking.
 */
export function solveTimetable(
  courses: Course[],
  rooms: Room[],
  weights: CSPWeights = DEFAULT_WEIGHTS,
  maxPermutations: number = 50000
): CSPResult {
  let bestAssignments: ScheduleAssignment[] = [];
  let bestScore = Infinity;
  let permutationsChecked = 0;

  // Sort courses by most constrained first (MRV heuristic)
  const sortedCourses = [...courses].sort((a, b) => {
    if (a.requiredCapacity !== b.requiredCapacity) return b.requiredCapacity - a.requiredCapacity;
    return a.duration - b.duration;
  });

  // Filter rooms that could fit at least one course
  const availableRooms = rooms.filter(r => courses.some(c => c.requiredCapacity <= r.capacity));

  function backtrack(
    courseIndex: number,
    currentAssignments: ScheduleAssignment[]
  ): boolean {
    if (permutationsChecked >= maxPermutations) return false;

    if (courseIndex === sortedCourses.length) {
      // All courses assigned — evaluate
      const score = calculateClashScore(currentAssignments, courses, rooms, weights);
      if (score.total < bestScore) {
        bestScore = score.total;
        bestAssignments = [...currentAssignments];
      }
      return score.total === 0; // Perfect solution found
    }

    const course = sortedCourses[courseIndex];
    const domain = generateDomains(course);

    // Shuffle domain for variety
    for (let i = domain.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [domain[i], domain[j]] = [domain[j], domain[i]];
    }

    // Try fitting rooms
    const fittingRooms = availableRooms.filter(r => r.capacity >= course.requiredCapacity);

    for (const slot of domain) {
      for (const room of fittingRooms) {
        permutationsChecked++;

        const assignment: ScheduleAssignment = {
          courseId: course.id,
          roomId: room.id,
          day: slot.day,
          startHour: slot.startHour,
          endHour: slot.startHour + course.duration,
        };

        // Forward checking: does this immediately clash?
        let hasClash = false;
        for (const existing of currentAssignments) {
          const existingCourse = courses.find(c => c.id === existing.courseId)!;
          if (timeOverlaps(assignment.day, assignment.startHour, assignment.endHour, existing.day, existing.startHour, existing.endHour)) {
            if (course.facultyId === existingCourse.facultyId) { hasClash = true; break; }
            if (room.id === existing.roomId) { hasClash = true; break; }
            if (course.studentTrack === existingCourse.studentTrack) { hasClash = true; break; }
          }
        }

        if (!hasClash) {
          currentAssignments.push(assignment);
          if (backtrack(courseIndex + 1, currentAssignments)) return true;
          currentAssignments.pop();
        }
      }
    }

    return false;
  }

  backtrack(0, []);

  const finalScore = calculateClashScore(bestAssignments, courses, rooms, weights);

  return {
    assignments: bestAssignments,
    clashScore: finalScore.total,
    facultyOverlaps: finalScore.facultyOverlaps,
    roomCapacityBreaches: finalScore.roomCapacityBreaches,
    studentTrackClashes: finalScore.studentTrackClashes,
    solved: finalScore.total === 0,
    permutationsChecked,
  };
}
