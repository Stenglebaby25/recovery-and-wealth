-- Create reviewer access codes table
CREATE TABLE public.reviewer_codes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  description TEXT,
  duration_days INTEGER NOT NULL DEFAULT 365,
  max_uses INTEGER DEFAULT NULL,
  current_uses INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT NULL
);

-- Enable RLS
ALTER TABLE public.reviewer_codes ENABLE ROW LEVEL SECURITY;

-- Admins can view all codes
CREATE POLICY "Admins can view all reviewer codes"
ON public.reviewer_codes
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_roles.user_id = auth.uid()
    AND user_roles.role = 'admin'
  )
);

-- Admins can create codes
CREATE POLICY "Admins can create reviewer codes"
ON public.reviewer_codes
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_roles.user_id = auth.uid()
    AND user_roles.role = 'admin'
  )
);

-- Admins can update codes
CREATE POLICY "Admins can update reviewer codes"
ON public.reviewer_codes
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_roles.user_id = auth.uid()
    AND user_roles.role = 'admin'
  )
);

-- Create index for faster lookups
CREATE INDEX idx_reviewer_codes_code ON public.reviewer_codes(code) WHERE is_active = true;

-- Add trigger to update updated_at
CREATE TRIGGER update_reviewer_codes_updated_at
  BEFORE UPDATE ON public.reviewer_codes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();