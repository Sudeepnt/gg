-- Clean up the contact_submissions table to match the new simplified UI

-- 1. Remove all existing test data (Optional: run this if you want to clear the table)
TRUNCATE TABLE contact_submissions;

-- 2. Drop the unused columns so Supabase is clean
ALTER TABLE contact_submissions DROP COLUMN IF EXISTS message;
ALTER TABLE contact_submissions DROP COLUMN IF EXISTS phone;
