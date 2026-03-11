import { createClient } from '@supabase/supabase-js';

// Client-side Supabase (public read only)
export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);
