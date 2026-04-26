import { useState } from "react";
import { cls } from "../themes";
import { lessonMap } from "../data/lessons";

function Tabs({ tabs, active, onChange }) {
  return (
    <div className="flex gap-1 border-b border-slate-200 dark:border-slate-700 mb-4">
      {tabs.map((t) => (
        <button
          key={t.id}
          onClick={() => onChange(t.id)}
          className={`px-3 py-2 text-sm font-medium -mb-px border-b-2 transition-colors ${
            active === t.id
              ? "border-slate-900 dark:border-white text-slate-900 dark:text-white"
              : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
          }`}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}

export default function ModuleCard({ module, completed, onToggle, onOpenLesson, lessonState }) {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState("courses");
  const c = cls(module.theme);
  const completedCount = module.courses.filter((co) => completed[co.id]).length;
  const total = module.courses.length;
  const pct = Math.round((completedCount / total) * 100);

  return (
    <div
      className={`rounded-lg border bg-white dark:bg-slate-800 dark:border-slate-700 shadow-sm overflow-hidden ${
        module.highPriority ? "ring-2 ring-red-400 dark:ring-red-500" : ""
      }`}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-4 p-4 text-left hover:bg-slate-50 dark:hover:bg-slate-700/40 transition-colors"
      >
        <div
          className={`shrink-0 w-12 h-12 rounded-lg flex items-center justify-center font-semibold text-lg ${c.bg} ${c.text}`}
        >
          {module.number}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-semibold text-slate-900 dark:text-white">
              {module.title}
            </h3>
            <span className={`text-xs px-2 py-0.5 rounded-full ${c.badge}`}>
              {module.tag}
            </span>
            {module.highPriority && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-200 font-medium">
                High priority
              </span>
            )}
          </div>
          <div className="mt-1.5 flex items-center gap-3">
            <span className="text-sm text-slate-600 dark:text-slate-400 tabular-nums">
              {completedCount} / {total} completed
            </span>
            <div className="flex-1 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden max-w-[180px]">
              <div
                className={`${c.dot} h-full transition-all`}
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        </div>
        <svg
          className={`w-5 h-5 text-slate-400 transition-transform ${
            open ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="px-4 pb-4 pt-2 border-t border-slate-100 dark:border-slate-700">
          {module.highPriority && (
            <div className="mb-4 p-3 rounded border-l-4 border-red-500 bg-red-50 dark:bg-red-900/30 text-sm text-red-800 dark:text-red-200">
              <strong>High-priority module.</strong> Hazardous drug content overlays USP 800 and adds an additional safety layer over all preceding concepts.
            </div>
          )}

          <Tabs
            active={tab}
            onChange={setTab}
            tabs={[
              { id: "courses", label: "Courses" },
              { id: "concepts", label: "Key Concepts" },
              { id: "must", label: "Must Know" },
            ]}
          />

          {tab === "courses" && (
            <ul className="space-y-2">
              {module.courses.map((course) => {
                const done = !!completed[course.id];
                const hasLesson = !!lessonMap[course.id];
                const lstate = (lessonState && lessonState[course.id]) || {};
                return (
                  <li
                    key={course.id}
                    className="flex items-start gap-2 p-2.5 rounded hover:bg-slate-50 dark:hover:bg-slate-700/40 group"
                  >
                    <input
                      type="checkbox"
                      checked={done}
                      onChange={() => onToggle(course.id)}
                      onClick={(e) => e.stopPropagation()}
                      className="mt-1 h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-700 cursor-pointer"
                    />
                    <button
                      type="button"
                      onClick={() => hasLesson && onOpenLesson(course.id)}
                      disabled={!hasLesson}
                      className="min-w-0 flex-1 text-left disabled:cursor-default"
                    >
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs text-slate-400 tabular-nums">
                          {course.id}
                        </span>
                        {lstate.started && !done && (
                          <span className="text-[10px] uppercase tracking-wide px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                            in progress
                          </span>
                        )}
                      </div>
                      <span
                        className={`text-sm ${
                          done
                            ? "line-through text-slate-400 dark:text-slate-500"
                            : "text-slate-800 dark:text-slate-100"
                        } ${hasLesson ? "group-hover:underline" : ""}`}
                      >
                        {course.title}
                      </span>
                    </button>
                    {hasLesson && (
                      <svg
                        className="w-4 h-4 text-slate-400 mt-1.5 shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    )}
                  </li>
                );
              })}
            </ul>
          )}

          {tab === "concepts" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {module.keyConcepts.map((kc, i) => (
                <div
                  key={i}
                  className="p-3 rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/40"
                >
                  <div className="font-semibold text-sm text-slate-900 dark:text-white mb-1">
                    {kc.term}
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-300">
                    {kc.definition}
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab === "must" && (
            <div>
              <ul className="space-y-2 mb-4">
                {module.mustKnow.map((m, i) => (
                  <li
                    key={i}
                    className={`pl-3 py-2 ${c.borderL} bg-slate-50 dark:bg-slate-900/40 text-sm text-slate-800 dark:text-slate-200 rounded-r`}
                  >
                    {m}
                  </li>
                ))}
              </ul>
              <div className="p-4 rounded-lg border border-purple-200 dark:border-purple-700 bg-purple-50 dark:bg-purple-900/30">
                <div className="text-xs font-semibold uppercase tracking-wide text-purple-700 dark:text-purple-200 mb-1">
                  Clinical connection
                </div>
                <div className="text-sm text-slate-800 dark:text-slate-200">
                  {module.clinicalConnection}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
