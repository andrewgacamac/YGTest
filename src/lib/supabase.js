
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://rjwaunghmcihpmockiap.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_2wpXUJklTjkVJGAJnb5Wqg_6DG55FRO';

console.log("Supabase Configuration Check:");
console.log("URL:", supabaseUrl ? supabaseUrl.substring(0, 15) + "..." : "MISSING");
console.log("Key:", supabaseAnonKey ? supabaseAnonKey.substring(0, 5) + "..." : "MISSING");

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Missing Supabase Environment Variables!");
}

// Safe initialization of Supabase client
let supabase = null;

try {
  if (supabaseUrl && supabaseAnonKey) {
    supabase = createClient(supabaseUrl, supabaseAnonKey);
  } else {
    console.error("Supabase keys are missing! Check your environment variables.");
  }
} catch (error) {
  console.error("Failed to initialize Supabase client:", error);
}

export { supabase };
