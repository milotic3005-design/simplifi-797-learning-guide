import { useEffect, useState } from "react";
import "./App.css";
import courses from "./data/courses.json";
import { useProgress } from "./useProgress";
import ModulesView from "./views/ModulesView";
import BudView from "./views/BudView";
import IsoView from "./views/IsoView";
import StudyPathView from "./views/StudyPathView";
import ExamPrepView from "./views/ExamPrepView";
import LessonView from "./views/LessonView";

const TABS = [
  { id: "modules", label: "Modules" },
  { id: "bud", label: "BUD Reference" },
  { id: "iso", label: "ISO Classification" },
  { id: "study", label: "Study Path" },
  { id: "exam", label: "Exam Prep" },
];

function useDarkMode() {
  const [dark, setDark] = useState(() => {
    const saved = localStorage.getItem("simplifi797.dark");
    if (saved !== null) return saved === "1";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });
  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("simplifi797.dark", dark ? "1" : "0");
  }, [dark]);
  return [dark, setDark];
}

export default function App() {
  const [tab, setTab] = useState("modules");
  const [activeLesson, setActiveLesson] = useState(null);
  const [dark, setDark] = useDarkMode();
  const {
    completed,
    toggle,
    setComplete,
    reset,
    lessonState,
    updateLesson,
    markStarted,
  } = useProgress();

  useEffect(() => {
    if (activeLesson) window.scrollTo({ top: 0, behavior: "instant" });
  }, [activeLesson]);

  const inLesson = !!activeLesson;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100">
      <header className="sticky top-0 z-10 backdrop-blur bg-white/80 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <div className="min-w-0">
            <div className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
              {courses.meta.subtitle}
            </div>
            <h1 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-white truncate">
              Simplifi 797 Learning Guide
            </h1>
          </div>
          <button
            onClick={() => setDark(!dark)}
            aria-label="Toggle dark mode"
            className="shrink-0 inline-flex items-center justify-center w-9 h-9 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            {dark ? (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>
        </div>
        {!inLesson && (
          <div className="max-w-5xl mx-auto px-4">
            <nav className="flex gap-1 overflow-x-auto -mb-px">
              {TABS.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={`px-3 py-2 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                    tab === t.id
                      ? "border-slate-900 dark:border-white text-slate-900 dark:text-white"
                      : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </nav>
          </div>
        )}
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6">
        {inLesson ? (
          <LessonView
            courseId={activeLesson}
            onBack={() => setActiveLesson(null)}
            completed={completed}
            setComplete={setComplete}
            lessonState={lessonState}
            updateLesson={updateLesson}
            markStarted={markStarted}
          />
        ) : (
          <>
            {tab === "modules" && (
              <ModulesView
                completed={completed}
                toggle={toggle}
                reset={reset}
                onOpenLesson={(id) => setActiveLesson(id)}
                lessonState={lessonState}
              />
            )}
            {tab === "bud" && <BudView />}
            {tab === "iso" && <IsoView />}
            {tab === "study" && <StudyPathView />}
            {tab === "exam" && <ExamPrepView />}
          </>
        )}
      </main>

      <footer className="max-w-5xl mx-auto px-4 py-6 text-center text-xs text-slate-500 dark:text-slate-500">
        {courses.meta.title} · v{courses.meta.version} · {courses.meta.totalCourses} courses across {courses.meta.totalModules} modules
      </footer>
    </div>
  );
}
