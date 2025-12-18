import React, { useEffect, useState, useRef } from 'react';
import confetti from 'canvas-confetti';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Trophy, Star, TrendingUp, Calendar, DollarSign, 
  Sparkles, Award, Target, X, Share2, Heart
} from 'lucide-react';
import { useMilestones, Milestone } from '@/hooks/useMilestones';
import { cn } from '@/lib/utils';

const MilestoneCelebration: React.FC = () => {
  const {
    milestones,
    userData,
    loading,
    newlyEarnedMilestone,
    clearCelebration,
    getNextMilestone,
    getEarnedMilestones,
    getTotalPoints,
  } = useMilestones();

  const [showCelebration, setShowCelebration] = useState(false);
  const [celebratingMilestone, setCelebratingMilestone] = useState<Milestone | null>(null);
  const celebrationRef = useRef<HTMLDivElement>(null);

  // Trigger confetti celebration
  const triggerCelebration = (milestone: Milestone) => {
    setCelebratingMilestone(milestone);
    setShowCelebration(true);

    // Fire confetti
    const duration = 3000;
    const end = Date.now() + duration;

    const colors = milestone.type === 'recovery' 
      ? ['#22c55e', '#86efac', '#4ade80'] 
      : milestone.type === 'financial'
      ? ['#3b82f6', '#93c5fd', '#60a5fa']
      : ['#f59e0b', '#fcd34d', '#fbbf24'];

    (function frame() {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors,
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();

    // Auto-close after animation
    setTimeout(() => {
      setShowCelebration(false);
      setCelebratingMilestone(null);
    }, 5000);
  };

  // Handle external celebration trigger
  useEffect(() => {
    if (newlyEarnedMilestone) {
      triggerCelebration(newlyEarnedMilestone);
      clearCelebration();
    }
  }, [newlyEarnedMilestone, clearCelebration]);

  const nextRecovery = getNextMilestone('recovery');
  const nextFinancial = getNextMilestone('financial');
  const earnedCount = getEarnedMilestones().length;
  const totalPoints = getTotalPoints();

  const MilestoneCard = ({ milestone, onCelebrate }: { milestone: Milestone; onCelebrate?: () => void }) => (
    <div 
      className={cn(
        "relative p-4 rounded-xl border-2 transition-all duration-300",
        milestone.isEarned 
          ? "bg-gradient-to-br from-primary/10 to-accent/10 border-primary/30 hover:scale-[1.02] cursor-pointer" 
          : "bg-muted/30 border-muted-foreground/10"
      )}
      onClick={() => milestone.isEarned && onCelebrate?.()}
    >
      {milestone.isEarned && (
        <div className="absolute -top-2 -right-2">
          <Sparkles className="w-5 h-5 text-amber-500 animate-pulse" />
        </div>
      )}
      
      <div className="flex items-start gap-3">
        <div className={cn(
          "text-3xl p-2 rounded-lg",
          milestone.isEarned ? "bg-primary/20" : "bg-muted/50 grayscale opacity-50"
        )}>
          {milestone.icon}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className={cn(
              "font-semibold truncate",
              milestone.isEarned ? "text-foreground" : "text-muted-foreground"
            )}>
              {milestone.name}
            </h4>
            <Badge variant={milestone.isEarned ? "default" : "outline"} className="text-xs">
              +{milestone.points} pts
            </Badge>
          </div>
          
          <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
            {milestone.description}
          </p>
          
          {!milestone.isEarned && (
            <div className="space-y-1">
              <Progress value={milestone.progress} className="h-2" />
              <p className="text-xs text-muted-foreground">
                {Math.round(milestone.progress)}% complete
              </p>
            </div>
          )}
          
          {milestone.isEarned && (
            <p className="text-xs text-success flex items-center gap-1">
              <Award className="w-3 h-3" /> Earned! Click to celebrate
            </p>
          )}
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <Card className="animate-pulse">
        <CardHeader>
          <div className="h-6 bg-muted rounded w-1/3"></div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="h-24 bg-muted rounded"></div>
            <div className="h-24 bg-muted rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      {/* Celebration Overlay */}
      {showCelebration && celebratingMilestone && (
        <div 
          ref={celebrationRef}
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm animate-fade-in"
          onClick={() => setShowCelebration(false)}
        >
          <Card className="max-w-md mx-4 animate-scale-in border-2 border-primary shadow-2xl">
            <CardHeader className="text-center relative pb-2">
              <button 
                onClick={() => setShowCelebration(false)}
                className="absolute top-2 right-2 p-1 rounded-full hover:bg-muted"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="text-6xl mb-4 animate-bounce">
                {celebratingMilestone.icon}
              </div>
              <CardTitle className="text-2xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                🎉 Milestone Achieved!
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <h3 className="text-xl font-bold">{celebratingMilestone.name}</h3>
              <p className="text-muted-foreground">{celebratingMilestone.description}</p>
              
              <div className="flex justify-center gap-4 pt-4">
                <Badge variant="secondary" className="text-lg px-4 py-2">
                  +{celebratingMilestone.points} Points
                </Badge>
              </div>
              
              <div className="flex gap-2 pt-4 justify-center">
                <Button variant="outline" size="sm" className="gap-2">
                  <Share2 className="w-4 h-4" /> Share
                </Button>
                <Button size="sm" onClick={() => setShowCelebration(false)} className="gap-2">
                  <Heart className="w-4 h-4" /> Continue Journey
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Milestone Dashboard */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-500" />
              Milestone Celebrations
            </CardTitle>
            <Badge variant="outline" className="text-base px-3 py-1">
              <Star className="w-4 h-4 mr-1 text-amber-500" />
              {totalPoints.toLocaleString()} pts
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Stats Summary */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 rounded-xl bg-gradient-to-br from-success/10 to-success/5 border border-success/20">
              <Calendar className="w-6 h-6 mx-auto mb-2 text-success" />
              <p className="text-2xl font-bold">{userData.currentStreak}</p>
              <p className="text-xs text-muted-foreground">Day Streak</p>
            </div>
            <div className="text-center p-4 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
              <DollarSign className="w-6 h-6 mx-auto mb-2 text-primary" />
              <p className="text-2xl font-bold">${userData.totalSaved.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">Est. Saved</p>
            </div>
            <div className="text-center p-4 rounded-xl bg-gradient-to-br from-accent/10 to-accent/5 border border-accent/20">
              <Award className="w-6 h-6 mx-auto mb-2 text-accent" />
              <p className="text-2xl font-bold">{earnedCount}</p>
              <p className="text-xs text-muted-foreground">Badges Earned</p>
            </div>
          </div>

          {/* Next Milestones Preview */}
          {(nextRecovery || nextFinancial) && (
            <div className="space-y-3">
              <h4 className="text-sm font-medium flex items-center gap-2">
                <Target className="w-4 h-4" /> Next Up
              </h4>
              <div className="grid gap-3 sm:grid-cols-2">
                {nextRecovery && (
                  <div className="p-3 rounded-lg bg-success/5 border border-success/20">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xl">{nextRecovery.icon}</span>
                      <span className="font-medium text-sm">{nextRecovery.name}</span>
                    </div>
                    <Progress value={nextRecovery.progress} className="h-2 mb-1" />
                    <p className="text-xs text-muted-foreground">
                      {Math.round(nextRecovery.progress)}% • {nextRecovery.targetDays! - userData.currentStreak} days to go
                    </p>
                  </div>
                )}
                {nextFinancial && (
                  <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xl">{nextFinancial.icon}</span>
                      <span className="font-medium text-sm">{nextFinancial.name}</span>
                    </div>
                    <Progress value={nextFinancial.progress} className="h-2 mb-1" />
                    <p className="text-xs text-muted-foreground">
                      {Math.round(nextFinancial.progress)}% • ${(nextFinancial.targetAmount! - userData.totalSaved).toLocaleString()} to go
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Milestones Tabs */}
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="recovery" className="flex items-center gap-1">
                <Heart className="w-3 h-3" /> Recovery
              </TabsTrigger>
              <TabsTrigger value="financial" className="flex items-center gap-1">
                <TrendingUp className="w-3 h-3" /> Financial
              </TabsTrigger>
              <TabsTrigger value="earned" className="flex items-center gap-1">
                <Trophy className="w-3 h-3" /> Earned
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-4 space-y-3 max-h-96 overflow-y-auto">
              {milestones.map((milestone) => (
                <MilestoneCard 
                  key={milestone.id} 
                  milestone={milestone}
                  onCelebrate={() => triggerCelebration(milestone)}
                />
              ))}
            </TabsContent>

            <TabsContent value="recovery" className="mt-4 space-y-3 max-h-96 overflow-y-auto">
              {milestones.filter(m => m.type === 'recovery').map((milestone) => (
                <MilestoneCard 
                  key={milestone.id} 
                  milestone={milestone}
                  onCelebrate={() => triggerCelebration(milestone)}
                />
              ))}
            </TabsContent>

            <TabsContent value="financial" className="mt-4 space-y-3 max-h-96 overflow-y-auto">
              {milestones.filter(m => m.type === 'financial').map((milestone) => (
                <MilestoneCard 
                  key={milestone.id} 
                  milestone={milestone}
                  onCelebrate={() => triggerCelebration(milestone)}
                />
              ))}
            </TabsContent>

            <TabsContent value="earned" className="mt-4 space-y-3 max-h-96 overflow-y-auto">
              {getEarnedMilestones().length > 0 ? (
                getEarnedMilestones().map((milestone) => (
                  <MilestoneCard 
                    key={milestone.id} 
                    milestone={milestone}
                    onCelebrate={() => triggerCelebration(milestone)}
                  />
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Trophy className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p>Start your journey to earn milestones!</p>
                  <p className="text-sm mt-1">Complete daily check-ins to track your progress.</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </>
  );
};

export default MilestoneCelebration;
