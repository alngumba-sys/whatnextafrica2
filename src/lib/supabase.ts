import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mtfsrlsccbmrekzthvmw.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im10ZnNybHNjY2JtcmVrenRodm13Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc5ODY4NDAsImV4cCI6MjA4MzU2Mjg0MH0.SdYC7G_lxFifJh8VLFpLjOZw5hPm_t0liv4xQJcHHGU';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types for our uploaded images
export interface UploadedImage {
  id: string;
  name: string;
  url: string;
  type: 'logo' | 'icon' | 'banner' | 'other';
  uploadedBy: string;
  uploadedAt: string;
}
