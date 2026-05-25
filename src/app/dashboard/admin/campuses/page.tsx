'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

export default function CampusManagementPage() {
  const [campuses, setCampuses] = useState([
    { id: 'c1', name: 'Main Campus (HQ)', location: 'Sector 1', status: 'active', students: 4500 },
    { id: 'c2', name: 'North Campus', location: 'Sector 4', status: 'active', students: 2100 },
  ]);

  const [newCampus, setNewCampus] = useState('');
  const [newLocation, setNewLocation] = useState('');

  const handleOnboard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCampus) return;
    
    setCampuses([
      ...campuses, 
      { id: Date.now().toString(), name: newCampus, location: newLocation, status: 'provisioning', students: 0 }
    ]);
    setNewCampus('');
    setNewLocation('');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Campus Nodes</h1>
        <p className="text-muted-foreground">Multi-Campus Onboarding and Global Infrastructure.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Onboarding Form */}
        <Card className="bg-background/50 backdrop-blur-xl border-glass-border md:col-span-1">
          <CardHeader>
            <CardTitle>Onboard New Node</CardTitle>
            <CardDescription>Deploy a new campus into the OS network.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleOnboard} className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-wider text-muted-foreground">Campus Name</label>
                <Input 
                  value={newCampus} 
                  onChange={(e) => setNewCampus(e.target.value)} 
                  placeholder="e.g. South Campus"
                  className="bg-background/50"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-wider text-muted-foreground">Location / Zone</label>
                <Input 
                  value={newLocation} 
                  onChange={(e) => setNewLocation(e.target.value)} 
                  placeholder="e.g. Sector 8"
                  className="bg-background/50"
                />
              </div>
              <Button type="submit" className="w-full">
                INITIALIZE NODE
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Global Configuration */}
        <Card className="bg-background/50 backdrop-blur-xl border-glass-border md:col-span-2">
          <CardHeader>
            <CardTitle>Global University Configuration</CardTitle>
            <CardDescription>Base parameters inherited by all campus nodes.</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-lg border border-glass-border bg-background/30 flex flex-col items-center justify-center text-center">
              <span className="text-xs text-muted-foreground uppercase tracking-widest mb-1">Grading Scale</span>
              <span className="text-2xl font-bold text-primary">10.0 CGPA</span>
            </div>
            <div className="p-4 rounded-lg border border-glass-border bg-background/30 flex flex-col items-center justify-center text-center">
              <span className="text-xs text-muted-foreground uppercase tracking-widest mb-1">Pass Criteria</span>
              <span className="text-2xl font-bold text-primary">&gt; 40%</span>
            </div>
            <div className="p-4 rounded-lg border border-glass-border bg-background/30 flex flex-col items-center justify-center text-center col-span-2">
              <span className="text-xs text-muted-foreground uppercase tracking-widest mb-1">Global Credit Transfer</span>
              <span className="text-sm font-medium text-success">Enabled (Cross-Campus)</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Network List */}
      <Card className="bg-background/50 backdrop-blur-xl border-glass-border">
        <CardHeader>
          <CardTitle>Active Campus Network</CardTitle>
          <CardDescription>Live telemetry from all provisioned campuses.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Node ID</TableHead>
                <TableHead>Campus Name</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Active Students</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {campuses.map((campus) => (
                <TableRow key={campus.id}>
                  <TableCell className="font-mono text-xs text-muted-foreground">#{campus.id}</TableCell>
                  <TableCell className="font-medium">{campus.name}</TableCell>
                  <TableCell>{campus.location}</TableCell>
                  <TableCell>{campus.students.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge variant={campus.status === 'active' ? 'default' : 'secondary'} className="uppercase text-[10px]">
                      {campus.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" className="text-xs">Manage</Button>
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
