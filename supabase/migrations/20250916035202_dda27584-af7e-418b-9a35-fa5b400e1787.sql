-- Enhanced course structure for rich interactive content
-- Add lesson content types and structure
CREATE TABLE IF NOT EXISTS public.lessons (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id UUID NOT NULL,
  lesson_number INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  content_type TEXT NOT NULL DEFAULT 'mixed', -- video, text, interactive, quiz, mixed
  video_url TEXT,
  video_duration INTEGER, -- in seconds
  presentation_slides JSONB, -- array of slide objects
  text_content TEXT,
  interactive_elements JSONB, -- exercises, worksheets, etc
  quiz_questions JSONB,
  estimated_duration INTEGER NOT NULL DEFAULT 30, -- in minutes
  order_index INTEGER NOT NULL DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT true,
  prerequisites TEXT[], -- array of prerequisite lesson ids
  learning_objectives TEXT[],
  resources JSONB, -- downloadable resources, links, etc
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enhanced user progress tracking for lessons
CREATE TABLE IF NOT EXISTS public.user_lesson_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  lesson_id UUID NOT NULL,
  course_id UUID NOT NULL,
  status TEXT NOT NULL DEFAULT 'not_started', -- not_started, in_progress, completed
  progress_percentage INTEGER NOT NULL DEFAULT 0,
  time_spent INTEGER NOT NULL DEFAULT 0, -- in seconds
  video_progress INTEGER DEFAULT 0, -- video watch progress in seconds
  quiz_score INTEGER, -- percentage score if quiz completed
  notes TEXT, -- user notes for the lesson
  bookmarks JSONB, -- timestamps and notes for bookmarks
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  last_accessed TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, lesson_id)
);

-- Course modules/sections for better organization
CREATE TABLE IF NOT EXISTS public.course_modules (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id UUID NOT NULL,
  module_number INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  learning_objectives TEXT[],
  estimated_duration INTEGER, -- total duration in minutes
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add module reference to lessons
ALTER TABLE public.lessons ADD COLUMN IF NOT EXISTS module_id UUID;

-- Enable RLS on new tables
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_modules ENABLE ROW LEVEL SECURITY;

-- RLS Policies for lessons
CREATE POLICY "Free lessons viewable by everyone" 
ON public.lessons 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.courses 
    WHERE courses.id = lessons.course_id 
    AND courses.content_type = 'free'
  )
);

CREATE POLICY "Premium lessons viewable by premium users" 
ON public.lessons 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.courses 
    WHERE courses.id = lessons.course_id 
    AND courses.content_type = 'premium'
    AND EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.user_id = auth.uid() 
      AND profiles.subscription_status = ANY (ARRAY['premium'::text, 'enterprise'::text])
      AND (profiles.subscription_expires_at IS NULL OR profiles.subscription_expires_at > now())
    )
  )
);

-- RLS Policies for user lesson progress
CREATE POLICY "Users can manage their own lesson progress" 
ON public.user_lesson_progress 
FOR ALL 
USING (auth.uid() = user_id);

-- RLS Policies for course modules
CREATE POLICY "Free course modules viewable by everyone" 
ON public.course_modules 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.courses 
    WHERE courses.id = course_modules.course_id 
    AND courses.content_type = 'free'
  )
);

CREATE POLICY "Premium course modules viewable by premium users" 
ON public.course_modules 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.courses 
    WHERE courses.id = course_modules.course_id 
    AND courses.content_type = 'premium'
    AND EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.user_id = auth.uid() 
      AND profiles.subscription_status = ANY (ARRAY['premium'::text, 'enterprise'::text])
      AND (profiles.subscription_expires_at IS NULL OR profiles.subscription_expires_at > now())
    )
  )
);

-- Add triggers for updated_at
CREATE TRIGGER update_lessons_updated_at
  BEFORE UPDATE ON public.lessons
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_lesson_progress_updated_at
  BEFORE UPDATE ON public.user_lesson_progress
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_course_modules_updated_at
  BEFORE UPDATE ON public.course_modules
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample 8-week financial recovery course structure
INSERT INTO public.course_modules (course_id, module_number, title, description, learning_objectives, estimated_duration, order_index)
SELECT 
  c.id,
  1,
  'Foundation & Assessment',
  'Understanding your relationship with money and substances',
  ARRAY['Assess current financial situation', 'Understand addiction costs', 'Set recovery goals'],
  120,
  1
FROM public.courses c 
WHERE c.title ILIKE '%financial recovery%' OR c.learning_pathway = 'foundation'
LIMIT 1;

-- Add sample lessons for Week 1
INSERT INTO public.lessons (course_id, module_id, lesson_number, title, description, content_type, estimated_duration, learning_objectives, order_index)
SELECT 
  c.id,
  m.id,
  1,
  'Your Financial Recovery Journey Begins',
  'Welcome to your 8-week transformation. Learn the true cost of addiction and discover your potential.',
  'mixed',
  45,
  ARRAY['Calculate personal addiction costs', 'Identify financial goals', 'Create accountability system'],
  1
FROM public.courses c
JOIN public.course_modules m ON m.course_id = c.id
WHERE m.module_number = 1
LIMIT 1;