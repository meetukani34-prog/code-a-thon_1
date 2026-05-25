'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/supabase/client';

export default function StudentHostelView() {
  const [residentInfo, setResidentInfo] = useState<any>(null);
  const [roomInfo, setRoomInfo] = useState<any>(null);
  const [leaves, setLeaves] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');

  // We'll use a mocked student name for demonstration if the user doesn't have one in DB yet.
  const studentName = 'Priya Patel';

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const supabase = createClient();
    
    // Fetch resident info
    const { data: residents } = await supabase
      .from('hostel_residents')
      .select('*, hostel_rooms(*)')
      .eq('student_name', studentName)
      .single();
      
    if (residents) {
      setResidentInfo(residents);
      if (residents.hostel_rooms) {
        setRoomInfo(residents.hostel_rooms);
      }
    }

    // Fetch leaves
    const { data: myLeaves } = await supabase
      .from('hostel_leaves')
      .select('*')
      .eq('student_name', studentName)
      .order('created_at', { ascending: false });
      
    if (myLeaves) setLeaves(myLeaves);
    
    setLoading(false);
  };

  const submitLeaveRequest = async () => {
    if (!startDate || !endDate || !reason) return;
    const supabase = createClient();
    await supabase.from('hostel_leaves').insert([
      { student_name: studentName, start_date: startDate, end_date: endDate, reason: reason, status: 'pending' }
    ]);
    setShowForm(false);
    setStartDate('');
    setEndDate('');
    setReason('');
    fetchData();
  };

  if (loading) return <div className="p-8 text-center text-muted-foreground animate-pulse">Loading Live Data...</div>;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Hostel Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-background/50 backdrop-blur-xl border-glass-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Room Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-primary mb-1">{roomInfo?.room_number || 'Unassigned'}</div>
            <div className="text-xs text-muted-foreground">{roomInfo?.block || 'Block X'} • {roomInfo?.capacity || 2} Seater</div>
          </CardContent>
        </Card>

        <Card className="bg-background/50 backdrop-blur-xl border-glass-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Mess Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-emerald-400 mb-1">Active</div>
            <div className="text-xs text-muted-foreground">{residentInfo?.mess_plan || 'Standard Veg'}</div>
          </CardContent>
        </Card>

        <Card className="bg-destructive/10 border-destructive/30 backdrop-blur-xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg text-destructive">Late Entries</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-destructive mb-1">{residentInfo?.late_entries || 0} / 3</div>
            <div className="text-xs text-muted-foreground">Warnings this month. 3rd warning alerts parents.</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Leave Requests */}
        <Card className="bg-background/50 backdrop-blur-xl border-glass-border">
          <CardHeader>
            <CardTitle>Leave/Outpass Requests</CardTitle>
            <CardDescription>Apply for outstation leave or night outpass.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid gap-2">
                {!showForm ? (
                  <Button onClick={() => setShowForm(true)} className="w-full bg-primary/20 text-primary hover:bg-primary/30 border border-primary/50">
                    + New Leave Request
                  </Button>
                ) : (
                  <div className="p-4 rounded-lg bg-black/40 border border-primary/30 space-y-3">
                    <div>
                      <label className="text-xs text-muted-foreground">Start Date</label>
                      <input type="date" className="w-full mt-1 bg-background/50 border border-glass-border rounded-md px-2 py-1 text-sm text-white focus:outline-none focus:border-primary" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground">End Date</label>
                      <input type="date" className="w-full mt-1 bg-background/50 border border-glass-border rounded-md px-2 py-1 text-sm text-white focus:outline-none focus:border-primary" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground">Reason</label>
                      <input type="text" placeholder="e.g. Family Function" className="w-full mt-1 bg-background/50 border border-glass-border rounded-md px-2 py-1 text-sm text-white focus:outline-none focus:border-primary" value={reason} onChange={(e) => setReason(e.target.value)} />
                    </div>
                    <div className="flex gap-2 pt-2">
                      <Button onClick={() => setShowForm(false)} variant="outline" className="flex-1 border-white/10 hover:bg-white/5">Cancel</Button>
                      <Button onClick={submitLeaveRequest} className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90" disabled={!startDate || !endDate || !reason}>Submit</Button>
                    </div>
                  </div>
                )}
              </div>
              <h4 className="font-medium text-sm mt-4 mb-2 text-muted-foreground">Recent Requests</h4>
              <div className="space-y-2">
                {leaves.length > 0 ? leaves.map((leave) => (
                  <div key={leave.id} className="p-3 rounded-lg bg-black/20 border border-white/5 flex justify-between items-center">
                    <div>
                      <div className="font-medium text-sm">{leave.reason}</div>
                      <div className="text-xs text-muted-foreground">{leave.start_date} to {leave.end_date}</div>
                    </div>
                    {leave.status === 'approved' ? (
                      <Badge className="bg-emerald-500/20 text-emerald-400 border-none">Approved</Badge>
                    ) : leave.status === 'rejected' ? (
                      <Badge variant="outline" className="text-destructive border-destructive/50 text-xs">Rejected</Badge>
                    ) : (
                      <Badge className="bg-yellow-500/20 text-yellow-400 border-none">Pending</Badge>
                    )}
                  </div>
                )) : <div className="text-xs text-muted-foreground text-center">No leave requests found.</div>}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Complaints & Alerts */}
        <Card className="bg-background/50 backdrop-blur-xl border-glass-border">
          <CardHeader>
            <CardTitle>Complaints & Maintenance</CardTitle>
            <CardDescription>Report issues with your room or facilities.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Button variant="outline" className="w-full border-accent-primary/50 text-accent-primary hover:bg-accent-primary/10">
                Lodge New Complaint
              </Button>
              
              <div className="mt-4">
                <div className="p-3 rounded-lg bg-black/20 border border-accent-primary/30 border-l-4">
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-semibold text-accent-primary text-sm">AC Cooling Issue</span>
                    <span className="text-xs text-muted-foreground">Ticket #8492</span>
                  </div>
                  <div className="text-xs text-muted-foreground">Technician assigned. Expected resolution today by 5 PM.</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
