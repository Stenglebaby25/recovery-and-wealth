import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Trophy, Target, Flame, Award, BookOpen, TrendingUp, CheckCircle } from 'lucide-react';
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
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-primary text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Mastery Level</p>
                <p className="text-2xl font-bold">{userStats.masteryLevel}</p>
              </div>
              <Trophy className="w-8 h-8 opacity-80" />
            </div>
            <div className="mt-2">
              <Progress value={getMasteryProgress()} className="h-2" />
              <p className="text-xs mt-1 opacity-80">
                {100 - getMasteryProgress()} points to next level
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Points</p>
                <p className="text-2xl font-bold text-primary">{userStats.totalPoints}</p>
              </div>
              <Target className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Current Streak</p>
                <p className="text-2xl font-bold text-accent">{userStats.currentStreak}</p>
              </div>
              <Flame className="w-8 h-8 text-accent" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Achievements</p>
                <p className="text-2xl font-bold text-secondary">{userStats.totalAchievements}</p>
              </div>
              <Award className="w-8 h-8 text-secondary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Achievements Grid */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5" />
            Achievements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {achievements.map((achievement) => {
              const IconComponent = iconMap[achievement.badge_icon] || Award;
              const isEarned = achievement.earned;
              
              return (
                <div 
                  key={achievement.id}
                  className={`p-4 rounded-lg border transition-all ${
                    isEarned 
                      ? 'bg-success/10 border-success/20' 
                      : 'bg-muted/50 border-border'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-full ${
                      isEarned 
                        ? 'bg-success/20 text-success' 
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className={`font-semibold ${
                          isEarned ? 'text-foreground' : 'text-muted-foreground'
                        }`}>
                          {achievement.name}
                        </h4>
                        {isEarned && (
                          <Badge variant="secondary">
                            Earned
                          </Badge>
                        )}
                      </div>
                      <p className={`text-sm ${
                        isEarned ? 'text-muted-foreground' : 'text-muted-foreground/60'
                      }`}>
                        {achievement.description}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <Badge variant="outline">
                          {achievement.points} pts
                        </Badge>
                        {isEarned && achievement.earned_at && (
                          <p className="text-xs text-muted-foreground">
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