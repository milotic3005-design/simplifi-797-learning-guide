import { useEffect, useMemo, useState } from "react";
import { lessonMap } from "../data/lessons";
import { lessonGraphics } from "../data/lessonGraphics";
import courses from "../data/courses.json";
import { cls } from "../themes";
import Graphic from "../components/graphics/Graphic";

const TABS = [
  { id: "lesson", label: "Lesson" },
  { id: "terms", label: "Key Terms" },
  { id: "clinical", label: "Clinical" },
  { id: "self", label: "Self-Check" },
];

function findModule(courseId) {
  return courses.modules.find((m) => m.courses.some((c) => c.id === courseId));
}

function LessonTab({ lesson }) {
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
    <div className="space-y-10">
      {/* Objectives */}
      <div
        className="px-6 py-5"
        style={{
          background: "var(--plum-tint)",
          borderLeft: "3px solid var(--plum)",
        }}
      >
        <div className="smallcaps mb-3" style={{ color: "var(--plum)" }}>
          ¶ After this lesson you will
        </div>
        <ol className="space-y-2 list-none">
          {lesson.objectives.map((o, i) => (
            <li
              key={i}
              className="flex gap-3 text-[15px] leading-relaxed"
              style={{ color: "var(--ink)" }}
            >
              <span
                className="font-mono text-[11px] tabular-nums mt-1.5"
                style={{ color: "var(--plum)" }}
              >
                {(i + 1).toString().padStart(2, "0")}
              </span>
              <span>{o}</span>
            </li>
          ))}
        </ol>
      </div>

      {/* Sections — textbook prose */}
      <article className="space-y-12">
        {lesson.sections.map((s, i) => (
          <section key={i} className="fade-in" style={{ animationDelay: `${i * 0.04}s` }}>
            {(placements[i] || []).map((gid) => (
              <Graphic key={gid} id={gid} />
            ))}
            <div className="grid md:grid-cols-[180px_1fr] gap-4 md:gap-10">
              <div className="md:pt-2">
                <div className="smallcaps">
                  § {(i + 1).toString().padStart(2, "0")}
                </div>
              </div>
              <div>
                <h2
                  className="font-display text-2xl sm:text-3xl font-normal leading-tight tracking-tight mb-4"
                  style={{ fontVariationSettings: '"SOFT" 30, "WONK" 0' }}
                >
                  {s.heading}
                </h2>
                <p
                  className={`text-[16px] leading-[1.75] ${i === 0 ? "dropcap" : ""}`}
                  style={{
                    color: "var(--ink)",
                    whiteSpace: "pre-line",
                  }}
                >
                  {s.body}
                </p>
              </div>
            </div>
          </section>
        ))}
      </article>
    </div>
  );
}

function TermsTab({ lesson }) {
  return (
    <div>
      <div className="smallcaps mb-6">¶ Glossary</div>
      <dl className="space-y-0">
        {lesson.keyTerms.map((kt, i) => (
          <div
            key={i}
            className="grid md:grid-cols-[1fr_2fr] gap-3 md:gap-10 py-6 border-t"
            style={{ borderColor: "var(--rule)" }}
          >
            <dt
              className="font-display text-xl leading-tight"
              style={{ fontVariationSettings: '"SOFT" 30' }}
            >
              {kt.term}
            </dt>
            <dd
              className="text-[15.5px] leading-[1.7]"
              style={{ color: "var(--ink-2)" }}
            >
              {kt.definition}
            </dd>
          </div>
        ))}
        <div className="border-t" style={{ borderColor: "var(--rule)" }} />
      </dl>
    </div>
  );
}

