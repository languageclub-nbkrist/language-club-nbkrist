import { createClient } from '@supabase/supabase-js';

// Replace with your actual Supabase project URL and anon key
const supabaseUrl = 'https://hjuunbqsrobjxbbnlwgu.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhqdXVuYnFzcm9ianhiYm5sd2d1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM2Mzk5NzQsImV4cCI6MjA2OTIxNTk3NH0.htFNNBBAWcgs9-B4HoKdR8O-gg4hC-yNztDPibGZPiM';

// Create a single Supabase client for convenience
export const supabase = createClient(supabaseUrl, supabaseAnonKey);