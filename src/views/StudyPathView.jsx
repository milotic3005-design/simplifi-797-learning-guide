import data from "../data/study-path-and-exam-prep.json";
import { cls } from "../themes";

export default function StudyPathView() {
  const sp = data.studyPath;
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">
          {sp.title}
        </h2>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
          {sp.description}
        </p>
      </div>

      <div className="space-y-4">
        {sp.phases.map((p) => {
          const c = cls(p.theme);
          return (
            <div
              key={p.phase}
              className={`rounded-lg border bg-white dark:bg-slate-800 dark:border-slate-700 ${c.borderL} overflow-hidden`}
            >
              <div className="p-4">
                <div className="flex items-center gap-3 flex-wrap">
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-semibold ${c.badge}`}
                  >
                    Phase {p.phase}
                  </span>
                  <h3 className="font-semibold text-slate-900 dark:text-white">
                    {p.label}
                  </h3>
                </div>
                <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                  <div>
                    <div className="text-xs uppercase text-slate-500 dark:text-slate-400">
                      Modules
                    </div>
                    <div className="font-medium text-slate-900 dark:text-white">
                      {p.modules.join(", ")}
                    </div>
                    <div className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                      {p.moduleNames.join(" · ")}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs uppercase text-slate-500 dark:text-slate-400">
                      Courses
                    </div>
                    <div className="font-medium text-slate-900 dark:text-white">
                      {p.courseCount}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs uppercase text-slate-500 dark:text-slate-400">
                      Estimated hours
                    </div>
                    <div className="font-medium text-slate-900 dark:text-white">
                      {p.estimatedHours}
                    </div>
                  </div>
                </div>
                <p className="mt-3 text-sm text-slate-700 dark:text-slate-200">
                  {p.rationale}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="rounded-lg border border-purple-200 dark:border-purple-700 bg-purple-50 dark:bg-purple-900/30 p-4">
        <div className="text-xs font-semibold uppercase tracking-wide text-purple-700 dark:text-purple-200 mb-1">
          Study tip
        </div>
        <div className="text-sm text-slate-800 dark:text-slate-200">
          {sp.studyTip}
        </div>
      </div>
    </div>
  );
}
