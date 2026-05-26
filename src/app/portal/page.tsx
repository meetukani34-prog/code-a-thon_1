'use client';

import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';

export default function PortalDashboard() {
  const modules = [
    { title: 'Biometric Attendance', icon: '👤', path: '/portal/attendance', desc: 'Face ID & Location Tracking', color: 'text-blue-400', bg: 'bg-blue-400/10', border: 'border-blue-400/30' },
    { title: 'Live Timetable', icon: '📅', path: '/portal/timetable', desc: 'Synced with Faculty', color: 'text-purple-400', bg: 'bg-purple-400/10', border: 'border-purple-400/30' },
    { title: 'Exam Portal', icon: '📝', path: '/portal/exams', desc: 'AI Proctored Assessments', color: 'text-emerald-400', bg: 'bg-emerald-400/10', border: 'border-emerald-400/30' },
    { title: 'Placement Cell', icon: '💼', path: '/portal/placements', desc: 'AI Resume Matcher', color: 'text-yellow-400', bg: 'bg-yellow-400/10', border: 'border-yellow-400/30' },
    { title: 'Hostel Module', icon: '🏨', path: '/portal/hostel', desc: 'Outpass & Approvals', color: 'text-pink-400', bg: 'bg-pink-400/10', border: 'border-pink-400/30' },
    { title: 'Events Portal', icon: '⭐', path: '/portal/events', desc: 'Campus Activities', color: 'text-cyan-400', bg: 'bg-cyan-400/10', border: 'border-cyan-400/30' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
          Welcome to Campus OS
        </h1>
        <p className="text-muted-foreground mt-2">
          Select a module to continue to your workspace.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {modules.map((mod, idx) => (
          <Link href={mod.path} key={idx}>
            <Card className={`h-full cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1 bg-black/40 backdrop-blur-xl border ${mod.border} hover:shadow-[0_0_30px_rgba(255,255,255,0.05)]`}>
              <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl ${mod.bg} ${mod.color}`}>
                  {mod.icon}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">{mod.title}</h3>
                  <p className="text-xs text-muted-foreground">{mod.desc}</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
