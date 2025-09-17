-- Fix resource file URLs to point to correct public folder paths
UPDATE resources 
SET file_url = '/learning-resources/' || split_part(file_url, '/', -1)
WHERE file_url IS NOT NULL AND file_url LIKE '/learning-resources/%';