# Supabase Setup Guide

This guide will help you set up the required Supabase database tables and storage buckets for the IT Manager image upload functionality.

## Prerequisites

- Supabase account
- Access to your Supabase project dashboard at: https://supabase.com/dashboard/project/mtfsrlsccbmrekzthvmw

## Setup Steps

### 1. Create Storage Bucket

1. Go to **Storage** in your Supabase dashboard
2. Click **New bucket**
3. Name it: `platform-assets`
4. Make it **Public** (so images can be accessed via public URLs)
5. Click **Create bucket**

### 2. Create Database Table

1. Go to **SQL Editor** in your Supabase dashboard
2. Click **New query**
3. Copy and paste the following SQL:

```sql
-- Create the uploaded_images table
CREATE TABLE uploaded_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('logo', 'icon', 'banner', 'other')),
  uploadedBy TEXT NOT NULL,
  uploadedAt TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE uploaded_images ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations (for demo purposes)
-- In production, you'd want more restrictive policies
CREATE POLICY "Allow all operations on uploaded_images"
  ON uploaded_images
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Create an index on uploadedAt for faster sorting
CREATE INDEX idx_uploaded_images_uploaded_at ON uploaded_images(uploadedAt DESC);
```

4. Click **Run** to execute the SQL

### 3. Verify Setup

1. Go to **Table Editor** and you should see the `uploaded_images` table
2. Go to **Storage** and you should see the `platform-assets` bucket

## Testing

1. Log in as **IT Manager** (username: `it.manager`, password: `Test@1234`)
2. Navigate to the IT Dashboard
3. Try uploading a test image
4. The image should appear in the gallery below the upload form

## Security Notes

**Important:** This setup is configured for demonstration purposes with open access policies. For a production environment, you should:

1. Implement proper Row Level Security (RLS) policies
2. Add authentication checks to ensure only IT Manager can upload/delete
3. Add file size and type validation
4. Implement rate limiting
5. Add audit logging for all uploads and deletions
6. Use environment variables for Supabase credentials (not hardcoded)

## Storage Bucket Policies

If you need to adjust the storage bucket policies:

1. Go to **Storage** > **Policies** for the `platform-assets` bucket
2. Add policies for:
   - Public read access: `SELECT` with `true`
   - Authenticated upload: `INSERT` with auth check
   - Authenticated delete: `DELETE` with auth check

## Troubleshooting

### Images not uploading
- Check that the `platform-assets` bucket exists and is public
- Verify the Supabase URL and anon key are correct in `/src/lib/supabase.ts`
- Check browser console for error messages

### Images not displaying
- Verify the storage bucket is set to public
- Check that the URLs in the database are accessible
- Try accessing an image URL directly in a browser

### Database errors
- Ensure the `uploaded_images` table was created successfully
- Verify RLS policies are in place
- Check the SQL Editor for any error messages

## Support

For issues with Supabase setup, refer to:
- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Storage Guide](https://supabase.com/docs/guides/storage)
- [Supabase Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
