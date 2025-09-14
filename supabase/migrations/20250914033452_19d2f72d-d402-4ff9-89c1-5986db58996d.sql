-- Create habits tracking table
CREATE TABLE public.habits (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL DEFAULT 'financial',
  target_frequency INTEGER NOT NULL DEFAULT 1, -- daily target
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create habit completions table
CREATE TABLE public.habit_completions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  habit_id UUID NOT NULL REFERENCES public.habits(id) ON DELETE CASCADE,
  completed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create achievements table
CREATE TABLE public.achievements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  badge_icon TEXT NOT NULL,
  category TEXT NOT NULL,
  requirement_type TEXT NOT NULL, -- 'streak', 'total', 'milestone'
  requirement_value INTEGER NOT NULL,
  points INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user achievements table
CREATE TABLE public.user_achievements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  achievement_id UUID NOT NULL REFERENCES public.achievements(id) ON DELETE CASCADE,
  earned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create sponsors/mentors table
CREATE TABLE public.sponsors (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL, -- the person being sponsored
  sponsor_name TEXT NOT NULL,
  sponsor_email TEXT,
  sponsor_phone TEXT,
  relationship_type TEXT NOT NULL DEFAULT 'sponsor', -- 'sponsor', 'mentor', 'accountability_partner'
  program_type TEXT NOT NULL DEFAULT '12_step', -- '12_step', 'smart_recovery', 'other'
  connected_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create resource library table
CREATE TABLE public.resources (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL, -- 'worksheet', 'template', 'guide', 'video', 'audio'
  resource_type TEXT NOT NULL DEFAULT 'premium', -- 'free', 'premium'
  file_url TEXT,
  external_url TEXT,
  tags TEXT[],
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.habits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.habit_completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sponsors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;

-- RLS Policies for habits
CREATE POLICY "Users can manage their own habits" ON public.habits
FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for habit completions
CREATE POLICY "Users can manage their own habit completions" ON public.habit_completions
FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for achievements (everyone can view, only system can insert)
CREATE POLICY "Everyone can view achievements" ON public.achievements
FOR SELECT USING (true);

-- RLS Policies for user achievements
CREATE POLICY "Users can view their own achievements" ON public.user_achievements
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can earn achievements" ON public.user_achievements
FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for sponsors
CREATE POLICY "Users can manage their own sponsors" ON public.sponsors
FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for resources
CREATE POLICY "Free resources viewable by everyone" ON public.resources
FOR SELECT USING (resource_type = 'free');

CREATE POLICY "Premium resources viewable by premium users" ON public.resources
FOR SELECT USING (
  resource_type = 'premium' AND 
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.user_id = auth.uid() 
    AND profiles.subscription_status IN ('premium', 'enterprise')
    AND (profiles.subscription_expires_at IS NULL OR profiles.subscription_expires_at > now())
  )
);

-- Add triggers for updated_at
CREATE TRIGGER update_habits_updated_at
  BEFORE UPDATE ON public.habits
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_sponsors_updated_at
  BEFORE UPDATE ON public.sponsors
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_resources_updated_at
  BEFORE UPDATE ON public.resources
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert some sample achievements
INSERT INTO public.achievements (name, description, badge_icon, category, requirement_type, requirement_value, points) VALUES
('First Step', 'Complete your first lesson', 'Award', 'learning', 'total', 1, 10),
('Week Warrior', 'Complete lessons for 7 consecutive days', 'Flame', 'learning', 'streak', 7, 50),
('Money Master', 'Complete all 8 weeks of the program', 'Trophy', 'learning', 'total', 8, 200),
('Habit Builder', 'Complete daily habits for 30 days', 'Target', 'habits', 'streak', 30, 100),
('Resource Explorer', 'Download 5 resources from the library', 'BookOpen', 'resources', 'total', 5, 25);

-- Insert some sample resources
INSERT INTO public.resources (title, description, category, resource_type, tags) VALUES
('Daily Money Mindset Worksheet', 'Track your daily financial thoughts and emotions', 'worksheet', 'free', ARRAY['daily', 'mindset', 'tracking']),
('Expense Tracking Template', 'Simple spreadsheet for tracking recovery-related expenses', 'template', 'free', ARRAY['budgeting', 'expenses', 'template']),
('Advanced Debt Recovery Plan', 'Comprehensive guide for managing debt in early recovery', 'guide', 'premium', ARRAY['debt', 'planning', 'recovery']),
('Meditation for Financial Anxiety', 'Guided meditation specifically for money-related stress', 'audio', 'premium', ARRAY['meditation', 'anxiety', 'stress']);