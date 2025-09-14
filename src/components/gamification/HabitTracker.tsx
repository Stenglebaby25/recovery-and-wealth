import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, CheckCircle, Circle, Calendar, Target, TrendingUp } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Habit {
  id: string;
  name: string;
  description: string;
  category: string;
  target_frequency: number;
  created_at: string;
}

interface HabitCompletion {
  id: string;
  habit_id: string;
  completed_at: string;
  notes?: string;
}

interface HabitWithCompletions extends Habit {
  completions: HabitCompletion[];
  todayCompleted: boolean;
  streak: number;
  completionRate: number;
}

const HabitTracker = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [habits, setHabits] = useState<HabitWithCompletions[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddingHabit, setIsAddingHabit] = useState(false);
  const [newHabit, setNewHabit] = useState({
    name: '',
    description: '',
    category: 'financial'
  });

  useEffect(() => {
    if (user) {
      fetchHabits();
    }
  }, [user]);

  const fetchHabits = async () => {
    if (!user) return;

    try {
      const { data: habitsData } = await supabase
        .from('habits')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (habitsData) {
        const habitsWithCompletions = await Promise.all(
          habitsData.map(async (habit) => {
            const { data: completions } = await supabase
              .from('habit_completions')
              .select('*')
              .eq('habit_id', habit.id)
              .eq('user_id', user.id)
              .order('completed_at', { ascending: false });

            const today = new Date().toDateString();
            const todayCompleted = completions?.some(
              c => new Date(c.completed_at).toDateString() === today
            ) || false;

            const streak = calculateStreak(completions || []);
            const completionRate = calculateCompletionRate(completions || [], habit.created_at);

            return {
              ...habit,
              completions: completions || [],
              todayCompleted,
              streak,
              completionRate
            };
          })
        );

        setHabits(habitsWithCompletions);
      }
    } catch (error) {
      console.error('Error fetching habits:', error);
      toast({
        title: "Error",
        description: "Failed to load habits. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateStreak = (completions: HabitCompletion[]) => {
    if (!completions.length) return 0;

    const sortedDates = completions
      .map(c => new Date(c.completed_at).toDateString())
      .filter((date, index, arr) => arr.indexOf(date) === index)
      .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

    let streak = 0;
    const today = new Date();
    
    for (let i = 0; i < sortedDates.length; i++) {
      const completionDate = new Date(sortedDates[i]);
      const expectedDate = new Date(today);
      expectedDate.setDate(expectedDate.getDate() - i);
      
      if (completionDate.toDateString() === expectedDate.toDateString()) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  };

  const calculateCompletionRate = (completions: HabitCompletion[], createdAt: string) => {
    const startDate = new Date(createdAt);
    const today = new Date();
    const daysSinceCreation = Math.ceil((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysSinceCreation === 0) return 0;
    
    const uniqueCompletionDays = new Set(
      completions.map(c => new Date(c.completed_at).toDateString())
    ).size;

    return Math.round((uniqueCompletionDays / daysSinceCreation) * 100);
  };

  const handleAddHabit = async () => {
    if (!user || !newHabit.name.trim()) return;

    try {
      const { error } = await supabase
        .from('habits')
        .insert({
          user_id: user.id,
          name: newHabit.name,
          description: newHabit.description,
          category: newHabit.category
        });

      if (error) throw error;

      setNewHabit({ name: '', description: '', category: 'financial' });
      setIsAddingHabit(false);
      fetchHabits();
      
      toast({
        title: "Success",
        description: "Habit added successfully!",
      });
    } catch (error) {
      console.error('Error adding habit:', error);
      toast({
        title: "Error",
        description: "Failed to add habit. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleCompleteHabit = async (habitId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('habit_completions')
        .insert({
          user_id: user.id,
          habit_id: habitId
        });

      if (error) throw error;

      fetchHabits();
      
      toast({
        title: "Great job!",
        description: "Habit completed for today!",
      });
    } catch (error) {
      console.error('Error completing habit:', error);
      toast({
        title: "Error",
        description: "Failed to complete habit. Please try again.",
        variant: "destructive"
      });
    }
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      financial: 'bg-primary/10 text-primary border-primary/20',
      recovery: 'bg-secondary/10 text-secondary border-secondary/20',
      wellness: 'bg-accent/10 text-accent border-accent/20',
      learning: 'bg-success/10 text-success border-success/20'
    };
    return colors[category as keyof typeof colors] || colors.financial;
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-muted rounded"></div>
        <div className="grid gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-24 bg-muted rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Supportive Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-progress bg-clip-text text-transparent">
            Daily Habits
          </h2>
          <p className="text-muted-foreground mt-1">
            Building healthy routines, one day at a time
          </p>
        </div>
        <Dialog open={isAddingHabit} onOpenChange={setIsAddingHabit}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-progress border-0 shadow-soft hover:shadow-medium transition-all">
              <Plus className="w-4 h-4 mr-2" />
              Add Habit
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-gradient-card border-0 shadow-glow">
            <DialogHeader>
              <DialogTitle className="text-xl">Add New Habit</DialogTitle>
              <p className="text-muted-foreground">
                Create a positive routine that supports your recovery journey
              </p>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground">Habit Name</label>
                <Input
                  value={newHabit.name}
                  onChange={(e) => setNewHabit(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., Review daily expenses"
                  className="mt-1 border-muted focus:border-primary"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Description</label>
                <Textarea
                  value={newHabit.description}
                  onChange={(e) => setNewHabit(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="How will this habit support your financial wellness?"
                  className="mt-1 border-muted focus:border-primary"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Category</label>
                <select
                  value={newHabit.category}
                  onChange={(e) => setNewHabit(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full p-2 border border-muted rounded-md mt-1 bg-background focus:border-primary"
                >
                  <option value="financial">Financial</option>
                  <option value="recovery">Recovery</option>
                  <option value="wellness">Wellness</option>
                  <option value="learning">Learning</option>
                </select>
              </div>
              <Button 
                onClick={handleAddHabit} 
                className="w-full bg-gradient-progress border-0 shadow-soft"
              >
                Create Habit
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {habits.length === 0 ? (
        <Card className="border-0 shadow-soft bg-gradient-subtle">
          <CardContent className="text-center py-16">
            <div className="w-16 h-16 bg-gradient-progress rounded-full flex items-center justify-center mx-auto mb-6 shadow-soft">
              <Target className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Start Your Journey</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Building healthy financial habits is a powerful step in your recovery. Start with one small habit today.
            </p>
            <Button 
              onClick={() => setIsAddingHabit(true)}
              className="bg-gradient-progress border-0 shadow-soft hover:shadow-medium transition-all"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Habit
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {habits.map((habit, index) => (
            <Card 
              key={habit.id} 
              className="border-0 shadow-soft bg-gradient-card transition-all duration-300 hover:shadow-medium animate-scale-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="font-semibold text-xl text-foreground">{habit.name}</h3>
                      <Badge 
                        variant="outline" 
                        className={`${getCategoryColor(habit.category)} border-0 shadow-soft`}
                      >
                        {habit.category}
                      </Badge>
                    </div>
                    {habit.description && (
                      <p className="text-muted-foreground mb-4 leading-relaxed">{habit.description}</p>
                    )}
                    <div className="flex items-center gap-8 text-sm">
                      <div className="flex items-center gap-2 px-3 py-1 bg-accent/10 rounded-full">
                        <Calendar className="w-4 h-4 text-accent" />
                        <span className="font-medium">{habit.streak} day streak</span>
                      </div>
                      <div className="flex items-center gap-2 px-3 py-1 bg-secondary/10 rounded-full">
                        <TrendingUp className="w-4 h-4 text-secondary" />
                        <span className="font-medium">{habit.completionRate}% completion</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 ml-6">
                    <Button
                      variant={habit.todayCompleted ? "success" : "outline"}
                      size="lg"
                      onClick={() => !habit.todayCompleted && handleCompleteHabit(habit.id)}
                      disabled={habit.todayCompleted}
                      className={`${
                        habit.todayCompleted 
                          ? 'bg-gradient-success border-0 shadow-success text-white hover:bg-gradient-success' 
                          : 'border-primary/20 hover:bg-primary/5 shadow-soft hover:shadow-medium'
                      } transition-all duration-200`}
                    >
                      {habit.todayCompleted ? (
                        <>
                          <CheckCircle className="w-5 h-5 mr-2" />
                          Completed Today
                        </>
                      ) : (
                        <>
                          <Circle className="w-5 h-5 mr-2" />
                          Mark Complete
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default HabitTracker;