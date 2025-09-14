-- Create mood and spending trigger journal table
CREATE TABLE public.mood_journal (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  mood_rating INTEGER NOT NULL CHECK (mood_rating >= 1 AND mood_rating <= 10),
  emotional_state TEXT NOT NULL,
  spending_trigger TEXT,
  spending_amount DECIMAL(10,2),
  spending_category TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.mood_journal ENABLE ROW LEVEL SECURITY;

-- Create policies for mood journal
CREATE POLICY "Users can manage their own mood journal entries" 
ON public.mood_journal 
FOR ALL 
USING (auth.uid() = user_id);

-- Create trigger for updated_at
CREATE TRIGGER update_mood_journal_updated_at
BEFORE UPDATE ON public.mood_journal
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create table for financial stress prevention events
CREATE TABLE public.stress_prevention_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  trigger_type TEXT NOT NULL, -- 'impulse_buy', 'financial_stress', 'overspending_urge'
  intervention_used TEXT, -- 'goals_reminder', 'accountability_message', 'meditation', 'pause_reflection'
  amount_considered DECIMAL(10,2),
  prevented BOOLEAN DEFAULT false,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.stress_prevention_events ENABLE ROW LEVEL SECURITY;

-- Create policies for stress prevention events
CREATE POLICY "Users can manage their own stress prevention events" 
ON public.stress_prevention_events 
FOR ALL 
USING (auth.uid() = user_id);