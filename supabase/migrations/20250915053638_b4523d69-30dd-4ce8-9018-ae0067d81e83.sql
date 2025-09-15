-- Create storage bucket for learning resources
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'learning-resources', 
  'learning-resources', 
  true,
  20971520, -- 20MB limit
  ARRAY['application/pdf', 'image/jpeg', 'image/png', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
);

-- Create policies for learning resources bucket
CREATE POLICY "Learning resources are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'learning-resources');

CREATE POLICY "Authenticated users can upload learning resources" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'learning-resources' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update their learning resources" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'learning-resources' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete their learning resources" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'learning-resources' AND auth.role() = 'authenticated');

-- Insert the new learning resources into the resources table
INSERT INTO public.resources (title, description, category, resource_type, file_url, tags, order_index) VALUES
(
  'Financial Foundations: A Roadmap to Stability in Recovery',
  'Comprehensive guide covering the recovery-finance connection, budgeting fundamentals, employment strategies, and building financial security during recovery. Essential reading for anyone in early to mid-stage recovery.',
  'ebook',
  'premium',
  'https://qnrgymppanngkpwsgqrx.supabase.co/storage/v1/object/public/learning-resources/Financial_Foundations_-_A_Roadmap_to_Stability_in_Recovery.pdf',
  ARRAY['recovery', 'financial stability', 'budgeting', 'employment', 'comprehensive guide'],
  1
),
(
  'A Revolutionary Approach to Sustainable Recovery',
  'White paper exploring financial empowerment as a key component of sustainable recovery. Discusses hidden challenges, life skills development, and innovative approaches to breaking the cycle of financial instability.',
  'whitepaper',
  'premium', 
  'https://qnrgymppanngkpwsgqrx.supabase.co/storage/v1/object/public/learning-resources/A_Revolutionary_Approach_to_Sustainable_Recovery_1.pdf',
  ARRAY['sustainable recovery', 'financial empowerment', 'life skills', 'innovation'],
  2
),
(
  'Sober Money Mindset Checklist',
  'Essential preparation checklist for your first meeting with a financial coach. Covers reflection questions, information gathering, commitment assessment, and expectation setting for successful coaching outcomes.',
  'checklist',
  'free',
  'https://qnrgymppanngkpwsgqrx.supabase.co/storage/v1/object/public/learning-resources/Sober_Money_Mindset_-_Checklist.pdf',
  ARRAY['coaching preparation', 'financial planning', 'self-assessment', 'goal setting'],
  3
),
(
  'Money Mindset Workbook',
  'Interactive workbook covering budgeting basics, banking fundamentals, savings strategies, and credit understanding. Includes worksheets, exercises, and practical tips for building financial confidence.',
  'workbook',
  'premium',
  'https://qnrgymppanngkpwsgqrx.supabase.co/storage/v1/object/public/learning-resources/Money_Mindset_Workbook.pdf',
  ARRAY['budgeting', 'banking', 'savings', 'credit', 'interactive exercises'],
  4
),
(
  'Personal Budget Worksheet',
  'Practical budget planning worksheet with income tracking, expense categorization, daily expense tracker, and goal-setting sections. Perfect for hands-on budget creation and management.',
  'worksheet',
  'free',
  'https://qnrgymppanngkpwsgqrx.supabase.co/storage/v1/object/public/learning-resources/R_W_-_Personal_Budget_Worksheet.pdf',
  ARRAY['budget planning', 'expense tracking', 'goal setting', 'practical tool'],
  5
);