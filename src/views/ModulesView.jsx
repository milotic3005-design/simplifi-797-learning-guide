import { useState } from "react";
import courses from "../data/courses.json";
import ModuleCard from "../components/ModuleCard";
import ProgressBar from "../components/ProgressBar";

// Bento layout hint per module — produces visual rhythm.
// 4-col grid; values are column spans on desktop.
const SPAN_HINTS = {
  1: 2,  // Fundamentals — large
  2: 2,  // Engineering — large
  3: 1,  // Personnel — small
  4: 1,  // Sampling — small
  5: 2,  // Sanitization
  6: 2,  // Aseptic
  7: 2,  // Sterilization
  8: 4,  // HD — featured wide
};

export default function ModulesView({
  completed,
  toggle,
  reset,
  onOpenLesson,
  lessonState,
}) {
  const totalCourses = courses.modules.reduce((n, m) => n + m.courses.length, 0);
  const completedCount = courses.modules.reduce(
    (n, m) => n + m.courses.filter((c) => completed[c.id]).length,
    0
  );
  const moduleCounts = courses.modules.map((m) => ({
    id: m.id,
    completed: m.courses.filter((c) => completed[c.id]).length,
    total: m.courses.length,
  }));
  const completedModules = moduleCounts.filter(
    (m) => m.completed === m.total
  ).length;

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Hero bento — overview */}
      <section className="bento" data-bento-stagger>
        <article className="glass b-2 p-6 sm:p-8 fade-up">
          <div className="eyebrow mb-3">A Learning Guide</div>
          <h1
            className="font-display text-3xl sm:text-4xl md:text-[44px] font-semibold leading-[1.05]"
            style={{ color: "var(--ink)" }}
          >
            USP <span style={{ color: "var(--info)" }}>797</span>{" "}
            sterile compounding,
            <br />
            paced for the working pharmacist.
          </h1>
          <p
            className="mt-4 max-w-md text-[15px] leading-relaxed"
            style={{ color: "var(--ink-2)" }}
          >
            Eight modules · twenty-eight courses · checklists, diagrams, and a
            survey-aligned readiness matrix.
          </p>
          <div className="mt-5 flex items-center gap-2 flex-wrap">
            <span
              className="chip"
              style={{ color: "var(--info)" }}
            >
              ◦ {courses.meta.subtitle}
            </span>
            <span
              className="chip"
              style={{ color: "var(--plum)" }}
            >
              v{courses.meta.version}
            </span>
          </div>
        </article>

        {/* Progress tile */}
        <article className="glass b-2 p-6 sm:p-7 flex flex-col justify-between min-h-[220px]">
          <div>
            <div className="eyebrow mb-3">Progress</div>
            <div
              className="font-display font-semibold leading-none tracking-tight"
              style={{
                fontSize: "clamp(56px, 9vw, 88px)",
                color: "var(--ink)",
              }}
            >
              <span className="font-num">{completedCount}</span>
              <span style={{ color: "var(--ink-3)", fontSize: "0.45em" }}>
                /{totalCourses}
              </span>
            </div>
            <div
              className="text-[13px] mt-1"
              style={{ color: "var(--ink-2)" }}
            >
              {completedModules}/{courses.meta.totalModules} chapters complete
            </div>
          </div>
          <div className="mt-5">
            <ProgressBar value={completedCount} total={totalCourses} compact />
            <div className="mt-3 flex items-center justify-between text-[11px]">
              <span style={{ color: "var(--ink-3)" }}>Saves locally</span>
              <button
                onClick={() => {
                  if (confirm("Clear all progress?")) reset();
                }}
                className="font-medium hover:underline"
                style={{ color: "var(--ink-2)" }}
              >
                Reset
              </button>
            </div>
          </div>
        </article>
      </section>

      {/* Module bento grid */}
      <section className="bento" data-bento-stagger>
        {courses.modules.map((m) => {
          const span = SPAN_HINTS[m.id] || 1;
          return (
            <ModuleCard
              key={m.id}
              module={m}
              completed={completed}
              onToggle={toggle}
              onOpenLesson={onOpenLesson}
              lessonState={lessonState}
              spanClass={`b-${span}`}
              featured={m.highPriority}
            />
          );
        })}
      </section>
    </div>
  );
}
