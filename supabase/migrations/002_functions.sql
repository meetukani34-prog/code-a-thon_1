-- ========================================
-- CAMPUS OS — Database Functions & Triggers
-- ========================================

-- =====================
-- Function: Check Attendance Threshold
-- Fires cascading ripple when student drops below 75%
-- =====================
CREATE OR REPLACE FUNCTION fn_check_attendance_threshold()
RETURNS TRIGGER AS $$
DECLARE
  total_sessions INT;
  attended_sessions INT;
  attendance_pct FLOAT;
  student_name TEXT;
  course_name TEXT;
BEGIN
  -- Count total sessions for this course this semester
  SELECT COUNT(DISTINCT session_date) INTO total_sessions
  FROM attendance
  WHERE course_id = NEW.course_id
    AND campus_id = NEW.campus_id;

  -- Count sessions this student attended
  SELECT COUNT(*) INTO attended_sessions
  FROM attendance
  WHERE student_id = NEW.student_id
    AND course_id = NEW.course_id
    AND campus_id = NEW.campus_id;

  -- Calculate percentage
  IF total_sessions > 0 THEN
    attendance_pct := (attended_sessions::FLOAT / total_sessions::FLOAT) * 100;
  ELSE
    attendance_pct := 100;
  END IF;

  -- Get names for the event payload
  SELECT full_name INTO student_name FROM users WHERE id = NEW.student_id;
  SELECT name INTO course_name FROM courses WHERE id = NEW.course_id;

  -- Update student metrics
  INSERT INTO student_metrics (campus_id, student_id, attendance_pct, metric_date)
  VALUES (NEW.campus_id, NEW.student_id, attendance_pct, CURRENT_DATE)
  ON CONFLICT (student_id, metric_date)
    DO UPDATE SET attendance_pct = EXCLUDED.attendance_pct;

  -- If below threshold, log event for the event bus to pick up
  IF attendance_pct < 75 THEN
    INSERT INTO event_log (campus_id, event_type, severity, payload, source_service)
    VALUES (
      NEW.campus_id,
      'attendance.threshold_breach',
      'critical',
      jsonb_build_object(
        'student_id', NEW.student_id,
        'student_name', student_name,
        'course_id', NEW.course_id,
        'course_name', course_name,
        'attendance_pct', attendance_pct,
        'threshold', 75
      ),
      'attendance_trigger'
    );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add unique constraint for metrics upsert
ALTER TABLE student_metrics ADD CONSTRAINT unique_student_metric_date
  UNIQUE (student_id, metric_date);

-- Trigger on attendance insert
CREATE TRIGGER trg_attendance_threshold
  AFTER INSERT ON attendance
  FOR EACH ROW
  EXECUTE FUNCTION fn_check_attendance_threshold();

-- =====================
-- Function: Anonymize Metrics (k-Anonymity)
-- Strips PII and aggregates into anonymized_analytics
-- =====================
CREATE OR REPLACE FUNCTION fn_anonymize_metrics(target_period TEXT DEFAULT 'daily')
RETURNS INT AS $$
DECLARE
  rows_inserted INT := 0;
  campus_rec RECORD;
BEGIN
  FOR campus_rec IN SELECT c.id, c.region FROM campuses c LOOP
    -- Attendance aggregation (k-anonymity: min 5 students per group)
    INSERT INTO anonymized_analytics (region, metric_type, value, dimensions, k_anonymity_level, period)
    SELECT
      campus_rec.region,
      'avg_attendance',
      AVG(sm.attendance_pct),
      jsonb_build_object('sample_size', COUNT(*)),
      LEAST(COUNT(*)::INT, 10),
      target_period
    FROM student_metrics sm
    WHERE sm.campus_id = campus_rec.id
      AND sm.metric_date = CURRENT_DATE
    HAVING COUNT(*) >= 5;

    GET DIAGNOSTICS rows_inserted = ROW_COUNT;

    -- Placement rate aggregation
    INSERT INTO anonymized_analytics (region, metric_type, value, dimensions, k_anonymity_level, period)
    SELECT
      campus_rec.region,
      'placement_rate',
      (COUNT(*) FILTER (WHERE p.status = 'selected'))::FLOAT / NULLIF(COUNT(*), 0) * 100,
      jsonb_build_object('total_applications', COUNT(*), 'selected', COUNT(*) FILTER (WHERE p.status = 'selected')),
      LEAST(COUNT(*)::INT, 10),
      target_period
    FROM placements p
    WHERE p.campus_id = campus_rec.id
    HAVING COUNT(*) >= 5;

    -- Friction risk aggregation
    INSERT INTO anonymized_analytics (region, metric_type, value, dimensions, k_anonymity_level, period)
    SELECT
      campus_rec.region,
      'avg_friction_risk',
      AVG(sm.friction_risk_score),
      jsonb_build_object('high_risk_count', COUNT(*) FILTER (WHERE sm.friction_risk_score > 70)),
      LEAST(COUNT(*)::INT, 10),
      target_period
    FROM student_metrics sm
    WHERE sm.campus_id = campus_rec.id
      AND sm.metric_date = CURRENT_DATE
    HAVING COUNT(*) >= 5;
  END LOOP;

  RETURN rows_inserted;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================
