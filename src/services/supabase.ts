import { createClient } from '@supabase/supabase-js';

// ATENÇÃO: Em projetos Vite/Vercel, use import.meta.env em vez de process.env
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Create client only if keys exist
export const supabase = (supabaseUrl && supabaseKey) 
  ? createClient(supabaseUrl, supabaseKey) 
  : null;
