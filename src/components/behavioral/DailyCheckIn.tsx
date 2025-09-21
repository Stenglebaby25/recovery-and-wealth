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
  Sparkles
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface DailyCheckIn {
  id?: string;
  mood_rating: number;
  sobriety_status: string;
  spending_impulse_level: number;
  energy_level: number;
  notes?: string;
  check_in_date: string;
}

const DailyCheckIn = () => {
  const { user } = useAuth();
  const [todaysCheckIn, setTodaysCheckIn] = useState<DailyCheckIn | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    mood_rating: 3,
    sobriety_status: 'strong',
    spending_impulse_level: 1,
    energy_level: 3,
    notes: ''
  });

  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    if (user) {
      fetchTodaysCheckIn();
    }
  }, [user]);

  const fetchTodaysCheckIn = async () => {
    if (!user) return;

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
        setTodaysCheckIn(data);
        setIsCompleted(true);
        setFormData({
          mood_rating: data.mood_rating,
          sobriety_status: data.sobriety_status,
          spending_impulse_level: data.spending_impulse_level,
          energy_level: data.energy_level,
          notes: data.notes || ''
        });
      }
    } catch (error) {
      console.error('Error fetching check-in:', error);
    }
  };

  const handleSubmit = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const checkInData = {
        user_id: user.id,
        check_in_date: today,
        ...formData
      };

      const { error } = await supabase
        .from('daily_checkins')
        .upsert(checkInData, {
          onConflict: 'user_id,check_in_date'
        });

      if (error) throw error;

      setIsCompleted(true);
      toast.success('Daily check-in complete! Great job staying connected to your wellness.');
      fetchTodaysCheckIn();
    } catch (error) {
      console.error('Error saving check-in:', error);
      toast.error('Failed to save check-in. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getRatingColor = (rating: number) => {
    if (rating <= 2) return 'text-destructive';
    if (rating <= 3) return 'text-warning';
    return 'text-success';
  };

  const getSobrietyColor = (status: string) => {
    switch (status) {
      case 'strong': return 'bg-success/10 text-success border-success/20';
      case 'confident': return 'bg-primary/10 text-primary border-primary/20';
      case 'challenged': return 'bg-warning/10 text-warning border-warning/20';
      case 'struggling': return 'bg-destructive/10 text-destructive border-destructive/20';
      default: return 'bg-muted';
    }
  };

  if (!user) return null;

  return (
    <Card className="border-0 shadow-soft bg-gradient-card relative overflow-hidden">
      {isCompleted && (
        <div className="absolute top-4 right-4">
          <CheckCircle className="w-6 h-6 text-success" />
        </div>
      )}
      
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <Calendar className="w-5 h-5 text-primary" />
          Daily Wellness Check-In
          {isCompleted && (
            <Badge variant="secondary" className="bg-success/10 text-success border-success/20">
              Complete
            </Badge>
          )}
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          {isCompleted ? 
            "You've checked in today! Here's your wellness snapshot:" :
            "Take 30 seconds to connect with your wellness today"
          }
        </p>
      </CardHeader>

      <CardContent className="space-y-6">
        {isCompleted ? (
          // Completed State - Show Summary
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center space-y-2">
              <Heart className={`w-8 h-8 mx-auto ${getRatingColor(formData.mood_rating)}`} />
              <p className="text-sm font-medium">Mood</p>
              <div className="flex justify-center">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className={`w-2 h-2 rounded-full mx-0.5 ${
                      i < formData.mood_rating ? 'bg-primary' : 'bg-muted'
                    }`}
                  />
                ))}
              </div>
            </div>
            
            <div className="text-center space-y-2">
              <Shield className="w-8 h-8 mx-auto text-primary" />
              <p className="text-sm font-medium">Sobriety</p>
              <Badge variant="outline" className={getSobrietyColor(formData.sobriety_status)}>
                {formData.sobriety_status}
              </Badge>
            </div>
            
            <div className="text-center space-y-2">
              <DollarSign className={`w-8 h-8 mx-auto ${getRatingColor(6 - formData.spending_impulse_level)}`} />
              <p className="text-sm font-medium">Spending Control</p>
              <Progress 
                value={(6 - formData.spending_impulse_level) * 20} 
                className="w-full h-2" 
              />
            </div>
            
            <div className="text-center space-y-2">
              <Zap className={`w-8 h-8 mx-auto ${getRatingColor(formData.energy_level)}`} />
              <p className="text-sm font-medium">Energy</p>
              <div className="flex justify-center">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className={`w-2 h-2 rounded-full mx-0.5 ${
                      i < formData.energy_level ? 'bg-accent' : 'bg-muted'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        ) : (
          // Form State
          <div className="space-y-6">
            {/* Mood Rating */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium mb-3">
                <Heart className="w-4 h-4 text-primary" />
                How's your mood today? (1-5)
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <Button
                    key={rating}
                    variant={formData.mood_rating === rating ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFormData({ ...formData, mood_rating: rating })}
                    className="w-10 h-10 p-0"
                  >
                    {rating}
                  </Button>
                ))}
              </div>
            </div>

            {/* Sobriety Status */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium mb-3">
                <Shield className="w-4 h-4 text-primary" />
                How's your recovery feeling today?
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { value: 'strong', label: 'Strong & Confident' },
                  { value: 'confident', label: 'Confident' },
                  { value: 'challenged', label: 'Feeling Challenged' },
                  { value: 'struggling', label: 'Struggling Today' }
                ].map((status) => (
                  <Button
                    key={status.value}
                    variant={formData.sobriety_status === status.value ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFormData({ ...formData, sobriety_status: status.value })}
                    className="text-xs h-auto py-2"
                  >
                    {status.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Spending Impulses */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium mb-3">
                <DollarSign className="w-4 h-4 text-primary" />
                Spending impulses today? (1 = none, 5 = strong)
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((level) => (
                  <Button
                    key={level}
                    variant={formData.spending_impulse_level === level ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFormData({ ...formData, spending_impulse_level: level })}
                    className="w-10 h-10 p-0"
                  >
                    {level}
                  </Button>
                ))}
              </div>
            </div>

            {/* Energy Level */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium mb-3">
                <Zap className="w-4 h-4 text-primary" />
                Energy level today? (1-5)
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((level) => (
                  <Button
                    key={level}
                    variant={formData.energy_level === level ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFormData({ ...formData, energy_level: level })}
                    className="w-10 h-10 p-0"
                  >
                    {level}
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
                placeholder="Anything specific you want to remember about today?"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="h-16 resize-none"
              />
            </div>

            <Button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-gradient-progress border-0"
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
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DailyCheckIn;