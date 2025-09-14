-- Create user profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  subscription_status TEXT DEFAULT 'free' CHECK (subscription_status IN ('free', 'premium', 'enterprise')),
  subscription_expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create profiles policies
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create courses table for Learning Hub content
CREATE TABLE public.courses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  week_number INTEGER,
  subject TEXT,
  content_type TEXT DEFAULT 'premium' CHECK (content_type IN ('free', 'premium')),
  video_url TEXT,
  content TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on courses
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;

-- Course policies - free content visible to all, premium needs subscription
CREATE POLICY "Free courses viewable by everyone" 
ON public.courses 
FOR SELECT 
USING (content_type = 'free');

CREATE POLICY "Premium courses viewable by premium users" 
ON public.courses 
FOR SELECT 
USING (
  content_type = 'premium' AND 
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() 
    AND subscription_status IN ('premium', 'enterprise')
    AND (subscription_expires_at IS NULL OR subscription_expires_at > now())
  )
);

-- Create user progress tracking
CREATE TABLE public.user_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  completed BOOLEAN DEFAULT false,
  completion_date TIMESTAMP WITH TIME ZONE,
  progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, course_id)
);

-- Enable RLS on user_progress
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;

-- User progress policies
CREATE POLICY "Users can view their own progress" 
ON public.user_progress 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own progress" 
ON public.user_progress 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress" 
ON public.user_progress 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_courses_updated_at
  BEFORE UPDATE ON public.courses
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_progress_updated_at
  BEFORE UPDATE ON public.user_progress
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger to create profile when user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name)
  VALUES (
    NEW.id, 
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.email)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Insert initial course data (8-week program)
INSERT INTO public.courses (title, description, week_number, subject, content_type, order_index) VALUES
('Foundations of Financial Well-being', 'Why financial literacy is a key component of recovery. Defining wealth beyond money - peace of mind, stability, assets. Overcoming money shame and understanding your financial position.', 1, 'Introduction to Personal Finance & Mindset', 'premium', 1),
('Taking Control with a Budget', 'Using a spending plan as a tool for freedom, not restriction. Identifying spending triggers, needs vs. wants, and learning budgeting tech tools.', 2, 'Budgeting and Spending Habits', 'premium', 2),
('Building a Safety Net', 'The power of compound interest and why emergency funds are critical in recovery. Techniques for managing financial stress and anxiety.', 3, 'Saving and Emergency Funds', 'premium', 3),
('Understanding Debt and Credit', 'Differentiating good vs bad debt. Understanding credit scores and building repair strategies. Debt snowball vs. debt avalanche methods.', 4, 'Credit and Debt Management', 'premium', 4),
('Planning for the Future', 'Setting SMART financial goals. Basics of retirement accounts, investing principles, and protecting assets with insurance.', 5, 'Long-Term Financial Planning', 'premium', 5),
('Career & Income Growth', 'Essential job search skills, continuing education value, and basic tax understanding for personal and professional growth.', 6, 'Earning and Sustaining a Living', 'premium', 6),
('Mind Over Money', 'Recognizing impulsive spending behaviors, building positive financial habits, and using positive reinforcement for small wins.', 7, 'Psychology of Spending', 'premium', 7),
('Building a Support System', 'The role of financial coaching and supportive community in maintaining financial wellness. Creating your personalized financial recovery plan.', 8, 'Coaching and Community', 'premium', 8);