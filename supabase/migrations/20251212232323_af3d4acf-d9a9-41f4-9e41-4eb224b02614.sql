-- Create table for HALT lesson progress and reflections
CREATE TABLE public.halt_lesson_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  lesson_id TEXT NOT NULL, -- 'hungry', 'angry', 'lonely', 'tired'
  completed_at TIMESTAMP WITH TIME ZONE,
  quiz_responses JSONB DEFAULT '[]'::jsonb,
  quiz_score INTEGER,
  reflection_notes TEXT,
  self_assessment_rating INTEGER, -- 1-10 how much this trigger affects them
  exercise_steps_completed JSONB DEFAULT '[]'::jsonb, -- track individual exercise step completion
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, lesson_id)
);

-- Enable Row Level Security
ALTER TABLE public.halt_lesson_progress ENABLE ROW LEVEL SECURITY;

-- Users can only access their own progress
CREATE POLICY "Users can manage their own HALT progress"
ON public.halt_lesson_progress
FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_halt_lesson_progress_updated_at
BEFORE UPDATE ON public.halt_lesson_progress
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();