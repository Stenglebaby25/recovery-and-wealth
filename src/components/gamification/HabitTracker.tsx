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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Daily Habits</h2>
        <Dialog open={isAddingHabit} onOpenChange={setIsAddingHabit}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Habit
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Habit</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Habit Name</label>
                <Input
                  value={newHabit.name}
                  onChange={(e) => setNewHabit(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., Review daily expenses"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  value={newHabit.description}
                  onChange={(e) => setNewHabit(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Why is this habit important for your recovery?"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Category</label>
                <select
                  value={newHabit.category}
                  onChange={(e) => setNewHabit(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="financial">Financial</option>
                  <option value="recovery">Recovery</option>
                  <option value="wellness">Wellness</option>
                  <option value="learning">Learning</option>
                </select>
              </div>
              <Button onClick={handleAddHabit} className="w-full">
                Add Habit
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {habits.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Target className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No habits yet</h3>
            <p className="text-muted-foreground mb-4">
              Start building healthy financial habits to support your recovery journey.
            </p>
            <Button onClick={() => setIsAddingHabit(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Habit
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {habits.map((habit) => (
            <Card key={habit.id} className="transition-all hover:shadow-medium">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-lg">{habit.name}</h3>
                      <Badge variant="outline" className={getCategoryColor(habit.category)}>
                        {habit.category}
                      </Badge>
                    </div>
                    {habit.description && (
                      <p className="text-muted-foreground mb-3">{habit.description}</p>
                    )}
                    <div className="flex items-center gap-6 text-sm">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span>{habit.streak} day streak</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <TrendingUp className="w-4 h-4 text-muted-foreground" />
                        <span>{habit.completionRate}% completion rate</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Button
                      variant={habit.todayCompleted ? "success" : "outline"}
                      size="lg"
                      onClick={() => !habit.todayCompleted && handleCompleteHabit(habit.id)}
                      disabled={habit.todayCompleted}
                    >
                      {habit.todayCompleted ? (
                        <>
                          <CheckCircle className="w-5 h-5 mr-2" />
                          Completed
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