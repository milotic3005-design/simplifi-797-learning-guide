import { useState } from "react";
import data from "../data/study-path-and-exam-prep.json";

function PriorityBadge({ priority }) {
  const isCritical = priority === "critical";
  return (
    <span
      className="chip"
      style={{
        color: isCritical ? "var(--danger)" : "var(--info)",
        background: isCritical ? "var(--danger-tint)" : "var(--info-tint)",
        borderColor: isCritical
          ? "rgba(244,63,94,0.25)"
          : "rgba(99,102,241,0.25)",
      }}
    >
      {isCritical ? "※ Critical" : "◦ High"}
    </span>
  );
}

function CategoryTile({ category, idx, open, onToggle }) {
  return (
    <article
      className="glass bento-tile b-2 fade-up overflow-hidden"
      style={{ animationDelay: `${idx * 0.04}s` }}
    >
      <button
        onClick={onToggle}
        className="w-full text-left p-5 sm:p-6"
      >
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <div
              className="font-display font-bold text-[20px] leading-none tracking-tight"
              style={{ color: "var(--ink-3)" }}
            >
              {(idx + 1).toString().padStart(2, "0")}
            </div>
            <PriorityBadge priority={category.priority} />
          </div>
          <svg
            className={`w-4 h-4 mt-1 transition-transform ${
              open ? "rotate-180" : ""
            }`}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            viewBox="0 0 24 24"
            style={{ color: "var(--ink-3)" }}
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
        <h3
          className="font-display text-lg sm:text-xl font-semibold leading-tight tracking-tight"
          style={{ color: "var(--ink)" }}
        >
          {category.category}
        </h3>
      </button>
      {open && (
        <ul className="px-5 sm:px-6 pb-6 space-y-2 fade-in">
          {category.items.map((item, i) => (
            <li
              key={i}
              className="flex gap-3 text-[14px] leading-relaxed"
              style={{ color: "var(--ink)" }}
            >
              <span
                className="font-num text-[11px] mt-1 shrink-0 font-semibold"
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
    <div className="space-y-6 sm:space-y-8">
      <section className="glass p-6 sm:p-8 fade-up">
        <div className="eyebrow mb-3">§ Practice</div>
        <h2
          className="font-display text-3xl sm:text-4xl md:text-5xl font-semibold leading-[1.05] tracking-tight"
          style={{ color: "var(--ink)" }}
        >
          {ep.title}
        </h2>
        <p
          className="mt-3 max-w-2xl text-[15px] leading-relaxed"
          style={{ color: "var(--ink-2)" }}
        >
          The handful of topics surveyors and competency assessments lean on
          hardest. Open each tile for the underlying details.
        </p>
      </section>

      {/* Topics bento */}
      <section className="bento" data-bento-stagger>
        {ep.categories.map((cat, i) => (
          <CategoryTile
            key={i}
            category={cat}
            idx={i}
            open={openIdx === i}
            onToggle={() => setOpenIdx(openIdx === i ? -1 : i)}
          />
        ))}
      </section>

      {/* Mnemonics bento */}
      <section>
        <div className="mb-5">
          <div className="eyebrow mb-2">¶ Mnemonics</div>
          <h3
            className="font-display text-2xl sm:text-3xl font-semibold leading-tight tracking-tight"
            style={{ color: "var(--ink)" }}
          >
            Anchors for recall
          </h3>
        </div>
        <div className="bento" data-bento-stagger>
          {data.mnemonics.map((m, i) => {
            const accents = [
              "var(--info)",
              "var(--success)",
              "var(--warning)",
              "var(--danger)",
              "var(--plum)",
              "var(--cyan)",
            ];
            const accent = accents[i % accents.length];
            return (
              <div
                key={i}
                className="glass bento-tile b-2 p-5 fade-up"
                style={{
                  background: `radial-gradient(at 100% 0%, ${accent}1a, transparent 60%), var(--glass-bg)`,
                }}
              >
                <div
                  className="text-[10px] font-bold tracking-widest uppercase mb-3"
                  style={{ color: accent }}
                >
                  {m.topic}
                </div>
                <div
                  className="font-display text-[18px] sm:text-[20px] leading-snug font-bold mb-3 tracking-tight"
                  style={{ color: "var(--ink)" }}
                >
                  {m.mnemonic}
                </div>
                <div
                  className="text-[13.5px] leading-relaxed"
                  style={{ color: "var(--ink-2)" }}
                >
                  {m.detail}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Surveyor findings */}
      <section className="glass p-6 sm:p-8 fade-up">
        <div
          className="text-[10px] font-bold tracking-widest uppercase mb-2"
          style={{ color: "var(--danger)" }}
        >
          ※ Common surveyor findings
        </div>
        <h3
          className="font-display text-2xl sm:text-3xl font-semibold leading-tight tracking-tight mb-5"
          style={{ color: "var(--ink)" }}
        >
          Where programs most often fail
        </h3>
        <ol className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
          {data.commonSurveyorFindings.map((f, i) => (
            <li
              key={i}
              className="glass-flat flex gap-3 px-4 py-3 text-[13.5px] leading-relaxed"
              style={{ color: "var(--ink)" }}
            >
              <span
                className="font-display font-bold text-[18px] leading-none shrink-0 w-7"
                style={{ color: "var(--danger)" }}
              >
                {(i + 1).toString().padStart(2, "0")}
              </span>
              <span>{f}</span>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
