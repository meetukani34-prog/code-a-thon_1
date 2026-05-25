/**
 * Proactive Trajectory Predictive Regressor
 * 
 * Computes a "Friction Risk Metric" (0-100) by analyzing:
 * - Attendance percentage
 * - LMS interaction score  
 * - Digital library download frequency
 * - Assignment submission rate
 * 
 * Uses exponential moving average for temporal smoothing.
 */

interface StudentTouchpoints {
  attendancePct: number;        // 0-100
  lmsInteractionScore: number;  // 0-100 (normalized)
  libraryDownloads: number;     // absolute count
  assignmentSubmissionRate: number; // 0-100
  previousRiskScore?: number;   // for EMA smoothing
}

interface RiskAssessment {
  frictionRiskScore: number;    // 0-100
  riskLevel: 'low' | 'moderate' | 'high' | 'critical';
  factors: RiskFactor[];
  recommendations: string[];
  shouldScheduleRemedial: boolean;
  shouldAlertAdvisor: boolean;
}

interface RiskFactor {
  name: string;
  value: number;
  weight: number;
  contribution: number;
  status: 'healthy' | 'warning' | 'danger';
}

// Weights for each factor
const WEIGHTS = {
  attendance: 0.35,
  lmsInteraction: 0.25,
  libraryUsage: 0.15,
  assignmentRate: 0.25,
};

// Thresholds
const RISK_THRESHOLDS = {
  low: 30,
  moderate: 50,
  high: 70,
  critical: 85,
};

// EMA smoothing factor (0-1, higher = more weight on recent data)
const EMA_ALPHA = 0.3;

/**
 * Normalize library downloads to 0-100 scale.
 * Assumes typical range of 0-50 downloads per period.
 */
function normalizeLibraryDownloads(downloads: number): number {
  const maxExpected = 50;
  return Math.min(100, (downloads / maxExpected) * 100);
}

/**
 * Compute the Friction Risk Metric for a student.
 */
export function computeFrictionRisk(touchpoints: StudentTouchpoints): RiskAssessment {
  const normalizedLibrary = normalizeLibraryDownloads(touchpoints.libraryDownloads);

  // Invert scores: high attendance = low risk, so risk = 100 - value
  const attendanceRisk = 100 - touchpoints.attendancePct;
  const lmsRisk = 100 - touchpoints.lmsInteractionScore;
  const libraryRisk = 100 - normalizedLibrary;
  const assignmentRisk = 100 - touchpoints.assignmentSubmissionRate;

  // Weighted sum
  const rawScore =
    WEIGHTS.attendance * attendanceRisk +
    WEIGHTS.lmsInteraction * lmsRisk +
    WEIGHTS.libraryUsage * libraryRisk +
    WEIGHTS.assignmentRate * assignmentRisk;

  // Apply EMA smoothing if previous score exists
  let smoothedScore = rawScore;
  if (touchpoints.previousRiskScore !== undefined) {
    smoothedScore = EMA_ALPHA * rawScore + (1 - EMA_ALPHA) * touchpoints.previousRiskScore;
  }

  // Clamp to 0-100
  const frictionRiskScore = Math.max(0, Math.min(100, Math.round(smoothedScore * 10) / 10));

  // Determine risk level
  let riskLevel: RiskAssessment['riskLevel'] = 'low';
  if (frictionRiskScore >= RISK_THRESHOLDS.critical) riskLevel = 'critical';
  else if (frictionRiskScore >= RISK_THRESHOLDS.high) riskLevel = 'high';
  else if (frictionRiskScore >= RISK_THRESHOLDS.moderate) riskLevel = 'moderate';

  // Build factor breakdown
  const factors: RiskFactor[] = [
    {
      name: 'Attendance',
      value: touchpoints.attendancePct,
      weight: WEIGHTS.attendance,
      contribution: WEIGHTS.attendance * attendanceRisk,
      status: touchpoints.attendancePct < 60 ? 'danger' : touchpoints.attendancePct < 75 ? 'warning' : 'healthy',
    },
    {
      name: 'LMS Interaction',
      value: touchpoints.lmsInteractionScore,
      weight: WEIGHTS.lmsInteraction,
      contribution: WEIGHTS.lmsInteraction * lmsRisk,
      status: touchpoints.lmsInteractionScore < 30 ? 'danger' : touchpoints.lmsInteractionScore < 60 ? 'warning' : 'healthy',
    },
    {
      name: 'Library Usage',
      value: normalizedLibrary,
      weight: WEIGHTS.libraryUsage,
      contribution: WEIGHTS.libraryUsage * libraryRisk,
      status: normalizedLibrary < 20 ? 'danger' : normalizedLibrary < 50 ? 'warning' : 'healthy',
    },
    {
      name: 'Assignment Submissions',
      value: touchpoints.assignmentSubmissionRate,
      weight: WEIGHTS.assignmentRate,
      contribution: WEIGHTS.assignmentRate * assignmentRisk,
      status: touchpoints.assignmentSubmissionRate < 50 ? 'danger' : touchpoints.assignmentSubmissionRate < 75 ? 'warning' : 'healthy',
    },
  ];

  // Generate recommendations
  const recommendations: string[] = [];
  if (touchpoints.attendancePct < 75) {
    recommendations.push('Schedule mandatory attendance improvement session');
  }
  if (touchpoints.lmsInteractionScore < 40) {
    recommendations.push('Assign supplementary LMS modules for engagement');
  }
  if (normalizedLibrary < 30) {
    recommendations.push('Recommend relevant research materials and readings');
  }
  if (touchpoints.assignmentSubmissionRate < 60) {
    recommendations.push('Set up assignment deadline reminders and check-ins');
  }
  if (frictionRiskScore >= RISK_THRESHOLDS.high) {
    recommendations.push('Immediate intervention: Schedule one-on-one advisor meeting');
  }

  return {
    frictionRiskScore,
    riskLevel,
    factors,
    recommendations,
    shouldScheduleRemedial: frictionRiskScore >= RISK_THRESHOLDS.high,
    shouldAlertAdvisor: frictionRiskScore >= RISK_THRESHOLDS.moderate,
  };
}

/**
 * Batch compute risk scores for multiple students.
 */
export function batchComputeRisk(students: Array<{ id: string; touchpoints: StudentTouchpoints }>): Array<{ id: string; assessment: RiskAssessment }> {
  return students.map(s => ({
    id: s.id,
    assessment: computeFrictionRisk(s.touchpoints),
  }));
}
