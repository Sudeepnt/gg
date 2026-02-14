-- Enable the Storage extension if not already enabled (usually enabled by default)
-- CREATE EXTENSION IF NOT EXISTS "storage";

-- 1. Create a new public bucket named 'uploads'
INSERT INTO storage.buckets (id, name, public)
VALUES ('uploads', 'uploads', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Set up security policies for the 'uploads' bucket
-- Allow public read access to all files
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'uploads' );

-- Allow anyone to upload files (For simplicity in this Admin context. Ideally restricted to authenticated users)
CREATE POLICY "Anyone can upload"
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'uploads' );

-- Allow anyone to update/delete their own files (or just anyone for this simple admin)
CREATE POLICY "Anyone can update"
ON storage.objects FOR UPDATE
USING ( bucket_id = 'uploads' );

CREATE POLICY "Anyone can delete"
ON storage.objects FOR DELETE
USING ( bucket_id = 'uploads' );
