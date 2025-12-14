import { createClient } from "@jsr/supabase__supabase-js";

// Uses Vite env variables. Ensure these are set in your environment:
// VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  // Not throwing to avoid breaking local dev where env may not be set.
  // Operations will fail gracefully and be logged where used.
  console.warn("Supabase environment variables are not set: data persistence will be disabled.");
}

const supabase = createClient(SUPABASE_URL || "", SUPABASE_ANON_KEY || "");

export default supabase;
