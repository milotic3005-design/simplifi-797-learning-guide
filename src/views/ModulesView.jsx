import { useMemo } from "react";
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
  user,
  onOpenAuth,
}) {
  const { totalCourses, completedCount, completedModules } = useMemo(() => {
    // ⚡ Bolt: memoize expensive operations to avoid re-calculating progress stats
    // on every render when unrelated props change.
    const total = courses.modules.reduce((n, m) => n + m.courses.length, 0);
    const count = courses.modules.reduce(
      (n, m) => n + m.courses.filter((c) => completed[c.id]).length,
      0
    );
    const mCounts = courses.modules.map((m) => ({
      id: m.id,
      completed: m.courses.filter((c) => completed[c.id]).length,
      total: m.courses.length,
    }));
    const mCompleted = mCounts.filter((m) => m.completed === m.total).length;

    return { totalCourses: total, completedCount: count, completedModules: mCompleted };
  }, [completed]);

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Hero bento — overview */}
      <section className="bento" data-bento-stagger>
        <article className="glass b-2 p-6 sm:p-8 fade-up">
          <div className="eyebrow mb-3">{courses.meta.title}</div>
          <h1
            className="font-display text-3xl sm:text-4xl md:text-[44px] font-semibold leading-[1.05]"
            style={{ color: "var(--ink)" }}
          >
            Sterile compounding,
            <br />
            from <span style={{ color: "var(--info)" }}>first air</span> to final release.
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
              {user ? (
                <span style={{ color: "var(--success)" }}>☁ Syncing to account</span>
              ) : (
                <button
                  onClick={onOpenAuth}
                  className="font-semibold hover:underline"
                  style={{ color: "var(--info)" }}
                >
                  ↑ Sign in to sync
                </button>
              )}
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

      {/* ── Sign-in nudge (guests only) ── */}
      {!user && (
        <section className="fade-up">
          <div
            className="glass p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6"
            style={{
              background: "radial-gradient(at 0% 50%, var(--info-tint), transparent 60%), var(--glass-bg)",
              border: "1px solid rgba(99,102,241,0.18)",
            }}
          >
            {/* Icon */}
            <div
              className="shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center text-xl"
              style={{
                background: "linear-gradient(135deg, var(--info-2), var(--plum-2))",
                boxShadow: "0 4px 14px -4px rgba(99,102,241,0.45)",
              }}
            >
              ☁
            </div>

            {/* Text */}
            <div className="flex-1 min-w-0">
              <div className="font-display text-[17px] font-semibold mb-0.5" style={{ color: "var(--ink)" }}>
                Save your progress to the cloud
              </div>
              <p className="text-[13px] leading-relaxed" style={{ color: "var(--ink-2)" }}>
                Create a free account and your checkmarks sync across every device — phone, tablet, and desktop.
              </p>
            </div>

            {/* CTAs */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={onOpenAuth}
                className="btn-primary"
                style={{ whiteSpace: "nowrap" }}
              >
                Create free account
              </button>
              <button
                onClick={onOpenAuth}
                className="btn-ghost"
                style={{ whiteSpace: "nowrap" }}
              >
                Sign in
              </button>
            </div>
          </div>
        </section>
      )}

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
