import { useEffect, useMemo, useRef, useState } from "react";
import { lessonMap } from "../data/lessons";
import courses from "../data/courses.json";

/* =============================================================
   Editorial Lesson View
   - Three-column layout: outline rail (260) · main (680) · glossary (240)
   - Drop caps, term tooltips, inline self-check checkpoints
   - Full-bleed clinical case feature
   - Top reading-progress bar with live "X min left"
   ============================================================= */

// ── theme map (editorial palette) ─────────────────────────────
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

// ── helpers ───────────────────────────────────────────────────
function findModule(courseId) {
  return courses.modules.find((m) => m.courses.some((c) => c.id === courseId));
}
function getWordCount(lesson) {
  return lesson.sections.reduce((n, s) => n + s.body.trim().split(/\s+/).length, 0);
}
function getReadingMinutes(words) {
  return Math.max(4, Math.round(words / 230));
}

// ── term-aware prose: wrap key-term phrases inline ────────────
function renderTermAwareProse(body, keyTerms) {
  if (!keyTerms?.length) return body;
  const terms = [...keyTerms].sort((a, b) => b.term.length - a.term.length);
  const escape = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const pattern = new RegExp("\\b(" + terms.map((t) => escape(t.term)).join("|") + ")\\b", "i");

  const parts = [];
  let remaining = body;
  let safety = 0;
  while (remaining && safety++ < 200) {
    const m = remaining.match(pattern);
    if (!m) { parts.push({ kind: "text", value: remaining }); break; }
    const idx = m.index;
    if (idx > 0) parts.push({ kind: "text", value: remaining.slice(0, idx) });
    const matched = terms.find((t) => t.term.toLowerCase() === m[0].toLowerCase());
    parts.push({ kind: "term", value: m[0], def: matched });
    remaining = remaining.slice(idx + m[0].length);
  }
  return parts.map((p, i) =>
    p.kind === "term" ? <Term key={i} term={p.def}>{p.value}</Term> : <span key={i}>{p.value}</span>
  );
}

function Term({ term, children }) {
  const [open, setOpen] = useState(false);
  if (!term) return <>{children}</>;
  return (
    <span
      className="ed-term"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onClick={() => setOpen((o) => !o)}
    >
      {children}
      {open && (
        <span className="ed-term-tip">
          <span className="label">Key term</span>
          <strong style={{ display: "block", marginBottom: 4, fontFamily: "var(--ed-serif)" }}>{term.term}</strong>
          {term.definition}
        </span>
      )}
    </span>
  );
}

// ── checkpoint card ───────────────────────────────────────────
function Checkpoint({ q, idx, total, onReveal }) {
  const [revealed, setRevealed] = useState(false);
  return (
    <aside className="ed-checkpoint ed-fade-in">
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 10 }}>
        <div className="ed-eyebrow-accent" style={{ color: "var(--ed-accent)" }}>
          ¶ Self-check · {String(idx + 1).padStart(2, "0")} of {String(total).padStart(2, "0")}
        </div>
        <div className="ed-eyebrow ed-num" style={{ fontSize: 10 }}>Reflect before revealing</div>
      </div>
      <p
        className="ed-serif"
        style={{
          fontSize: 22, lineHeight: 1.35, fontWeight: 500, margin: "4px 0 14px 0",
          color: "var(--ed-ink)", textWrap: "balance", letterSpacing: "-0.01em",
        }}
      >
        {q.question}
      </p>
      {!revealed ? (
        <button
          className="ed-btn-ghost"
          onClick={() => { setRevealed(true); onReveal?.(idx); }}
        >
          Reveal answer
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M2 6h8M7 3l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      ) : (
        <div className="ed-reveal ed-fade-in">
          <div className="ed-eyebrow-accent" style={{ color: "var(--ed-accent-deep)", marginBottom: 6 }}>Answer</div>
          <div className="ed-serif" style={{ fontSize: 16, lineHeight: 1.55, marginBottom: 10, color: "var(--ed-ink)" }}>
            <span className="ed-hl">{q.answer}</span>
          </div>
          <div style={{ fontSize: 13, lineHeight: 1.55, color: "var(--ed-ink-2)", fontStyle: "italic", fontFamily: "var(--ed-serif)" }}>
            {q.explanation}
          </div>
        </div>
      )}
    </aside>
  );
}

