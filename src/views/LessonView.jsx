import { useEffect, useMemo, useState } from "react";
import { lessonMap } from "../data/lessons";
import { lessonGraphics } from "../data/lessonGraphics";
import courses from "../data/courses.json";
import { cls } from "../themes";
import Graphic from "../components/graphics/Graphic";
import LessonGuidedTab from "./LessonGuidedTab";

const TABS = [
  { id: "guided", label: "Guided" },
  { id: "lesson", label: "Lesson" },
  { id: "terms", label: "Terms" },
  { id: "clinical", label: "Clinical" },
  { id: "self", label: "Self-Check" },
];

function findModule(courseId) {
  return courses.modules.find((m) => m.courses.some((c) => c.id === courseId));
}

function LessonTab({ lesson, theme }) {
  const c = cls(theme);
  const graphics = lessonGraphics[lesson.id] || [];
  const sectionCount = lesson.sections.length;
  const placements = {};
  if (graphics.length > 0) {
    placements[0] = [graphics[0]];
    if (graphics.length > 1) {
      const remaining = graphics.slice(1);
      const stride = Math.max(1, Math.floor(sectionCount / (remaining.length + 1)));
      remaining.forEach((g, i) => {
        const idx = Math.min(sectionCount - 1, (i + 1) * stride + 1);
        placements[idx] = placements[idx] || [];
        placements[idx].push(g);
      });
    }
  }

  return (
    <div className="space-y-6">
      {/* Objectives glass tile */}
      <div
        className="glass p-5 sm:p-6"
        style={{
          background: `radial-gradient(at 0% 0%, var(--plum-tint), transparent 70%), var(--glass-bg)`,
        }}
      >
        <div
          className="text-[10px] font-bold tracking-widest uppercase mb-3"
          style={{ color: "var(--plum)" }}
        >
          ¶ After this lesson you will
        </div>
        <ol className="space-y-2.5">
          {lesson.objectives.map((o, i) => (
            <li
              key={i}
              className="flex gap-3 text-[15px] leading-relaxed"
              style={{ color: "var(--ink)" }}
            >
              <span
                className="font-num text-[12px] mt-1 shrink-0 font-semibold"
                style={{ color: "var(--plum)" }}
              >
                {(i + 1).toString().padStart(2, "0")}
              </span>
              <span>{o}</span>
            </li>
          ))}
        </ol>
      </div>

      {/* Sections */}
      <article className="space-y-6">
        {lesson.sections.map((s, i) => (
          <section key={i} className="space-y-4 fade-in" style={{ animationDelay: `${i * 0.05}s` }}>
            {(placements[i] || []).map((gid) => (
              <Graphic key={gid} id={gid} accent={c.accent} />
            ))}
            <div className="glass p-5 sm:p-7">
              <div className="flex items-baseline gap-3 mb-2.5">
                <span
                  className="font-num text-[10px] font-bold tracking-widest uppercase"
                  style={{ color: "var(--ink-3)" }}
                >
                  § {(i + 1).toString().padStart(2, "0")}
                </span>
              </div>
              <h2
                className="font-display text-[22px] sm:text-[26px] font-semibold leading-tight tracking-tight mb-3"
                style={{ color: "var(--ink)" }}
              >
                {s.heading}
              </h2>
              <p
                className="text-[15.5px] leading-[1.7]"
                style={{ color: "var(--ink-2)", whiteSpace: "pre-line" }}
              >
                {s.body}
              </p>
            </div>
          </section>
        ))}
      </article>
    </div>
  );
}

function TermsTab({ lesson }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {lesson.keyTerms.map((kt, i) => (
        <div key={i} className="glass p-4 sm:p-5">
          <div
            className="font-display text-[16px] font-semibold mb-1.5 leading-tight"
            style={{ color: "var(--ink)" }}
          >
            {kt.term}
          </div>
          <div
            className="text-[14px] leading-relaxed"
            style={{ color: "var(--ink-2)" }}
          >
            {kt.definition}
          </div>
        </div>
      ))}
    </div>
  );
}

function ClinicalTab({ lesson, theme }) {
  const c = cls(theme);
  const ex = lesson.clinicalExample;
  return (
    <div className="space-y-4">
      <div
        className="glass p-5 sm:p-6"
        style={{
          background: `radial-gradient(at 0% 0%, ${c.tint}, transparent 70%), var(--glass-bg)`,
        }}
      >
        <div
          className="text-[10px] font-bold tracking-widest uppercase mb-3"
          style={{ color: c.accent }}
        >
          ¶ Scenario
        </div>
        <p
          className="font-display text-[18px] sm:text-[20px] leading-[1.45] font-medium"
          style={{ color: "var(--ink)" }}
        >
          {ex.scenario}
        </p>
      </div>
      <div className="glass p-5 sm:p-6">
        <div
          className="text-[10px] font-bold tracking-widest uppercase mb-3"
          style={{ color: "var(--ink-3)" }}
        >
          ¶ Analysis
        </div>
        <p
          className="text-[15px] leading-[1.7]"
          style={{ color: "var(--ink-2)" }}
        >
          {ex.analysis}
        </p>
      </div>
      <div
        className="glass p-5 sm:p-6"
        style={{
          background: `radial-gradient(at 100% 100%, var(--plum-tint), transparent 70%), var(--glass-bg)`,
        }}
      >
        <div
          className="text-[10px] font-bold tracking-widest uppercase mb-3"
          style={{ color: "var(--plum)" }}
        >
          ¶ Clinical takeaway
        </div>
        <p
          className="font-display text-[19px] sm:text-[22px] leading-tight font-semibold"
          style={{ color: "var(--ink)" }}
        >
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
      <div className="glass p-4 flex items-center justify-between">
        <div
          className="text-[10px] font-bold tracking-widest uppercase"
          style={{ color: "var(--ink-3)" }}
        >
          ¶ Self-check
        </div>
        <div
          className="font-num text-[12px] font-medium"
          style={{ color: "var(--ink-2)" }}
        >
          {revealedCount} / {total} revealed
        </div>
      </div>
      <ol className="space-y-3">
        {lesson.selfCheck.map((q, i) => {
          const isRevealed = !!revealed[i];
          return (
            <li key={i} className="glass p-5 sm:p-6">
              <div className="flex items-baseline gap-3 mb-3">
                <span
                  className="font-display font-bold text-[24px] leading-none"
                  style={{ color: "var(--ink-3)" }}
                >
                  {(i + 1).toString().padStart(2, "0")}
                </span>
                <span
                  className="text-[10px] font-bold tracking-widest uppercase"
                  style={{ color: "var(--ink-3)" }}
                >
                  Question {i + 1} of {total}
                </span>
              </div>
              <p
                className="font-display text-[17px] leading-snug font-medium mb-3"
                style={{ color: "var(--ink)" }}
              >
                {q.question}
              </p>
              {!isRevealed ? (
                <button
                  onClick={() => setRevealed((r) => ({ ...r, [i]: true }))}
                  className="btn-primary"
                >
                  Reveal answer →
                </button>
              ) : (
                <div
                  className="mt-2 p-4 r-md fade-in"
                  style={{
                    background: "var(--success-tint)",
                    border: "1px solid rgba(16,185,129,0.20)",
                  }}
                >
                  <div
                    className="text-[10px] font-bold tracking-widest uppercase mb-2"
                    style={{ color: "var(--success)" }}
                  >
                    Answer
                  </div>
                  <p
                    className="text-[15px] leading-relaxed mb-2.5"
                    style={{ color: "var(--ink)" }}
                  >
                    <span className="ink-highlight font-semibold">
                      {q.answer}
                    </span>
                  </p>
                  <p
                    className="text-[13.5px] leading-relaxed"
                    style={{ color: "var(--ink-2)" }}
                  >
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
  const [tab, setTab] = useState("guided");

  useEffect(() => {
    if (lesson) markStarted(courseId);
  }, [courseId, lesson, markStarted]);

  const c = useMemo(() => cls(module?.theme || "neutral"), [module]);

  if (!lesson) {
    return (
      <div className="space-y-4 fade-up">
        <button onClick={onBack} className="btn-ghost">
          ← Back
        </button>
        <div className="glass p-8" style={{ color: "var(--ink-2)" }}>
          No lesson content for {courseId}.
        </div>
      </div>
    );
  }

  const isComplete = !!completed[courseId];
  const state = lessonState[courseId] || {};

  return (
    <div className="space-y-6 fade-up">
      {/* Back */}
      <button onClick={onBack} className="btn-ghost">
        ← {module ? `Module ${module.number}` : "Back"}
      </button>

      {/* Header glass tile */}
      <header
        className="glass p-6 sm:p-8"
        style={{
          background: `radial-gradient(at 100% 0%, ${c.tint}, transparent 50%), var(--glass-bg)`,
        }}
      >
        <div className="flex items-center gap-2 mb-4 flex-wrap">
          {module && (
            <>
              <span
                className="chip"
                style={{ color: c.accent }}
              >
                {c.label} · Module {module.number}
              </span>
              <span
                className="chip font-num"
                style={{ color: "var(--ink-3)" }}
              >
                {lesson.id}
              </span>
            </>
          )}
          {state.started && (
            <span
              className="chip"
              style={{ color: "var(--ink-2)" }}
            >
              ◦ Started
            </span>
          )}
          {state.selfCheckComplete && (
            <span
              className="chip"
              style={{ color: "var(--info)" }}
            >
              ◦ Self-check
            </span>
          )}
          {isComplete && (
            <span
              className="chip"
              style={{ color: "var(--success)" }}
            >
              ✓ Complete
            </span>
          )}
        </div>
        <h1
          className="font-display text-3xl sm:text-4xl md:text-[44px] font-semibold leading-[1.05] tracking-tight"
          style={{ color: "var(--ink)" }}
        >
          {lesson.title}
        </h1>
      </header>

      {/* Sticky tabs */}
      <div className="sticky top-[60px] z-10 -mx-4 px-4 sm:-mx-6 sm:px-6 py-2">
        <nav className="tabs">
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
      </div>

      {/* Tab body */}
      <div>
        {tab === "guided" && (
          <LessonGuidedTab lesson={lesson} module={module} onTab={setTab} />
        )}
        {tab === "lesson" && (
          <LessonTab lesson={lesson} theme={module?.theme || "neutral"} />
        )}
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

      {/* Footer */}
      <div className="glass p-4 sm:p-5 flex items-center justify-between flex-wrap gap-3">
        <div className="text-[12px]" style={{ color: "var(--ink-3)" }}>
          Progress saves automatically.
        </div>
        <button
          onClick={() => setComplete(courseId, !isComplete)}
          className={isComplete ? "btn-ghost" : "btn-primary"}
        >
          {isComplete ? "✓ Marked complete" : "Mark lesson complete"}
        </button>
      </div>
    </div>
  );
}
