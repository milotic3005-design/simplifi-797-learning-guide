import { useEffect, useMemo, useState } from "react";
import { lessonMap } from "../data/lessons";
import courses from "../data/courses.json";
import { cls } from "../themes";

const TABS = [
  { id: "lesson", label: "Lesson" },
  { id: "terms", label: "Key Terms" },
  { id: "clinical", label: "Clinical Example" },
  { id: "self", label: "Self-Check" },
];

function findModule(courseId) {
  return courses.modules.find((m) => m.courses.some((c) => c.id === courseId));
}

function LessonTab({ lesson }) {
  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-purple-200 dark:border-purple-700 bg-purple-50 dark:bg-purple-900/30 p-4">
        <div className="text-xs font-semibold uppercase tracking-wide text-purple-700 dark:text-purple-200 mb-2">
          Learning objectives
        </div>
        <ul className="space-y-1.5 text-[15px] text-slate-800 dark:text-slate-100">
          {lesson.objectives.map((o, i) => (
            <li key={i} className="flex gap-2">
              <span className="text-purple-500 mt-0.5">•</span>
              <span>{o}</span>
            </li>
          ))}
        </ul>
      </div>

      <article className="space-y-6">
        {lesson.sections.map((s, i) => (
          <section key={i}>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              {s.heading}
            </h2>
            <p className="text-[15px] leading-[1.7] text-slate-700 dark:text-slate-200 whitespace-pre-line">
              {s.body}
            </p>
          </section>
        ))}
      </article>
    </div>
  );
}

function TermsTab({ lesson }) {
  return (
    <ul className="divide-y divide-slate-100 dark:divide-slate-700 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 overflow-hidden">
      {lesson.keyTerms.map((kt, i) => (
        <li key={i} className="p-4">
          <div className="font-semibold text-slate-900 dark:text-white text-[15px] mb-1">
            {kt.term}
          </div>
          <div className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            {kt.definition}
          </div>
        </li>
      ))}
    </ul>
  );
}

function ClinicalTab({ lesson, theme }) {
  const c = cls(theme);
  const ex = lesson.clinicalExample;
  return (
    <div className="space-y-4">
      <div className={`rounded-lg ${c.borderL} bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-4`}>
        <div className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-1">
          Scenario
        </div>
        <p className="text-[15px] leading-[1.7] text-slate-800 dark:text-slate-100">
          {ex.scenario}
        </p>
      </div>
      <div className="rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-4">
        <div className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-1">
          Analysis
        </div>
        <p className="text-[15px] leading-[1.7] text-slate-700 dark:text-slate-200">
          {ex.analysis}
        </p>
      </div>
      <div className="rounded-lg border border-purple-300 dark:border-purple-700 bg-purple-50 dark:bg-purple-900/30 p-4">
        <div className="text-xs font-semibold uppercase tracking-wide text-purple-700 dark:text-purple-200 mb-1">
          Clinical takeaway
        </div>
        <p className="text-[15px] leading-[1.6] font-semibold text-slate-900 dark:text-white">
          {ex.takeaway}
        </p>
      </div>
    </div>
  );
}