// ── clinical case feature (full-bleed editorial) ──────────────
function ClinicalFeature({ ex, theme }) {
  return (
    <section
      className="ed-fade-in"
      style={{
        margin: "56px 0",
        borderTop: `2px solid ${theme.color}`,
        borderBottom: `2px solid ${theme.color}`,
        padding: "36px 40px",
        background: theme.soft,
        position: "relative",
      }}
    >
      <div style={{ position: "absolute", top: -1, left: 0, height: 4, width: 64, background: theme.color }} />
      <div className="ed-eyebrow-accent" style={{ color: theme.color, marginBottom: 10 }}>
        ¶ Clinical case · From the bench
      </div>

      <p className="ed-pullquote" style={{ borderLeft: "none", padding: 0, fontSize: 30, marginBottom: 24 }}>
        “{ex.scenario}”
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 32,
          borderTop: "1px solid var(--rule)",
          paddingTop: 22,
        }}
      >
        <div>
          <div className="ed-eyebrow" style={{ marginBottom: 8 }}>Pharmacist's reading</div>
          <p className="ed-serif" style={{ fontSize: 15.5, lineHeight: 1.62, color: "var(--ed-ink-2)", margin: 0 }}>
            {ex.analysis}
          </p>
        </div>
        <div>
          <div className="ed-eyebrow" style={{ marginBottom: 8, color: theme.color }}>Takeaway</div>
          <p
            className="ed-serif"
            style={{ fontSize: 17, lineHeight: 1.45, color: "var(--ed-ink)", margin: 0, fontWeight: 500, textWrap: "balance" }}
          >
            {ex.takeaway}
          </p>
        </div>
      </div>
    </section>
  );
}

