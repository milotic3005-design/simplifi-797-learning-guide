import courses from "../data/courses.json";

/* =============================================================
   Editorial Table of Contents
   Replaces the bento module grid with a journal-style ToC
   grouped by study phase, with serif numerals and per-module
   accent colors.
   ============================================================= */

const THEME_FOR_MODULE = {
  1: { name: "info",    label: "Foundations",    color: "var(--ed-info)" },
  2: { name: "info",    label: "Engineering",    color: "var(--ed-info)" },
  3: { name: "neutral", label: "Personnel",      color: "var(--ed-neutral)" },
  4: { name: "success", label: "Sampling",       color: "var(--ed-success)" },
  5: { name: "success", label: "Sanitization",   color: "var(--ed-success)" },
  6: { name: "success", label: "Aseptic",        color: "var(--ed-success)" },
  7: { name: "warning", label: "Sterilization",  color: "var(--ed-warning)" },
  8: { name: "danger",  label: "Hazardous",      color: "var(--ed-danger)" },
};

const PHASES = [
  { num: "I",   label: "Foundations", modules: [1, 2, 3] },
  { num: "II",  label: "Practice",    modules: [4, 5, 6] },
  { num: "III", label: "Advanced",    modules: [7, 8] },
];

function ProgressLine({ done, total, color }) {
  const pct = total > 0 ? (done / total) * 100 : 0;
  const status = pct === 100 ? "COMPLETE" : pct === 0 ? "NOT STARTED" : "IN PROGRESS";
  return (
    <div>
      <div style={{ height: 1, background: "var(--rule)", position: "relative", marginBottom: 4 }}>
        <div style={{ position: "absolute", top: -1, left: 0, height: 3, width: `${pct}%`, background: color }} />
      </div>
      <div style={{ fontSize: 10, color: "var(--ed-ink-3)", letterSpacing: "0.06em" }}>
        {status}
      </div>
    </div>
  );
}

function Stat({ label, value, accent }) {
  return (
    <div style={{ textAlign: "right" }}>
      <div
        className="ed-numeral ed-serif ed-num"
        style={{ fontSize: 36, fontWeight: 500, lineHeight: 1, color: accent ? "var(--ed-accent)" : "var(--ed-ink)" }}
      >
        {value}
      </div>
      <div className="ed-eyebrow" style={{ fontSize: 10, marginTop: 4 }}>{label}</div>
    </div>
  );
}

