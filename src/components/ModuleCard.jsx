import { useState } from "react";
import { cls } from "../themes";
import { lessonMap } from "../data/lessons";

function Tabs({ tabs, active, onChange }) {
  return (
    <div
      className="flex gap-6 border-b mb-6"
      style={{ borderColor: "var(--rule)" }}
    >
      {tabs.map((t) => (
        <button
          key={t.id}
          onClick={() => onChange(t.id)}
          data-active={active === t.id}
          className="tab"
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}

export default function ModuleCard({
  module,
  index,
  completed,
  onToggle,
  onOpenLesson,
  lessonState,
}) {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState("courses");
  const c = cls(module.theme);
  const completedCount = module.courses.filter((co) => completed[co.id]).length;
  const total = module.courses.length;
  const isComplete = completedCount === total;

  return (
    <article
      className="border-t fade-up"
      style={{
        borderColor: "var(--rule)",
        animationDelay: `${index * 0.04}s`,
      }}
    >
      {/* Chapter row */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full text-left py-7 group"
      >
        <div className="grid grid-cols-[80px_1fr_auto] sm:grid-cols-[120px_1fr_auto] gap-4 sm:gap-6 items-baseline">
          {/* Chapter number */}
          <div
            className="chapter-num text-5xl sm:text-7xl"
            style={{ color: c.accent }}
          >
            {module.number}
          </div>

          {/* Title block */}
          <div>
            <div className="flex items-center gap-3 mb-1.5 flex-wrap">
              <span
                className="font-mono text-[10px] tracking-widest uppercase"
                style={{ color: c.accent }}
              >
                {c.label}
              </span>
              <span style={{ color: "var(--rule)" }}>·</span>
              <span className="font-mono text-[10px] tracking-widest uppercase" style={{ color: "var(--ink-3)" }}>
                {module.tag}
              </span>
              {module.highPriority && (
                <>
                  <span style={{ color: "var(--rule)" }}>·</span>
                  <span
                    className="font-mono text-[10px] tracking-widest uppercase"
                    style={{ color: "var(--danger)" }}
                  >
                    ※ Critical
                  </span>
                </>
              )}
            </div>
            <h3
              className="font-display text-2xl sm:text-3xl font-normal leading-tight tracking-tight"
              style={{ fontVariationSettings: '"SOFT" 30, "WONK" 0' }}
            >
              {module.title}
            </h3>
          </div>

          {/* Status */}
          <div className="text-right">
            <div className="font-mono text-xs tabular-nums" style={{ color: "var(--ink-2)" }}>
              {completedCount.toString().padStart(2, "0")} / {total.toString().padStart(2, "0")}
            </div>
            <div className="smallcaps mt-1" style={{ color: isComplete ? "var(--success)" : "var(--ink-3)" }}>
              {isComplete ? "Complete" : open ? "Close ↑" : "Read ↓"}
            </div>
          </div>
        </div>
      </button>

      {open && (
        <div className="pb-10 pt-2 fade-in">
          {module.highPriority && (
            <div
              className="mb-6 px-5 py-4 text-sm"
              style={{
                background: "var(--danger-tint)",
                borderLeft: "3px solid var(--danger)",
                color: "var(--ink)",
              }}
            >
              <div className="smallcaps mb-1" style={{ color: "var(--danger)" }}>
                ※ High-priority module
              </div>
              Hazardous-drug content overlays USP 800 on top of all preceding concepts.
              Approach this chapter only after the prior modules are solid.
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
            <ol className="space-y-0 -mt-2">
              {module.courses.map((course, i) => {
                const done = !!completed[course.id];
                const hasLesson = !!lessonMap[course.id];
                const lstate = (lessonState && lessonState[course.id]) || {};
                return (
                  <li
                    key={course.id}
                    className="grid grid-cols-[28px_1fr_auto] gap-4 py-3.5 items-baseline border-t"
                    style={{ borderColor: "var(--rule-soft)" }}
                  >
                    <input
                      type="checkbox"
                      checked={done}
                      onChange={() => onToggle(course.id)}
                      className="checkbox mt-1"
                      onClick={(e) => e.stopPropagation()}
                    />
                    <button
                      type="button"
                      onClick={() => hasLesson && onOpenLesson(course.id)}
                      disabled={!hasLesson}
                      className="text-left disabled:cursor-default group flex items-baseline gap-3 flex-wrap"
                    >
                      <span
                        className="font-mono text-[11px] tabular-nums"
                        style={{ color: "var(--ink-3)" }}
                      >
                        {course.id}
                      </span>
                      <span
                        className="text-[15px] leading-snug group-enabled:hover:link"
                        style={{
                          color: done ? "var(--ink-3)" : "var(--ink)",
                          textDecoration: done ? "line-through" : "none",
                        }}
                      >
                        {course.title}
                      </span>
                      {lstate.started && !done && (
                        <span
                          className="font-mono text-[10px] tracking-widest uppercase"
                          style={{ color: "var(--warning)" }}
                        >
                          · in progress
                        </span>
                      )}
                    </button>
                    {hasLesson ? (
                      <span
                        className="font-mono text-[10px] tracking-widest uppercase"
                        style={{ color: "var(--ink-3)" }}
                      >
                        Read →
                      </span>
                    ) : (
                      <span
                        className="font-mono text-[10px] tracking-widest uppercase"
                        style={{ color: "var(--ink-3)" }}
                      >
                        —
                      </span>
                    )}
                  </li>
                );
              })}
            </ol>
          )}

          {tab === "concepts" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-7">
              {module.keyConcepts.map((kc, i) => (
                <div
                  key={i}
                  className="border-t pt-4"
                  style={{ borderColor: "var(--rule-soft)" }}
                >
                  <div
                    className="font-display text-lg leading-tight mb-1.5"
                    style={{ fontVariationSettings: '"SOFT" 30' }}
                  >
                    {kc.term}
                  </div>
                  <div className="text-[15px] leading-relaxed" style={{ color: "var(--ink-2)" }}>
                    {kc.definition}
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab === "must" && (
            <div className="space-y-6">
              <ul className="space-y-3">
                {module.mustKnow.map((m, i) => (
                  <li
                    key={i}
                    className="pl-5 py-3 text-[15px] leading-relaxed"
                    style={{
                      borderLeft: `3px solid ${c.accent}`,
                      background: c.tint,
                    }}
                  >
                    <span
                      className="font-mono text-[11px] tabular-nums mr-3"
                      style={{ color: c.accent }}
                    >
                      № {(i + 1).toString().padStart(2, "0")}
                    </span>
                    {m}
                  </li>
                ))}
              </ul>
              <div
                className="px-5 py-5 border-l-[3px]"
                style={{
                  borderColor: "var(--plum)",
                  background: "var(--plum-tint)",
                }}
              >
                <div className="smallcaps mb-2" style={{ color: "var(--plum)" }}>
                  ¶ Clinical connection
                </div>
                <div
                  className="font-display text-base leading-relaxed"
                  style={{ fontVariationSettings: '"SOFT" 50', color: "var(--ink)" }}
                >
                  {module.clinicalConnection}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </article>
  );
}