// ── individual section ────────────────────────────────────────
function LessonSection({ section, idx, total, refEl, lesson }) {
  const isFirst = idx === 0;
  const paragraphs = section.body.split(/\n\n+/);

  return (
    <section ref={refEl} data-section-idx={idx} style={{ marginBottom: 56, scrollMarginTop: 28 }}>
      <header
        style={{
          display: "grid",
          gridTemplateColumns: "60px 1fr",
          gap: 20,
          alignItems: "baseline",
          marginBottom: 22,
        }}
      >
        <div className="ed-numeral ed-serif" style={{ fontSize: 38, lineHeight: 1, textAlign: "right" }}>
          {String(idx + 1).padStart(2, "0")}
        </div>
        <div>
          <div className="ed-eyebrow" style={{ marginBottom: 6 }}>
            § Section {idx + 1} of {total}
          </div>
          <h2
            className="ed-serif"
            style={{
              fontSize: 36,
              lineHeight: 1.1,
              fontWeight: 500,
              letterSpacing: "-0.018em",
              margin: 0,
              color: "var(--ed-ink)",
              textWrap: "balance",
            }}
          >
            {section.heading}
          </h2>
        </div>
      </header>

      <div style={{ display: "grid", gridTemplateColumns: "60px 1fr", gap: 20 }}>
        <div>
          {isFirst && (
            <div
              style={{
                fontFamily: "var(--ed-sans)",
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "var(--ed-ink-3)",
                writingMode: "vertical-rl",
                transform: "rotate(180deg)",
                marginTop: 8,
              }}
            >
              Begin reading
            </div>
          )}
        </div>
        <div className="ed-prose">
          {paragraphs.map((para, pi) => (
            <p key={pi} className={isFirst && pi === 0 ? "ed-dropcap" : ""}>
              {renderTermAwareProse(para, lesson.keyTerms)}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── scroll-spy hook ───────────────────────────────────────────
function useScrollSpy(sectionRefs, scrollEl) {
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const root = scrollEl?.current;
    if (!root) return;
    const onScroll = () => {
      const top = root.scrollTop;
      const h = root.scrollHeight - root.clientHeight;
      setProgress(h > 0 ? Math.min(1, Math.max(0, top / h)) : 0);

      let activeIdx = 0;
      let bestPos = -Infinity;
      sectionRefs.current.forEach((el, i) => {
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const rootRect = root.getBoundingClientRect();
        const rel = rect.top - rootRect.top;
        if (rel < root.clientHeight * 0.3 && rel > bestPos) {
          bestPos = rel;
          activeIdx = i;
        }
      });
      setActive(activeIdx);
    };
    root.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => root.removeEventListener("scroll", onScroll);
  }, [sectionRefs, scrollEl]);

  return { active, progress };
}

// ============================================================
// MAIN — LessonView
// ============================================================
export default function LessonView({
  courseId,
  onBack,
  completed,
  setComplete,
  lessonState,
  updateLesson,
  markStarted,
}) {
  const lesson = lessonMap[courseId];
  const module = findModule(courseId);
  const theme = THEME_FOR_MODULE[module?.id || 1] || THEME_FOR_MODULE[1];

  const scrollRef = useRef(null);
  const sectionRefs = useRef([]);
  sectionRefs.current = [];

  const { active: activeSection, progress } = useScrollSpy(sectionRefs, scrollRef);

  useEffect(() => {
    if (lesson) markStarted(courseId);
  }, [courseId, lesson, markStarted]);

  const wordCount = useMemo(() => (lesson ? getWordCount(lesson) : 0), [lesson]);
  const readMin = getReadingMinutes(wordCount);
  const remainingMin = Math.max(0, Math.round(readMin * (1 - progress)));

  const setRef = (el, i) => { sectionRefs.current[i] = el; };

  const scrollToSection = (i) => {
    const el = sectionRefs.current[i];
    if (el && scrollRef.current) {
      const rect = el.getBoundingClientRect();
      const rootRect = scrollRef.current.getBoundingClientRect();
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollTop + rect.top - rootRect.top - 24,
        behavior: "smooth",
      });
    }
  };

  if (!lesson) {
    return (
      <div className="space-y-4 fade-up">
        <button onClick={onBack} className="btn-ghost">← Back</button>
        <div className="glass p-8" style={{ color: "var(--ink-2)" }}>
          No lesson content for {courseId}.
        </div>
      </div>
    );
  }

  const isComplete = !!completed[courseId];

  // ── interleave sections + checkpoints + clinical ──
  const sectionStream = [];
  lesson.sections.forEach((s, i) => {
    sectionStream.push({ kind: "section", section: s, idx: i });
    if (lesson.selfCheck[Math.floor(i / 2)] && i % 2 === 1) {
      const qIdx = Math.floor(i / 2);
      sectionStream.push({ kind: "check", q: lesson.selfCheck[qIdx], idx: qIdx });
    }
  });
  sectionStream.push({ kind: "clinical" });
  lesson.selfCheck.forEach((q, qi) => {
    if (qi >= Math.ceil(lesson.sections.length / 2)) {
      sectionStream.push({ kind: "check", q, idx: qi });
    }
  });

  return (
    <div
      className={`editorial theme-${theme.name}`}
      style={{
        // Break out of the parent container's max-width and padding
        position: "fixed",
        inset: 0,
        zIndex: 40,
        background: "var(--paper)",
        display: "grid",
        gridTemplateColumns: "260px 1fr 240px",
        gridTemplateRows: "64px 1fr",
        gridTemplateAreas: '"top top top" "rail main aside"',
        color: "var(--ed-ink)",
        overflow: "hidden",
      }}
    >
      {/* ============= TOP BAR ============= */}
      <header
        style={{
          gridArea: "top",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "0 32px",
          borderBottom: "1px solid var(--rule)",
          background: "var(--paper)",
          position: "relative", zIndex: 10,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <button
            onClick={onBack}
            className="ed-btn-link"
            style={{ borderBottom: "none", display: "flex", alignItems: "center", gap: 6 }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M9 3L5 7l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Module {String(module?.id || 0).padStart(2, "0")}
          </button>
          <div style={{ width: 1, height: 18, background: "var(--rule)" }} />
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span className="ed-serif" style={{ fontSize: 18, fontWeight: 600, letterSpacing: "-0.01em" }}>
              First Air
            </span>
            <span style={{
              fontSize: 11, fontWeight: 600, letterSpacing: "0.16em",
              textTransform: "uppercase", color: "var(--ed-ink-3)",
            }}>
              · USP 797
            </span>
          </div>
        </div>

        <div style={{ flex: 1, maxWidth: 380, margin: "0 32px", display: "flex", alignItems: "center", gap: 14 }}>
          <span className="ed-num ed-eyebrow" style={{ fontSize: 11, color: "var(--ed-ink-2)" }}>
            {Math.round(progress * 100)}%
          </span>
          <div style={{ flex: 1, height: 2, background: "var(--rule)", position: "relative" }}>
            <div style={{
              position: "absolute", top: 0, left: 0, height: "100%",
              background: theme.color, width: `${progress * 100}%`, transition: "width 0.2s ease",
            }} />
          </div>
          <span className="ed-num ed-eyebrow" style={{ fontSize: 11, color: "var(--ed-ink-3)" }}>
            ~{remainingMin} min left
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span className="ed-tag" style={{ borderColor: theme.color, color: theme.color }}>
            {theme.label}
          </span>
          <span className="ed-tag ed-num">{lesson.id}</span>
        </div>
      </header>

      {/* ============= LEFT RAIL — OUTLINE ============= */}
      <nav
        style={{
          gridArea: "rail",
          padding: "32px 24px 32px 32px",
          borderRight: "1px solid var(--rule)",
          overflowY: "auto",
          background: "var(--paper)",
        }}
      >
        <div className="ed-eyebrow" style={{ marginBottom: 14 }}>Contents</div>

        <div className="ed-rail">
          {lesson.sections.map((s, i) => {
            const state = i === activeSection ? "active" : i < activeSection ? "done" : "idle";
            return (
              <button
                key={i}
                className="ed-rail-section"
                data-state={state}
                onClick={() => scrollToSection(i)}
              >
                <div className="ed-rail-num">§{String(i + 1).padStart(2, "0")}</div>
                <div className="ed-rail-title">{s.heading}</div>
              </button>
            );
          })}
          <div
            className="ed-rail-section"
            data-state={progress > 0.7 ? "active" : "idle"}
            style={{ marginTop: 8, borderTop: "1px solid var(--ed-ink)", paddingTop: 14 }}
          >
            <div className="ed-rail-num" style={{ color: "var(--ed-accent)" }}>★</div>
            <div className="ed-rail-title" style={{ color: "var(--ed-accent)" }}>Clinical case</div>
          </div>
          <div className="ed-rail-section" data-state={progress > 0.85 ? "active" : "idle"}>
            <div className="ed-rail-num" style={{ color: "var(--ed-accent)" }}>?</div>
            <div className="ed-rail-title" style={{ color: "var(--ed-accent)" }}>
              Self-check ({lesson.selfCheck.length})
            </div>
          </div>
        </div>

        <div style={{ marginTop: 32, paddingTop: 20, borderTop: "1px solid var(--rule)" }}>
          <div className="ed-eyebrow" style={{ marginBottom: 10 }}>Status</div>
          <div style={{ fontSize: 12, color: "var(--ed-ink-2)", lineHeight: 1.55 }}>
            {isComplete ? "✓ Marked complete" : "Reading in progress…"}
          </div>
        </div>
      </nav>

      {/* ============= MAIN — READING ============= */}
      <main
        ref={scrollRef}
        style={{
          gridArea: "main",
          overflowY: "auto",
          padding: "48px 80px 200px",
          scrollBehavior: "smooth",
        }}
      >
        {/* Title block */}
        <div style={{ maxWidth: 680, margin: "0 auto 64px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }}>
            <span className="ed-num ed-serif" style={{ fontSize: 14, color: theme.color, fontWeight: 600 }}>
              Lesson {lesson.id}
            </span>
            <span style={{ width: 24, height: 1, background: theme.color }} />
            <span className="ed-eyebrow-accent" style={{ color: theme.color }}>
              {theme.label} · Module {String(module?.id || 0).padStart(2, "0")}
            </span>
          </div>

          <h1
            className="ed-serif"
            style={{
              fontSize: 56,
              lineHeight: 1.05,
              fontWeight: 500,
              letterSpacing: "-0.025em",
              margin: "0 0 28px 0",
              color: "var(--ed-ink)",
              textWrap: "balance",
            }}
          >
            {lesson.title}
          </h1>

          <div style={{
            borderTop: "1px solid var(--ed-ink)",
            borderBottom: "1px solid var(--rule)",
            padding: "20px 0",
            margin: "24px 0 0 0",
          }}>
            <div className="ed-eyebrow" style={{ marginBottom: 14 }}>After this lesson you will</div>
            <ol style={{ margin: 0, padding: 0, listStyle: "none" }}>
              {lesson.objectives.map((o, i) => (
                <li
                  key={i}
                  style={{
                    display: "grid", gridTemplateColumns: "32px 1fr", gap: 12,
                    padding: "8px 0",
                    borderBottom: i < lesson.objectives.length - 1 ? "1px dotted var(--rule)" : "none",
                  }}
                >
                  <span className="ed-numeral ed-serif ed-num" style={{ fontSize: 14, paddingTop: 2 }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="ed-serif" style={{ fontSize: 16, lineHeight: 1.45, color: "var(--ed-ink)" }}>
                    {o}
                  </span>
                </li>
              ))}
            </ol>
          </div>

          <div
            style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "14px 0",
              borderBottom: "1px solid var(--rule)",
              fontSize: 12, color: "var(--ed-ink-3)",
            }}
          >
            <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
              <span><span className="ed-num" style={{ color: "var(--ed-ink)", fontWeight: 600 }}>{readMin}</span> min read</span>
              <span><span className="ed-num" style={{ color: "var(--ed-ink)", fontWeight: 600 }}>{wordCount}</span> words</span>
              <span><span className="ed-num" style={{ color: "var(--ed-ink)", fontWeight: 600 }}>{lesson.sections.length}</span> sections</span>
              <span><span className="ed-num" style={{ color: "var(--ed-ink)", fontWeight: 600 }}>{lesson.keyTerms.length}</span> key terms</span>
            </div>
            <span className="ed-smallcaps">Hover any italicized term for its definition</span>
          </div>
        </div>

        {/* Body */}
        <article style={{ maxWidth: 680, margin: "0 auto" }}>
          {sectionStream.map((item) => {
            if (item.kind === "section") {
              return (
                <LessonSection
                  key={`s-${item.idx}`}
                  section={item.section}
                  idx={item.idx}
                  total={lesson.sections.length}
                  refEl={(el) => setRef(el, item.idx)}
                  lesson={lesson}
                />
              );
            }
            if (item.kind === "check") {
              return (
                <Checkpoint
                  key={`c-${item.idx}`}
                  q={item.q}
                  idx={item.idx}
                  total={lesson.selfCheck.length}
                  onReveal={() =>
                    updateLesson(courseId, { selfCheckComplete: true })
                  }
                />
              );
            }
            if (item.kind === "clinical") {
              return <ClinicalFeature key="clin" ex={lesson.clinicalExample} theme={theme} />;
            }
            return null;
          })}

          {/* End-of-lesson */}
          <div style={{ borderTop: "2px solid var(--ed-ink)", paddingTop: 32, marginTop: 40 }}>
            <div className="ed-eyebrow" style={{ marginBottom: 12 }}>End of lesson</div>
            <h3
              className="ed-serif"
              style={{ fontSize: 28, fontWeight: 500, lineHeight: 1.2, margin: "0 0 24px 0", letterSpacing: "-0.015em" }}
            >
              You've reached the bottom of {lesson.id}.
            </h3>
            <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
              <button
                onClick={() => setComplete(courseId, !isComplete)}
                className={isComplete ? "ed-btn-ghost" : "ed-btn"}
              >
                {isComplete ? "✓ Marked complete" : "Mark complete"}
                {!isComplete && <span style={{ marginLeft: 4 }}>✓</span>}
              </button>
              <button onClick={onBack} className="ed-btn-ghost">Back to module →</button>
              <span style={{ marginLeft: "auto", fontSize: 12, color: "var(--ed-ink-3)" }}>
                Progress saves automatically.
              </span>
            </div>
          </div>
        </article>
      </main>

      {/* ============= RIGHT ASIDE — GLOSSARY ============= */}
      <aside
        style={{
          gridArea: "aside",
          padding: "32px 28px",
          borderLeft: "1px solid var(--rule)",
          overflowY: "auto",
          background: "var(--paper-2)",
        }}
      >
        <div className="ed-eyebrow" style={{ marginBottom: 16 }}>Glossary · in this lesson</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {lesson.keyTerms.map((kt, i) => (
            <div key={i} style={{ borderBottom: "1px dotted var(--rule)", paddingBottom: 14 }}>
              <div
                className="ed-serif"
                style={{
                  fontSize: 14.5, fontWeight: 600, letterSpacing: "-0.005em",
                  color: "var(--ed-ink)", marginBottom: 4,
                }}
              >
                {kt.term}
              </div>
              <div className="ed-serif" style={{ fontSize: 13, lineHeight: 1.5, color: "var(--ed-ink-2)" }}>
                {kt.definition}
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 28, padding: 16, background: "var(--paper)", border: "1px solid var(--rule)" }}>
          <div className="ed-eyebrow-accent" style={{ color: theme.color, marginBottom: 8 }}>
            ¶ Phase context
          </div>
          <div className="ed-serif" style={{ fontSize: 13, lineHeight: 1.55, color: "var(--ed-ink-2)" }}>
            This lesson is part of <strong style={{ color: "var(--ed-ink)" }}>{theme.label}</strong> — Module {String(module?.id || 0).padStart(2, "0")} of 8.
            Plan to revisit Key Terms before tackling the next module.
          </div>
        </div>
      </aside>
    </div>
  );
}
