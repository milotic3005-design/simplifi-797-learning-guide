import { useState } from "react";
import { cls } from "../themes";
import { lessonMap } from "../data/lessons";
import { buildModuleGuide } from "../data/guidance";

function Tabs({ tabs, active, onChange }) {
  return (
    <div className="tabs mb-5 self-start">
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
  completed,
  onToggle,
  onOpenLesson,
  lessonState,
  spanClass = "b-1",
  featured = false,
}) {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState("guided");
  const c = cls(module.theme);
  const completedCount = module.courses.filter((co) => completed[co.id]).length;
  const total = module.courses.length;
  const isComplete = completedCount === total;
  const pct = Math.round((completedCount / total) * 100);

  const expandSpan = open ? "b-4" : spanClass;
  const featuredStyle = featured
    ? {
        background: `radial-gradient(at 0% 100%, ${c.tint}, transparent 60%), var(--glass-bg)`,
        boxShadow: `var(--glass-shadow), 0 0 0 1px ${c.accent}25`,
      }
    : {};

  return (
    <article
      className={`glass bento-tile ${expandSpan} flex flex-col p-5 sm:p-6 transition-[grid-column] duration-300`}
      style={featuredStyle}
    >
      {/* Top: number + status */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center font-display text-[15px] font-bold tracking-tight"
            style={{
              background: `linear-gradient(135deg, ${c.accent2 || c.accent}, ${c.accent})`,
              color: "#fff",
              boxShadow:
                "0 1px 0 rgba(255,255,255,0.4) inset, 0 4px 14px -4px " +
                c.accent +
                "60",
            }}
          >
            {module.number}
          </div>
          <div className="flex flex-col">
            <span
              className="text-[10px] font-bold tracking-widest uppercase"
              style={{ color: c.accent }}
            >
              {c.label}
            </span>
            {featured && (
              <span
                className="text-[10px] font-bold tracking-widest uppercase mt-0.5"
                style={{ color: "var(--danger)" }}
              >
                ※ Critical
              </span>
            )}
          </div>
        </div>
        <div className="text-right">
          <div
            className="font-num text-[12px] font-medium"
            style={{ color: "var(--ink-2)" }}
          >
            {completedCount}/{total}
          </div>
          {isComplete && (
            <div
              className="text-[10px] font-semibold uppercase tracking-wider mt-0.5"
              style={{ color: "var(--success)" }}
            >
              ✓ Done
            </div>
          )}
        </div>
      </div>

      {/* Title */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="text-left flex-1 min-w-0 group"
      >
        <h3
          className="font-display font-semibold leading-[1.15] tracking-tight"
          style={{
            color: "var(--ink)",
            fontSize: featured ? "clamp(22px, 3vw, 30px)" : "20px",
          }}
        >
          {module.title}
        </h3>
        <div
          className="text-[12px] mt-1.5"
          style={{ color: "var(--ink-3)" }}
        >
          {module.tag}
        </div>
      </button>

      {/* Mini progress bar */}
      <div className="mt-4">
        <div
          className="h-1 w-full rounded-full overflow-hidden"
          style={{ background: "rgba(15,17,35,0.06)" }}
        >
          <div
            className={`h-full ${c.bar} transition-all duration-500 rounded-full`}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {/* Footer toggle */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="mt-4 flex items-center justify-between text-[12px] font-medium pt-3 hairline-t"
        style={{ color: "var(--ink-2)" }}
      >
        <span>{open ? "Close" : "Open chapter"}</span>
        <svg
          className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          viewBox="0 0 24 24"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {/* Expanded body */}
      {open && (
        <div className="mt-5 fade-in">
          {featured && (
            <div
              className="mb-5 p-4 r-md text-[13.5px] leading-relaxed"
              style={{
                background: "var(--danger-tint)",
                border: "1px solid rgba(244,63,94,0.2)",
                color: "var(--ink)",
              }}
            >
              <div
                className="text-[10px] font-bold tracking-widest uppercase mb-1"
                style={{ color: "var(--danger)" }}
              >
                ※ High-priority module
              </div>
              Hazardous-drug content overlays USP 800 on top of all preceding
              concepts. Approach this chapter only after the prior modules are
              solid.
            </div>
          )}

          <Tabs
            active={tab}
            onChange={setTab}
            tabs={[
              { id: "guided", label: "Guided" },
              { id: "courses", label: "Courses" },
              { id: "concepts", label: "Concepts" },
              { id: "must", label: "Must Know" },
            ]}
          />

          {tab === "guided" && (
            <ModuleGuidedPanel
              module={module}
              theme={c}
              completed={completed}
              onTab={setTab}
            />
          )}

          {tab === "courses" && (
            <ol className="space-y-1.5">
              {module.courses.map((course) => {
                const done = !!completed[course.id];
                const hasLesson = !!lessonMap[course.id];
                const lstate = (lessonState && lessonState[course.id]) || {};
                return (
                  <li
                    key={course.id}
                    className="glass-flat flex items-center gap-3 px-3.5 py-3"
                  >
                    <input
                      type="checkbox"
                      checked={done}
                      onChange={() => onToggle(course.id)}
                      className="checkbox"
                      onClick={(e) => e.stopPropagation()}
                    />
                    <button
                      type="button"
                      onClick={() => hasLesson && onOpenLesson(course.id)}
                      disabled={!hasLesson}
                      className="text-left flex-1 min-w-0 disabled:cursor-default group"
                    >
                      <div className="flex items-center gap-2 mb-0.5">
                        <span
                          className="font-num text-[10px] font-medium"
                          style={{ color: "var(--ink-3)" }}
                        >
                          {course.id}
                        </span>
                        {lstate.started && !done && (
                          <span
                            className="text-[9px] uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded-full"
                            style={{
                              background: "var(--warning-tint)",
                              color: "var(--warning)",
                            }}
                          >
                            in progress
                          </span>
                        )}
                      </div>
                      <span
                        className={`text-[13.5px] leading-snug ${
                          hasLesson ? "group-enabled:group-hover:underline" : ""
                        }`}
                        style={{
                          color: done ? "var(--ink-3)" : "var(--ink)",
                          textDecoration: done ? "line-through" : "none",
                        }}
                      >
                        {course.title}
                      </span>
                    </button>
                    {hasLesson && (
                      <span
                        className="font-num text-[11px] font-medium shrink-0"
                        style={{ color: c.accent }}
                      >
                        Read →
                      </span>
                    )}
                  </li>
                );
              })}
            </ol>
          )}

          {tab === "concepts" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              {module.keyConcepts.map((kc, i) => (
                <div key={i} className="glass-flat p-3.5">
                  <div
                    className="font-display text-[14px] font-semibold mb-1 leading-tight"
                    style={{ color: "var(--ink)" }}
                  >
                    {kc.term}
                  </div>
                  <div
                    className="text-[13px] leading-relaxed"
                    style={{ color: "var(--ink-2)" }}
                  >
                    {kc.definition}
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab === "must" && (
            <div className="space-y-3">
              <ol className="space-y-2">
                {module.mustKnow.map((m, i) => (
                  <li
                    key={i}
                    className="glass-flat px-4 py-3 text-[13.5px] leading-relaxed flex gap-3"
                    style={{
                      borderLeft: `3px solid ${c.accent}`,
                    }}
                  >
                    <span
                      className="font-num text-[11px] font-bold shrink-0"
                      style={{ color: c.accent }}
                    >
                      №{(i + 1).toString().padStart(2, "0")}
                    </span>
                    <span style={{ color: "var(--ink)" }}>{m}</span>
                  </li>
                ))}
              </ol>
              <div
                className="p-4 r-md"
                style={{
                  background: "var(--plum-tint)",
                  border: "1px solid rgba(139,92,246,0.20)",
                }}
              >
                <div
                  className="text-[10px] font-bold tracking-widest uppercase mb-1.5"
                  style={{ color: "var(--plum)" }}
                >
                  ¶ Clinical connection
                </div>
                <div
                  className="text-[14px] leading-relaxed"
                  style={{ color: "var(--ink)" }}
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

function ModuleGuidedPanel({ module, theme, completed, onTab }) {
  const g = buildModuleGuide(module);
  const completedCount = module.courses.filter((co) => completed[co.id]).length;
  const total = module.courses.length;
  const nextCourse = module.courses.find((co) => !completed[co.id]);

  const phaseRoman = ["", "I", "II", "III"];

  return (
    <div className="space-y-3 fade-in">
      {/* At-a-glance stats */}
      <div className="glass-flat p-4 grid grid-cols-3 gap-3">
        <Stat label="Courses" value={`${completedCount}/${total}`} />
        <Stat label="Est. time" value={`${Math.round(g.estMinutes / 60 * 10) / 10}h`} />
        <Stat label="Phase" value={g.phase ? phaseRoman[g.phase.phase] : "—"} />
      </div>

      {/* Where this fits */}
      {g.phase && (
        <div
          className="glass-flat p-4"
          style={{
            borderLeft: `2px solid ${theme.accent}`,
          }}
        >
          <div
            className="text-[10px] font-bold tracking-widest uppercase mb-1.5"
            style={{ color: theme.accent }}
          >
            ¶ Where this chapter fits
          </div>
          <div
            className="font-display text-[14.5px] font-semibold mb-1"
            style={{ color: "var(--ink)" }}
          >
            Phase {phaseRoman[g.phase.phase]} · {g.phase.label}
          </div>
          <div
            className="text-[13px] leading-relaxed"
            style={{ color: "var(--ink-2)" }}
          >
            {g.phase.rationale}
          </div>
        </div>
      )}

      {/* Prereqs */}
      {g.prereqs.length > 0 && (
        <div className="glass-flat p-4">
          <div
            className="text-[10px] font-bold tracking-widest uppercase mb-2"
            style={{ color: "var(--warning)" }}
          >
            ◦ Read these first
          </div>
          <ul className="space-y-1">
            {g.prereqs.map((p) => (
              <li
                key={p.id}
                className="flex items-baseline gap-2.5 text-[13px]"
                style={{ color: "var(--ink)" }}
              >
                <span
                  className="font-num text-[11px] font-bold shrink-0 w-7"
                  style={{ color: "var(--warning)" }}
                >
                  {p.number}
                </span>
                <span>{p.title}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Recommended sequence */}
      <div className="glass-flat p-4">
        <div
          className="text-[10px] font-bold tracking-widest uppercase mb-2"
          style={{ color: theme.accent }}
        >
          ¶ Recommended order
        </div>
        <ol className="space-y-1.5">
          {g.sequence.map((s) => {
            const done = !!completed[s.id];
            return (
              <li
                key={s.id}
                className="flex items-baseline gap-2.5 text-[13px]"
                style={{
                  color: done ? "var(--ink-3)" : "var(--ink)",
                  textDecoration: done ? "line-through" : "none",
                }}
              >
                <span
                  className="font-num text-[11px] font-bold shrink-0 w-7"
                  style={{ color: theme.accent }}
                >
                  {s.id}
                </span>
                <span>{s.title}</span>
                {done && (
                  <span
                    className="text-[10px] font-bold tracking-widest uppercase"
                    style={{ color: "var(--success)" }}
                  >
                    ✓
                  </span>
                )}
              </li>
            );
          })}
        </ol>
      </div>

      {/* Goals */}
      <div className="glass-flat p-4">
        <div
          className="text-[10px] font-bold tracking-widest uppercase mb-2"
          style={{ color: "var(--info)" }}
        >
          ¶ After this chapter you should
        </div>
        <ul className="space-y-2">
          {g.learningGoals.map((goal, i) => (
            <li
              key={i}
              className="flex gap-3 text-[13px] leading-relaxed"
              style={{ color: "var(--ink)" }}
            >
              <span
                className="font-num text-[11px] mt-1 shrink-0 font-semibold"
                style={{ color: "var(--info)" }}
              >
                {(i + 1).toString().padStart(2, "0")}
              </span>
              <span>{goal}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Wrap-up actions */}
      <div className="glass-flat p-4">
        <div
          className="text-[10px] font-bold tracking-widest uppercase mb-2"
          style={{ color: "var(--plum)" }}
        >
          ¶ Wrap-up checklist
        </div>
        <ul className="space-y-1.5">
          {g.afterChapter.map((action, i) => (
            <li
              key={i}
              className="flex gap-2.5 text-[13px] leading-relaxed"
              style={{ color: "var(--ink-2)" }}
            >
              <span
                className="font-num text-[10px] mt-1 shrink-0 font-semibold"
                style={{ color: "var(--plum)" }}
              >
                ☐
              </span>
              <span>{action}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Start CTA */}
      <div className="flex items-center justify-end gap-2 pt-1">
        <button
          onClick={() => onTab("courses")}
          className="btn-ghost"
        >
          See course list
        </button>
        {nextCourse && (
          <button
            onClick={() => onTab("courses")}
            className="btn-primary"
            title={`Next: ${nextCourse.title}`}
          >
            {completedCount === 0 ? "Start chapter" : "Continue"} →
          </button>
        )}
      </div>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div>
      <div
        className="text-[10px] font-bold tracking-widest uppercase mb-1"
        style={{ color: "var(--ink-3)" }}
      >
        {label}
      </div>
      <div
        className="font-display font-semibold leading-none tracking-tight font-num"
        style={{ fontSize: "clamp(20px, 3vw, 26px)", color: "var(--ink)" }}
      >
        {value}
      </div>
    </div>
  );
}
