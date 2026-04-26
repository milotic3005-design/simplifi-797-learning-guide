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
    <div className="space-y-5">
      <div className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4">
        <ProgressBar value={completedCount} total={totalCourses} />
        <div className="mt-3 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span>
            {courses.meta.title} · {courses.meta.subtitle}
          </span>
          <button
            onClick={() => {
              if (confirm("Clear all progress?")) reset();
            }}
            className="underline hover:text-slate-700 dark:hover:text-slate-200"
          >
            Reset progress
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {courses.modules.map((m) => (
          <ModuleCard
            key={m.id}
            module={m}
            completed={completed}
            onToggle={toggle}
            onOpenLesson={onOpenLesson}
            lessonState={lessonState}
          />
        ))}
      </div>
    </div>
  );
}
