import { lessonMap } from "../data/lessons";
import courses from "../data/courses.json";

const THEME_FOR_MODULE = {
  1: { name: "info",    label: "Foundations",    color: "var(--ed-info)",    soft: "var(--ed-info-soft)" },
  2: { name: "info",    label: "Engineering",    color: "var(--ed-info)",    soft: "var(--ed-info-soft)" },
  3: { name: "neutral", label: "Personnel",      color: "var(--ed-neutral)", soft: "var(--ed-neutral-soft)" },
  4: { name: "success", label: "Sampling",       color: "var(--ed-success)", soft: "var(--ed-success-soft)" },
  5: { name: "success", label: "Sanitization",   color: "var(--ed-success)", soft: "var(--ed-success-soft)" },
  6: { name: "success", label: "Aseptic",        color: "var(--ed-success)", soft: "var(--ed-success-soft)" },
  7: { name: "warning", label: "Sterilization",  color: "var(--ed-warning)", soft: "var(--ed-warning-soft)" },
  8: { name: "danger",  label: "Hazardous",      color: "var(--ed-danger)",  soft: "var(--ed-danger-soft)" },
};

export default function ModuleDetailView({ moduleId, onBack, onOpenLesson, completed }) {
  const m = courses.modules.find((x) => x.id === moduleId);
  if (!m) return null;
  const t = THEME_FOR_MODULE[m.id];

  return (
    <div className={`editorial theme-${t.name}`} style={{ background: "var(--paper)", minHeight: "calc(100vh - 140px)", margin: "-24px -16px 0", padding: 0 }}>
      {/* Top bar */}
      <header
        style={{
          position: "sticky", top: 0, zIndex: 5,
          padding: "16px 64px",
          background: "var(--paper)",
          borderBottom: "1px solid var(--rule)",
          display: "flex", justifyContent: "space-between", alignItems: "center",
          flexWrap: "wrap", gap: 12,
        }}
      >
        <button
          onClick={onBack}
          className="ed-btn-link"
          style={{ borderBottom: "none", display: "flex", alignItems: "center", gap: 6 }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M9 3L5 7l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Table of contents
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span className="ed-tag" style={{ borderColor: t.color, color: t.color }}>{t.label}</span>
          <span className="ed-tag ed-num">Module {m.number}</span>
        </div>
      </header>

      <div style={{ padding: "56px 64px 120px", maxWidth: 1100, margin: "0 auto" }}>
        {/* ── Chapter opener ── */}
        <div style={{ display: "grid", gridTemplateColumns: "180px 1fr", gap: 48, marginBottom: 56 }} className="ed-chapter-grid">
          <div>
            <div
              className="ed-numeral ed-serif ed-num"
              style={{
                fontSize: "clamp(120px, 18vw, 200px)",
                lineHeight: 0.85,
                fontWeight: 500,
                color: t.color,
                letterSpacing: "-0.05em",
              }}
            >
              {m.number}
            </div>
            <div className="ed-eyebrow-accent" style={{ color: t.color, marginTop: 8 }}>
              Chapter {m.number}
            </div>
          </div>

          <div>
            {m.tag && (
              <div className="ed-eyebrow" style={{ marginBottom: 14 }}>{m.tag}</div>
            )}
            <h1
              className="ed-serif"
              style={{
                fontSize: "clamp(40px, 5vw, 64px)",
                lineHeight: 1.02,
                fontWeight: 500,
                letterSpacing: "-0.025em",
                margin: "0 0 28px 0",
                textWrap: "balance",
                color: "var(--ed-ink)",
              }}
            >
              {m.title}
            </h1>
            {m.clinicalConnection && (
              <p
                className="ed-serif"
                style={{
                  fontSize: 20,
                  lineHeight: 1.45,
                  color: "var(--ed-ink-2)",
                  margin: 0,
                  borderLeft: `2px solid ${t.color}`,
                  paddingLeft: 20,
                  textWrap: "pretty",
                }}
              >
                {m.clinicalConnection}
              </p>
            )}
          </div>
        </div>

        {/* ── Two-column: Lessons + Must Know ── */}
        <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: 64 }} className="ed-detail-grid">
          {/* Lessons */}
          <section>
            <div
              style={{
                display: "flex", alignItems: "baseline", justifyContent: "space-between",
                marginBottom: 16, paddingBottom: 10,
                borderBottom: "2px solid var(--ed-ink)",
              }}
            >
              <h2 className="ed-serif" style={{ fontSize: 22, fontWeight: 500, letterSpacing: "-0.01em", margin: 0, color: "var(--ed-ink)" }}>
                Lessons in this chapter
              </h2>
              <span className="ed-eyebrow ed-num">{m.courses.length} total</span>
            </div>

            <ol style={{ margin: 0, padding: 0, listStyle: "none" }}>
              {m.courses.map((c) => {
                const has = !!lessonMap[c.id];
                const done = !!completed[c.id];
                return (
                  <li key={c.id}>
                    <button
                      onClick={() => has && onOpenLesson(c.id)}
                      disabled={!has}
                      style={{
                        width: "100%", textAlign: "left",
                        display: "grid",
                        gridTemplateColumns: "46px 1fr auto",
                        gap: 16,
                        alignItems: "baseline",
                        padding: "18px 0",
                        background: "transparent",
                        border: 0,
                        borderBottom: "1px solid var(--rule)",
                        cursor: has ? "pointer" : "default",
                        color: "var(--ed-ink)",
                        opacity: has ? 1 : 0.5,
                        transition: "padding 0.15s ease",
                        fontFamily: "var(--ed-sans)",
                      }}
                      onMouseEnter={(e) => { if (has) e.currentTarget.style.paddingLeft = "8px"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.paddingLeft = "0"; }}
                    >
                      <span
                        className="ed-numeral ed-serif ed-num"
                        style={{
                          fontSize: 22,
                          fontWeight: 500,
                          color: done ? "var(--ed-ink-3)" : t.color,
                          paddingTop: 2,
                        }}
                      >
                        {c.id}
                      </span>
                      <div>
                        <div
                          className="ed-serif"
                          style={{
                            fontSize: 18,
                            lineHeight: 1.3,
                            fontWeight: 500,
                            letterSpacing: "-0.005em",
                            color: done ? "var(--ed-ink-3)" : "var(--ed-ink)",
                            textDecoration: done ? "line-through" : "none",
                            textDecorationColor: "var(--ed-ink-3)",
                          }}
                        >
                          {c.title}
                        </div>
                        {has && (
                          <div className="ed-eyebrow" style={{ marginTop: 4, fontSize: 10 }}>
                            {done ? "✓ Read" : "· 4–6 sections · ~12 min"}
                          </div>
                        )}
                      </div>
                      <div
                        style={{
                          color: has ? t.color : "var(--ed-ink-3)",
                          fontSize: 14,
                          fontFamily: "var(--ed-sans)",
                          fontWeight: 600,
                        }}
                      >
                        {done ? "✓" : has ? "Read →" : "—"}
                      </div>
                    </button>
                  </li>
                );
              })}
            </ol>
          </section>

          {/* Must-know + concepts */}
          <aside>
            <div
              style={{
                display: "flex", alignItems: "baseline",
                marginBottom: 16, paddingBottom: 10,
                borderBottom: "2px solid var(--ed-ink)",
              }}
            >
              <h2 className="ed-serif" style={{ fontSize: 22, fontWeight: 500, margin: 0, letterSpacing: "-0.01em", color: "var(--ed-ink)" }}>
                Must know
              </h2>
            </div>
            {m.mustKnow && m.mustKnow.length > 0 && (
              <ol style={{ margin: "0 0 36px 0", padding: 0, listStyle: "none" }}>
                {m.mustKnow.map((mk, i) => (
                  <li
                    key={i}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "32px 1fr",
                      gap: 12,
                      padding: "14px 0",
                      borderBottom: "1px dotted var(--rule)",
                    }}
                  >
                    <span className="ed-numeral ed-serif ed-num" style={{ fontSize: 16, color: t.color, paddingTop: 2 }}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="ed-serif" style={{ fontSize: 14.5, lineHeight: 1.5, color: "var(--ed-ink)" }}>
                      {mk}
                    </span>
                  </li>
                ))}
              </ol>
            )}

            {m.keyConcepts && m.keyConcepts.length > 0 && (
              <>
                <div className="ed-eyebrow" style={{ marginBottom: 12 }}>Key concepts</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  {m.keyConcepts.slice(0, 5).map((kc, i) => (
                    <div key={i}>
                      <div className="ed-serif" style={{ fontSize: 14, fontWeight: 600, color: "var(--ed-ink)", marginBottom: 2 }}>
                        {kc.term}
                      </div>
                      <div style={{ fontSize: 12.5, lineHeight: 1.5, color: "var(--ed-ink-2)", fontFamily: "var(--ed-serif)" }}>
                        {kc.definition}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </aside>
        </div>
      </div>

      {/* Mobile collapse — both grids stack vertically below 720px */}
      <style>{`
        @media (max-width: 720px) {
          .ed-chapter-grid, .ed-detail-grid, .ed-toc-grid { grid-template-columns: 1fr !important; gap: 32px !important; }
        }
      `}</style>
    </div>
  );
}
