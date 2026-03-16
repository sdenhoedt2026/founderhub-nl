import { createClient } from '@supabase/supabase-js';

// Public anon key — safe to expose in the browser (read-only access)
const url = import.meta.env.VITE_SUPABASE_URL || 'https://nvrgxaqnubalwsbstemu.supabase.co';
const key = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im52cmd4YXFudWJhbHdzYnN0ZW11Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM2NDg3MTksImV4cCI6MjA4OTIyNDcxOX0.g2AQbDgbzaEeuKpEkGk-VdYgsRzON86Q0PcwZ9Po7GI';

export const supabase = createClient(url, key);
