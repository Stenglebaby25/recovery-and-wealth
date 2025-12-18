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
  Shield,
  DollarSign,
  Calendar,
  Bot,
  Sparkles
} from 'lucide-react';
import LearningHub from './LearningHub';
import ProgressDashboard from './gamification/ProgressDashboard';
import MilestoneCelebration from './gamification/MilestoneCelebration';
import HabitTracker from './gamification/HabitTracker';
import RewardsCenter from './gamification/RewardsCenter';
import ResourceLibrary from './premium/ResourceLibrary';
import SponsorManagement from './premium/SponsorManagement';
import MoodJournal from './behavioral/MoodJournal';
import StressPrevention from './behavioral/StressPrevention';
import DailyCheckIn from './behavioral/DailyCheckIn';
import ExpenseTracker from './ExpenseTracker';
import { BudgetAnalysis } from './BudgetAnalysis';
import BillManagement from './BillManagement';
import TestingPanel from './TestingPanel';
import AIEducationChat from './AIEducationChat';
import PremiumGate from './PremiumGate';

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
    <section id="dashboard" className="py-20 bg-gradient-subtle">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          {/* Welcome Header */}
          <div className="text-center mb-12 animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-progress bg-clip-text text-transparent mb-4">
              Welcome Back!
            </h1>
            <p className="text-xl text-muted-foreground">
              Continue your financial recovery journey with personalized tools and insights.
            </p>
          </div>

          {/* Testing Panel - Only show in development */}
          <TestingPanel />

          {/* Dashboard Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8 animate-scale-in">
            <TabsList className="grid w-full grid-cols-3 lg:grid-cols-12 h-auto bg-gradient-card border-0 shadow-soft">
              <TabsTrigger value="overview" className="flex flex-col gap-1 py-3 data-[state=active]:bg-primary/10 data-[state=active]:text-primary transition-all">
                <TrendingUp className="w-5 h-5" />
                <span className="text-xs">Overview</span>
              </TabsTrigger>
              <TabsTrigger value="learning" className="flex flex-col gap-1 py-3 data-[state=active]:bg-primary/10 data-[state=active]:text-primary transition-all">
                <BookOpen className="w-5 h-5" />
                <span className="text-xs">Learning</span>
              </TabsTrigger>
              <TabsTrigger value="habits" className="flex flex-col gap-1 py-3 data-[state=active]:bg-primary/10 data-[state=active]:text-primary transition-all">
                <Target className="w-5 h-5" />
                <span className="text-xs">Habits</span>
              </TabsTrigger>
              <TabsTrigger value="milestones" className="flex flex-col gap-1 py-3 data-[state=active]:bg-primary/10 data-[state=active]:text-primary transition-all">
                <Sparkles className="w-5 h-5" />
                <span className="text-xs">Milestones</span>
              </TabsTrigger>
              <TabsTrigger value="achievements" className="flex flex-col gap-1 py-3 data-[state=active]:bg-primary/10 data-[state=active]:text-primary transition-all">
                <Trophy className="w-5 h-5" />
                <span className="text-xs">Progress</span>
              </TabsTrigger>
              <TabsTrigger value="rewards" className="flex flex-col gap-1 py-3 data-[state=active]:bg-primary/10 data-[state=active]:text-primary transition-all">
                <Gift className="w-5 h-5" />
                <span className="text-xs">Rewards</span>
              </TabsTrigger>
              <TabsTrigger value="journal" className="flex flex-col gap-1 py-3 data-[state=active]:bg-primary/10 data-[state=active]:text-primary transition-all">
                <Brain className="w-5 h-5" />
                <span className="text-xs">Journal</span>
              </TabsTrigger>
              <TabsTrigger value="expenses" className="flex flex-col gap-1 py-3 data-[state=active]:bg-primary/10 data-[state=active]:text-primary transition-all">
                <DollarSign className="w-5 h-5" />
                <span className="text-xs">Expenses</span>
              </TabsTrigger>
              <TabsTrigger value="budget" className="flex flex-col gap-1 py-3 data-[state=active]:bg-primary/10 data-[state=active]:text-primary transition-all">
                <TrendingUp className="w-5 h-5" />
                <span className="text-xs">Budget</span>
              </TabsTrigger>
              <TabsTrigger value="prevention" className="flex flex-col gap-1 py-3 data-[state=active]:bg-primary/10 data-[state=active]:text-primary transition-all">
                <Shield className="w-5 h-5" />
                <span className="text-xs">Prevention</span>
              </TabsTrigger>
              <TabsTrigger value="resources" className="flex flex-col gap-1 py-3 data-[state=active]:bg-primary/10 data-[state=active]:text-primary transition-all">
                <FileText className="w-5 h-5" />
                <span className="text-xs">Resources</span>
              </TabsTrigger>
              <TabsTrigger value="bills" className="flex flex-col gap-1 py-3 data-[state=active]:bg-primary/10 data-[state=active]:text-primary transition-all">
                <Calendar className="w-5 h-5" />
                <span className="text-xs">Bills</span>
              </TabsTrigger>
              <TabsTrigger value="support" className="flex flex-col gap-1 py-3 data-[state=active]:bg-primary/10 data-[state=active]:text-primary transition-all">
                <Users className="w-5 h-5" />
                <span className="text-xs">Support</span>
              </TabsTrigger>
              <TabsTrigger value="ai-chat" className="flex flex-col gap-1 py-3 data-[state=active]:bg-primary/10 data-[state=active]:text-primary transition-all">
                <Bot className="w-5 h-5" />
                <span className="text-xs">AI Assistant</span>
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-8">
              {/* Daily Check-In - Prominent placement at top */}
              <DailyCheckIn />
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Quick Stats & Milestones */}
                <Card className="lg:col-span-2 border-0 shadow-soft bg-gradient-card">
                  <CardContent className="p-6">
                    <MilestoneCelebration />
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card className="border-0 shadow-soft bg-gradient-subtle">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4 text-foreground">Quick Actions</h3>
                    <div className="space-y-3">
                      <Button 
                        variant="outline" 
                        className="w-full justify-start border-primary/20 hover:bg-primary/5 transition-all shadow-soft hover:shadow-medium"
                        onClick={() => setActiveTab('learning')}
                      >
                        <BookOpen className="w-4 h-4 mr-2" />
                        Continue Learning
                      </Button>
                      <Button 
                        variant="outline" 
                        className="w-full justify-start border-secondary/20 hover:bg-secondary/5 transition-all shadow-soft hover:shadow-medium"
                        onClick={() => setActiveTab('habits')}
                      >
                        <Target className="w-4 h-4 mr-2" />
                        Track Habits
                      </Button>
                      <Button 
                        variant="outline" 
                        className="w-full justify-start border-accent/20 hover:bg-accent/5 transition-all shadow-soft hover:shadow-medium"
                        onClick={() => setActiveTab('resources')}
                      >
                        <FileText className="w-4 h-4 mr-2" />
                        Browse Resources
                      </Button>
                      {!isPremium && (
                        <Button 
                          variant="default" 
                          className="w-full justify-start bg-gradient-progress border-0 shadow-soft hover:shadow-medium transition-all"
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

            {/* Milestones Tab */}
            <TabsContent value="milestones">
              <MilestoneCelebration />
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

            {/* Expenses Tab - Premium */}
            <TabsContent value="expenses">
              <PremiumGate 
                feature="Expense Tracker"
                description="Track your spending, set budget limits, and get real-time alerts when you're approaching your limits."
                benefits={[
                  "Track expenses across 7 categories",
                  "Set custom monthly spending limits",
                  "Get alerts at 80% and 100% of budget",
                  "View spending trends with charts",
                  "Analyze category breakdowns"
                ]}
              >
                <ExpenseTracker />
              </PremiumGate>
            </TabsContent>
            
            <TabsContent value="budget">
              <BudgetAnalysis />
            </TabsContent>

            {/* Bills Tab - Premium */}
            <TabsContent value="bills">
              <PremiumGate 
                feature="Bill Management"
                description="Never miss a bill payment again. Track due dates, set reminders, and stay on top of your finances."
                benefits={[
                  "Track all your recurring bills",
                  "Set payment reminders",
                  "Mark bills as paid",
                  "Organize by category",
                  "View upcoming due dates"
                ]}
              >
                <BillManagement />
              </PremiumGate>
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

            {/* AI Assistant Tab */}
            <TabsContent value="ai-chat">
              <AIEducationChat />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </section>
  );
};

export default Dashboard;