function ClinicalTab({ lesson, theme }) {
  const c = cls(theme);
  const ex = lesson.clinicalExample;
  return (
    <div className="space-y-8">
      {/* Scenario */}
      <div>
        <div className="smallcaps mb-3" style={{ color: c.accent }}>
          Scenario
        </div>
        <div
          className="px-6 py-5 border-l-[3px]"
          style={{ borderColor: c.accent, background: c.tint }}
        >
          <p
            className="font-display text-lg sm:text-xl leading-[1.55] italic"
            style={{
              fontVariationSettings: '"SOFT" 60, "WONK" 1',
              color: "var(--ink)",
            }}
          >
            {ex.scenario}
          </p>
        </div>
      </div>

      {/* Analysis */}
      <div>
        <div className="smallcaps mb-3">Analysis</div>
        <p
          className="text-[16px] leading-[1.75]"
          style={{ color: "var(--ink)" }}
        >
          {ex.analysis}
        </p>
      </div>

      {/* Takeaway */}
      <div>
        <div className="smallcaps mb-3" style={{ color: "var(--plum)" }}>
          ¶ Clinical takeaway
        </div>
        <div
          className="px-6 py-6"
          style={{
            background: "var(--plum-tint)",
            borderLeft: "3px solid var(--plum)",
          }}
        >
          <p
            className="font-display text-xl sm:text-2xl leading-tight"
            style={{
              fontVariationSettings: '"SOFT" 40, "WONK" 1',
              color: "var(--ink)",
            }}
          >
            {ex.takeaway}
          </p>
        </div>
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
    <div className="space-y-0">
      <div className="flex items-baseline justify-between mb-6">
        <div className="smallcaps">¶ Self-check exam</div>
        <div className="font-mono text-xs tabular-nums" style={{ color: "var(--ink-2)" }}>
          {revealedCount} / {total} revealed
        </div>
      </div>
      <ol className="space-y-0">
        {lesson.selfCheck.map((q, i) => {
          const isRevealed = !!revealed[i];
          return (
            <li
              key={i}
              className="border-t py-7"
              style={{ borderColor: "var(--rule)" }}
            >
              <div className="grid md:grid-cols-[60px_1fr] gap-3 md:gap-8">
                <div
                  className="chapter-num text-3xl"
                  style={{ color: "var(--ink-3)" }}
                >
                  {(i + 1).toString().padStart(2, "0")}
                </div>
                <div>
                  <p
                    className="font-display text-lg leading-snug mb-3"
                    style={{ fontVariationSettings: '"SOFT" 30' }}
                  >
                    {q.question}
                  </p>
                  {!isRevealed ? (
                    <button
                      onClick={() => setRevealed((r) => ({ ...r, [i]: true }))}
                      className="btn-ghost"
                    >
                      Reveal answer →
                    </button>
                  ) : (
                    <div
                      className="mt-2 px-5 py-4 fade-in"
                      style={{
                        background: "var(--success-tint)",
                        borderLeft: "3px solid var(--success)",
                      }}
                    >
                      <div
                        className="smallcaps mb-2"
                        style={{ color: "var(--success)" }}
                      >
                        Answer
                      </div>
                      <p
                        className="text-[16px] leading-relaxed mb-3"
                        style={{ color: "var(--ink)" }}
                      >
                        <span className="ink-highlight font-medium">{q.answer}</span>
                      </p>
                      <p
                        className="text-[14.5px] leading-relaxed italic"
                        style={{ color: "var(--ink-2)" }}
                      >
                        {q.explanation}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </li>
          );
        })}
        <div className="border-t" style={{ borderColor: "var(--rule)" }} />
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
      <div className="space-y-6">
        <button onClick={onBack} className="btn-ghost">
          ← Back
        </button>
        <div className="px-6 py-10 hairline">
          <p style={{ color: "var(--ink-2)" }}>No lesson content for {courseId}.</p>
        </div>
      </div>
    );
  }

  const isComplete = !!completed[courseId];
  const state = lessonState[courseId] || {};

  return (
    <div className="space-y-10 fade-up">
      {/* Back link */}
      <button
        onClick={onBack}
        className="link smallcaps"
        style={{ color: "var(--ink-2)" }}
      >
        ← {module ? `Back to Module ${module.number}` : "Back"}
      </button>

      {/* Lesson header — newspaper article style */}
      <header
        className="border-t border-b py-10 grid md:grid-cols-[1fr_auto] gap-6 items-end"
        style={{ borderColor: "var(--ink)" }}
      >
        <div>
          <div className="flex items-center gap-3 mb-4 flex-wrap">
            {module && (
              <>
                <span
                  className="font-mono text-[10px] tracking-widest uppercase"
                  style={{ color: c.accent }}
                >
                  {c.label} · Module {module.number}
                </span>
                <span style={{ color: "var(--rule)" }}>·</span>
                <span
                  className="font-mono text-[10px] tracking-widest uppercase"
                  style={{ color: "var(--ink-3)" }}
                >
                  Course {lesson.id}
                </span>
              </>
            )}
          </div>
          <h1
            className="font-display text-4xl sm:text-5xl md:text-6xl font-light leading-[0.95] tracking-tight"
            style={{ fontVariationSettings: '"SOFT" 30, "WONK" 1' }}
          >
            {lesson.title}
          </h1>
          {(state.started || state.selfCheckComplete || isComplete) && (
            <div className="mt-5 flex items-center gap-3 flex-wrap">
              {state.started && (
                <span className="smallcaps" style={{ color: "var(--ink-3)" }}>
                  ◦ Started
                </span>
              )}
              {state.selfCheckComplete && (
                <span className="smallcaps" style={{ color: "var(--info)" }}>
                  ◦ Self-check done
                </span>
              )}
              {isComplete && (
                <span className="smallcaps" style={{ color: "var(--success)" }}>
                  ✓ Complete
                </span>
              )}
            </div>
          )}
        </div>
      </header>

      {/* Tabs */}
      <div
        className="sticky top-0 z-[5] -mx-6 px-6 py-3 border-b"
        style={{
          background: "color-mix(in srgb, var(--paper) 92%, transparent)",
          backdropFilter: "blur(8px)",
          borderColor: "var(--rule)",
        }}
      >
        <div className="flex gap-6 sm:gap-8 overflow-x-auto">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              data-active={tab === t.id}
              className="tab !py-2"
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Body */}
      <div className="max-w-3xl">
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

      {/* Footer — mark complete */}
      <div
        className="pt-8 border-t flex items-center justify-between flex-wrap gap-4"
        style={{ borderColor: "var(--rule)" }}
      >
        <div className="font-mono text-[11px]" style={{ color: "var(--ink-3)" }}>
          ¶ Progress saves automatically.
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
