-- Update the file URLs to point to the public folder instead of storage
UPDATE public.resources 
SET file_url = '/learning-resources/Financial_Foundations_-_A_Roadmap_to_Stability_in_Recovery.pdf'
WHERE title = 'Financial Foundations: A Roadmap to Stability in Recovery';

UPDATE public.resources 
SET file_url = '/learning-resources/A_Revolutionary_Approach_to_Sustainable_Recovery_1.pdf'
WHERE title = 'A Revolutionary Approach to Sustainable Recovery';

UPDATE public.resources 
SET file_url = '/learning-resources/Sober_Money_Mindset_-_Checklist.pdf'
WHERE title = 'Sober Money Mindset Checklist';

UPDATE public.resources 
SET file_url = '/learning-resources/Money_Mindset_Workbook.pdf'
WHERE title = 'Money Mindset Workbook';

UPDATE public.resources 
SET file_url = '/learning-resources/R_W_-_Personal_Budget_Worksheet.pdf'
WHERE title = 'Personal Budget Worksheet';