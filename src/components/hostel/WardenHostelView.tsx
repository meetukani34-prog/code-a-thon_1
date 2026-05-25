'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function WardenHostelView() {
  const pendingLeaves = [
    { id: 1, name: 'Rahul Sharma', room: 'B-201', dates: 'June 15 - June 18', reason: 'Family Function' },
    { id: 2, name: 'Anjali Desai', room: 'A-105', dates: 'June 10', reason: 'Medical Checkup' },
  ];

  const alerts = [
    { type: 'late', name: 'Arjun Mehta', room: 'C-302', time: '11:45 PM', status: '3rd Warning' },
    { type: 'absent', name: 'Priya Patel', room: 'A-402', time: '3 Days', status: 'Advisor Alerted' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Overview Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-background/50 backdrop-blur-xl border-glass-border">
          <CardContent className="pt-4 flex flex-col items-center">
            <div className="text-3xl font-black text-primary">842</div>
            <div className="text-xs text-muted-foreground uppercase mt-1">Total Residents</div>
          </CardContent>
        </Card>
        <Card className="bg-background/50 backdrop-blur-xl border-glass-border">
          <CardContent className="pt-4 flex flex-col items-center">
            <div className="text-3xl font-black text-emerald-400">810</div>
            <div className="text-xs text-muted-foreground uppercase mt-1">Present Today</div>
          </CardContent>
        </Card>
        <Card className="bg-destructive/10 border-destructive/30 backdrop-blur-xl">
          <CardContent className="pt-4 flex flex-col items-center">
            <div className="text-3xl font-black text-destructive">12</div>
            <div className="text-xs text-muted-foreground uppercase mt-1">Late Entries</div>
          </CardContent>
        </Card>
        <Card className="bg-accent-primary/10 border-accent-primary/30 backdrop-blur-xl">
          <CardContent className="pt-4 flex flex-col items-center">
            <div className="text-3xl font-black text-accent-primary">15</div>
            <div className="text-xs text-muted-foreground uppercase mt-1">Pending Leaves</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pending Leaves */}
        <Card className="bg-background/50 backdrop-blur-xl border-glass-border">
          <CardHeader>
            <CardTitle>Leave & Outpass Approvals</CardTitle>
            <CardDescription>Review pending requests from students.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pendingLeaves.map(leave => (
                <div key={leave.id} className="p-4 rounded-lg bg-black/20 border border-white/5">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-semibold text-sm">{leave.name} <span className="text-muted-foreground font-normal">({leave.room})</span></h4>
                      <p className="text-xs text-muted-foreground mt-1">{leave.dates} • {leave.reason}</p>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <Button size="sm" className="bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 border border-emerald-500/50 flex-1">Approve</Button>
                    <Button size="sm" variant="outline" className="border-destructive/50 text-destructive hover:bg-destructive/10 flex-1">Reject</Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Actionable Alerts */}
        <Card className="bg-destructive/5 border-destructive/20 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-destructive flex items-center gap-2">
              ⚠️ Security & Discipline Alerts
            </CardTitle>
            <CardDescription>Late entries, unauthorized absences, and security triggers.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {alerts.map((alert, i) => (
                <div key={i} className="p-3 rounded-lg bg-black/20 border border-destructive/30 border-l-4 flex justify-between items-center">
                  <div>
                    <div className="font-semibold text-sm">{alert.name} <span className="text-muted-foreground font-normal">({alert.room})</span></div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {alert.type === 'late' ? `Late Entry at ${alert.time}` : `Absent for ${alert.time}`}
                    </div>
                  </div>
                  <Badge variant="destructive" className="animate-pulse">{alert.status}</Badge>
                </div>
              ))}
            </div>
            <Button className="w-full mt-4 bg-destructive/20 text-destructive hover:bg-destructive/30 border border-destructive/50">
              Trigger Emergency Broadcast
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
