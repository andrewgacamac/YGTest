
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

console.log("Supabase Configuration Check:");
console.log("URL:", supabaseUrl ? supabaseUrl.substring(0, 15) + "..." : "MISSING");
console.log("Key:", supabaseAnonKey ? supabaseAnonKey.substring(0, 5) + "..." : "MISSING");

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Missing Supabase Environment Variables!");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
