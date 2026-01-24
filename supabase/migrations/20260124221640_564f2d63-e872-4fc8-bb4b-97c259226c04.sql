-- Create user_learning_paths table to store quiz results and personalized recommendations
CREATE TABLE public.user_learning_paths (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  quiz_answers JSONB NOT NULL DEFAULT '{}',
  recommended_modules JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.user_learning_paths ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own learning path"
ON public.user_learning_paths
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own learning path"
ON public.user_learning_paths
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own learning path"
ON public.user_learning_paths
FOR UPDATE
USING (auth.uid() = user_id);

-- Create email_drip_queue table for scheduled email sequences
CREATE TABLE public.email_drip_queue (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  email TEXT NOT NULL,
  email_type TEXT NOT NULL CHECK (email_type IN ('foundations_complete', 'module_reminder', 'progress_nudge', 'milestone_celebration', 'reengagement')),
  scheduled_for TIMESTAMP WITH TIME ZONE NOT NULL,
  sent_at TIMESTAMP WITH TIME ZONE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed', 'cancelled')),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.email_drip_queue ENABLE ROW LEVEL SECURITY;

-- Only allow service role to manage email queue (edge functions)
CREATE POLICY "Service role can manage email queue"
ON public.email_drip_queue
FOR ALL
USING (auth.role() = 'service_role');

-- Create index for efficient queue processing
CREATE INDEX idx_email_drip_pending ON public.email_drip_queue (scheduled_for, status) WHERE status = 'pending';
CREATE INDEX idx_email_drip_user ON public.email_drip_queue (user_id);

-- Create trigger for updated_at on user_learning_paths
CREATE TRIGGER update_user_learning_paths_updated_at
BEFORE UPDATE ON public.user_learning_paths
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();