import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress, CircularProgress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Trophy, Target, Flame, Award, BookOpen, TrendingUp, CheckCircle, Coffee, ShoppingBag, Home, Car } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface Achievement {
  id: string;
  name: string;
  description: string;
  badge_icon: string;
  category: string;
  requirement_type: string;
  requirement_value: number;
  points: number;
  earned?: boolean;
  earned_at?: string;
}

interface UserStats {
  totalPoints: number;
  completedCourses: number;
  currentStreak: number;
  totalAchievements: number;
  masteryLevel: number;
}

const iconMap: Record<string, any> = {
  Trophy,
  Target, 
  Flame,
  Award,
  BookOpen,
  TrendingUp,
  CheckCircle
};

const ProgressDashboard = () => {
  const { user } = useAuth();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [userStats, setUserStats] = useState<UserStats>({
    totalPoints: 0,
    completedCourses: 0,
    currentStreak: 0,
    totalAchievements: 0,
    masteryLevel: 1
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchUserProgress();
    }
  }, [user]);

  const fetchUserProgress = async () => {
    if (!user) return;

    try {
      // Fetch all achievements with user completion status
      const { data: achievementsData } = await supabase
        .from('achievements')
        .select(`
          *,
          user_achievements!left(earned_at)
        `)
        .order('points', { ascending: false });

      // Fetch user progress stats
      const { data: progressData } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', user.id);

      // Fetch user achievements for points calculation
      const { data: userAchievements } = await supabase
        .from('user_achievements')
        .select(`
          achievement_id,
          earned_at,
          achievements(points)
        `)
        .eq('user_id', user.id);

      if (achievementsData) {
        const processedAchievements = achievementsData.map(achievement => ({
          ...achievement,
          earned: achievement.user_achievements && achievement.user_achievements.length > 0,
          earned_at: achievement.user_achievements?.[0]?.earned_at
        }));
        setAchievements(processedAchievements);
      }

      // Calculate user stats
      const completedCourses = progressData?.filter(p => p.completed).length || 0;
      const totalPoints = userAchievements?.reduce((sum, ua) => sum + (ua.achievements?.points || 0), 0) || 0;
      const totalEarnedAchievements = userAchievements?.length || 0;
      const masteryLevel = Math.floor(totalPoints / 100) + 1;

      setUserStats({
        totalPoints,
        completedCourses,
        currentStreak: calculateStreak(progressData || []),
        totalAchievements: totalEarnedAchievements,
        masteryLevel
      });

    } catch (error) {
      console.error('Error fetching progress:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStreak = (progressData: any[]) => {
    // Simple streak calculation - would need more sophisticated logic for real streaks
    const completedDates = progressData
      .filter(p => p.completed)
      .map(p => new Date(p.completion_date).toDateString())
      .sort();
    
    return completedDates.length > 0 ? Math.min(completedDates.length, 7) : 0;
  };

  const getMasteryProgress = () => {
    const currentLevelProgress = userStats.totalPoints % 100;
    return currentLevelProgress;
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-muted rounded"></div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 bg-muted rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Motivational Header */}
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold bg-gradient-progress bg-clip-text text-transparent">
          Your Recovery Journey
        </h2>
        <p className="text-muted-foreground">
          Every step forward is progress worth celebrating
        </p>
      </div>

      {/* Main Stats Overview with Visual Improvements */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Mastery Level with Circular Progress */}
        <Card className="relative overflow-hidden bg-gradient-card border-0 shadow-soft">
          <CardContent className="p-6 text-center">
            <CircularProgress 
              value={getMasteryProgress()} 
              size={100}
              className="mx-auto mb-4"
            />
            <div>
              <p className="text-sm text-muted-foreground mb-1">Mastery Level</p>
              <p className="text-2xl font-bold text-primary">{userStats.masteryLevel}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {100 - getMasteryProgress()} points to next level
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Total Points */}
        <Card className="bg-gradient-subtle border-0 shadow-soft transition-all duration-200 hover:shadow-medium">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Points</p>
                <p className="text-3xl font-bold text-primary">{userStats.totalPoints}</p>
                <p className="text-xs text-muted-foreground">Keep growing!</p>
              </div>
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <Target className="w-6 h-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Current Streak */}
        <Card className="bg-gradient-accent border-0 shadow-soft transition-all duration-200 hover:shadow-medium">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-accent-foreground/80">Current Streak</p>
                <p className="text-3xl font-bold text-accent-foreground">{userStats.currentStreak}</p>
                <p className="text-xs text-accent-foreground/80">Days strong</p>
              </div>
              <div className="w-12 h-12 bg-accent-foreground/10 rounded-full flex items-center justify-center">
                <Flame className="w-6 h-6 text-accent-foreground animate-pulse-success" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Achievements */}
        <Card className="bg-gradient-success border-0 shadow-success transition-all duration-200 hover:shadow-medium">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/80">Achievements</p>
                <p className="text-3xl font-bold text-white">{userStats.totalAchievements}</p>
                <p className="text-xs text-white/80">Milestones reached</p>
              </div>
              <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
                <Award className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Spending Categories Visualization */}
      <Card className="border-0 shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <TrendingUp className="w-5 h-5 text-primary" />
            Financial Wellness Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: Coffee, label: "Daily Spending", value: 75, color: "text-primary" },
              { icon: ShoppingBag, label: "Discretionary", value: 45, color: "text-accent" },
              { icon: Home, label: "Essentials", value: 90, color: "text-secondary" },
              { icon: Car, label: "Transportation", value: 60, color: "text-warning" }
            ].map((category, index) => (
              <div key={index} className="text-center space-y-3 p-4 rounded-lg bg-muted/30 transition-all hover:bg-muted/50">
                <div className="w-12 h-12 mx-auto bg-gradient-subtle rounded-full flex items-center justify-center shadow-soft">
                  <category.icon className={`w-6 h-6 ${category.color}`} />
                </div>
                <div>
                  <p className="text-sm font-medium">{category.label}</p>
                  <Progress value={category.value} className="mt-2 h-2" />
                  <p className="text-xs text-muted-foreground mt-1">{category.value}% of budget</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Achievements Grid */}
      <Card className="border-0 shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Trophy className="w-5 h-5 text-primary" />
            Your Achievements
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Celebrating your progress and milestones
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {achievements.map((achievement) => {
              const IconComponent = iconMap[achievement.badge_icon] || Award;
              const isEarned = achievement.earned;
              
              return (
                <div 
                  key={achievement.id}
                  className={`p-4 rounded-xl border transition-all duration-300 hover:scale-105 ${
                    isEarned 
                      ? 'bg-gradient-success/10 border-success/30 shadow-success' 
                      : 'bg-gradient-subtle border-border shadow-soft hover:shadow-medium'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-3 rounded-full transition-colors ${
                      isEarned 
                        ? 'bg-success/20 text-success shadow-success' 
                        : 'bg-muted/50 text-muted-foreground'
                    }`}>
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className={`font-semibold ${
                          isEarned ? 'text-foreground' : 'text-muted-foreground'
                        }`}>
                          {achievement.name}
                        </h4>
                        {isEarned && (
                          <Badge variant="secondary" className="bg-success/10 text-success border-success/20">
                            ✓ Earned
                          </Badge>
                        )}
                      </div>
                      <p className={`text-sm mb-3 ${
                        isEarned ? 'text-muted-foreground' : 'text-muted-foreground/60'
                      }`}>
                        {achievement.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <Badge 
                          variant="outline" 
                          className={`${isEarned ? 'border-primary/20 text-primary' : ''}`}
                        >
                          {achievement.points} pts
                        </Badge>
                        {isEarned && achievement.earned_at && (
                          <p className="text-xs text-success">
                            {new Date(achievement.earned_at).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProgressDashboard;