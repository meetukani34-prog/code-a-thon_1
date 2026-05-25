'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default function FacultyExamView() {
  const ineligibleStudents = [
    { usn: '12367547', name: 'Agastya Sharma', branch: 'CS', attendance: 68 },
    { usn: '5785638625', name: 'Anju Patel', branch: 'DS', attendance: 71 },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Action Hub */}
        <Card className="bg-background/50 backdrop-blur-xl border-glass-border">
          <CardHeader>
            <CardTitle>📝 Internal Marks Upload</CardTitle>
            <CardDescription>Deadline for submission: June 1st</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Select a subject to upload internal marks for the current semester.
              </p>
              <div className="grid gap-2">
                <button className="flex items-center justify-between p-3 rounded-lg bg-black/20 border border-white/5 hover:border-accent-primary/50 transition-colors">
                  <div className="text-left">
                    <div className="font-medium text-sm">Data Structures (CS301)</div>
                    <div className="text-xs text-muted-foreground">Semester 4 • 60 Students</div>
                  </div>
                  <Badge variant="outline">Pending</Badge>
                </button>
                <button className="flex items-center justify-between p-3 rounded-lg bg-black/20 border border-white/5 hover:border-emerald-500/50 transition-colors">
                  <div className="text-left">
                    <div className="font-medium text-sm">Operating Systems Lab (CS302L)</div>
                    <div className="text-xs text-muted-foreground">Semester 4 • 60 Students</div>
                  </div>
                  <Badge className="bg-emerald-500/20 text-emerald-400 border-none">Uploaded</Badge>
                </button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Invigilation Schedule */}
        <Card className="bg-background/50 backdrop-blur-xl border-glass-border">
          <CardHeader>
            <CardTitle>👁️ Invigilation Duty</CardTitle>
            <CardDescription>Your assigned duties for upcoming exams</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-semibold text-primary">June 10, 2026</span>
                  <Badge variant="outline">10:00 AM - 01:00 PM</Badge>
                </div>
                <div className="text-sm">Room 304 (CS Block)</div>
                <div className="text-xs text-muted-foreground mt-1">Subject: Computer Networks</div>
              </div>
              <div className="p-3 rounded-lg bg-black/20 border border-white/5 opacity-70">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-semibold">June 12, 2026</span>
                  <Badge variant="outline" className="opacity-50">02:00 PM - 05:00 PM</Badge>
                </div>
                <div className="text-sm">Main Auditorium</div>
                <div className="text-xs text-muted-foreground mt-1">Subject: Database Management</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Eligibility Dashboard */}
      <Card className="bg-destructive/5 border-destructive/20 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-destructive flex items-center gap-2">
            ⚠️ Low Attendance Watchlist
          </CardTitle>
          <CardDescription>
            Students in your mentor group at risk of losing exam eligibility (Attendance &lt; 75%)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>USN</TableHead>
                <TableHead>Student Name</TableHead>
                <TableHead>Branch</TableHead>
                <TableHead className="text-right">Attendance</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ineligibleStudents.map((student, i) => (
                <TableRow key={i}>
                  <TableCell className="font-medium">{student.usn}</TableCell>
                  <TableCell>{student.name}</TableCell>
                  <TableCell>{student.branch}</TableCell>
                  <TableCell className="text-right">
                    <span className="text-destructive font-bold">{student.attendance}%</span>
                  </TableCell>
                  <TableCell className="text-right">
                    <button className="text-xs bg-destructive/20 text-destructive px-3 py-1 rounded hover:bg-destructive/30 transition-colors">
                      Notify
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
