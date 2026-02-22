-- Update Meditation for Financial Anxiety: change category to video
UPDATE public.resources 
SET category = 'video',
    description = 'Guided faceless meditation video for managing money-related stress and financial anxiety. Combines calming visuals with mindfulness techniques tailored for recovery.',
    tags = ARRAY['meditation', 'anxiety', 'stress', 'video', 'mindfulness'],
    updated_at = now()
WHERE id = '7d4e6cc2-315b-4297-820c-327d960c6b79';

-- Update Daily Money Mindset Worksheet: clarify as quick daily journal
UPDATE public.resources 
SET description = 'Quick one-page daily journal for tracking morning money intentions, gratitude, and spending awareness. Designed as a 5-minute daily ritual — distinct from the comprehensive Money Mindset Workbook.',
    tags = ARRAY['daily', 'journal', 'mindset', 'morning routine', 'quick'],
    updated_at = now()
WHERE id = '725e502c-7027-4d5d-96ce-1a35d511e055';

-- Update Expense Tracking Template: clarify as focused recovery-spending log
UPDATE public.resources 
SET description = 'Focused weekly/monthly expense log with categories specific to recovery spending (meetings, therapy, sober activities, self-care). A companion tracker to the broader Personal Budget Worksheet.',
    tags = ARRAY['expense tracking', 'recovery spending', 'weekly log', 'categories'],
    updated_at = now()
WHERE id = 'bd92b63d-9833-4a55-a139-218789d44286';