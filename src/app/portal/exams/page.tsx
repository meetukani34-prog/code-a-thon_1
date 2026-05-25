import { createServerSupabaseClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import StudentExamView from '@/components/exams/StudentExamView';
import FacultyExamView from '@/components/exams/FacultyExamView';
import AdminExamView from '@/components/exams/AdminExamView';

export default async function ExamsPortal() {
  const supabase = await createServerSupabaseClient();
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    redirect('/');
  }

  const role = session.user.user_metadata?.role?.toLowerCase() || 'student';

  return (
    <div>
      <h1 style={{
        fontSize: 'var(--text-xl)',
        fontWeight: 700,
        marginBottom: 'var(--space-xl)',
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-sm)'
      }}>
        <span style={{ color: 'var(--accent-primary)' }}>✎</span> 
        {role === 'faculty' ? 'Faculty Exam Center' : role === 'admin' || role === 'superadmin' ? 'Master Exam Control' : 'Student Exam Portal'}
      </h1>
      
      {role === 'student' && <StudentExamView />}
      {role === 'faculty' && <FacultyExamView />}
      {(role === 'admin' || role === 'superadmin') && <AdminExamView />}
      
    </div>
  );
}
