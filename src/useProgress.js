import { useEffect, useState, useCallback } from "react";

const KEY = "simplifi797.progress.v1";
const LESSON_KEY = "simplifi797.lessonState.v1";

export function useProgress() {
  const [completed, setCompleted] = useState(() => {
    try {
      const raw = localStorage.getItem(KEY);
      return raw ? JSON.parse(raw) || {} : {};
    } catch {
      return {};
    }
  });

  const [lessonState, setLessonState] = useState(() => {
    try {
      const raw = localStorage.getItem(LESSON_KEY);
      return raw ? JSON.parse(raw) || {} : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(completed));
    } catch {
      /* ignore */
    }
  }, [completed]);

  useEffect(() => {
    try {
      localStorage.setItem(LESSON_KEY, JSON.stringify(lessonState));
    } catch {
      /* ignore */
    }
  }, [lessonState]);

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
  }, []);

  const updateLesson = useCallback((courseId, patch) => {
    setLessonState((s) => ({
      ...s,
      [courseId]: { ...(s[courseId] || {}), ...patch },
    }));
  }, []);

  const markStarted = useCallback(
    (courseId) => {
      const cur = lessonState[courseId];
      if (!cur || !cur.started) updateLesson(courseId, { started: true });
    },
    [lessonState, updateLesson]
  );

  return {
    completed,
    toggle,
    setComplete,
    reset,
    lessonState,
    updateLesson,
    markStarted,
  };
}
