import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Heart, 
  Shield, 
  Zap, 
  DollarSign, 
  CheckCircle, 
  Calendar,
  Sparkles,
  RotateCcw
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';

interface CheckInData {
  mood_rating: number;
  sobriety_status: string;
  spending_impulse_level: number;
  energy_level: number;
  notes: string;
  check_in_date: string;
}

const LOCAL_STORAGE_KEY = 'quick_daily_checkin';

const QuickDailyCheckIn = () => {
  const { user } = useAuth();
  const [isCompleted, setIsCompleted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<CheckInData>({
    mood_rating: 3,
    sobriety_status: 'strong',
    spending_impulse_level: 1,
    energy_level: 3,
    notes: '',
    check_in_date: new Date().toISOString().split('T')[0]
  });

  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    fetchTodaysCheckIn();
  }, [user]);

  const fetchTodaysCheckIn = async () => {
    if (user) {
      // Logged-in user: fetch from Supabase
      try {
        const { data, error } = await supabase
          .from('daily_checkins')
          .select('*')
          .eq('user_id', user.id)
          .eq('check_in_date', today)
          .maybeSingle();

        if (error && error.code !== 'PGRST116') {
          console.error('Error fetching check-in:', error);
          return;
        }

        if (data) {
          setFormData({
            mood_rating: data.mood_rating,
            sobriety_status: data.sobriety_status,
            spending_impulse_level: data.spending_impulse_level,
            energy_level: data.energy_level,
            notes: data.notes || '',
            check_in_date: data.check_in_date
          });
          setIsCompleted(true);
        }
      } catch (error) {
        console.error('Error fetching check-in:', error);
      }
    } else {
      // Guest: check localStorage
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (parsed.check_in_date === today) {
            setFormData(parsed);
            setIsCompleted(true);
          }
        } catch (e) {
          console.error('Error parsing stored check-in:', e);
        }
      }
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    const checkInData = { ...formData, check_in_date: today };

    try {
      if (user) {
        // Save to Supabase for logged-in users
        const { error } = await supabase
          .from('daily_checkins')
          .upsert({
            user_id: user.id,
            ...checkInData
          }, {
            onConflict: 'user_id,check_in_date'
          });

        if (error) throw error;
        toast.success('Daily check-in saved! Keep up the great work.');
      } else {
        // Save to localStorage for guests
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(checkInData));
        toast.success('Check-in complete! Sign up to save your progress across devices.');
      }

      setFormData(checkInData);
      setIsCompleted(true);
    } catch (error) {
      console.error('Error saving check-in:', error);
      toast.error('Failed to save check-in. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setIsCompleted(false);
    setFormData({
      mood_rating: 3,
      sobriety_status: 'strong',
      spending_impulse_level: 1,
      energy_level: 3,
      notes: '',
      check_in_date: today
    });
  };

  const getRatingColor = (rating: number) => {
    if (rating <= 2) return 'text-destructive';
    if (rating <= 3) return 'text-amber-500';
    return 'text-emerald-500';
  };

  const getSobrietyColor = (status: string) => {
    switch (status) {
      case 'strong': return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20';
      case 'confident': return 'bg-primary/10 text-primary border-primary/20';
      case 'challenged': return 'bg-amber-500/10 text-amber-600 border-amber-500/20';
      case 'struggling': return 'bg-destructive/10 text-destructive border-destructive/20';
      default: return 'bg-muted';
    }
  };

  const getSobrietyLabel = (status: string) => {
    switch (status) {
      case 'strong': return 'Strong & Confident';
      case 'confident': return 'Confident';
      case 'challenged': return 'Feeling Challenged';
      case 'struggling': return 'Struggling Today';
      default: return status;
    }
  };

  return (
    <Card className="border-0 shadow-lg bg-gradient-to-br from-card via-card to-primary/5 relative overflow-hidden">
      {isCompleted && (
        <div className="absolute top-4 right-4 flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReset}
            className="text-muted-foreground hover:text-foreground"
          >
            <RotateCcw className="w-4 h-4 mr-1" />
            Update
          </Button>
          <CheckCircle className="w-6 h-6 text-emerald-500" />
        </div>
      )}
      
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-xl md:text-2xl">
          <Calendar className="w-6 h-6 text-primary" />
          Quick Daily Check-In
          {isCompleted && (
            <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20">
              Complete
            </Badge>
          )}
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          {isCompleted ? 
            "Here's your wellness snapshot for today:" :
            "Take 30 seconds to connect with your wellness — it's free!"
          }
        </p>
      </CardHeader>

      <CardContent className="space-y-6">
        {isCompleted ? (
          // Completed State - Show Summary
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center space-y-2 p-4 rounded-xl bg-background/50">
                <Heart className={`w-8 h-8 mx-auto ${getRatingColor(formData.mood_rating)}`} />
                <p className="text-sm font-medium">Mood</p>
                <div className="flex justify-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className={`w-2.5 h-2.5 rounded-full ${
                        i < formData.mood_rating ? 'bg-primary' : 'bg-muted'
                      }`}
                    />
                  ))}
                </div>
              </div>
              
              <div className="text-center space-y-2 p-4 rounded-xl bg-background/50">
                <Shield className="w-8 h-8 mx-auto text-primary" />
                <p className="text-sm font-medium">Recovery</p>
                <Badge variant="outline" className={`text-xs ${getSobrietyColor(formData.sobriety_status)}`}>
                  {getSobrietyLabel(formData.sobriety_status)}
                </Badge>
              </div>
              
              <div className="text-center space-y-2 p-4 rounded-xl bg-background/50">
                <DollarSign className={`w-8 h-8 mx-auto ${getRatingColor(6 - formData.spending_impulse_level)}`} />
                <p className="text-sm font-medium">Spending Control</p>
                <Progress 
                  value={(6 - formData.spending_impulse_level) * 20} 
                  className="w-full h-2" 
                />
              </div>
              
              <div className="text-center space-y-2 p-4 rounded-xl bg-background/50">
                <Zap className={`w-8 h-8 mx-auto ${getRatingColor(formData.energy_level)}`} />
                <p className="text-sm font-medium">Energy</p>
                <div className="flex justify-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className={`w-2.5 h-2.5 rounded-full ${
                        i < formData.energy_level ? 'bg-accent' : 'bg-muted'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {formData.notes && (
              <div className="p-4 rounded-xl bg-background/50">
                <p className="text-sm text-muted-foreground font-medium mb-1">Today's Note:</p>
                <p className="text-sm">{formData.notes}</p>
              </div>
            )}

            {!user && (
              <div className="p-4 rounded-xl bg-primary/5 border border-primary/10 text-center">
                <p className="text-sm text-muted-foreground mb-2">
                  Want to track your progress over time?
                </p>
                <Link to="/auth">
                  <Button variant="outline" size="sm" className="border-primary/20 hover:bg-primary/10">
                    Sign Up Free to Save History
                  </Button>
                </Link>
              </div>
            )}
          </div>
        ) : (
          // Form State
          <div className="space-y-6">
            {/* Mood Rating */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium mb-3">
                <Heart className="w-4 h-4 text-primary" />
                How's your mood today?
              </label>
              <div className="flex gap-2 flex-wrap">
                {[
                  { value: 1, label: '😔' },
                  { value: 2, label: '😕' },
                  { value: 3, label: '😐' },
                  { value: 4, label: '🙂' },
                  { value: 5, label: '😊' }
                ].map((rating) => (
                  <Button
                    key={rating.value}
                    variant={formData.mood_rating === rating.value ? "default" : "outline"}
                    size="lg"
                    onClick={() => setFormData({ ...formData, mood_rating: rating.value })}
                    className="w-12 h-12 p-0 text-xl"
                  >
                    {rating.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Sobriety Status */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium mb-3">
                <Shield className="w-4 h-4 text-primary" />
                How's your recovery feeling?
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { value: 'strong', label: 'Strong & Confident', icon: '💪' },
                  { value: 'confident', label: 'Confident', icon: '👍' },
                  { value: 'challenged', label: 'Feeling Challenged', icon: '🤔' },
                  { value: 'struggling', label: 'Struggling Today', icon: '🆘' }
                ].map((status) => (
                  <Button
                    key={status.value}
                    variant={formData.sobriety_status === status.value ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFormData({ ...formData, sobriety_status: status.value })}
                    className="text-xs h-auto py-3 justify-start gap-2"
                  >
                    <span>{status.icon}</span>
                    {status.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Spending Impulses */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium mb-3">
                <DollarSign className="w-4 h-4 text-primary" />
                Spending impulses today?
              </label>
              <div className="flex gap-2">
                {[
                  { value: 1, label: 'None' },
                  { value: 2, label: 'Low' },
                  { value: 3, label: 'Medium' },
                  { value: 4, label: 'High' },
                  { value: 5, label: 'Strong' }
                ].map((level) => (
                  <Button
                    key={level.value}
                    variant={formData.spending_impulse_level === level.value ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFormData({ ...formData, spending_impulse_level: level.value })}
                    className="flex-1 text-xs px-1"
                  >
                    {level.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Energy Level */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium mb-3">
                <Zap className="w-4 h-4 text-primary" />
                Energy level today?
              </label>
              <div className="flex gap-2 flex-wrap">
                {[
                  { value: 1, label: '🔋', desc: 'Drained' },
                  { value: 2, label: '🪫', desc: 'Low' },
                  { value: 3, label: '⚡', desc: 'OK' },
                  { value: 4, label: '💪', desc: 'Good' },
                  { value: 5, label: '🚀', desc: 'Great' }
                ].map((level) => (
                  <Button
                    key={level.value}
                    variant={formData.energy_level === level.value ? "default" : "outline"}
                    size="lg"
                    onClick={() => setFormData({ ...formData, energy_level: level.value })}
                    className="w-12 h-12 p-0 text-xl"
                    title={level.desc}
                  >
                    {level.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Quick Notes */}
            <div>
              <label className="text-sm font-medium mb-2 block">
                Quick note (optional)
              </label>
              <Textarea
                placeholder="Anything on your mind today?"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="h-16 resize-none"
              />
            </div>

            <Button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full"
              size="lg"
            >
              {loading ? (
                "Saving..."
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Complete Check-In
                </>
              )}
            </Button>

            {!user && (
              <p className="text-xs text-muted-foreground text-center">
                No account needed! Your check-in is saved locally.{' '}
                <Link to="/auth" className="text-primary hover:underline">
                  Sign up
                </Link>
                {' '}to track history.
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default QuickDailyCheckIn;
