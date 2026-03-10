import { useState } from 'react';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  BookOpen, 
  TrendingUp, 
  Mail, 
  Shield,
  Settings,
  BarChart3,
  Database,
  AlertTriangle
} from 'lucide-react';
import AdminUserManagement from './AdminUserManagement';
import AdminContentManagement from './AdminContentManagement';
import AdminLeadManagement from './AdminLeadManagement';
import AdminAnalytics from './AdminAnalytics';
import AdminFacilityManagement from './AdminFacilityManagement';
import AdminClientManagement from './AdminClientManagement';
import AdminReviewerCodes from './AdminReviewerCodes';
import AdminTaskExport from './AdminTaskExport';

const AdminDashboard = () => {
  const { isAdmin, adminLoading, user } = useAdminAuth();
  const [activeTab, setActiveTab] = useState('overview');

  if (adminLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-lg text-muted-foreground">Verifying admin access...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md">
          <AlertTriangle className="w-16 h-16 text-destructive mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-4">Authentication Required</h2>
          <p className="text-muted-foreground mb-6">
            Please log in to access the admin dashboard.
          </p>
          <Button onClick={() => window.location.href = '/auth'}>
            Sign In
          </Button>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md">
          <Shield className="w-16 h-16 text-destructive mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
          <p className="text-muted-foreground mb-6">
            You don't have administrator privileges to access this dashboard.
          </p>
          <Button onClick={() => window.location.href = '/'} variant="outline">
            Return Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Admin Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold bg-gradient-progress bg-clip-text text-transparent">
                  Admin Dashboard
                </h1>
                <p className="text-muted-foreground mt-2">
                  Manage your Recovery Wealth platform
                </p>
              </div>
              <Badge variant="destructive" className="px-4 py-2">
                <Shield className="w-4 h-4 mr-2" />
                Administrator
              </Badge>
            </div>
          </div>

          {/* Admin Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-8 h-auto bg-gradient-card border-0 shadow-soft">
              <TabsTrigger value="overview" className="flex flex-col gap-1 py-3 data-[state=active]:bg-primary/10 data-[state=active]:text-primary transition-all">
                <BarChart3 className="w-5 h-5" />
                <span className="text-xs">Overview</span>
              </TabsTrigger>
              <TabsTrigger value="users" className="flex flex-col gap-1 py-3 data-[state=active]:bg-primary/10 data-[state=active]:text-primary transition-all">
                <Users className="w-5 h-5" />
                <span className="text-xs">Users</span>
              </TabsTrigger>
              <TabsTrigger value="reviewer-codes" className="flex flex-col gap-1 py-3 data-[state=active]:bg-highlight/10 data-[state=active]:text-highlight transition-all">
                <Mail className="w-5 h-5" />
                <span className="text-xs">Reviewers</span>
              </TabsTrigger>
              <TabsTrigger value="facilities" className="flex flex-col gap-1 py-3 data-[state=active]:bg-primary/10 data-[state=active]:text-primary transition-all">
                <Database className="w-5 h-5" />
                <span className="text-xs">Facilities</span>
              </TabsTrigger>
              <TabsTrigger value="clients" className="flex flex-col gap-1 py-3 data-[state=active]:bg-primary/10 data-[state=active]:text-primary transition-all">
                <Shield className="w-5 h-5" />
                <span className="text-xs">Clients</span>
              </TabsTrigger>
              <TabsTrigger value="content" className="flex flex-col gap-1 py-3 data-[state=active]:bg-primary/10 data-[state=active]:text-primary transition-all">
                <BookOpen className="w-5 h-5" />
                <span className="text-xs">Content</span>
              </TabsTrigger>
              <TabsTrigger value="leads" className="flex flex-col gap-1 py-3 data-[state=active]:bg-primary/10 data-[state=active]:text-primary transition-all">
                <Mail className="w-5 h-5" />
                <span className="text-xs">Leads</span>
              </TabsTrigger>
              <TabsTrigger value="analytics" className="flex flex-col gap-1 py-3 data-[state=active]:bg-primary/10 data-[state=active]:text-primary transition-all">
                <TrendingUp className="w-5 h-5" />
                <span className="text-xs">Analytics</span>
              </TabsTrigger>
              <TabsTrigger value="tasks" className="flex flex-col gap-1 py-3 data-[state=active]:bg-highlight/10 data-[state=active]:text-highlight transition-all">
                <Send className="w-5 h-5" />
                <span className="text-xs">Tasks</span>
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="border-0 shadow-soft bg-gradient-card">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Total Users</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">--</div>
                    <p className="text-xs text-muted-foreground">Loading...</p>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-soft bg-gradient-card">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Premium Users</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">--</div>
                    <p className="text-xs text-muted-foreground">Loading...</p>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-soft bg-gradient-card">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Total Leads</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">--</div>
                    <p className="text-xs text-muted-foreground">Loading...</p>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-soft bg-gradient-card">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Active Courses</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">--</div>
                    <p className="text-xs text-muted-foreground">Loading...</p>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="border-0 shadow-soft bg-gradient-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5" />
                      Recent Activity
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">Activity data will be loaded here...</p>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-soft bg-gradient-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Settings className="w-5 h-5" />
                      Quick Actions
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={() => setActiveTab('users')}
                    >
                      <Users className="w-4 h-4 mr-2" />
                      Manage Users
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={() => setActiveTab('content')}
                    >
                      <BookOpen className="w-4 h-4 mr-2" />
                      Manage Content
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={() => setActiveTab('leads')}
                    >
                      <Mail className="w-4 h-4 mr-2" />
                      View Leads
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Users Tab */}
            <TabsContent value="users">
              <AdminUserManagement />
            </TabsContent>

            {/* Reviewer Codes Tab */}
            <TabsContent value="reviewer-codes">
              <AdminReviewerCodes />
            </TabsContent>

            {/* Facilities Tab */}
            <TabsContent value="facilities">
              <AdminFacilityManagement />
            </TabsContent>

            {/* Clients Tab */}
            <TabsContent value="clients">
              <AdminClientManagement />
            </TabsContent>

            {/* Content Tab */}
            <TabsContent value="content">
              <AdminContentManagement />
            </TabsContent>

            {/* Leads Tab */}
            <TabsContent value="leads">
              <AdminLeadManagement />
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics">
              <AdminAnalytics />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;