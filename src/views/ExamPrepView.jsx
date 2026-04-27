import { useState } from "react";
import data from "../data/study-path-and-exam-prep.json";

function PriorityBadge({ priority }) {
  const isCritical = priority === "critical";
  return (
    <span
      className="font-mono text-[10px] tracking-widest uppercase"
      style={{ color: isCritical ? "var(--danger)" : "var(--info)" }}
    >
      {isCritical ? "※ Critical" : "◦ High"}
    </span>
  );
}

function Accordion({ category, idx, open, onToggle }) {
  return (
    <article
      className="border-t fade-up"
      style={{
        borderColor: "var(--rule)",
        animationDelay: `${idx * 0.04}s`,
      }}
    >
      <button
        onClick={onToggle}
        className="w-full text-left py-6 group"
      >
        <div className="grid grid-cols-[60px_1fr_auto] gap-4 items-baseline">
          <div
            className="chapter-num text-3xl"
            style={{ color: "var(--ink-3)" }}
          >
            {(idx + 1).toString().padStart(2, "0")}
          </div>
          <div>
            <div className="mb-1.5">
              <PriorityBadge priority={category.priority} />
            </div>
            <h3
              className="font-display text-xl sm:text-2xl font-normal leading-tight tracking-tight"
              style={{ fontVariationSettings: '"SOFT" 30' }}
            >
              {category.category}
            </h3>
          </div>
          <div className="smallcaps" style={{ color: "var(--ink-3)" }}>
            {open ? "Close ↑" : "Open ↓"}
          </div>
        </div>
      </button>
      {open && (
        <ul className="pb-8 pl-[76px] space-y-2.5 fade-in">
          {category.items.map((item, i) => (
            <li
              key={i}
              className="flex gap-3 text-[15px] leading-relaxed"
              style={{ color: "var(--ink)" }}
            >
              <span
                className="font-mono text-[11px] tabular-nums mt-1"
                style={{ color: "var(--ink-3)" }}
              >
                {(i + 1).toString().padStart(2, "0")}
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}

export default function ExamPrepView() {
  const [openIdx, setOpenIdx] = useState(0);
  const ep = data.examPrep;
  return (
    <div className="space-y-14">
      <section className="fade-up">
        <div className="smallcaps mb-3">§ V — Practice</div>
        <h2
          className="font-display text-4xl sm:text-5xl md:text-6xl font-light leading-[0.95] tracking-tight"
          style={{ fontVariationSettings: '"SOFT" 50, "WONK" 1' }}
        >
          {ep.title}
        </h2>
        <p
          className="mt-4 max-w-2xl text-[16px] leading-relaxed"
          style={{ color: "var(--ink-2)" }}
        >
          The handful of topics that surveyors and competency assessments lean on
          hardest. Open each card to study the underlying details.
        </p>
        <div className="rule-thick mt-8" style={{ background: "var(--ink)" }} />
      </section>

      {/* Topics */}
      <section>
        {ep.categories.map((cat, i) => (
          <Accordion
            key={i}
            category={cat}
            idx={i}
            open={openIdx === i}
            onToggle={() => setOpenIdx(openIdx === i ? -1 : i)}
          />
        ))}
        <div className="border-t" style={{ borderColor: "var(--rule)" }} />
      </section>

      {/* Mnemonics */}
      <section className="fade-up">
        <div className="smallcaps mb-3">¶ Mnemonics</div>
        <h3
          className="font-display text-3xl font-light leading-tight tracking-tight mb-8"
          style={{ fontVariationSettings: '"SOFT" 40, "WONK" 1' }}
        >
          Anchors for recall
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px" style={{ background: "var(--rule)" }}>
          {data.mnemonics.map((m, i) => (
            <div
              key={i}
              className="p-6 hover:bg-paper-3 transition-colors"
              style={{ background: "var(--paper-2)" }}
            >
              <div className="smallcaps mb-3">{m.topic}</div>
              <div
                className="font-mono text-[15px] leading-snug font-bold mb-3"
                style={{ color: "var(--ink)" }}
              >
                {m.mnemonic}
              </div>
              <div
                className="text-[14px] leading-relaxed"
                style={{ color: "var(--ink-2)" }}
              >
                {m.detail}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Surveyor findings */}
      <section className="fade-up">
        <div className="smallcaps mb-3" style={{ color: "var(--danger)" }}>
          ※ Common surveyor findings
        </div>
        <h3
          className="font-display text-3xl font-light leading-tight tracking-tight mb-6"
          style={{ fontVariationSettings: '"SOFT" 40, "WONK" 1' }}
        >
          Where programs most often fail
        </h3>
        <ol className="space-y-0">
          {data.commonSurveyorFindings.map((f, i) => (
            <li
              key={i}
              className="grid grid-cols-[60px_1fr] gap-4 py-4 border-t text-[15px] leading-relaxed"
              style={{ borderColor: "var(--rule)", color: "var(--ink)" }}
            >
              <span
                className="chapter-num text-2xl"
                style={{ color: "var(--danger)" }}
              >
                {(i + 1).toString().padStart(2, "0")}
              </span>
              <span>{f}</span>
            </li>
          ))}
          <div className="border-t" style={{ borderColor: "var(--rule)" }} />
        </ol>
      </section>
    </div>
  );
}
