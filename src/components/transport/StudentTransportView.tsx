'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function StudentTransportView() {
  const [eta, setEta] = useState(5);
  const [distance, setDistance] = useState(1.2);

  // Mock live movement
  useEffect(() => {
    const interval = setInterval(() => {
      setEta(prev => (prev > 0 ? prev - 1 : 0));
      setDistance(prev => (prev > 0 ? parseFloat((prev - 0.2).toFixed(1)) : 0));
    }, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Live Status Header */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-primary/10 border-primary/30 backdrop-blur-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl -mr-10 -mt-10"></div>
          <CardHeader>
            <CardTitle className="text-primary flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
              </span>
              Bus 04 is approaching
            </CardTitle>
            <CardDescription className="text-primary/70">Route: City Center → Campus Gate</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-4">
              <div>
                <div className="text-5xl font-black text-primary">{eta}</div>
                <div className="text-sm font-medium text-primary/70 uppercase tracking-wider mt-1">Minutes Away</div>
              </div>
              <div className="pb-1">
                <Badge variant="outline" className="border-primary/50 text-primary text-xs bg-primary/10">
                  {distance} km away
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Driver & Vehicle Details */}
        <Card className="bg-background/50 backdrop-blur-xl border-glass-border">
          <CardHeader>
            <CardTitle>Vehicle Details</CardTitle>
            <CardDescription>Your assigned transport information</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 rounded-lg bg-black/20 border border-white/5">
                <div>
                  <div className="font-medium text-sm text-muted-foreground">Vehicle Number</div>
                  <div className="text-lg font-bold text-white tracking-widest">GJ-01-XX-9090</div>
                </div>
                <Badge className="bg-white/10 text-white border-none">Bus 04</Badge>
              </div>

              <div className="flex justify-between items-center p-3 rounded-lg bg-black/20 border border-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-accent-primary/20 flex items-center justify-center text-lg">👨‍✈️</div>
                  <div>
                    <div className="font-medium text-sm">Ramesh Kumar</div>
                    <div className="text-xs text-muted-foreground">+91 98765 43210</div>
                  </div>
                </div>
                <Button size="sm" variant="outline" className="border-accent-primary/50 text-accent-primary hover:bg-accent-primary/10">
                  Call
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Mock Map View */}
      <Card className="bg-background/50 backdrop-blur-xl border-glass-border overflow-hidden">
        <CardHeader className="border-b border-glass-border/50 bg-black/20">
          <CardTitle className="text-sm flex justify-between items-center">
            <span>Live Route Map</span>
            <span className="text-xs font-normal text-muted-foreground">GPS Tracking Active</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 relative h-[300px] bg-[#1a1c23]">
          {/* Mock Map Background Grid */}
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
          
          {/* Mock Route Line */}
          <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
            <path d="M 50 250 Q 200 250 250 150 T 450 50" fill="none" stroke="var(--accent-primary)" strokeWidth="4" strokeDasharray="8 8" className="opacity-50" />
          </svg>

          {/* Student Stop (Target) */}
          <div className="absolute top-[40px] left-[440px] flex flex-col items-center">
            <div className="w-4 h-4 bg-primary rounded-full shadow-[0_0_15px_var(--color-primary)]"></div>
            <span className="text-[10px] font-bold mt-1 bg-black/50 px-2 py-1 rounded">Campus Gate</span>
          </div>

          {/* Bus Icon (Moving) */}
          <div 
            className="absolute flex flex-col items-center transition-all duration-1000 ease-in-out"
            style={{
              top: `${150 + (eta * 10)}px`,
              left: `${250 - (eta * 20)}px`
            }}
          >
            <div className="w-8 h-8 bg-white rounded-lg shadow-lg flex items-center justify-center text-lg z-10 animate-bounce">
              🚌
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
