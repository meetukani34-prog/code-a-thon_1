'use client';

import { useState, useEffect } from 'react';
import GlassCard from '@/components/ui/GlassCard';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar,
  PieChart, Pie, Cell,
  AreaChart, Area
} from 'recharts';

const performanceData = [
  { time: 'Week 1', score: 75, average: 65 },
  { time: 'Week 2', score: 82, average: 68 },
  { time: 'Week 3', score: 88, average: 70 },
  { time: 'Week 4', score: 85, average: 71 },
  { time: 'Week 5', score: 91, average: 72 },
  { time: 'Week 6', score: 94, average: 75 },
  { time: 'Week 7', score: 96, average: 78 },
];

const subjectAttendanceData = [
  { subject: 'Data Structs', rate: 94 },
  { subject: 'Algorithms', rate: 91 },
  { subject: 'Database', rate: 88 },
  { subject: 'OS', rate: 96 },
  { subject: 'Networks', rate: 92 },
];

const placementData = [
  { name: 'SDE-1', value: 45 },
  { name: 'Data Science', value: 25 },
  { name: 'Core Eng', value: 15 },
  { name: 'Product', value: 10 },
  { name: 'Research', value: 5 },
];

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export default function AnalyticsPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Student Analytics Hub</h1>
        <p className="text-muted-foreground">Your personal academic progress and attendance metrics.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Trend Area Chart */}
        <GlassCard padding="lg" className="lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-sm font-bold uppercase tracking-wider">Academic Performance Trend</h3>
            <span className="badge badge-success animate-pulse">Live</span>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={performanceData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--accent-primary)" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="var(--accent-primary)" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorAvg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--accent-secondary)" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="var(--accent-secondary)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} domain={[0, 100]} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(5, 7, 12, 0.9)', borderColor: 'var(--glass-border)', borderRadius: '8px' }}
                  itemStyle={{ color: 'var(--text-primary)' }}
                />
                <Area type="monotone" dataKey="score" stroke="var(--accent-primary)" fillOpacity={1} fill="url(#colorScore)" name="Your Score" />
                <Area type="monotone" dataKey="average" stroke="var(--accent-secondary)" fillOpacity={1} fill="url(#colorAvg)" name="Class Average" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* Attendance Bar Chart */}
        <GlassCard padding="lg">
          <h3 className="text-sm font-bold uppercase tracking-wider mb-6">Attendance Rates by Subject</h3>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={subjectAttendanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="subject" stroke="var(--text-muted)" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--text-muted)" fontSize={11} tickLine={false} axisLine={false} domain={[0, 100]} />
                <Tooltip 
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                  contentStyle={{ backgroundColor: 'rgba(5, 7, 12, 0.9)', borderColor: 'var(--glass-border)', borderRadius: '8px' }}
                />
                <Bar dataKey="rate" fill="var(--color-success)" radius={[4, 4, 0, 0]} name="Attendance %" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* Placements Donut Chart */}
        <GlassCard padding="lg">
          <h3 className="text-sm font-bold uppercase tracking-wider mb-6">Placement Distribution</h3>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={placementData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {placementData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(5, 7, 12, 0.9)', borderColor: 'var(--glass-border)', borderRadius: '8px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap gap-3 justify-center mt-4">
            {placementData.map((entry, idx) => (
              <div key={entry.name} className="flex items-center gap-2 text-xs">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                <span className="text-muted-foreground">{entry.name}</span>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
