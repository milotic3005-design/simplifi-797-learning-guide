import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Returns null if env vars are missing (app works in guest-only mode)
export const supabase =
  url && key && !url.startsWith("https://your-") ? createClient(url, key) : null;
