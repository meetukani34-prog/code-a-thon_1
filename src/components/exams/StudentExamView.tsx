'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default function StudentExamView() {
  // Mock data for prototype
  const attendance = 72; // Below 75% triggers warning
  const isEligible = attendance >= 75;

  const timetable = [
    { date: '2026-06-10', time: '10:00 AM', subject: 'Data Structures', code: 'CS301' },
    { date: '2026-06-12', time: '10:00 AM', subject: 'Operating Systems', code: 'CS302' },
    { date: '2026-06-15', time: '02:00 PM', subject: 'Database Management', code: 'CS303' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Eligibility & Hall Ticket Card */}
        <Card className={`backdrop-blur-xl border ${isEligible ? 'bg-background/50 border-glass-border' : 'bg-destructive/5 border-destructive/30'}`}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              🎫 Hall Ticket Status
              {!isEligible && <Badge variant="destructive" className="ml-auto animate-pulse">ACTION REQUIRED</Badge>}
            </CardTitle>
            <CardDescription>Current Semester Exams</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 rounded-lg bg-black/20 border border-white/5">
                <span className="text-muted-foreground">Overall Attendance:</span>
                <span className={`font-bold ${isEligible ? 'text-emerald-400' : 'text-destructive'}`}>{attendance}%</span>
              </div>
              
              {!isEligible ? (
                <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-sm">
                  <h4 className="font-semibold text-destructive mb-1">⚠️ Eligibility Warning</h4>
                  <p className="text-muted-foreground">Your attendance is below the mandatory 75% threshold. Your hall ticket generation has been put on hold. Please contact your HOD immediately for condonation.</p>
                </div>
              ) : (
                <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-sm flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-emerald-400 mb-1">✓ Cleared</h4>
                    <p className="text-muted-foreground">You meet all eligibility criteria.</p>
                  </div>
                  <button className="px-4 py-2 bg-emerald-500/20 text-emerald-400 rounded-md hover:bg-emerald-500/30 transition-colors text-xs font-semibold">
                    Download Ticket
                  </button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Previous Results Overview */}
        <Card className="bg-background/50 backdrop-blur-xl border-glass-border">
          <CardHeader>
            <CardTitle>📊 Academic Performance</CardTitle>
            <CardDescription>Internal Marks & Previous Semesters</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-black/20 border border-white/5 text-center">
                  <div className="text-2xl font-black text-primary mb-1">8.4</div>
                  <div className="text-xs text-muted-foreground">Current CGPA</div>
                </div>
                <div className="p-4 rounded-lg bg-black/20 border border-white/5 text-center">
                  <div className="text-2xl font-black text-accent-primary mb-1">0</div>
                  <div className="text-xs text-muted-foreground">Active Backlogs</div>
                </div>
              </div>
              <p className="text-xs text-muted-foreground text-center mt-2">
                Internal marks for the current semester will be published here 1 week before finals.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Exam Timetable */}
      <Card className="bg-background/50 backdrop-blur-xl border-glass-border">
        <CardHeader>
          <CardTitle>📅 Upcoming Exam Schedule</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Subject Code</TableHead>
                <TableHead>Subject Name</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {timetable.map((exam, i) => (
                <TableRow key={i}>
                  <TableCell className="font-medium">{exam.date}</TableCell>
                  <TableCell>{exam.time}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs">{exam.code}</Badge>
                  </TableCell>
                  <TableCell>{exam.subject}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
