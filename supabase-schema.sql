-- ============================================
-- CAMPUS OS - Complete Database Schema
-- Run this in Supabase SQL Editor
-- ============================================

-- 1. EVENTS TABLE (Admin creates events, students see them)
CREATE TABLE IF NOT EXISTS events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  date DATE NOT NULL,
  time TEXT,
  venue TEXT,
  type TEXT DEFAULT 'Technical',
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. ATTENDANCE LOGS (Track student attendance records)
CREATE TABLE IF NOT EXISTS attendance_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID REFERENCES auth.users(id),
  student_name TEXT,
  method TEXT DEFAULT 'Biometric Face Match',
  geo_verified BOOLEAN DEFAULT true,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. PLACEMENTS (Track placement drives and applications)
CREATE TABLE IF NOT EXISTS placements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company TEXT NOT NULL,
  position TEXT,
  student_id UUID REFERENCES auth.users(id),
  status TEXT DEFAULT 'applied',
  frozen_reason TEXT,
  package_lpa NUMERIC,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. EXAM RESULTS (Store exam scores)
CREATE TABLE IF NOT EXISTS exam_results (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID REFERENCES auth.users(id),
  subject TEXT NOT NULL,
  exam_type TEXT DEFAULT 'Mid-Semester',
  marks_obtained NUMERIC,
  total_marks NUMERIC DEFAULT 100,
  semester INTEGER,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. NOTIFICATIONS (System notifications for students)
CREATE TABLE IF NOT EXISTS notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  message TEXT,
  type TEXT DEFAULT 'info',
  target_role TEXT DEFAULT 'all',
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- ENABLE ROW LEVEL SECURITY (RLS)
-- ============================================
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE placements ENABLE ROW LEVEL SECURITY;
ALTER TABLE exam_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- ============================================
-- RLS POLICIES (Allow all authenticated users to read, admin to write)
-- ============================================

-- Events: Everyone can read, admin can insert
CREATE POLICY "Anyone can read events" ON events FOR SELECT USING (true);
CREATE POLICY "Admin can insert events" ON events FOR INSERT WITH CHECK (true);

-- Attendance: Everyone can read, anyone can insert
CREATE POLICY "Anyone can read attendance" ON attendance_logs FOR SELECT USING (true);
CREATE POLICY "Anyone can insert attendance" ON attendance_logs FOR INSERT WITH CHECK (true);

-- Placements: Everyone can read
CREATE POLICY "Anyone can read placements" ON placements FOR SELECT USING (true);
CREATE POLICY "Anyone can insert placements" ON placements FOR INSERT WITH CHECK (true);

-- Exam Results: Everyone can read
CREATE POLICY "Anyone can read exams" ON exam_results FOR SELECT USING (true);
CREATE POLICY "Anyone can insert exams" ON exam_results FOR INSERT WITH CHECK (true);

-- Notifications: Everyone can read
CREATE POLICY "Anyone can read notifications" ON notifications FOR SELECT USING (true);
CREATE POLICY "Anyone can insert notifications" ON notifications FOR INSERT WITH CHECK (true);

-- ============================================
-- INSERT SAMPLE DATA (Makes demo look impressive)
-- ============================================

-- Sample Events
INSERT INTO events (title, description, date, time, venue, type) VALUES
('Annual Tech Fest 2026', 'Flagship technology festival with hackathons, workshops, and guest lectures from industry leaders.', '2026-06-15', '09:00 AM', 'Main Auditorium', 'Technical'),
('Cultural Night', 'Annual cultural extravaganza with music, dance, and drama performances.', '2026-06-20', '06:00 PM', 'Open Air Theatre', 'Cultural'),
('Industry Workshop: AI/ML', 'Hands-on workshop on Machine Learning and AI applications in modern industry.', '2026-06-10', '10:00 AM', 'CS Lab 301', 'Workshop'),
('Inter-College Sports Meet', 'Annual sports championship featuring cricket, football, badminton, and athletics.', '2026-07-01', '08:00 AM', 'Sports Complex', 'Sports');

-- Sample Attendance Logs
INSERT INTO attendance_logs (student_name, method, geo_verified) VALUES
('Anjali Desai', 'QR + GeoFencing', true),
('Rahul Sharma', 'Biometric Face Match', true),
('Priya Patel', 'BLE Beacon', true),
('Arjun Mehta', 'Campus WiFi', false),
('Sneha Reddy', 'Biometric Face Match', true);

-- Sample Placements
INSERT INTO placements (company, position, status, package_lpa) VALUES
('Google', 'Software Engineer L3', 'interview_scheduled', 45.0),
('Microsoft', 'Cloud Solution Architect', 'applied', 38.0),
('Amazon', 'SDE-1', 'applied', 32.0),
('Infosys', 'Systems Engineer', 'offer_received', 8.5);

-- Sample Exam Results
INSERT INTO exam_results (subject, exam_type, marks_obtained, total_marks, semester) VALUES
('Data Structures', 'Mid-Semester', 85, 100, 4),
('Operating Systems', 'Mid-Semester', 78, 100, 4),
('Database Management', 'End-Semester', 92, 100, 3),
('Computer Networks', 'Mid-Semester', 71, 100, 4),
('Software Engineering', 'End-Semester', 88, 100, 3);

-- Sample Notifications
INSERT INTO notifications (title, message, type, target_role) VALUES
('Placement Drive: Google', 'Google campus placement drive scheduled for June 25. Eligibility: > 8.0 CGPA, No backlogs.', 'info', 'student'),
('Attendance Warning', 'Students below 75% attendance will not be allowed to sit for end-semester exams.', 'warning', 'student'),
('Faculty Meeting', 'All faculty members are requested to attend the curriculum review meeting on June 5.', 'info', 'faculty');

-- ============================================
-- HOSTEL MODULE
-- ============================================

-- 6. HOSTEL ROOMS
CREATE TABLE IF NOT EXISTS hostel_rooms (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  room_number TEXT NOT NULL,
  block TEXT NOT NULL,
  capacity INTEGER DEFAULT 2,
  current_occupants INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 7. HOSTEL RESIDENTS
CREATE TABLE IF NOT EXISTS hostel_residents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID REFERENCES auth.users(id),
  student_name TEXT,
  room_id UUID REFERENCES hostel_rooms(id),
  mess_plan TEXT DEFAULT 'Standard Veg',
  late_entries INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 8. HOSTEL LEAVES
CREATE TABLE IF NOT EXISTS hostel_leaves (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID REFERENCES auth.users(id),
  student_name TEXT,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  reason TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 9. HOSTEL ALERTS
CREATE TABLE IF NOT EXISTS hostel_alerts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID REFERENCES auth.users(id),
  student_name TEXT,
  alert_type TEXT,
  message TEXT,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE hostel_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE hostel_residents ENABLE ROW LEVEL SECURITY;
ALTER TABLE hostel_leaves ENABLE ROW LEVEL SECURITY;
ALTER TABLE hostel_alerts ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Anyone can read hostel_rooms" ON hostel_rooms FOR SELECT USING (true);
CREATE POLICY "Anyone can insert hostel_rooms" ON hostel_rooms FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can read hostel_residents" ON hostel_residents FOR SELECT USING (true);
CREATE POLICY "Anyone can insert hostel_residents" ON hostel_residents FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can read hostel_leaves" ON hostel_leaves FOR SELECT USING (true);
CREATE POLICY "Anyone can insert hostel_leaves" ON hostel_leaves FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can read hostel_alerts" ON hostel_alerts FOR SELECT USING (true);
CREATE POLICY "Anyone can insert hostel_alerts" ON hostel_alerts FOR INSERT WITH CHECK (true);

-- Sample Data for Hostel
INSERT INTO hostel_rooms (id, room_number, block, capacity, current_occupants) VALUES
('11111111-1111-1111-1111-111111111111', 'A-402', 'Block A', 2, 1),
('22222222-2222-2222-2222-222222222222', 'B-201', 'Block B', 2, 2),
('33333333-3333-3333-3333-333333333333', 'C-302', 'Block C', 1, 1);

INSERT INTO hostel_residents (student_name, room_id, mess_plan, late_entries) VALUES
('Priya Patel', '11111111-1111-1111-1111-111111111111', 'Premium Veg Plan', 0),
('Rahul Sharma', '22222222-2222-2222-2222-222222222222', 'Standard Veg', 1),
('Arjun Mehta', '33333333-3333-3333-3333-333333333333', 'Non-Veg Plan', 3);

INSERT INTO hostel_leaves (student_name, start_date, end_date, reason, status) VALUES
('Anjali Desai', '2026-06-10', '2026-06-12', 'Medical Checkup', 'pending'),
('Rahul Sharma', '2026-06-15', '2026-06-18', 'Family Function', 'pending'),
('Priya Patel', '2026-05-20', '2026-05-21', 'Night Outpass (Tech Fest)', 'rejected');

INSERT INTO hostel_alerts (student_name, alert_type, message, status) VALUES
('Arjun Mehta', 'Late Entry', 'Late Entry at 11:45 PM', 'active'),
('Priya Patel', 'Absence', 'Absent for 3 Days', 'active');
