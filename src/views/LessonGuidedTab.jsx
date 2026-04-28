import { buildLessonGuide } from "../data/guidance";
import { cls } from "../themes";

export default function LessonGuidedTab({ lesson, module, onTab }) {
  const c = cls(module?.theme || "neutral");
  const g = buildLessonGuide(lesson, module);

  return (
    <div className="space-y-4 fade-up">
      {/* Pre-flight tile */}
      <div
        className="glass p-5 sm:p-7 grid sm:grid-cols-3 gap-4"
        style={{
          background: `radial-gradient(at 0% 0%, ${c.tint}, transparent 60%), var(--glass-bg)`,
        }}
      >
        <Stat label="Reading time" value={`${g.readingMin} min`} />
        <Stat label="Sections" value={g.totalSections} />
        <Stat label="Self-check" value={`${g.selfCheckCount} Q`} />
        {g.phase && (
          <div className="sm:col-span-3 hairline-t pt-4 text-[13.5px]" style={{ color: "var(--ink-2)" }}>
            <span className="smallcaps mr-2">Where you are</span>
            Phase {g.phase.phase} · {g.phase.label} · Module {g.moduleNumber}
          </div>
        )}
      </div>

      {/* Why this matters */}
      <div className="glass p-5 sm:p-6">
        <SectionLabel
          color="var(--info)"
          label="Why this matters"
          numeral="01"
        />
        <ul className="mt-3 space-y-2">
          {g.objectives.map((o, i) => (
            <li
              key={i}
              className="flex gap-3 text-[14.5px] leading-relaxed"
              style={{ color: "var(--ink)" }}
            >
              <span
                className="font-num text-[11px] mt-1 shrink-0 font-semibold"
                style={{ color: "var(--info)" }}
              >
                {(i + 1).toString().padStart(2, "0")}
              </span>
              <span>{o}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Pacing plan */}
      <div className="glass p-5 sm:p-6">
        <SectionLabel
          color="var(--plum)"
          label="A 5-step pacing plan"
          numeral="02"
        />
        <ol className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {g.pacing.map((p, i) => (
            <li
              key={i}
              className="glass-flat p-4"
              style={{
                borderLeft: "2px solid var(--plum)",
              }}
            >
              <div className="flex items-baseline gap-2 mb-1">
                <span
                  className="font-num text-[10px] font-bold tracking-widest uppercase"
                  style={{ color: "var(--plum)" }}
                >
                  Step {(i + 1).toString().padStart(2, "0")}
                </span>
                <span
                  className="font-display text-[14px] font-semibold"
                  style={{ color: "var(--ink)" }}
                >
                  {p.label}
                </span>
              </div>
              <div
                className="text-[13px] leading-relaxed"
                style={{ color: "var(--ink-2)" }}
              >
                {p.detail}
              </div>
            </li>
          ))}
        </ol>
      </div>

      {/* Section preview */}
      <div className="glass p-5 sm:p-6">
        <SectionLabel
          color={c.accent}
          label="What you'll read · section by section"
          numeral="03"
        />
        <ol className="mt-3 space-y-2">
          {g.sectionPreviews.map((s) => (
            <li
              key={s.ord}
              className="glass-flat p-3.5 grid grid-cols-[28px_1fr] gap-3"
            >
              <span
                className="font-num text-[12px] font-bold mt-0.5"
                style={{ color: c.accent }}
              >
                §{s.ord.toString().padStart(2, "0")}
              </span>
              <div>
                <div
                  className="font-display text-[14.5px] font-semibold leading-snug mb-0.5"
                  style={{ color: "var(--ink)" }}
                >
                  {s.heading}
                </div>
                <div
                  className="text-[12.5px] leading-relaxed"
                  style={{ color: "var(--ink-3)" }}
                >
                  {s.preview}
                </div>
              </div>
            </li>
          ))}
        </ol>
      </div>

      {/* Start CTA */}
      <div className="glass p-5 sm:p-6 flex items-center justify-between flex-wrap gap-3">
        <div>
          <div
            className="text-[10px] font-bold tracking-widest uppercase mb-0.5"
            style={{ color: "var(--ink-3)" }}
          >
            Ready
          </div>
          <div className="text-[14px]" style={{ color: "var(--ink-2)" }}>
            Begin reading. The lesson auto-saves every action.
          </div>
        </div>
        <button onClick={() => onTab("lesson")} className="btn-primary">
          Start the lesson →
        </button>
      </div>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div>
      <div
        className="text-[10px] font-bold tracking-widest uppercase mb-1.5"
        style={{ color: "var(--ink-3)" }}
      >
        {label}
      </div>
      <div
        className="font-display font-semibold leading-none tracking-tight font-num"
        style={{ fontSize: "clamp(28px, 4vw, 36px)", color: "var(--ink)" }}
      >
        {value}
      </div>
    </div>
  );
}

function SectionLabel({ label, numeral, color }) {
  return (
    <div className="flex items-center gap-2.5">
      <span
        className="font-num text-[11px] font-bold"
        style={{ color }}
      >
        {numeral}
      </span>
      <span
        className="text-[10px] font-bold tracking-widest uppercase"
        style={{ color }}
      >
        {label}
      </span>
    </div>
  );
}
