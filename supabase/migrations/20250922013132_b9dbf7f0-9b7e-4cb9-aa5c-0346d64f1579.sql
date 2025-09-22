-- Create expenses table for tracking user spending
CREATE TABLE public.expenses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  category TEXT NOT NULL DEFAULT 'other',
  description TEXT,
  expense_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create spending limits table for alerts
CREATE TABLE public.spending_limits (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  category TEXT NOT NULL,
  monthly_limit DECIMAL(10,2) NOT NULL,
  alert_threshold DECIMAL(3,2) NOT NULL DEFAULT 0.80, -- Alert at 80% of limit
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, category)
);

-- Enable Row Level Security
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.spending_limits ENABLE ROW LEVEL SECURITY;

-- Create policies for expenses
CREATE POLICY "Users can manage their own expenses" 
ON public.expenses 
FOR ALL 
USING (auth.uid() = user_id);

-- Create policies for spending limits
CREATE POLICY "Users can manage their own spending limits" 
ON public.spending_limits 
FOR ALL 
USING (auth.uid() = user_id);

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_expenses_updated_at
BEFORE UPDATE ON public.expenses
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_spending_limits_updated_at
BEFORE UPDATE ON public.spending_limits
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();