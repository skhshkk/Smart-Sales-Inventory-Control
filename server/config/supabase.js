import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Using Service Role Key for Admin-level access on backend

if (!supabaseUrl || !supabaseKey) {
  console.warn('Missing Supabase URL or Key. Make sure .env is set.');
}

export const supabase = createClient(supabaseUrl, supabaseKey);
