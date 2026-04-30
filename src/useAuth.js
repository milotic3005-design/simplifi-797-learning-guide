import { useEffect, useState } from "react";
import { supabase } from "./lib/supabase";

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    // Get current session on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Subscribe to future auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email, password) => {
    if (!supabase) return { message: "Auth not configured." };
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return error ?? null;
  };

  const signUp = async (email, password) => {
    if (!supabase) return { message: "Auth not configured." };
    const { error } = await supabase.auth.signUp({ email, password });
    return error ?? null;
  };

  const signOut = async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
  };

  return { user, loading, signIn, signUp, signOut };
}
