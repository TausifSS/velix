import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseServiceKey);

if (!isSupabaseConfigured) {
  console.warn('WARNING: SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is not defined.');
}

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseServiceKey)
  : null;
