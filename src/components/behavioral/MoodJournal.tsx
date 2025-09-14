import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/hooks/use-toast';
import { 
  Brain, 
  TrendingUp, 
  AlertTriangle, 
  Smile,
  Frown,
  Meh,
  Calendar,
  DollarSign,
  BarChart3
} from 'lucide-react';
import { format } from 'date-fns';

interface MoodEntry {
  id: string;
  mood_rating: number;
  emotional_state: string;
  spending_trigger?: string;
  spending_amount?: number;
  spending_category?: string;
  notes?: string;
  created_at: string;
}

interface SpendingPattern {
  emotional_state: string;
  avg_spending: number;
  frequency: number;
  categories: string[];
}

const MoodJournal = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [entries, setEntries] = useState<MoodEntry[]>([]);
  const [patterns, setPatterns] = useState<SpendingPattern[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  // Form state
  const [moodRating, setMoodRating] = useState([5]);
  const [emotionalState, setEmotionalState] = useState('');
  const [spendingTrigger, setSpendingTrigger] = useState('');
  const [spendingAmount, setSpendingAmount] = useState('');
  const [spendingCategory, setSpendingCategory] = useState('');
  const [notes, setNotes] = useState('');

  const emotionalStates = [
    'Stressed', 'Anxious', 'Happy', 'Sad', 'Angry', 'Excited', 
    'Bored', 'Lonely', 'Confident', 'Overwhelmed', 'Peaceful', 'Frustrated'
  ];

  const spendingCategories = [
    'Food & Dining', 'Shopping', 'Entertainment', 'Travel', 
    'Healthcare', 'Transportation', 'Bills & Utilities', 'Other'
  ];

  useEffect(() => {
    if (user) {
      fetchEntries();
      analyzePatterns();
    }
  }, [user]);

  const fetchEntries = async () => {
    try {
      const { data, error } = await supabase
        .from('mood_journal')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      setEntries(data || []);
    } catch (error) {
      console.error('Error fetching mood entries:', error);
    } finally {
      setLoading(false);
    }
  };

  const analyzePatterns = async () => {
    try {
      const { data, error } = await supabase
        .from('mood_journal')
        .select('emotional_state, spending_amount, spending_category')
        .eq('user_id', user?.id)
        .not('spending_amount', 'is', null);

      if (error) throw error;

      // Group by emotional state and calculate patterns
      const stateGroups = data?.reduce((acc, entry) => {
        const state = entry.emotional_state;
        if (!acc[state]) {
          acc[state] = { amounts: [], categories: [] };
        }
        acc[state].amounts.push(entry.spending_amount);
        if (entry.spending_category) {
          acc[state].categories.push(entry.spending_category);
        }
        return acc;
      }, {} as Record<string, { amounts: number[], categories: string[] }>);

      const patternData = Object.entries(stateGroups || {}).map(([state, data]) => ({
        emotional_state: state,
        avg_spending: data.amounts.reduce((sum, amt) => sum + amt, 0) / data.amounts.length,
        frequency: data.amounts.length,
        categories: [...new Set(data.categories)]
      }));

      setPatterns(patternData.sort((a, b) => b.avg_spending - a.avg_spending));
    } catch (error) {
      console.error('Error analyzing patterns:', error);
    }
  };

  const submitEntry = async () => {
    if (!emotionalState) {
      toast({
        title: "Missing Information",
        description: "Please select your emotional state.",
        variant: "destructive"
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('mood_journal')
        .insert({
          user_id: user?.id,
          mood_rating: moodRating[0],
          emotional_state: emotionalState,
          spending_trigger: spendingTrigger || null,
          spending_amount: spendingAmount ? parseFloat(spendingAmount) : null,
          spending_category: spendingCategory || null,
          notes: notes || null
        });

      if (error) throw error;

      toast({
        title: "Entry Added",
        description: "Your mood and spending entry has been recorded."
      });

      // Reset form
      setMoodRating([5]);
      setEmotionalState('');
      setSpendingTrigger('');
      setSpendingAmount('');
      setSpendingCategory('');
      setNotes('');
      setShowForm(false);

      // Refresh data
      fetchEntries();
      analyzePatterns();
    } catch (error) {
      console.error('Error submitting entry:', error);
      toast({
        title: "Error",
        description: "Failed to save your entry. Please try again.",
        variant: "destructive"
      });
    }
  };

  const getMoodIcon = (rating: number) => {
    if (rating <= 3) return <Frown className="w-5 h-5 text-red-500" />;
    if (rating <= 7) return <Meh className="w-5 h-5 text-yellow-500" />;
    return <Smile className="w-5 h-5 text-green-500" />;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-64 bg-muted rounded"></div>
            <div className="h-64 bg-muted rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Brain className="w-6 h-6 text-primary" />
            Mood & Spending Journal
          </h2>
          <p className="text-muted-foreground">
            Track your emotional state and spending patterns to understand behavioral finance triggers
          </p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : 'New Entry'}
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Record Your Mood & Spending</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Mood Rating (1-10)</Label>
              <div className="flex items-center space-x-4 mt-2">
                <span>1</span>
                <Slider
                  value={moodRating}
                  onValueChange={setMoodRating}
                  max={10}
                  min={1}
                  step={1}
                  className="flex-1"
                />
                <span>10</span>
                <div className="flex items-center gap-2 min-w-[60px]">
                  {getMoodIcon(moodRating[0])}
                  <span className="font-bold">{moodRating[0]}</span>
                </div>
              </div>
            </div>

            <div>
              <Label>Emotional State</Label>
              <Select value={emotionalState} onValueChange={setEmotionalState}>
                <SelectTrigger>
                  <SelectValue placeholder="How are you feeling?" />
                </SelectTrigger>
                <SelectContent>
                  {emotionalStates.map(state => (
                    <SelectItem key={state} value={state}>{state}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Spending Trigger (Optional)</Label>
              <Input
                placeholder="What triggered this spending urge?"
                value={spendingTrigger}
                onChange={(e) => setSpendingTrigger(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Amount Spent (Optional)</Label>
                <Input
                  type="number"
                  placeholder="0.00"
                  value={spendingAmount}
                  onChange={(e) => setSpendingAmount(e.target.value)}
                />
              </div>
              <div>
                <Label>Category (Optional)</Label>
                <Select value={spendingCategory} onValueChange={setSpendingCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {spendingCategories.map(category => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label>Notes (Optional)</Label>
              <Textarea
                placeholder="Additional thoughts or reflections..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>

            <Button onClick={submitEntry} className="w-full">
              Save Entry
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Spending Patterns */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Emotional Spending Patterns
            </CardTitle>
          </CardHeader>
          <CardContent>
            {patterns.length > 0 ? (
              <div className="space-y-4">
                {patterns.slice(0, 5).map((pattern, index) => (
                  <div key={pattern.emotional_state} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div>
                      <div className="font-medium">{pattern.emotional_state}</div>
                      <div className="text-sm text-muted-foreground">
                        {pattern.frequency} entries • Top: {pattern.categories.slice(0, 2).join(', ')}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">${pattern.avg_spending.toFixed(0)}</div>
                      <div className="text-sm text-muted-foreground">avg spent</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8">
                Start journaling to see your emotional spending patterns
              </p>
            )}
          </CardContent>
        </Card>

        {/* Recent Entries */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Recent Entries
            </CardTitle>
          </CardHeader>
          <CardContent>
            {entries.length > 0 ? (
              <div className="space-y-3">
                {entries.slice(0, 5).map((entry) => (
                  <div key={entry.id} className="p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {getMoodIcon(entry.mood_rating)}
                        <span className="font-medium">{entry.emotional_state}</span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {format(new Date(entry.created_at), 'MMM d')}
                      </div>
                    </div>
                    {entry.spending_amount && (
                      <div className="flex items-center gap-2 text-sm">
                        <DollarSign className="w-4 h-4" />
                        <span>${entry.spending_amount} • {entry.spending_category}</span>
                      </div>
                    )}
                    {entry.notes && (
                      <p className="text-sm text-muted-foreground mt-1">{entry.notes}</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8">
                No entries yet. Start tracking your mood and spending!
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {patterns.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Behavioral Finance Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <h4 className="font-semibold">Your Spending Triggers</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  {patterns.slice(0, 3).map(pattern => (
                    <li key={pattern.emotional_state}>
                      • You spend most when feeling <strong>{pattern.emotional_state.toLowerCase()}</strong> (${pattern.avg_spending.toFixed(0)} avg)
                    </li>
                  ))}
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold">Behavioral Finance Tips</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• <strong>Loss Aversion:</strong> Focus on what you'll lose by overspending</li>
                  <li>• <strong>Emotional Regulation:</strong> Use the stress prevention tools before purchasing</li>
                  <li>• <strong>Confirmation Bias:</strong> Challenge your spending justifications</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MoodJournal;