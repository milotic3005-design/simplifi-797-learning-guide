import courses from "../data/courses.json";
import ModuleCard from "../components/ModuleCard";
import ProgressBar from "../components/ProgressBar";

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

  return (
    <div className="space-y-12">
      {/* Section header — Contents */}
      <section className="fade-up">
        <div className="flex items-baseline justify-between flex-wrap gap-6">
          <div>
            <div className="smallcaps mb-3">§ I — Contents</div>
            <h2
              className="font-display text-4xl sm:text-5xl font-light leading-none tracking-tight"
              style={{ fontVariationSettings: '"SOFT" 30, "WONK" 1' }}
            >
              The eight chapters
            </h2>
            <p
              className="mt-3 max-w-xl"
              style={{ color: "var(--ink-2)", lineHeight: 1.6 }}
            >
              A complete walkthrough of USP 797 sterile compounding — eight
              modules, twenty-eight courses, paced for the working pharmacist.
            </p>
          </div>
          <div className="w-full sm:w-80 fade-up-2">
            <ProgressBar value={completedCount} total={totalCourses} />
            <div className="mt-3 flex items-center justify-between">
              <span className="font-mono text-[11px]" style={{ color: "var(--ink-3)" }}>
                Progress saves locally
              </span>
              <button
                onClick={() => {
                  if (confirm("Clear all progress?")) reset();
                }}
                className="link smallcaps"
                style={{ color: "var(--ink-2)" }}
              >
                Reset
              </button>
            </div>
          </div>
        </div>
        <div className="rule mt-8" />
      </section>

      {/* Module list */}
      <section className="space-y-0">
        {courses.modules.map((m, i) => (
          <ModuleCard
            key={m.id}
            module={m}
            index={i}
            completed={completed}
            onToggle={toggle}
            onOpenLesson={onOpenLesson}
            lessonState={lessonState}
          />
        ))}
        <div className="rule" />
      </section>
    </div>
  );
}
