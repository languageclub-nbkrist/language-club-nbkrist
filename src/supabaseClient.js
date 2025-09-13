import { createClient } from '@supabase/supabase-js';

// Replace with your actual Supabase project URL and anon key
const supabaseUrl = 'https://urxsbymhvbzefqeiuotz.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVyeHNieW1odmJ6ZWZxZWl1b3R6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NzYxMjQ1MiwiZXhwIjoyMDczMTg4NDUyfQ.Bd1PhKEwBgmyjmq9HlsHwZzBuB190B1DXRgqxff2ZyQ';

// Create a single Supabase client for convenience
export const supabase = createClient(supabaseUrl, supabaseAnonKey);