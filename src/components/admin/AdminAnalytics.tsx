import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  BarChart3, 
  Users, 
  TrendingUp, 
  Target, 
  BookOpen,
  Mail,
  Calendar,
  Activity
} from 'lucide-react';

interface AnalyticsData {
  totalUsers: number;
  premiumUsers: number;
  totalLeads: number;
  totalCourses: number;
  recentSignups: any[];
  leadsByType: { [key: string]: number };
  usersBySubscription: { [key: string]: number };
  dailySignups: { date: string; count: number; }[];
}

const AdminAnalytics = () => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('7d');

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);

      // Calculate date range
      const now = new Date();
      const startDate = new Date();
      switch (timeRange) {
        case '7d':
          startDate.setDate(now.getDate() - 7);
          break;
        case '30d':
          startDate.setDate(now.getDate() - 30);
          break;
        case '90d':
          startDate.setDate(now.getDate() - 90);
          break;
        default:
          startDate.setDate(now.getDate() - 7);
      }

      // Fetch all data in parallel
      const [
        profilesResult,
        leadsResult,
        coursesResult
      ] = await Promise.all([
        supabase.from('profiles').select('*'),
        supabase.from('leads').select('*'),
        supabase.from('courses').select('*')
      ]);

      const profiles = profilesResult.data || [];
      const leads = leadsResult.data || [];
      const courses = coursesResult.data || [];

      // Process analytics data
      const totalUsers = profiles.length;
      const premiumUsers = profiles.filter(p => 
        p.subscription_status === 'premium' || p.subscription_status === 'enterprise'
      ).length;

      const recentSignups = profiles
        .filter(p => new Date(p.created_at) >= startDate)
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 10);

      const leadsByType = leads.reduce((acc, lead) => {
        acc[lead.lead_type] = (acc[lead.lead_type] || 0) + 1;
        return acc;
      }, {} as { [key: string]: number });

      const usersBySubscription = profiles.reduce((acc, profile) => {
        const status = profile.subscription_status || 'free';
        acc[status] = (acc[status] || 0) + 1;
        return acc;
      }, {} as { [key: string]: number });

      // Calculate daily signups for chart
      const dailySignups = [];
      for (let i = parseInt(timeRange.replace('d', '')) - 1; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        
        const count = profiles.filter(p => 
          p.created_at.split('T')[0] === dateStr
        ).length;
        
        dailySignups.push({ date: dateStr, count });
      }

      setAnalyticsData({
        totalUsers,
        premiumUsers,
        totalLeads: leads.length,
        totalCourses: courses.length,
        recentSignups,
        leadsByType,
        usersBySubscription,
        dailySignups
      });

    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const getConversionRate = () => {
    if (!analyticsData || analyticsData.totalLeads === 0) return 0;
    return ((analyticsData.totalUsers / analyticsData.totalLeads) * 100).toFixed(1);
  };

  const getPremiumConversionRate = () => {
    if (!analyticsData || analyticsData.totalUsers === 0) return 0;
    return ((analyticsData.premiumUsers / analyticsData.totalUsers) * 100).toFixed(1);
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

  if (!analyticsData) {
    return (
      <Card className="border-0 shadow-soft bg-gradient-card">
        <CardContent className="p-6">
          <p className="text-center text-muted-foreground">Failed to load analytics data</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Time Range Selector */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 90 days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-0 shadow-soft bg-gradient-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Users className="w-4 h-4" />
              Total Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(analyticsData.totalUsers)}</div>
            <p className="text-xs text-muted-foreground">
              {analyticsData.recentSignups.length} new in {timeRange}
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-soft bg-gradient-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Target className="w-4 h-4" />
              Premium Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(analyticsData.premiumUsers)}</div>
            <p className="text-xs text-muted-foreground">
              {getPremiumConversionRate()}% conversion rate
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-soft bg-gradient-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Total Leads
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(analyticsData.totalLeads)}</div>
            <p className="text-xs text-muted-foreground">
              {getConversionRate()}% to signup rate
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-soft bg-gradient-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Active Courses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(analyticsData.totalCourses)}</div>
            <p className="text-xs text-muted-foreground">
              Learning content
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Subscription Breakdown */}
        <Card className="border-0 shadow-soft bg-gradient-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              User Subscription Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(analyticsData.usersBySubscription).map(([status, count]) => (
              <div key={status} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant={status === 'premium' ? 'default' : 'outline'}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{count}</span>
                  <span className="text-sm text-muted-foreground">
                    ({((count / analyticsData.totalUsers) * 100).toFixed(1)}%)
                  </span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Lead Types */}
        <Card className="border-0 shadow-soft bg-gradient-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="w-5 h-5" />
              Lead Sources
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(analyticsData.leadsByType).map(([type, count]) => (
              <div key={type} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{count}</span>
                  <span className="text-sm text-muted-foreground">
                    ({((count / analyticsData.totalLeads) * 100).toFixed(1)}%)
                  </span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="border-0 shadow-soft bg-gradient-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Recent Signups
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {analyticsData.recentSignups.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">
                No recent signups in the selected time range
              </p>
            ) : (
              analyticsData.recentSignups.map((signup) => (
                <div key={signup.id} className="flex items-center justify-between py-2 border-b last:border-b-0">
                  <div>
                    <div className="font-medium">{signup.full_name || 'No name'}</div>
                    <div className="text-sm text-muted-foreground">
                      {signup.subscription_status || 'free'} user
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {new Date(signup.created_at).toLocaleDateString()}
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminAnalytics;