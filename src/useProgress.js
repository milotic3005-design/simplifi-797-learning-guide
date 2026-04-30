import { useCallback, useEffect, useRef, useState } from "react";
import { supabase } from "./lib/supabase";

const LS_COMPLETED  = "simplifi797.progress.v1";
const LS_LESSON     = "simplifi797.lessonState.v1";

// ── localStorage helpers ──────────────────────────────────────
function readLocal() {
  try {
    const c = localStorage.getItem(LS_COMPLETED);
    const l = localStorage.getItem(LS_LESSON);
    return {
      completed:   c ? JSON.parse(c) || {} : {},
      lessonState: l ? JSON.parse(l) || {} : {},
    };
  } catch {
    return { completed: {}, lessonState: {} };
  }
}

// ── Supabase helpers ──────────────────────────────────────────
async function loadCloud(userId) {
  if (!supabase || !userId) return null;
  const { data } = await supabase
    .from("user_progress")
    .select("completed, lesson_state")
    .eq("id", userId)
    .maybeSingle();
  return data; // null if no row yet
}

async function saveCloud(userId, completed, lessonState) {
  if (!supabase || !userId) return;
  await supabase.from("user_progress").upsert(
    { id: userId, completed, lesson_state: lessonState, updated_at: new Date().toISOString() },
    { onConflict: "id" }
  );
}

// ── hook ──────────────────────────────────────────────────────
export function useProgress(userId) {
  const init = readLocal();
  const [completed,   setCompleted]   = useState(init.completed);
  const [lessonState, setLessonState] = useState(init.lessonState);
  const syncTimer = useRef(null);
  const prevUser  = useRef(null);

  // When user signs in: load cloud data, merge with local, push merged back
  useEffect(() => {
    if (!userId || userId === prevUser.current) return;
    prevUser.current = userId;

    loadCloud(userId).then((cloud) => {
      setCompleted((local) => {
        const merged = { ...(cloud?.completed || {}), ...local };
        return merged;
      });
      setLessonState((local) => {
        const cloudLesson = cloud?.lesson_state || {};
        const allIds = new Set([...Object.keys(cloudLesson), ...Object.keys(local)]);
        const merged = {};
        for (const id of allIds) {
          merged[id] = { ...(cloudLesson[id] || {}), ...(local[id] || {}) };
        }
        return merged;
      });
    });
  }, [userId]);

  // Persist to localStorage on every change
  useEffect(() => {
    try { localStorage.setItem(LS_COMPLETED, JSON.stringify(completed)); } catch {}
  }, [completed]);

  useEffect(() => {
    try { localStorage.setItem(LS_LESSON, JSON.stringify(lessonState)); } catch {}
  }, [lessonState]);

  // Debounced cloud save (1.5 s after last change)
  useEffect(() => {
    if (!userId) return;
    clearTimeout(syncTimer.current);
    syncTimer.current = setTimeout(() => {
      saveCloud(userId, completed, lessonState);
    }, 1500);
    return () => clearTimeout(syncTimer.current);
  }, [userId, completed, lessonState]);

  // ── actions ──
  const toggle = useCallback((courseId) => {
    setCompleted((c) => {
      const next = { ...c };
      if (next[courseId]) delete next[courseId];
      else next[courseId] = true;
      return next;
    });
  }, []);

  const setComplete = useCallback((courseId, value) => {
    setCompleted((c) => {
      const next = { ...c };
      if (value) next[courseId] = true;
      else delete next[courseId];
      return next;
    });
  }, []);

  const reset = useCallback(() => {
    setCompleted({});
    setLessonState({});
    if (userId) saveCloud(userId, {}, {});
  }, [userId]);

  const updateLesson = useCallback((courseId, patch) => {
    setLessonState((s) => ({
      ...s,
      [courseId]: { ...(s[courseId] || {}), ...patch },
    }));
  }, []);

  const markStarted = useCallback((courseId) => {
    setLessonState((s) => {
      if (s[courseId]?.started) return s;
      return { ...s, [courseId]: { ...(s[courseId] || {}), started: true } };
    });
  }, []);

  return { completed, toggle, setComplete, reset, lessonState, updateLesson, markStarted };
}
