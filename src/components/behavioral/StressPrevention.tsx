import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { 
  AlertTriangle, 
  Shield, 
  Target, 
  Heart, 
  Pause, 
  MessageSquare,
  Brain,
  CheckCircle,
  XCircle
} from 'lucide-react';

interface PreventionEvent {
  id: string;
  trigger_type: string;
  intervention_used: string;
  amount_considered?: number;
  prevented: boolean;
  notes?: string;
  created_at: string;
}

const StressPrevention = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [events, setEvents] = useState<PreventionEvent[]>([]);
  const [showPanicDialog, setShowPanicDialog] = useState(false);
  const [currentTrigger, setCurrentTrigger] = useState('');
  const [amountConsidered, setAmountConsidered] = useState('');
  const [notes, setNotes] = useState('');
  const [selectedIntervention, setSelectedIntervention] = useState('');
  const [loading, setLoading] = useState(true);

  const interventions = [
    {
      id: 'goals_reminder',
      title: 'Review Your Goals',
      description: 'Remind yourself why you\'re on this financial recovery journey',
      icon: Target,
      content: [
        '💡 Remember: Every dollar saved gets you closer to financial freedom',
        '🎯 Your emergency fund is your safety net for true peace of mind',
        '🏠 That home, car, or vacation you\'re saving for is worth the wait',
        '📈 Compound interest only works if you actually save the money'
      ]
    },
    {
      id: 'accountability_message',
      title: 'Reach Out for Support',
      description: 'Connect with your accountability partner or sponsor',
      icon: MessageSquare,
      content: [
        '📱 Text your accountability partner about this spending urge',
        '🤝 Call your financial sponsor or mentor for guidance',
        '💬 Share in your recovery community about this challenge',
        '📝 Write down what you\'re feeling before you act'
      ]
    },
    {
      id: 'meditation',
      title: 'Mindful Pause',
      description: 'Take a moment to breathe and center yourself',
      icon: Heart,
      content: [
        '🧘‍♀️ Take 10 deep breaths before making any financial decision',
        '⏰ Wait 24 hours for purchases over $50, 1 week for over $200',
        '🎵 Listen to calming music or a guided meditation',
        '🚶‍♂️ Take a walk outside to clear your mind'
      ]
    },
    {
      id: 'pause_reflection',
      title: 'Behavioral Finance Check',
      description: 'Challenge your thoughts and identify cognitive biases',
      icon: Brain,
      content: [
        '❓ Am I experiencing FOMO (Fear of Missing Out) right now?',
        '🧠 Is this purchase based on emotion or logical need?',
        '⚖️ Am I falling victim to loss aversion? What will I truly lose?',
        '🔍 Is confirmation bias making me justify this purchase?'
      ]
    }
  ];

  useEffect(() => {
    if (user) {
      fetchEvents();
    }
  }, [user]);

  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('stress_prevention_events')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      console.error('Error fetching prevention events:', error);
    } finally {
      setLoading(false);
    }
  };

  const triggerPanicButton = (triggerType: string) => {
    setCurrentTrigger(triggerType);
    setShowPanicDialog(true);
  };

  const recordEvent = async (prevented: boolean) => {
    try {
      const { error } = await supabase
        .from('stress_prevention_events')
        .insert({
          user_id: user?.id,
          trigger_type: currentTrigger,
          intervention_used: selectedIntervention,
          amount_considered: amountConsidered ? parseFloat(amountConsidered) : null,
          prevented,
          notes: notes || null
        });

      if (error) throw error;

      toast({
        title: prevented ? "Great Job!" : "Learning Opportunity",
        description: prevented 
          ? "You successfully prevented impulsive spending!" 
          : "Every experience teaches us about our patterns."
      });

      // Reset form
      setAmountConsidered('');
      setNotes('');
      setSelectedIntervention('');
      setShowPanicDialog(false);
      
      // Refresh data
      fetchEvents();
    } catch (error) {
      console.error('Error recording event:', error);
      toast({
        title: "Error",
        description: "Failed to record your event.",
        variant: "destructive"
      });
    }
  };

  const getSuccessRate = () => {
    if (events.length === 0) return 0;
    const prevented = events.filter(e => e.prevented).length;
    return Math.round((prevented / events.length) * 100);
  };

  if (loading) {
    return <div className="animate-pulse h-64 bg-muted rounded"></div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Shield className="w-6 h-6 text-primary" />
          Financial Stress Prevention
        </h2>
        <p className="text-muted-foreground">
          Use these tools when you feel the urge to overspend or make impulsive financial decisions
        </p>
      </div>

      {/* Panic Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-red-200 bg-red-50/50 dark:bg-red-950/20">
          <CardContent className="p-4 text-center">
            <AlertTriangle className="w-8 h-8 text-red-500 mx-auto mb-2" />
            <h3 className="font-semibold mb-2">Impulse Purchase Urge</h3>
            <Button 
              variant="destructive"
              onClick={() => triggerPanicButton('impulse_buy')}
              className="w-full"
            >
              Get Help Now
            </Button>
          </CardContent>
        </Card>

        <Card className="border-orange-200 bg-orange-50/50 dark:bg-orange-950/20">
          <CardContent className="p-4 text-center">
            <Pause className="w-8 h-8 text-orange-500 mx-auto mb-2" />
            <h3 className="font-semibold mb-2">Financial Stress</h3>
            <Button 
              variant="outline"
              onClick={() => triggerPanicButton('financial_stress')}
              className="w-full border-orange-500 text-orange-700 hover:bg-orange-100"
            >
              Need Support
            </Button>
          </CardContent>
        </Card>

        <Card className="border-yellow-200 bg-yellow-50/50 dark:bg-yellow-950/20">
          <CardContent className="p-4 text-center">
            <Brain className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
            <h3 className="font-semibold mb-2">Overspending Pattern</h3>
            <Button 
              variant="outline"
              onClick={() => triggerPanicButton('overspending_urge')}
              className="w-full border-yellow-500 text-yellow-700 hover:bg-yellow-100"
            >
              Break the Cycle
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Stats */}
      {events.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Your Prevention Success</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">{getSuccessRate()}%</div>
                <div className="text-sm text-muted-foreground">Prevention Success Rate</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">{events.length}</div>
                <div className="text-sm text-muted-foreground">Total Interventions Used</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">
                  ${events.filter(e => e.prevented && e.amount_considered)
                    .reduce((sum, e) => sum + (e.amount_considered || 0), 0).toFixed(0)}
                </div>
                <div className="text-sm text-muted-foreground">Money Saved</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Events */}
      {events.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Prevention Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {events.slice(0, 5).map((event) => (
                <div key={event.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3">
                    {event.prevented ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-500" />
                    )}
                    <div>
                      <div className="font-medium capitalize">
                        {event.trigger_type.replace('_', ' ')}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Used: {event.intervention_used.replace('_', ' ')}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    {event.amount_considered && (
                      <div className="font-medium">${event.amount_considered}</div>
                    )}
                    <div className="text-sm text-muted-foreground">
                      {new Date(event.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Intervention Dialog */}
      <Dialog open={showPanicDialog} onOpenChange={setShowPanicDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Financial Stress Prevention Tools</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            {!selectedIntervention ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {interventions.map((intervention) => {
                  const IconComponent = intervention.icon;
                  return (
                    <Card 
                      key={intervention.id}
                      className="cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => setSelectedIntervention(intervention.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3 mb-2">
                          <IconComponent className="w-5 h-5 text-primary" />
                          <h3 className="font-semibold">{intervention.title}</h3>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {intervention.description}
                        </p>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <div className="space-y-4">
                {(() => {
                  const intervention = interventions.find(i => i.id === selectedIntervention);
                  if (!intervention) return null;
                  const IconComponent = intervention.icon;
                  
                  return (
                    <>
                      <div className="flex items-center gap-3">
                        <IconComponent className="w-6 h-6 text-primary" />
                        <h3 className="text-xl font-semibold">{intervention.title}</h3>
                      </div>
                      
                      <div className="bg-muted/50 p-4 rounded-lg">
                        <ul className="space-y-2">
                          {intervention.content.map((item, index) => (
                            <li key={index} className="text-sm">{item}</li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <Label>Amount You Were Considering (Optional)</Label>
                          <Input
                            type="number"
                            placeholder="0.00"
                            value={amountConsidered}
                            onChange={(e) => setAmountConsidered(e.target.value)}
                          />
                        </div>
                        
                        <div>
                          <Label>Additional Notes</Label>
                          <Textarea
                            placeholder="How are you feeling? What triggered this?"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                          />
                        </div>
                      </div>
                      
                      <div className="flex gap-3">
                        <Button 
                          onClick={() => recordEvent(true)}
                          className="flex-1 bg-green-600 hover:bg-green-700"
                        >
                          I Prevented the Purchase
                        </Button>
                        <Button 
                          onClick={() => recordEvent(false)}
                          variant="outline"
                          className="flex-1"
                        >
                          I Still Made the Purchase
                        </Button>
                      </div>
                    </>
                  );
                })()}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StressPrevention;