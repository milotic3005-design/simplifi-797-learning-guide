import { useState } from "react";
import data from "../data/study-path-and-exam-prep.json";

function PriorityBadge({ priority }) {
  const isCritical = priority === "critical";
  return (
    <span
      className={`text-xs px-2 py-0.5 rounded-full font-semibold uppercase tracking-wide ${
        isCritical
          ? "bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-200"
          : "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-200"
      }`}
    >
      {priority}
    </span>
  );
}

function Accordion({ category, open, onToggle }) {
  return (
    <div className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-50 dark:hover:bg-slate-700/40 transition-colors"
      >
        <div className="flex items-center gap-3 flex-wrap">
          <h3 className="font-semibold text-slate-900 dark:text-white">
            {category.category}
          </h3>
          <PriorityBadge priority={category.priority} />
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
        <div className="px-4 pb-4 border-t border-slate-100 dark:border-slate-700">
          <ul className="mt-3 space-y-2">
            {category.items.map((item, i) => (
              <li
                key={i}
                className="text-sm text-slate-700 dark:text-slate-200 flex gap-2"
              >
                <span className="text-slate-400 mt-0.5">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default function ExamPrepView() {
  const [openIdx, setOpenIdx] = useState(0);
  const ep = data.examPrep;
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">
          {ep.title}
        </h2>
      </div>

      <div className="space-y-3">
        {ep.categories.map((cat, i) => (
          <Accordion
            key={i}
            category={cat}
            open={openIdx === i}
            onToggle={() => setOpenIdx(openIdx === i ? -1 : i)}
          />
        ))}
      </div>

      <div>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
          Mnemonics
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {data.mnemonics.map((m, i) => (
            <div
              key={i}
              className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4"
            >
              <div className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-1">
                {m.topic}
              </div>
              <div className="font-mono font-bold text-slate-900 dark:text-white text-sm mb-2">
                {m.mnemonic}
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-300">
                {m.detail}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
          Common surveyor findings
        </h3>
        <ol className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 divide-y divide-slate-100 dark:divide-slate-700">
          {data.commonSurveyorFindings.map((f, i) => (
            <li key={i} className="flex items-start gap-3 p-3 text-sm">
              <span className="shrink-0 inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold tabular-nums">
                {i + 1}
              </span>
              <span className="text-slate-800 dark:text-slate-100">{f}</span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
