-- =====================================================
-- Supabase Setup Script for IT Manager Image Management
-- =====================================================
-- Run this script in your Supabase SQL Editor
-- Project: https://supabase.com/dashboard/project/mtfsrlsccbmrekzthvmw
-- =====================================================

-- 1. Create the uploaded_images table
CREATE TABLE IF NOT EXISTS uploaded_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('logo', 'icon', 'banner', 'other')),
  "uploadedBy" TEXT NOT NULL,
  "uploadedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Enable Row Level Security
ALTER TABLE uploaded_images ENABLE ROW LEVEL SECURITY;

-- 3. Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Allow all operations on uploaded_images" ON uploaded_images;

-- 4. Create policy to allow all operations (for demo purposes)
-- In production, you'd want more restrictive policies based on user roles
CREATE POLICY "Allow all operations on uploaded_images"
  ON uploaded_images
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- 5. Create an index on uploadedAt for faster sorting
CREATE INDEX IF NOT EXISTS idx_uploaded_images_uploaded_at 
  ON uploaded_images("uploadedAt" DESC);

-- 6. Create an index on type for filtering
CREATE INDEX IF NOT EXISTS idx_uploaded_images_type 
  ON uploaded_images(type);

-- =====================================================
-- Verification Queries
-- =====================================================

-- Check if table was created
SELECT table_name 
FROM information_schema.tables 
WHERE table_name = 'uploaded_images';

-- Check table structure
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'uploaded_images'
ORDER BY ordinal_position;

-- Check policies
SELECT policyname, permissive, roles, cmd
FROM pg_policies
WHERE tablename = 'uploaded_images';

-- =====================================================
-- Storage Bucket Setup (Manual Steps Required)
-- =====================================================
-- 
-- After running this SQL script, you need to manually:
-- 
-- 1. Go to Storage in Supabase dashboard
-- 2. Create a new bucket named: platform-assets
-- 3. Make it PUBLIC so images can be accessed via URLs
-- 4. Click "Create bucket"
-- 
-- The storage bucket cannot be created via SQL, it must be done
-- through the Supabase dashboard UI.
-- =====================================================

-- =====================================================
-- Setup Complete!
-- =====================================================
-- 
-- Next steps:
-- 1. Create the storage bucket (see manual steps above)
-- 2. Login as IT Manager (username: it.manager)
-- 3. Test uploading an image
-- 4. Verify images appear in the gallery
-- =====================================================