function SelfCheckTab({ lesson, courseId, lessonState, updateLesson }) {
  const [revealed, setRevealed] = useState({});

  const total = lesson.selfCheck.length;
  const revealedCount = Object.keys(revealed).filter((k) => revealed[k]).length;

  useEffect(() => {
    const allRevealed = revealedCount === total && total > 0;
    const cur = lessonState[courseId] || {};
    if (allRevealed && !cur.selfCheckComplete) {
      updateLesson(courseId, { selfCheckComplete: true });
    }
  }, [revealedCount, total, courseId, lessonState, updateLesson]);

  return (
    <div className="space-y-4">
      <div className="text-sm text-slate-600 dark:text-slate-300 tabular-nums">
        Revealed {revealedCount} / {total}
      </div>
      <ol className="space-y-4">
        {lesson.selfCheck.map((q, i) => {
          const isRevealed = !!revealed[i];
          return (
            <li
              key={i}
              className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 overflow-hidden"
            >
              <div className="p-4">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-1">
                  Question {i + 1} of {total}
                </div>
                <p className="text-[15px] leading-relaxed text-slate-900 dark:text-white">
                  {q.question}
                </p>
                {!isRevealed && (
                  <button
                    onClick={() =>
                      setRevealed((r) => ({ ...r, [i]: true }))
                    }
                    className="mt-3 inline-flex items-center px-3 py-1.5 rounded text-sm font-medium bg-slate-900 text-white hover:bg-slate-700 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200 transition-colors"
                  >
                    Reveal answer
                  </button>
                )}
              </div>
              {isRevealed && (
                <div className="border-l-4 border-green-500 bg-green-50 dark:bg-green-900/20 px-4 py-3">
                  <div className="text-xs font-semibold uppercase tracking-wide text-green-700 dark:text-green-300 mb-1">
                    Answer
                  </div>
                  <p className="text-[15px] text-slate-900 dark:text-white">
                    {q.answer}
                  </p>
                  <p className="mt-2 text-sm italic text-slate-600 dark:text-slate-300">
                    {q.explanation}
                  </p>
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}

export default function LessonView({
  courseId,
  onBack,
  completed,
  setComplete,
  lessonState,
  updateLesson,
  markStarted,
}) {
  const lesson = lessonMap[courseId];
  const module = findModule(courseId);
  const [tab, setTab] = useState("lesson");

  useEffect(() => {
    if (lesson) markStarted(courseId);
  }, [courseId, lesson, markStarted]);

  const c = useMemo(() => cls(module?.theme || "neutral"), [module]);

  if (!lesson) {
    return (
      <div className="space-y-4">
        <button
          onClick={onBack}
          className="text-sm text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
        >
          ← Back
        </button>
        <div className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 text-slate-700 dark:text-slate-200">
          No lesson content found for {courseId}.
        </div>
      </div>
    );
  }

  const isComplete = !!completed[courseId];
  const state = lessonState[courseId] || {};

  return (
    <div className="space-y-5">
      <button
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-sm text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to {module ? `Module ${module.number}` : "modules"}
      </button>

      <div>
        <div className="flex items-center gap-2 flex-wrap mb-2 text-xs">
          {module && (
            <span className={`px-2 py-0.5 rounded-full font-medium ${c.badge}`}>
              Module {module.number} · {module.title}
            </span>
          )}
          <span className="text-slate-400 tabular-nums">{lesson.id}</span>
          {state.started && (
            <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
              Started
            </span>
          )}
          {state.selfCheckComplete && (
            <span className="px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-200">
              Self-check done
            </span>
          )}
          {isComplete && (
            <span className="px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-200">
              Complete
            </span>
          )}
        </div>
        <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900 dark:text-white leading-tight">
          {lesson.title}
        </h1>
      </div>

      <div className="border-b border-slate-200 dark:border-slate-700 -mx-4 px-4 sticky top-[105px] bg-slate-50/95 dark:bg-slate-950/95 backdrop-blur z-[5]">
        <div className="flex gap-1 overflow-x-auto -mb-px">
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
        </div>
      </div>

      <div>
        {tab === "lesson" && <LessonTab lesson={lesson} />}
        {tab === "terms" && <TermsTab lesson={lesson} />}
        {tab === "clinical" && (
          <ClinicalTab lesson={lesson} theme={module?.theme || "neutral"} />
        )}
        {tab === "self" && (
          <SelfCheckTab
            lesson={lesson}
            courseId={courseId}
            lessonState={lessonState}
            updateLesson={updateLesson}
          />
        )}
      </div>

      <div className="pt-4 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between flex-wrap gap-3">
        <div className="text-xs text-slate-500 dark:text-slate-400">
          Progress is saved automatically.
        </div>
        <button
          onClick={() => setComplete(courseId, !isComplete)}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            isComplete
              ? "bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900/40 dark:text-green-200 dark:hover:bg-green-900/60"
              : "bg-slate-900 text-white hover:bg-slate-700 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
          }`}
        >
          {isComplete ? "✓ Lesson complete" : "Mark lesson complete"}
        </button>
      </div>
    </div>
  );
}
