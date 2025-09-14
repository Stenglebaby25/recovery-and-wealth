-- Add advanced recovery-focused courses to the learning hub
INSERT INTO public.courses (title, description, week_number, subject, content_type, order_index) VALUES
('Emotional Regulation & Financial Triggers', 'Learn to identify and manage financial stress without compromising your recovery. Develop healthy coping strategies for money-related anxiety.', 9, 'Advanced Recovery Finance', 'premium', 9),
('Long-term Financial Planning in Recovery', 'Create 5-10 year financial goals that support your recovery journey. Build wealth while maintaining sobriety priorities.', 10, 'Advanced Recovery Finance', 'premium', 10),
('Credit Repair & Financial Redemption', 'Systematic approach to healing financial damage from active addiction. Rebuild credit and restore financial reputation.', 11, 'Advanced Recovery Finance', 'premium', 11),
('Career Development in Recovery', 'Build sustainable income streams that align with recovery values. Navigate workplace challenges while maintaining sobriety.', 12, 'Advanced Career Development', 'premium', 12),
('Healthy Money Boundaries', 'Establish financial boundaries with family and friends. Navigate lending, borrowing, and financial codependency in recovery.', 13, 'Advanced Relationships', 'premium', 13),
('Investment & Wealth Building', 'Advanced investment strategies for people in recovery. Build long-term wealth while avoiding financial gambling behaviors.', 14, 'Advanced Wealth Building', 'premium', 14),
('Recovery Emergency Fund Strategy', 'Build financial safety nets specific to recovery needs. Plan for treatment costs, sober living, and recovery-related expenses.', 15, 'Advanced Emergency Planning', 'premium', 15),
('Sponsor Financial Guidance Integration', 'How to incorporate financial topics into sponsor relationships. Money discussions in 12-step programs and recovery mentorship.', 16, 'Advanced Recovery Integration', 'premium', 16);

-- Add learning pathway categories
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS learning_pathway text DEFAULT 'foundation';

-- Update existing courses to be foundation level
UPDATE public.courses 
SET learning_pathway = 'foundation' 
WHERE week_number <= 8;

-- Update new advanced courses
UPDATE public.courses 
SET learning_pathway = 'advanced' 
WHERE week_number > 8;