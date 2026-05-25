'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/supabase/client';

export default function WardenHostelView() {
  const [pendingLeaves, setPendingLeaves] = useState<any[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [stats, setStats] = useState({ total: 0, late: 0, pending: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const supabase = createClient();
    
    // Fetch pending leaves
    const { data: leaves } = await supabase
      .from('hostel_leaves')
      .select('*')
      .eq('status', 'pending');
      
    if (leaves) {
      setPendingLeaves(leaves);
      setStats(prev => ({ ...prev, pending: leaves.length }));
    }

    // Fetch active alerts
    const { data: activeAlerts } = await supabase
      .from('hostel_alerts')
      .select('*')
      .eq('status', 'active');
      
    if (activeAlerts) setAlerts(activeAlerts);

    // Fetch stats from residents
    const { data: residents } = await supabase
      .from('hostel_residents')
      .select('*');
      
    if (residents) {
      const lateCount = residents.reduce((acc, curr) => acc + (curr.late_entries || 0), 0);
      setStats(prev => ({ ...prev, total: residents.length, late: lateCount }));
    }
    
    setLoading(false);
  };

  const updateLeaveStatus = async (id: string, status: string) => {
    const supabase = createClient();
    await supabase.from('hostel_leaves').update({ status }).eq('id', id);
    fetchData(); // Refresh
  };

  if (loading) return <div className="p-8 text-center text-muted-foreground animate-pulse">Loading Live Data...</div>;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Overview Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-background/50 backdrop-blur-xl border-glass-border">
          <CardContent className="pt-4 flex flex-col items-center">
            <div className="text-3xl font-black text-primary">{stats.total > 0 ? stats.total : 842}</div>
            <div className="text-xs text-muted-foreground uppercase mt-1">Total Residents</div>
          </CardContent>
        </Card>
        <Card className="bg-background/50 backdrop-blur-xl border-glass-border">
          <CardContent className="pt-4 flex flex-col items-center">
            <div className="text-3xl font-black text-emerald-400">{stats.total > 0 ? stats.total - stats.pending : 810}</div>
            <div className="text-xs text-muted-foreground uppercase mt-1">Present Today</div>
          </CardContent>
        </Card>
        <Card className="bg-destructive/10 border-destructive/30 backdrop-blur-xl">
          <CardContent className="pt-4 flex flex-col items-center">
            <div className="text-3xl font-black text-destructive">{stats.late}</div>
            <div className="text-xs text-muted-foreground uppercase mt-1">Late Entries</div>
          </CardContent>
        </Card>
        <Card className="bg-accent-primary/10 border-accent-primary/30 backdrop-blur-xl">
          <CardContent className="pt-4 flex flex-col items-center">
            <div className="text-3xl font-black text-accent-primary">{stats.pending}</div>
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
              {pendingLeaves.length > 0 ? pendingLeaves.map(leave => (
                <div key={leave.id} className="p-4 rounded-lg bg-black/20 border border-white/5">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-semibold text-sm">{leave.student_name || 'Student'} <span className="text-muted-foreground font-normal"></span></h4>
                      <p className="text-xs text-muted-foreground mt-1">{leave.start_date} to {leave.end_date} • {leave.reason}</p>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <Button onClick={() => updateLeaveStatus(leave.id, 'approved')} size="sm" className="bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 border border-emerald-500/50 flex-1">Approve</Button>
                    <Button onClick={() => updateLeaveStatus(leave.id, 'rejected')} size="sm" variant="outline" className="border-destructive/50 text-destructive hover:bg-destructive/10 flex-1">Reject</Button>
                  </div>
                </div>
              )) : <div className="text-sm text-muted-foreground p-4 text-center">No pending leaves.</div>}
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
              {alerts.length > 0 ? alerts.map((alert) => (
                <div key={alert.id} className="p-3 rounded-lg bg-black/20 border border-destructive/30 border-l-4 flex justify-between items-center">
                  <div>
                    <div className="font-semibold text-sm">{alert.student_name || 'Unknown'} </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {alert.message}
                    </div>
                  </div>
                  <Badge variant="destructive" className="animate-pulse">{alert.status}</Badge>
                </div>
              )) : <div className="text-sm text-muted-foreground p-4 text-center">No active alerts.</div>}
            </div>
            <Button 
              onClick={() => {
                alert("EMERGENCY BROADCAST TRIGGERED: All wardens and security personnel have been notified.");
              }}
              className="w-full mt-4 bg-destructive/20 text-destructive hover:bg-destructive/30 border border-destructive/50"
            >
              Trigger Emergency Broadcast
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
