'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function DigitalIdentityApprovalPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    setLoading(true);
    // Note: To bypass RLS and fetch all users, we normally need a service_role fetch via an API route. 
    // For this prototype, we'll fetch from a secure API route we will build.
    const res = await fetch('/api/admin/users');
    const data = await res.json();
    if (data.users) {
      setUsers(data.users);
    }
    setLoading(false);
  }

  async function updateUserRole(userId: string, newRole: string) {
    await fetch('/api/admin/users', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, role: newRole }),
    });
    fetchUsers();
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Identity Access Management</h1>
        <p className="text-muted-foreground">Approve and assign roles to pending network nodes.</p>
      </div>

      <Card className="bg-background/50 backdrop-blur-xl border-glass-border">
        <CardHeader>
          <CardTitle>Pending & Active Nodes</CardTitle>
          <CardDescription>All registered users requiring RBAC clearance.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email / USN</TableHead>
                <TableHead>Full Name</TableHead>
                <TableHead>Branch / Track</TableHead>
                <TableHead>Current Role</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">Fetching Identities...</TableCell>
                </TableRow>
              ) : users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">No users found.</TableCell>
                </TableRow>
              ) : (
                users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="font-medium">{user.email}</div>
                      <div className="text-xs text-muted-foreground">{user.raw_user_meta_data?.usn || 'N/A'}</div>
                    </TableCell>
                    <TableCell>{user.raw_user_meta_data?.full_name || 'N/A'}</TableCell>
                    <TableCell>{user.raw_user_meta_data?.branch || 'N/A'}</TableCell>
                    <TableCell>
                      <Badge variant={user.raw_user_meta_data?.role === 'admin' ? 'destructive' : 'default'} className="uppercase text-[10px]">
                        {user.raw_user_meta_data?.role || 'pending'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Select defaultValue={user.raw_user_meta_data?.role} onValueChange={(val) => updateUserRole(user.id, val)}>
                        <SelectTrigger className="w-[140px] h-8 text-xs">
                          <SelectValue placeholder="Assign Role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="student">Student</SelectItem>
                          <SelectItem value="faculty">Faculty</SelectItem>
                          <SelectItem value="warden">Warden</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
