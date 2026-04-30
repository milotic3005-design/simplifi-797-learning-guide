import { createClient } from "@supabase/supabase-js";

// These are the public (anon) credentials — safe to ship in the browser.
// Security is enforced by Row-Level Security policies on the database.
const url =
  import.meta.env.VITE_SUPABASE_URL ||
  "https://mpuqbracpyjryajjwjmk.supabase.co";

const key =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1wdXFicmFjcHlqcnlhamp3am1rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc1MDE4MTUsImV4cCI6MjA5MzA3NzgxNX0.zcX9HE0xd5OhNOjb1He3Ymz-Xj230UPVPM0JdxH5pyA";

export const supabase = createClient(url, key);
