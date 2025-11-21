import { createClient } from '@supabase/supabase-js';

// Using process.env instead of import.meta.env to avoid type errors if vite types are missing
const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || '';

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