const { createClient } = require('@supabase/supabase-js');
const url = 'https://mnyynjxquprwvtcncxye.supabase.co';
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ueXluanhxdXByd3Z0Y25jeHllIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3OTcxNTg4NywiZXhwIjoyMDk1MjkxODg3fQ.lhztbgL9nNCq_4xkyo2oahz2o90nU5CgC_9PXtdutGg';
const supabase = createClient(url, key);

async function test() {
  const { data, error } = await supabase.rpc('exec_sql', { sql: 'CREATE TABLE IF NOT EXISTS hostel_leaves (id SERIAL PRIMARY KEY, student_name TEXT, start_date DATE, end_date DATE, reason TEXT, status TEXT, created_at TIMESTAMP DEFAULT NOW());' });
  console.log('Result:', data, error);
}
test();
