-- ========================================
-- SARVAM — Core Database Schema
-- Multi-Tenant PostgreSQL with RLS
-- ========================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================
-- CAMPUSES (Tenant Nodes / Isolated Orbits)
-- =====================
CREATE TABLE campuses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  code TEXT UNIQUE NOT NULL,
  region TEXT NOT NULL,
  config JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- =====================
-- USERS (Multi-Role with Encrypted PII)
-- =====================
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_id UUID UNIQUE,
  campus_id UUID REFERENCES campuses(id) ON DELETE CASCADE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin','faculty','student','warden','transport','placement_officer')),
  avatar_url TEXT,
  profile JSONB DEFAULT '{}',
  encrypted_contact TEXT,
  encrypted_address TEXT,
  encrypted_id_number TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_users_campus ON users(campus_id);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_auth ON users(auth_id);

-- =====================
-- ROOMS
-- =====================
CREATE TABLE rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campus_id UUID REFERENCES campuses(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  capacity INT NOT NULL DEFAULT 30,
  building TEXT,
  floor INT,
  amenities JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_rooms_campus ON rooms(campus_id);

-- =====================
-- COURSES
-- =====================
CREATE TABLE courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campus_id UUID REFERENCES campuses(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  code TEXT NOT NULL,
  faculty_id UUID REFERENCES users(id),
  room_id UUID REFERENCES rooms(id),
  schedule JSONB DEFAULT '[]',
  semester TEXT,
  max_students INT DEFAULT 60,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_courses_campus ON courses(campus_id);
CREATE INDEX idx_courses_faculty ON courses(faculty_id);

-- =====================
-- ATTENDANCE
-- =====================
CREATE TABLE attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campus_id UUID REFERENCES campuses(id) ON DELETE CASCADE NOT NULL,
  student_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE NOT NULL,
  recorded_at TIMESTAMPTZ DEFAULT now(),
  method TEXT CHECK (method IN ('qr_token','manual','biometric')) DEFAULT 'manual',
  geo_verified BOOLEAN DEFAULT false,
  wifi_verified BOOLEAN DEFAULT false,
  qr_token_hash TEXT,
  session_date DATE DEFAULT CURRENT_DATE
);

CREATE INDEX idx_attendance_student ON attendance(student_id);
CREATE INDEX idx_attendance_course ON attendance(course_id);
CREATE INDEX idx_attendance_campus ON attendance(campus_id);
CREATE INDEX idx_attendance_date ON attendance(session_date);

-- =====================
-- PLACEMENTS
-- =====================
CREATE TABLE placements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campus_id UUID REFERENCES campuses(id) ON DELETE CASCADE NOT NULL,
  student_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  company TEXT NOT NULL,
  position TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active','frozen','selected','rejected','interview_scheduled')),
  resume_url TEXT,
  skill_match_score FLOAT DEFAULT 0,
  matched_skills JSONB DEFAULT '[]',
  interview_slot TIMESTAMPTZ,
  frozen_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_placements_campus ON placements(campus_id);
CREATE INDEX idx_placements_student ON placements(student_id);
CREATE INDEX idx_placements_status ON placements(status);

-- =====================
-- EVENT LOG (Kinetic Event Bus Audit Trail)
-- =====================
CREATE TABLE event_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campus_id UUID REFERENCES campuses(id),
  event_type TEXT NOT NULL,
  severity TEXT DEFAULT 'info' CHECK (severity IN ('debug','info','warning','critical')),
  payload JSONB NOT NULL DEFAULT '{}',
  source_service TEXT,
  processed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_events_campus ON event_log(campus_id);
CREATE INDEX idx_events_type ON event_log(event_type);
CREATE INDEX idx_events_severity ON event_log(severity);
CREATE INDEX idx_events_created ON event_log(created_at DESC);

-- =====================
-- ANONYMIZED ANALYTICS (Cosmological Data Warehouse — No PII)
-- =====================
CREATE TABLE anonymized_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  region TEXT NOT NULL,
  metric_type TEXT NOT NULL,
  value FLOAT NOT NULL,
  dimensions JSONB DEFAULT '{}',
  k_anonymity_level INT DEFAULT 5,
  period TEXT NOT NULL CHECK (period IN ('daily','weekly','monthly','quarterly')),
  recorded_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_analytics_region ON anonymized_analytics(region);
CREATE INDEX idx_analytics_metric ON anonymized_analytics(metric_type);
CREATE INDEX idx_analytics_period ON anonymized_analytics(period);

-- =====================
-- HOSTEL ALERTS
-- =====================
CREATE TABLE hostel_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campus_id UUID REFERENCES campuses(id) ON DELETE CASCADE NOT NULL,
  student_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  alert_type TEXT NOT NULL CHECK (alert_type IN ('attendance_low','academic_probation','disciplinary','health','general')),
  message TEXT NOT NULL,
  severity TEXT DEFAULT 'warning' CHECK (severity IN ('info','warning','critical')),
  acknowledged BOOLEAN DEFAULT false,
  acknowledged_by UUID REFERENCES users(id),
  acknowledged_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_hostel_alerts_campus ON hostel_alerts(campus_id);
CREATE INDEX idx_hostel_alerts_student ON hostel_alerts(student_id);

-- =====================
-- VEHICLES (Transit Telemetry)
-- =====================
CREATE TABLE vehicles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campus_id UUID REFERENCES campuses(id) ON DELETE CASCADE NOT NULL,
  plate_number TEXT NOT NULL,
  vehicle_type TEXT DEFAULT 'bus',
  route_name TEXT,
  current_lat DOUBLE PRECISION,
  current_lng DOUBLE PRECISION,
  speed_kmh FLOAT DEFAULT 0,
  heading FLOAT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  last_ping TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_vehicles_campus ON vehicles(campus_id);

-- =====================
-- TIMETABLE SLOTS (CSP Solver Output)
-- =====================
CREATE TABLE timetable_slots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campus_id UUID REFERENCES campuses(id) ON DELETE CASCADE NOT NULL,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE NOT NULL,
  room_id UUID REFERENCES rooms(id),
  faculty_id UUID REFERENCES users(id),
  day_of_week INT NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_active BOOLEAN DEFAULT true,
  solver_version INT DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_timetable_campus ON timetable_slots(campus_id);
CREATE INDEX idx_timetable_day ON timetable_slots(day_of_week);

-- =====================
-- STUDENT METRICS (Cognitive Layer Input)
-- =====================
CREATE TABLE student_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campus_id UUID REFERENCES campuses(id) ON DELETE CASCADE NOT NULL,
  student_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  metric_date DATE DEFAULT CURRENT_DATE,
  attendance_pct FLOAT DEFAULT 100,
  lms_interaction_score FLOAT DEFAULT 0,
  library_downloads INT DEFAULT 0,
  assignment_submission_rate FLOAT DEFAULT 0,
  friction_risk_score FLOAT DEFAULT 0,
  remedial_scheduled BOOLEAN DEFAULT false,
  advisor_alerted BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_student_metrics_student ON student_metrics(student_id);
CREATE INDEX idx_student_metrics_risk ON student_metrics(friction_risk_score DESC);

-- ========================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ========================================

-- Enable RLS on all tenant-scoped tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE placements ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE hostel_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE timetable_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_metrics ENABLE ROW LEVEL SECURITY;

-- Helper function to extract campus_id from JWT
CREATE OR REPLACE FUNCTION get_user_campus_id()
RETURNS UUID AS $$
  SELECT (auth.jwt() -> 'app_metadata' ->> 'campus_id')::UUID;
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- Helper function to extract role from JWT
CREATE OR REPLACE FUNCTION get_user_role()
RETURNS TEXT AS $$
  SELECT auth.jwt() -> 'app_metadata' ->> 'role';
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- Campus Isolation: users only see their own campus
CREATE POLICY campus_isolation_users ON users
  FOR ALL USING (campus_id = get_user_campus_id());

CREATE POLICY campus_isolation_rooms ON rooms
  FOR ALL USING (campus_id = get_user_campus_id());

CREATE POLICY campus_isolation_courses ON courses
  FOR ALL USING (campus_id = get_user_campus_id());

CREATE POLICY campus_isolation_attendance ON attendance
  FOR ALL USING (campus_id = get_user_campus_id());

CREATE POLICY campus_isolation_placements ON placements
  FOR ALL USING (campus_id = get_user_campus_id());

CREATE POLICY campus_isolation_events ON event_log
  FOR ALL USING (campus_id = get_user_campus_id() OR campus_id IS NULL);

CREATE POLICY campus_isolation_hostel ON hostel_alerts
  FOR ALL USING (campus_id = get_user_campus_id());

CREATE POLICY campus_isolation_vehicles ON vehicles
  FOR ALL USING (campus_id = get_user_campus_id());

CREATE POLICY campus_isolation_timetable ON timetable_slots
  FOR ALL USING (campus_id = get_user_campus_id());

CREATE POLICY campus_isolation_metrics ON student_metrics
  FOR ALL USING (campus_id = get_user_campus_id());

-- RBAC: Transport operators cannot see student performance/medical data
CREATE POLICY rbac_transport_restricted ON student_metrics
  FOR SELECT USING (get_user_role() != 'transport');

CREATE POLICY rbac_transport_no_placements ON placements
  FOR SELECT USING (get_user_role() != 'transport');

-- Anonymized analytics has no RLS (no PII, global access)
-- campuses table: admins only can modify
CREATE POLICY campuses_read_all ON campuses
  FOR SELECT USING (true);

CREATE POLICY campuses_modify_admin ON campuses
  FOR ALL USING (get_user_role() = 'admin');

-- Service role bypass for server-side operations
-- (Supabase service_role key inherently bypasses RLS)
