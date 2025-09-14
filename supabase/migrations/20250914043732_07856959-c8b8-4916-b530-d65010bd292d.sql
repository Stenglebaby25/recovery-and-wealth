-- Create rewards table for available incentives
CREATE TABLE public.rewards (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  reward_type TEXT NOT NULL DEFAULT 'discount',
  points_required INTEGER NOT NULL DEFAULT 0,
  value TEXT, -- discount percentage, gift card amount, etc.
  category TEXT NOT NULL DEFAULT 'coaching',
  is_active BOOLEAN NOT NULL DEFAULT true,
  max_redemptions INTEGER, -- null means unlimited
  current_redemptions INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user rewards redemptions tracking
CREATE TABLE public.user_reward_redemptions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  reward_id UUID NOT NULL REFERENCES public.rewards(id),
  points_spent INTEGER NOT NULL,
  redeemed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  status TEXT NOT NULL DEFAULT 'pending',
  redemption_code TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_reward_redemptions ENABLE ROW LEVEL SECURITY;

-- RLS policies for rewards
CREATE POLICY "Everyone can view active rewards" 
ON public.rewards 
FOR SELECT 
USING (is_active = true);

-- RLS policies for user redemptions
CREATE POLICY "Users can view their own redemptions" 
ON public.user_reward_redemptions 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own redemptions" 
ON public.user_reward_redemptions 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Add updated_at trigger for rewards
CREATE TRIGGER update_rewards_updated_at
BEFORE UPDATE ON public.rewards
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample rewards
INSERT INTO public.rewards (title, description, reward_type, points_required, value, category) VALUES
('15% Coaching Discount', 'Get 15% off your next one-on-one coaching session', 'discount', 500, '15%', 'coaching'),
('Recovery Journal', 'Free premium recovery journal for daily reflection', 'physical_item', 300, 'Free Item', 'recovery_tools'),
('$25 Amazon Gift Card', 'Redeem points for a $25 Amazon gift card', 'gift_card', 1000, '$25', 'gift_cards'),
('Workshop Access', 'Free access to exclusive recovery workshop', 'workshop', 750, 'Free Access', 'education'),
('30% Coaching Discount', 'Get 30% off your next coaching package', 'discount', 1200, '30%', 'coaching'),
('Recovery Medallion', 'Celebrate your progress with a custom recovery medallion', 'physical_item', 400, 'Free Item', 'recovery_tools');