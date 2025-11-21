import { createClient } from '@supabase/supabase-js';

// Using Vite environment variables (import.meta.env)
// VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY must be set in Vercel

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Create client only if keys exist
export const supabase = (supabaseUrl && supabaseKey) 
  ? createClient(supabaseUrl, supabaseKey) 
  : null;

/**
 * Helper to check if online mode is active
 */
export const isOnlineMode = () => {
  return !!supabase;
};