-- Function: Cryptographic Migration Protocol
-- Securely transfers user between campus nodes
-- =====================
CREATE OR REPLACE FUNCTION fn_cryptographic_migration(
  p_user_id UUID,
  p_target_campus_id UUID
)
RETURNS JSONB AS $$
DECLARE
  source_campus_id UUID;
  result JSONB;
BEGIN
  -- Get current campus
  SELECT campus_id INTO source_campus_id
  FROM users WHERE id = p_user_id;

  IF source_campus_id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'User not found');
  END IF;

  IF source_campus_id = p_target_campus_id THEN
    RETURN jsonb_build_object('success', false, 'error', 'Already in target campus');
  END IF;

  -- Update user's campus assignment
  UPDATE users SET
    campus_id = p_target_campus_id,
    updated_at = now()
  WHERE id = p_user_id;

  -- Migrate attendance records
  UPDATE attendance SET campus_id = p_target_campus_id
  WHERE student_id = p_user_id AND campus_id = source_campus_id;

  -- Migrate placement records
  UPDATE placements SET campus_id = p_target_campus_id
  WHERE student_id = p_user_id AND campus_id = source_campus_id;

  -- Migrate student metrics
  UPDATE student_metrics SET campus_id = p_target_campus_id
  WHERE student_id = p_user_id AND campus_id = source_campus_id;

  -- Migrate hostel alerts
  UPDATE hostel_alerts SET campus_id = p_target_campus_id
  WHERE student_id = p_user_id AND campus_id = source_campus_id;

  -- Log the migration event on both campuses
  INSERT INTO event_log (campus_id, event_type, severity, payload, source_service)
  VALUES
    (source_campus_id, 'user.migrated_out', 'info',
     jsonb_build_object('user_id', p_user_id, 'target_campus', p_target_campus_id),
     'migration_protocol'),
    (p_target_campus_id, 'user.migrated_in', 'info',
     jsonb_build_object('user_id', p_user_id, 'source_campus', source_campus_id),
     'migration_protocol');

  RETURN jsonb_build_object(
    'success', true,
    'user_id', p_user_id,
    'from_campus', source_campus_id,
    'to_campus', p_target_campus_id,
    'migrated_at', now()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================
-- Function: Freeze Placement (Called by Event Bus)
-- =====================
CREATE OR REPLACE FUNCTION fn_freeze_student_placements(
  p_student_id UUID,
  p_reason TEXT DEFAULT 'Attendance below 75% threshold'
)
RETURNS INT AS $$
DECLARE
  frozen_count INT;
BEGIN
  UPDATE placements
  SET status = 'frozen',
      frozen_reason = p_reason,
      updated_at = now()
  WHERE student_id = p_student_id
    AND status = 'active';

  GET DIAGNOSTICS frozen_count = ROW_COUNT;
  RETURN frozen_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================
-- Seed Data for Demo
-- =====================
INSERT INTO campuses (name, code, region) VALUES
  ('National Institute of Technology', 'NIT-SUR', 'South'),
  ('Indian Institute of Technology', 'IIT-BOM', 'West'),
  ('Delhi Technical University', 'DTU-DEL', 'North');
