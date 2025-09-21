-- Create daily check-ins table for quick wellness tracking
CREATE TABLE public.daily_checkins (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  check_in_date DATE NOT NULL,
  mood_rating INTEGER NOT NULL CHECK (mood_rating >= 1 AND mood_rating <= 5),
  sobriety_status TEXT NOT NULL DEFAULT 'strong', -- 'strong', 'confident', 'challenged', 'struggling'
  spending_impulse_level INTEGER NOT NULL CHECK (spending_impulse_level >= 1 AND spending_impulse_level <= 5),
  energy_level INTEGER NOT NULL CHECK (energy_level >= 1 AND energy_level <= 5),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, check_in_date)
);

-- Enable RLS
ALTER TABLE public.daily_checkins ENABLE ROW LEVEL SECURITY;

-- Create policies for daily check-ins
CREATE POLICY "Users can manage their own daily check-ins" 
ON public.daily_checkins 
FOR ALL 
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_daily_checkins_updated_at
BEFORE UPDATE ON public.daily_checkins
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();