export default function ModulesView({
  completed,
  reset,
  onOpenModule,
  user,
  onOpenAuth,
}) {
  const totalCourses = courses.modules.reduce((n, m) => n + m.courses.length, 0);
  const completedCount = courses.modules.reduce(
    (n, m) => n + m.courses.filter((c) => completed[c.id]).length,
    0
  );

  return (
    <div className="editorial" style={{ background: "var(--paper)", minHeight: "calc(100vh - 140px)", margin: "-24px -16px 0", padding: "48px 64px 96px" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>

        {/* ── Masthead ── */}
        <header style={{ marginBottom: 56 }}>
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 18, flexWrap: "wrap", gap: 12 }}>
            <div className="ed-eyebrow-accent" style={{ color: "var(--ed-accent)" }}>
              First Air · USP 797 (2023 Revised)
            </div>
            <div className="ed-eyebrow ed-num" style={{ fontSize: 11 }}>
              Vol. 01 · Edition 2023
            </div>
          </div>
          <div style={{ borderTop: "2px solid var(--ed-ink)", borderBottom: "1px solid var(--ed-ink)", padding: "14px 0" }}>
            <h1
              className="ed-serif"
              style={{
                fontSize: "clamp(48px, 8vw, 96px)",
                lineHeight: 0.95,
                fontWeight: 500,
                letterSpacing: "-0.04em",
                margin: 0,
                color: "var(--ed-ink)",
                textWrap: "balance",
              }}
            >
              Sterile compounding,<br />
              <em style={{ fontStyle: "italic", color: "var(--ed-accent)" }}>
                from first air to final release.
              </em>
            </h1>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginTop: 14, gap: 24, flexWrap: "wrap" }}>
            <p
              className="ed-serif"
              style={{ fontSize: 18, lineHeight: 1.5, color: "var(--ed-ink-2)", margin: 0, maxWidth: 540 }}
            >
              Eight modules. Twenty-eight lessons. A study companion for the pharmacist who already knows the medicine.
            </p>
            <div style={{ display: "flex", gap: 32 }}>
              <Stat label="Lessons" value={totalCourses} />
              <Stat label="Done" value={completedCount} accent />
              <Stat label="Modules" value={courses.meta.totalModules} />
            </div>
          </div>
        </header>

        {/* ── Sign-in nudge (guests) ── */}
        {!user && (
          <div
            style={{
              borderLeft: "2px solid var(--ed-accent)",
              padding: "12px 0 12px 18px",
              marginBottom: 48,
              display: "flex", alignItems: "center", justifyContent: "space-between",
              gap: 16, flexWrap: "wrap",
            }}
          >
            <div>
              <div className="ed-eyebrow-accent" style={{ color: "var(--ed-accent)", marginBottom: 4 }}>
                ¶ Reader's note
              </div>
              <p className="ed-serif" style={{ fontSize: 14.5, lineHeight: 1.5, color: "var(--ed-ink-2)", margin: 0, maxWidth: 600 }}>
                Sign in to keep your progress in sync across devices, or read on as a guest — your checkmarks save to this device.
              </p>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={onOpenAuth} className="ed-btn">Sign in</button>
              <button onClick={() => { if (confirm("Clear all progress?")) reset(); }} className="ed-btn-ghost">Reset</button>
            </div>
          </div>
        )}

        {/* ── Table of contents ── */}
        <div style={{ display: "grid", gridTemplateColumns: "180px 1fr", gap: 56, marginBottom: 40 }} className="ed-toc-grid">
          <aside style={{ position: "sticky", top: 24, alignSelf: "start" }}>
            <div className="ed-eyebrow" style={{ marginBottom: 14 }}>Table of contents</div>
            <div className="ed-serif" style={{ fontSize: 14, lineHeight: 1.6, color: "var(--ed-ink-2)" }}>
              Eight chapters, organised in three study phases. Read them in order; each chapter assumes its predecessors.
            </div>
          </aside>

          <div>
            {PHASES.map((phase) => (
              <section key={phase.num} style={{ marginBottom: 48 }}>
                <div
                  style={{
                    display: "flex", alignItems: "baseline", gap: 16,
                    marginBottom: 18, paddingBottom: 10,
                    borderBottom: "1px solid var(--ed-ink)",
                  }}
                >
                  <span
                    className="ed-numeral ed-serif"
                    style={{ fontSize: 32, fontWeight: 500, color: "var(--ed-accent)" }}
                  >
                    {phase.num}
                  </span>
                  <h2
                    className="ed-serif"
                    style={{ fontSize: 28, fontWeight: 500, letterSpacing: "-0.015em", margin: 0, color: "var(--ed-ink)" }}
                  >
                    Phase {phase.num} · {phase.label}
                  </h2>
                  <span className="ed-eyebrow ed-num" style={{ marginLeft: "auto", fontSize: 11 }}>
                    {phase.modules.length} chapters
                  </span>
                </div>

                <div>
                  {phase.modules.map((mid) => {
                    const m = courses.modules.find((x) => x.id === mid);
                    if (!m) return null;
                    const t = THEME_FOR_MODULE[m.id];
                    const done = m.courses.filter((c) => completed[c.id]).length;
                    return (
                      <button
                        key={m.id}
                        onClick={() => onOpenModule(m.id)}
                        className="ed-toc-row"
                        style={{
                          display: "grid",
                          gridTemplateColumns: "70px 1fr 200px 120px 24px",
                          gap: 24,
                          alignItems: "baseline",
                          padding: "22px 0",
                          borderBottom: "1px solid var(--rule)",
                          background: "transparent",
                          border: 0,
                          borderBottom: "1px solid var(--rule)",
                          textAlign: "left",
                          cursor: "pointer",
                          color: "var(--ed-ink)",
                          width: "100%",
                          fontFamily: "var(--ed-sans)",
                          transition: "background 0.15s ease, padding 0.15s ease",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = "var(--paper-2)";
                          e.currentTarget.style.paddingLeft = "12px";
                          e.currentTarget.style.paddingRight = "12px";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = "transparent";
                          e.currentTarget.style.paddingLeft = "0";
                          e.currentTarget.style.paddingRight = "0";
                        }}
                      >
                        <span
                          className="ed-numeral ed-serif ed-num"
                          style={{
                            fontSize: 56, fontWeight: 500, lineHeight: 0.9,
                            color: t.color, alignSelf: "start",
                          }}
                        >
                          {m.number}
                        </span>
                        <div>
                          <div className="ed-eyebrow-accent" style={{ color: t.color, marginBottom: 6, fontSize: 10 }}>
                            {t.label}{m.tag ? ` · ${m.tag}` : ""}
                          </div>
                          <div
                            className="ed-serif"
                            style={{
                              fontSize: 24, fontWeight: 500, letterSpacing: "-0.015em",
                              lineHeight: 1.15, marginBottom: 4, color: "var(--ed-ink)",
                            }}
                          >
                            {m.title}
                          </div>
                          <div style={{ fontSize: 12, color: "var(--ed-ink-3)" }}>
                            {m.courses
                              .slice(0, 3)
                              .map((c) => c.title.split(" for ")[0].split(" — ")[0])
                              .join(" · ")}
                            {m.courses.length > 3 && ` · +${m.courses.length - 3} more`}
                          </div>
                        </div>
                        <div style={{ fontSize: 12, color: "var(--ed-ink-2)" }}>
                          <ProgressLine done={done} total={m.courses.length} color={t.color} />
                        </div>
                        <div className="ed-num ed-smallcaps" style={{ fontSize: 13, color: "var(--ed-ink-2)", textAlign: "right" }}>
                          {String(done).padStart(2, "0")} / {String(m.courses.length).padStart(2, "0")}
                          <div style={{ fontSize: 10, color: "var(--ed-ink-3)", marginTop: 2, letterSpacing: "0.16em" }}>
                            lessons
                          </div>
                        </div>
                        <div style={{ color: "var(--ed-ink-3)", fontSize: 18, alignSelf: "center" }}>›</div>
                      </button>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>
        </div>

        <footer
          style={{
            marginTop: 80, paddingTop: 24,
            borderTop: "2px solid var(--ed-ink)",
            display: "flex", justifyContent: "space-between", alignItems: "baseline",
            color: "var(--ed-ink-3)", fontSize: 11, fontFamily: "var(--ed-sans)",
          }}
        >
          <span className="ed-smallcaps">First Air · A study companion</span>
          <span className="ed-num">Edition {courses.meta.version}</span>
        </footer>
      </div>
    </div>
  );
}
