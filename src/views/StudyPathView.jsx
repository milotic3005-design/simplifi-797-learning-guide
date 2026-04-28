import data from "../data/study-path-and-exam-prep.json";
import { cls } from "../themes";

const ROMANS = ["I", "II", "III", "IV", "V"];

export default function StudyPathView() {
  const sp = data.studyPath;
  return (
    <div className="space-y-6 sm:space-y-8">
      <section className="glass p-6 sm:p-8 fade-up">
        <div className="eyebrow mb-3">§ Suggested route</div>
        <h2
          className="font-display text-3xl sm:text-4xl md:text-5xl font-semibold leading-[1.05] tracking-tight"
          style={{ color: "var(--ink)" }}
        >
          {sp.title}
        </h2>
        <p
          className="mt-3 max-w-2xl text-[15px] leading-relaxed"
          style={{ color: "var(--ink-2)" }}
        >
          {sp.description}
        </p>
      </section>

      <section className="bento" data-bento-stagger>
        {sp.phases.map((p, i) => {
          const c = cls(p.theme);
          return (
            <article
              key={p.phase}
              className="glass bento-tile b-2 p-6 sm:p-7 fade-up flex flex-col"
              style={{
                background: `radial-gradient(at 100% 100%, ${c.tint}, transparent 60%), var(--glass-bg)`,
              }}
            >
              <div className="flex items-baseline justify-between mb-4">
                <div>
                  <div
                    className="text-[10px] font-bold tracking-widest uppercase mb-1"
                    style={{ color: "var(--ink-3)" }}
                  >
                    Phase
                  </div>
                  <div
                    className="font-display font-bold leading-none tracking-tight"
                    style={{
                      fontSize: "clamp(56px, 8vw, 84px)",
                      background: `linear-gradient(135deg, ${c.accent2}, ${c.accent})`,
                      WebkitBackgroundClip: "text",
                      backgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    {ROMANS[i]}
                  </div>
                </div>
                <div className="text-right">
                  <div
                    className="font-num text-[13px] font-medium"
                    style={{ color: "var(--ink-2)" }}
                  >
                    {p.estimatedHours}
                  </div>
                  <div
                    className="text-[11px] mt-0.5"
                    style={{ color: "var(--ink-3)" }}
                  >
                    {p.courseCount} courses
                  </div>
                </div>
              </div>
              <h3
                className="font-display text-xl sm:text-2xl font-semibold leading-tight tracking-tight mb-4"
                style={{ color: "var(--ink)" }}
              >
                {p.label}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-4">
                {p.moduleNames.map((name, j) => (
                  <div
                    key={j}
                    className="glass-flat px-3 py-2.5"
                    style={{
                      borderLeft: `2px solid ${c.accent}`,
                    }}
                  >
                    <div
                      className="text-[10px] font-bold tracking-widest uppercase mb-0.5 font-num"
                      style={{ color: c.accent }}
                    >
                      № {p.modules[j]}
                    </div>
                    <div
                      className="text-[12px] leading-snug"
                      style={{ color: "var(--ink)" }}
                    >
                      {name}
                    </div>
                  </div>
                ))}
              </div>
              <p
                className="text-[14px] leading-[1.65]"
                style={{ color: "var(--ink-2)" }}
              >
                {p.rationale}
              </p>
            </article>
          );
        })}
      </section>

      {/* Study tip */}
      <section
        className="glass p-6 sm:p-8 fade-up"
        style={{
          background: `radial-gradient(at 0% 100%, var(--plum-tint), transparent 60%), var(--glass-bg)`,
        }}
      >
        <div
          className="text-[10px] font-bold tracking-widest uppercase mb-3"
          style={{ color: "var(--plum)" }}
        >
          ¶ Study tip
        </div>
        <blockquote
          className="font-display text-xl sm:text-2xl md:text-3xl leading-[1.3] font-medium tracking-tight max-w-3xl"
          style={{ color: "var(--ink)" }}
        >
          {sp.studyTip}
        </blockquote>
      </section>
    </div>
  );
}
