'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function AdminExamView() {
  const [threshold, setThreshold] = useState('75');
  const [examType, setExamType] = useState('End-Semester');
  const [isLocked, setIsLocked] = useState(false);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Analytics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-background/50 backdrop-blur-xl border-glass-border">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center text-center">
              <div className="text-4xl font-black text-primary mb-2">1,240</div>
              <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Total Registered Students</div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-destructive/10 border-destructive/30 backdrop-blur-xl">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center text-center">
              <div className="text-4xl font-black text-destructive mb-2">142</div>
              <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Ineligible (&lt; {threshold}% Attendance)</div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-emerald-500/10 border-emerald-500/30 backdrop-blur-xl">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center text-center">
              <div className="text-4xl font-black text-emerald-400 mb-2">85%</div>
              <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Internal Marks Uploaded</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Master Controls */}
        <Card className="bg-background/50 backdrop-blur-xl border-glass-border">
          <CardHeader>
            <CardTitle>⚙️ Exam Operations</CardTitle>
            <CardDescription>Master controls for exam cycle management</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-black/20 border border-white/5 flex flex-col gap-3">
                <div>
                  <h4 className="font-semibold text-primary">Hall Ticket Generation</h4>
                  <p className="text-xs text-muted-foreground mt-1">Generate and distribute hall tickets to eligible students ({'>'}= {threshold}% attendance).</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button className="w-full bg-primary/20 text-primary hover:bg-primary/30 border border-primary/50">
                    Run Batch Generation
                  </Button>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-black/20 border border-white/5 flex flex-col gap-3">
                <div>
                  <h4 className="font-semibold text-accent-primary">Publish Results</h4>
                  <p className="text-xs text-muted-foreground mt-1">Publish external exam results to student portals.</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" className="w-full border-accent-primary/50 text-accent-primary hover:bg-accent-primary/10">
                    Publish {examType}
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Global Configuration */}
        <Card className="bg-background/50 backdrop-blur-xl border-glass-border">
          <CardHeader>
            <CardTitle>🔧 System Configuration</CardTitle>
            <CardDescription>Global parameters for the examination system</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 rounded-lg bg-black/20 border border-white/5">
                <div>
                  <div className="font-medium text-sm">Mandatory Attendance Threshold</div>
                  <div className="text-xs text-muted-foreground">Minimum attendance required for hall ticket</div>
                </div>
                <div className="flex items-center gap-2">
                  <input 
                    type="number" 
                    value={threshold}
                    onChange={(e) => setThreshold(e.target.value)}
                    className="w-16 bg-background/50 border border-glass-border rounded-md px-2 py-1 text-sm text-center text-primary focus:outline-none focus:border-primary"
                  />
                  <span className="text-muted-foreground text-sm">%</span>
                </div>
              </div>

              <div className="flex justify-between items-center p-3 rounded-lg bg-black/20 border border-white/5">
                <div>
                  <div className="font-medium text-sm">Exam Type</div>
                  <div className="text-xs text-muted-foreground">Current ongoing examination cycle</div>
                </div>
                <Select value={examType} onValueChange={setExamType}>
                  <SelectTrigger className="w-[140px] h-8 text-xs bg-background/50 border-glass-border">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Mid-Semester">Mid-Semester</SelectItem>
                    <SelectItem value="End-Semester">End-Semester</SelectItem>
                    <SelectItem value="Supplementary">Supplementary</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-between items-center p-3 rounded-lg bg-black/20 border border-white/5">
                <div>
                  <div className="font-medium text-sm">Internal Marks Lock</div>
                  <div className="text-xs text-muted-foreground">Prevent faculty from uploading marks</div>
                </div>
                <button 
                  onClick={() => setIsLocked(!isLocked)}
                  className={`w-12 h-6 rounded-full flex items-center p-1 border transition-colors ${
                    isLocked 
                      ? 'bg-destructive/20 border-destructive/50 justify-end' 
                      : 'bg-emerald-500/20 border-emerald-500/50 justify-start'
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full ${isLocked ? 'bg-destructive' : 'bg-emerald-400'}`}></div>
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
