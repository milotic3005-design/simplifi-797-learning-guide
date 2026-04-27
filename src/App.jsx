import React, { useEffect, useState, useMemo, useCallback } from "react";
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
  { id: "study", label: "Study Path" },
  { id: "exam", label: "Exam Prep" },
  { id: "compliance", label: "TJC Readiness" },
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

// ⚡ Bolt: Memoized Masthead to prevent re-rendering when unrelated progress state changes
// in App.jsx. Eliminates unnecessary main-thread work.
const Masthead = React.memo(function Masthead({ dark, setDark, inLesson, activeTab, onNav }) {
  // ⚡ Bolt: Memoize the date calculation to avoid re-calculating on every render.
  const today = useMemo(() => new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }), []);

  return (
    <header
      className="border-b"
      style={{ borderColor: "var(--rule)", background: "var(--paper)" }}
    >
      {/* Top metadata bar */}
      <div
        className="border-b text-[10px]"
        style={{ borderColor: "var(--rule-soft)" }}
      >
        <div className="max-w-6xl mx-auto px-6 py-2 flex items-center justify-between">
          <div className="flex items-center gap-4 smallcaps">
            <span>Vol. 1</span>
            <span style={{ color: "var(--rule)" }}>·</span>
            <span>{courses.meta.subtitle}</span>
            <span style={{ color: "var(--rule)" }} className="hidden sm:inline">·</span>
            <span className="hidden sm:inline">{today}</span>
          </div>
          <button
            onClick={() => setDark(!dark)}
            className="smallcaps hover:text-ink transition-colors"
            aria-label="Toggle dark mode"
          >
            {dark ? "Light ◦" : "Dark •"}
          </button>
        </div>
      </div>

      {/* Title block */}
      <div className="max-w-6xl mx-auto px-6 pt-8 pb-6 fade-up">
        <div className="flex items-baseline justify-between flex-wrap gap-4">
          <div>
            <div className="smallcaps mb-2">A Learning Guide for Pharmacists</div>
            <h1
              className="font-display text-5xl sm:text-6xl md:text-7xl font-light leading-[0.92] tracking-tight"
              style={{ fontVariationSettings: '"SOFT" 50, "WONK" 1' }}
            >
              Simplifi <span className="italic font-normal" style={{ fontVariationSettings: '"SOFT" 80, "WONK" 1' }}>797</span>
            </h1>
          </div>
          <div className="text-right hidden md:block">
            <div className="smallcaps">Issue №01</div>
            <div className="font-mono text-xs mt-1" style={{ color: "var(--ink-2)" }}>
              {courses.meta.totalCourses} courses · {courses.meta.totalModules} modules
            </div>
          </div>
        </div>
      </div>

      {/* Tab nav */}
      {!inLesson && (
        <div
          className="max-w-6xl mx-auto px-6 border-t"
          style={{ borderColor: "var(--rule)" }}
        >
          <nav className="flex gap-6 sm:gap-8 overflow-x-auto">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => onNav(t.id)}
                data-tab={t.id}
                // ⚡ Bolt: Use declarative prop binding instead of document.querySelectorAll
                // in a useEffect. Prevents synchronous DOM thrashing and bypasses manual mutations.
                data-active={activeTab === t.id}
                className="tab nav-tab"
              >
                {t.label}
              </button>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
});

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

  const handleNav = useCallback((newTab) => {
    setActiveLesson(null);
    setTab(newTab);
  }, [setActiveLesson]); // Ensure stable reference

  return (
    <div className="min-h-screen" style={{ background: "var(--paper)", color: "var(--ink)" }}>
      <Masthead dark={dark} setDark={setDark} inLesson={inLesson} activeTab={tab} onNav={handleNav} />

      <main className="max-w-6xl mx-auto px-6 py-10">
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

      <footer
        className="border-t mt-16"
        style={{ borderColor: "var(--rule)" }}
      >
        <div className="max-w-6xl mx-auto px-6 py-8 flex flex-wrap items-center justify-between gap-4 text-[11px]">
          <div className="smallcaps">
            {courses.meta.title} · v{courses.meta.version}
          </div>
          <div className="font-mono" style={{ color: "var(--ink-3)" }}>
            ¶ {courses.meta.totalCourses} courses · {courses.meta.totalModules} modules
          </div>
        </div>
      </footer>
    </div>
  );
}
