'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function StudentHostelView() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Hostel Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-background/50 backdrop-blur-xl border-glass-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Room Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-primary mb-1">A-402</div>
            <div className="text-xs text-muted-foreground">Block A • 4th Floor • 2 Seater</div>
          </CardContent>
        </Card>

        <Card className="bg-background/50 backdrop-blur-xl border-glass-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Mess Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-emerald-400 mb-1">Active</div>
            <div className="text-xs text-muted-foreground">Premium Veg Plan</div>
          </CardContent>
        </Card>

        <Card className="bg-destructive/10 border-destructive/30 backdrop-blur-xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg text-destructive">Late Entries</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-destructive mb-1">2 / 3</div>
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
                <Button className="w-full bg-primary/20 text-primary hover:bg-primary/30 border border-primary/50">
                  + New Leave Request
                </Button>
              </div>
              <h4 className="font-medium text-sm mt-4 mb-2 text-muted-foreground">Recent Requests</h4>
              <div className="space-y-2">
                <div className="p-3 rounded-lg bg-black/20 border border-white/5 flex justify-between items-center">
                  <div>
                    <div className="font-medium text-sm">Weekend Home Visit</div>
                    <div className="text-xs text-muted-foreground">June 12 - June 14</div>
                  </div>
                  <Badge className="bg-emerald-500/20 text-emerald-400 border-none">Approved</Badge>
                </div>
                <div className="p-3 rounded-lg bg-black/20 border border-white/5 flex justify-between items-center">
                  <div>
                    <div className="font-medium text-sm">Night Outpass (Tech Fest)</div>
                    <div className="text-xs text-muted-foreground">May 20 - May 21</div>
                  </div>
                  <Badge variant="outline" className="text-destructive border-destructive/50 text-xs">Rejected</Badge>
                </div>
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
