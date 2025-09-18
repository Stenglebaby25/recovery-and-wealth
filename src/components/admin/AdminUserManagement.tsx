import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, UserPlus, Shield, Crown, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface UserData {
  id: string;
  user_id: string;
  full_name: string | null;
  subscription_status: string;
  subscription_expires_at: string | null;
  created_at: string;
  email?: string;
  roles?: string[];
}

const AdminUserManagement = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      
      // Fetch profiles first
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (profilesError) {
        console.error('Error fetching users:', profilesError);
        toast.error('Failed to load users');
        return;
      }

      // Fetch user roles separately
      const { data: userRoles, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id, role');

      if (rolesError) {
        console.error('Error fetching user roles:', rolesError);
      }

      // Process the data to include roles
      const processedUsers = profiles?.map(profile => ({
        ...profile,
        roles: userRoles?.filter(r => r.user_id === profile.user_id).map(r => r.role) || []
      })) || [];

      setUsers(processedUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (userId: string, role: 'admin' | 'moderator' | 'user', action: 'add' | 'remove') => {
    try {
      if (action === 'add') {
        const { error } = await supabase
          .from('user_roles')
          .insert({ user_id: userId, role: role as any });
        
        if (error) throw error;
        toast.success(`${role} role added successfully`);
      } else {
        const { error } = await supabase
          .from('user_roles')
          .delete()
          .eq('user_id', userId)
          .eq('role', role);
        
        if (error) throw error;
        toast.success(`${role} role removed successfully`);
      }
      
      fetchUsers(); // Refresh the list
    } catch (error) {
      console.error('Error updating user role:', error);
      toast.error('Failed to update user role');
    }
  };

  const updateSubscriptionStatus = async (userId: string, status: string) => {
    try {
      const updates: any = { subscription_status: status };
      
      if (status === 'premium') {
        // Set expiration to 1 year from now for premium
        const expiresAt = new Date();
        expiresAt.setFullYear(expiresAt.getFullYear() + 1);
        updates.subscription_expires_at = expiresAt.toISOString();
      } else if (status === 'free') {
        updates.subscription_expires_at = null;
      }

      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('user_id', userId);

      if (error) throw error;
      
      toast.success('Subscription status updated successfully');
      fetchUsers(); // Refresh the list
    } catch (error) {
      console.error('Error updating subscription:', error);
      toast.error('Failed to update subscription status');
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         user.user_id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || user.subscription_status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'premium':
        return <Badge variant="default"><Crown className="w-3 h-3 mr-1" />Premium</Badge>;
      case 'enterprise':
        return <Badge variant="secondary"><Shield className="w-3 h-3 mr-1" />Enterprise</Badge>;
      default:
        return <Badge variant="outline">Free</Badge>;
    }
  };

  const getRoleBadges = (roles: string[]) => {
    return roles.map(role => (
      <Badge key={role} variant={role === 'admin' ? 'destructive' : 'secondary'} className="mr-1">
        {role}
      </Badge>
    ));
  };

  if (loading) {
    return (
      <Card className="border-0 shadow-soft bg-gradient-card">
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-soft bg-gradient-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="w-5 h-5" />
            User Management
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Users</SelectItem>
                <SelectItem value="free">Free</SelectItem>
                <SelectItem value="premium">Premium</SelectItem>
                <SelectItem value="enterprise">Enterprise</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Users Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Roles</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      <AlertCircle className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-muted-foreground">No users found</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => (
                    <TableRow key={user.user_id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{user.full_name || 'No name'}</div>
                          <div className="text-sm text-muted-foreground">{user.user_id}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(user.subscription_status)}
                      </TableCell>
                      <TableCell>
                        {user.roles && user.roles.length > 0 ? (
                          getRoleBadges(user.roles)
                        ) : (
                          <span className="text-muted-foreground">No roles</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {new Date(user.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Select onValueChange={(status) => updateSubscriptionStatus(user.user_id, status)}>
                            <SelectTrigger className="w-32">
                              <SelectValue placeholder="Change status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="free">Free</SelectItem>
                              <SelectItem value="premium">Premium</SelectItem>
                              <SelectItem value="enterprise">Enterprise</SelectItem>
                            </SelectContent>
                          </Select>
                          
                          {!user.roles?.includes('admin') ? (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateUserRole(user.user_id, 'admin', 'add')}
                            >
                              Make Admin
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => updateUserRole(user.user_id, 'admin', 'remove')}
                            >
                              Remove Admin
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Summary */}
          <div className="flex justify-between items-center text-sm text-muted-foreground">
            <span>Total: {filteredUsers.length} users</span>
            <span>
              Premium: {filteredUsers.filter(u => u.subscription_status === 'premium').length} | 
              Free: {filteredUsers.filter(u => u.subscription_status === 'free').length}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminUserManagement;