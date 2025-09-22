-- Create bills table for bill reminders and management
CREATE TABLE public.bills (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  bill_name TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  due_date DATE NOT NULL,
  frequency TEXT NOT NULL DEFAULT 'monthly',
  category TEXT NOT NULL DEFAULT 'utilities',
  is_paid BOOLEAN NOT NULL DEFAULT false,
  autopay_enabled BOOLEAN NOT NULL DEFAULT false,
  reminder_days INTEGER NOT NULL DEFAULT 3,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.bills ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can manage their own bills" 
ON public.bills 
FOR ALL 
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_bills_updated_at
BEFORE UPDATE ON public.bills
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();