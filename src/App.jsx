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
import ComplianceView from "./views/ComplianceView";

const TABS = [
  { id: "modules", label: "Modules" },
  { id: "bud", label: "BUD" },
  { id: "iso", label: "ISO" },
  { id: "study", label: "Study" },
  { id: "exam", label: "Exam" },
  { id: "compliance", label: "TJC" },
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

function Header({ dark, setDark, tab, setTab, inLesson, onHome }) {
  return (
    <header className="sticky top-0 z-30 px-4 sm:px-6 pt-4 pb-3">
      <div className="max-w-6xl mx-auto">
        <div
          className="glass-strong px-3 py-2.5 sm:px-4 sm:py-3 flex items-center gap-3 sm:gap-4"
          style={{ borderRadius: 999 }}
        >
          {/* Brand — home button */}
          <button
            type="button"
            onClick={onHome}
            aria-label="Home"
            title="Home — back to modules"
            className="brand-home flex items-center gap-2.5 shrink-0 rounded-full -ml-1 pl-1 pr-2 py-0.5 transition-colors"
          >
            <div
              className="brand-badge w-8 h-8 rounded-full flex items-center justify-center text-[13px] font-bold text-white transition-transform"
              style={{
                background:
                  "linear-gradient(135deg, var(--info-2), var(--plum-2))",
                boxShadow:
                  "0 1px 0 rgba(255,255,255,0.4) inset, 0 4px 14px -4px rgba(99,102,241,0.5)",
              }}
            >
              S
            </div>
            <div className="hidden sm:block leading-tight text-left">
              <div
                className="font-display text-[15px] font-semibold tracking-tight"
                style={{ color: "var(--ink)" }}
              >
                Simplifi 797
              </div>
              <div className="text-[10px]" style={{ color: "var(--ink-3)" }}>
                {courses.meta.subtitle}
              </div>
            </div>
          </button>

          {/* Tabs */}
          {!inLesson && (
            <nav className="tabs ml-auto overflow-x-auto max-w-full">
              {TABS.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  data-active={tab === t.id}
                  className="tab"
                >
                  {t.label}
                </button>
              ))}
            </nav>
          )}

          {/* Dark toggle */}
          <button
            onClick={() => setDark(!dark)}
            aria-label="Toggle dark mode"
            className={`shrink-0 w-9 h-9 inline-flex items-center justify-center rounded-full hairline transition-colors ${
              inLesson ? "ml-auto" : ""
            }`}
            style={{ background: "var(--glass-bg)" }}
          >
            {dark ? (
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="4"/>
                <path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/>
              </svg>
            ) : (
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
              </svg>
            )}
          </button>
        </div>
      </div>
    </header>
  );
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

  const handleTab = (id) => {
    setActiveLesson(null);
    setTab(id);
  };

  const handleHome = () => {
    setActiveLesson(null);
    setTab("modules");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const inLesson = !!activeLesson;

  return (
    <div className="min-h-screen" style={{ color: "var(--ink)" }}>
      <Header
        dark={dark}
        setDark={setDark}
        tab={tab}
        setTab={handleTab}
        inLesson={inLesson}
        onHome={handleHome}
      />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
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
            {tab === "compliance" && <ComplianceView />}
          </>
        )}
      </main>

      <footer className="max-w-6xl mx-auto px-6 py-10 text-center">
        <div className="smallcaps">
          {courses.meta.title} · v{courses.meta.version} · {courses.meta.totalCourses} courses · {courses.meta.totalModules} modules
        </div>
      </footer>
    </div>
  );
}
