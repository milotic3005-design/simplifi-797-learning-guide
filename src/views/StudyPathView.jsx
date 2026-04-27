import data from "../data/study-path-and-exam-prep.json";
import { cls } from "../themes";

const ROMANS = ["I", "II", "III", "IV", "V"];

export default function StudyPathView() {
  const sp = data.studyPath;
  return (
    <div className="space-y-14">
      <section className="fade-up">
        <div className="smallcaps mb-3">§ IV — Suggested route</div>
        <h2
          className="font-display text-4xl sm:text-5xl md:text-6xl font-light leading-[0.95] tracking-tight"
          style={{ fontVariationSettings: '"SOFT" 50, "WONK" 1' }}
        >
          {sp.title}
        </h2>
        <p
          className="mt-4 max-w-2xl text-[16px] leading-relaxed"
          style={{ color: "var(--ink-2)" }}
        >
          {sp.description}
        </p>
        <div className="rule-thick mt-8" style={{ background: "var(--ink)" }} />
      </section>

      <section>
        {sp.phases.map((p, i) => {
          const c = cls(p.theme);
          return (
            <article
              key={p.phase}
              className="fade-up py-12 border-t grid md:grid-cols-[180px_1fr] gap-8"
              style={{
                borderColor: "var(--rule)",
                animationDelay: `${i * 0.06}s`,
              }}
            >
              <div>
                <div className="smallcaps mb-2">Phase</div>
                <div
                  className="font-display tracking-tight leading-none"
                  style={{
                    fontSize: "clamp(80px, 11vw, 140px)",
                    fontWeight: 200,
                    fontVariationSettings: '"SOFT" 70, "WONK" 1',
                    color: c.accent,
                  }}
                >
                  {ROMANS[i]}
                </div>
              </div>
              <div>
                <h3
                  className="font-display text-2xl sm:text-3xl font-normal leading-tight tracking-tight mb-3"
                  style={{ fontVariationSettings: '"SOFT" 30' }}
                >
                  {p.label}
                </h3>
                <div
                  className="flex flex-wrap items-center gap-x-5 gap-y-1 mb-5 font-mono text-[12px]"
                  style={{ color: "var(--ink-2)" }}
                >
                  <span>Modules {p.modules.join(", ")}</span>
                  <span style={{ color: "var(--rule)" }}>·</span>
                  <span>{p.courseCount} courses</span>
                  <span style={{ color: "var(--rule)" }}>·</span>
                  <span>{p.estimatedHours}</span>
                </div>
                <div
                  className="grid md:grid-cols-3 gap-3 mb-5"
                >
                  {p.moduleNames.map((name, j) => (
                    <div
                      key={j}
                      className="px-4 py-3 text-[13px] leading-tight"
                      style={{
                        background: c.tint,
                        borderLeft: `3px solid ${c.accent}`,
                      }}
                    >
                      <div className="smallcaps mb-1">№ {p.modules[j]}</div>
                      <div style={{ color: "var(--ink)" }}>{name}</div>
                    </div>
                  ))}
                </div>
                <p
                  className="font-display text-[18px] leading-[1.55] italic max-w-2xl"
                  style={{
                    fontVariationSettings: '"SOFT" 50, "WONK" 1',
                    color: "var(--ink)",
                  }}
                >
                  {p.rationale}
                </p>
              </div>
            </article>
          );
        })}
        <div className="border-t" style={{ borderColor: "var(--rule)" }} />
      </section>

      {/* Study tip pull-quote */}
      <section className="fade-up max-w-3xl">
        <div className="smallcaps mb-4" style={{ color: "var(--plum)" }}>
          ¶ Study tip
        </div>
        <blockquote
          className="font-display text-2xl sm:text-3xl leading-[1.3] tracking-tight"
          style={{
            fontVariationSettings: '"SOFT" 60, "WONK" 1',
            color: "var(--ink)",
          }}
        >
          <span
            className="font-display text-5xl block leading-none mb-2"
            style={{
              color: "var(--plum)",
              fontVariationSettings: '"SOFT" 80, "WONK" 1',
            }}
          >
            “
          </span>
          {sp.studyTip}
        </blockquote>
      </section>
    </div>
  );
}
