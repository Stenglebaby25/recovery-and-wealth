import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  BookOpen, 
  Target, 
  Trophy, 
  Users, 
  FileText,
  TrendingUp,
  Star,
  Gift,
  Brain,
  Shield
} from 'lucide-react';
import LearningHub from './LearningHub';
import ProgressDashboard from './gamification/ProgressDashboard';
import HabitTracker from './gamification/HabitTracker';
import RewardsCenter from './gamification/RewardsCenter';
import ResourceLibrary from './premium/ResourceLibrary';
import SponsorManagement from './premium/SponsorManagement';
import MoodJournal from './behavioral/MoodJournal';
import StressPrevention from './behavioral/StressPrevention';
import TestingPanel from './TestingPanel';

const Dashboard = () => {
  const { user, isPremium } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  if (!user) {
    return (
      <div className="py-20 text-center">
        <div className="max-w-md mx-auto">
          <h2 className="text-2xl font-bold mb-4">Access Your Dashboard</h2>
          <p className="text-muted-foreground mb-6">
            Please log in to access your personalized learning dashboard and track your progress.
          </p>
          <Button onClick={() => window.location.href = '/auth'}>
            Sign In
          </Button>
        </div>
      </div>
    );
  }

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          {/* Welcome Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Welcome Back!
            </h1>
            <p className="text-xl text-muted-foreground">
              Continue your financial recovery journey with personalized tools and insights.
            </p>
          </div>

          {/* Testing Panel - Only show in development */}
          <TestingPanel />

          {/* Dashboard Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
            <TabsList className="grid w-full grid-cols-3 lg:grid-cols-9 h-auto">
              <TabsTrigger value="overview" className="flex flex-col gap-1 py-3">
                <TrendingUp className="w-5 h-5" />
                <span className="text-xs">Overview</span>
              </TabsTrigger>
              <TabsTrigger value="learning" className="flex flex-col gap-1 py-3">
                <BookOpen className="w-5 h-5" />
                <span className="text-xs">Learning</span>
              </TabsTrigger>
              <TabsTrigger value="habits" className="flex flex-col gap-1 py-3">
                <Target className="w-5 h-5" />
                <span className="text-xs">Habits</span>
              </TabsTrigger>
              <TabsTrigger value="achievements" className="flex flex-col gap-1 py-3">
                <Trophy className="w-5 h-5" />
                <span className="text-xs">Progress</span>
              </TabsTrigger>
              <TabsTrigger value="rewards" className="flex flex-col gap-1 py-3">
                <Gift className="w-5 h-5" />
                <span className="text-xs">Rewards</span>
              </TabsTrigger>
              <TabsTrigger value="journal" className="flex flex-col gap-1 py-3">
                <Brain className="w-5 h-5" />
                <span className="text-xs">Journal</span>
              </TabsTrigger>
              <TabsTrigger value="prevention" className="flex flex-col gap-1 py-3">
                <Shield className="w-5 h-5" />
                <span className="text-xs">Prevention</span>
              </TabsTrigger>
              <TabsTrigger value="resources" className="flex flex-col gap-1 py-3">
                <FileText className="w-5 h-5" />
                <span className="text-xs">Resources</span>
              </TabsTrigger>
              <TabsTrigger value="support" className="flex flex-col gap-1 py-3">
                <Users className="w-5 h-5" />
                <span className="text-xs">Support</span>
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Quick Stats */}
                <Card className="lg:col-span-2">
                  <CardContent className="p-6">
                    <ProgressDashboard />
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
                    <div className="space-y-3">
                      <Button 
                        variant="outline" 
                        className="w-full justify-start"
                        onClick={() => setActiveTab('learning')}
                      >
                        <BookOpen className="w-4 h-4 mr-2" />
                        Continue Learning
                      </Button>
                      <Button 
                        variant="outline" 
                        className="w-full justify-start"
                        onClick={() => setActiveTab('habits')}
                      >
                        <Target className="w-4 h-4 mr-2" />
                        Track Habits
                      </Button>
                      <Button 
                        variant="outline" 
                        className="w-full justify-start"
                        onClick={() => setActiveTab('resources')}
                      >
                        <FileText className="w-4 h-4 mr-2" />
                        Browse Resources
                      </Button>
                      {!isPremium && (
                        <Button 
                          variant="default" 
                          className="w-full justify-start bg-gradient-primary"
                        >
                          <Star className="w-4 h-4 mr-2" />
                          Upgrade to Premium
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Learning Tab */}
            <TabsContent value="learning">
              <LearningHub />
            </TabsContent>

            {/* Habits Tab */}
            <TabsContent value="habits">
              <HabitTracker />
            </TabsContent>

            {/* Achievements Tab */}
            <TabsContent value="achievements">
              <ProgressDashboard />
            </TabsContent>

            {/* Rewards Tab */}
            <TabsContent value="rewards">
              <RewardsCenter />
            </TabsContent>

            {/* Journal Tab */}
            <TabsContent value="journal">
              <MoodJournal />
            </TabsContent>

            {/* Prevention Tab */}
            <TabsContent value="prevention">
              <StressPrevention />
            </TabsContent>

            {/* Resources Tab */}
            <TabsContent value="resources">
              <ResourceLibrary />
            </TabsContent>

            {/* Support Tab */}
            <TabsContent value="support">
              <SponsorManagement />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </section>
  );
};

export default Dashboard;