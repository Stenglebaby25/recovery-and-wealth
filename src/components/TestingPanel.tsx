import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Settings, Crown, User } from 'lucide-react';

const TestingPanel = () => {
  const { user, profile, isPremium } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const togglePremiumStatus = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const newStatus = isPremium ? 'free' : 'premium';
      const expiresAt = isPremium ? null : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000); // 1 year from now
      
      const { error } = await supabase
        .from('profiles')
        .update({ 
          subscription_status: newStatus,
          subscription_expires_at: expiresAt?.toISOString()
        })
        .eq('user_id', user.id);

      if (error) throw error;

      toast({
        title: "Status Updated",
        description: `You are now ${newStatus === 'premium' ? 'Premium' : 'Free'} user!`
      });

      // Refresh the page to update the auth context
      window.location.reload();
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: "Error",
        description: "Failed to update subscription status",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const addSampleData = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Add some sample habits
      await supabase.from('habits').upsert([
        {
          user_id: user.id,
          name: 'Check Budget',
          description: 'Review daily spending and budget categories',
          category: 'financial',
          target_frequency: 1
        },
        {
          user_id: user.id,
          name: 'Mindful Spending',
          description: 'Pause 10 seconds before any purchase over $20',
          category: 'mindfulness',
          target_frequency: 1
        }
      ], { onConflict: 'user_id,name' });

      // Add some sample mood entries
      await supabase.from('mood_journal').insert([
        {
          user_id: user.id,
          mood_rating: 6,
          emotional_state: 'Stressed',
          spending_trigger: 'Work deadline pressure',
          spending_amount: 45.67,
          spending_category: 'Food & Dining',
          notes: 'Ordered expensive takeout instead of cooking'
        },
        {
          user_id: user.id,
          mood_rating: 8,
          emotional_state: 'Happy',
          spending_trigger: 'Got promoted!',
          spending_amount: 120.00,
          spending_category: 'Entertainment',
          notes: 'Celebrated with friends at dinner'
        }
      ]);

      // Add some user progress
      const { data: courses } = await supabase.from('courses').select('id').limit(3);
      if (courses && courses.length > 0) {
        await supabase.from('user_progress').upsert(
          courses.map((course, index) => ({
            user_id: user.id,
            course_id: course.id,
            progress_percentage: [25, 75, 100][index],
            completed: index === 2
          })),
          { onConflict: 'user_id,course_id' }
        );
      }

      toast({
        title: "Sample Data Added",
        description: "Added habits, mood entries, and course progress!"
      });
    } catch (error) {
      console.error('Error adding sample data:', error);
      toast({
        title: "Error",
        description: "Failed to add sample data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <Card className="mb-6 border-dashed border-orange-300 bg-orange-50/50 dark:bg-orange-950/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-orange-700">
          <Settings className="w-5 h-5" />
          Testing Panel
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span>Current Status:</span>
            <Badge variant={isPremium ? "default" : "secondary"} className="flex items-center gap-1">
              {isPremium ? <Crown className="w-3 h-3" /> : <User className="w-3 h-3" />}
              {isPremium ? 'Premium' : 'Free'}
            </Badge>
          </div>
          <Button 
            onClick={togglePremiumStatus}
            disabled={loading}
            variant={isPremium ? "outline" : "default"}
            size="sm"
          >
            {loading ? 'Updating...' : isPremium ? 'Downgrade to Free' : 'Upgrade to Premium'}
          </Button>
        </div>
        
        <div className="flex items-center justify-between">
          <span>Sample Data:</span>
          <Button 
            onClick={addSampleData}
            disabled={loading}
            variant="outline"
            size="sm"
          >
            {loading ? 'Adding...' : 'Add Sample Data'}
          </Button>
        </div>

        <div className="text-sm text-muted-foreground">
          <strong>Premium Features to Test:</strong>
          <ul className="list-disc list-inside mt-1 space-y-1">
            <li>Advanced Recovery Courses in Learning Hub</li>
            <li>Premium Resources in Resource Library</li>
            <li>Advanced rewards in Rewards Center</li>
            <li>All mood journaling and stress prevention tools</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default TestingPanel;