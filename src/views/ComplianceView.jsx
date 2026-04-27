import { useEffect, useMemo, useState } from "react";
import data from "../data/compliance-matrix.json";
import { cls } from "../themes";

const KEY = "simplifi797.compliance.v1";

function useCheckpointState() {
  const [state, setState] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(KEY)) || {};
    } catch {
      return {};
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch {
      /* ignore */
    }
  }, [state]);
  const set = (id, val) =>
    setState((s) => ({ ...s, [id]: val }));
  const reset = () => setState({});
  return [state, set, reset];
}

function StatusPill({ status }) {
  const map = {
    pass: { label: "Pass", color: "var(--success)", bg: "var(--success-tint)" },
    gap: { label: "Gap", color: "var(--danger)", bg: "var(--danger-tint)" },
    review: { label: "Review", color: "var(--warning)", bg: "var(--warning-tint)" },
  };
  const cur = map[status];
  if (!cur) return null;
  return (
    <span
      className="font-mono text-[10px] tracking-widest uppercase px-2 py-0.5"
      style={{ color: cur.color, background: cur.bg }}
    >
      {cur.label}
    </span>
  );
}

function CheckpointRow({ cp, status, onStatus }) {
  const [open, setOpen] = useState(false);
  return (
    <li
      className="border-t py-5"
      style={{ borderColor: "var(--rule-soft)" }}
    >
      <div className="grid grid-cols-[80px_1fr_auto] gap-4 items-baseline">
        <div className="font-mono text-[11px] tabular-nums" style={{ color: "var(--ink-3)" }}>
          {cp.id}
        </div>
        <div>
          <button
            onClick={() => setOpen((v) => !v)}
            className="text-left group"
          >
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <StatusPill status={status} />
              <span className="font-mono text-[10px] tracking-widest uppercase" style={{ color: "var(--ink-3)" }}>
                TJC · {cp.tjcFocus}
              </span>
            </div>
            <p
              className="font-display text-[17px] leading-snug"
              style={{ fontVariationSettings: '"SOFT" 30' }}
            >
              {cp.objective}
            </p>
          </button>
          {open && (
            <div className="mt-3 fade-in space-y-3">
              <div>
                <div className="smallcaps mb-1">Acceptance criterion</div>
                <p className="text-[14.5px] leading-relaxed" style={{ color: "var(--ink-2)" }}>
                  {cp.criterion}
                </p>
              </div>
              <div>
                <div className="smallcaps mb-1">Evidence to produce</div>
                <ul className="space-y-1 text-[14px]" style={{ color: "var(--ink-2)" }}>
                  {cp.evidence.map((e, i) => (
                    <li key={i} className="flex gap-2">
                      <span style={{ color: "var(--ink-3)" }}>·</span>
                      <span>{e}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
        <div className="flex items-center gap-1">
          {[
            { v: "pass", label: "✓", title: "Mark pass", color: "var(--success)" },
            { v: "review", label: "?", title: "Mark for review", color: "var(--warning)" },
            { v: "gap", label: "✗", title: "Mark gap", color: "var(--danger)" },
          ].map((b) => (
            <button
              key={b.v}
              onClick={() => onStatus(status === b.v ? null : b.v)}
              title={b.title}
              className="w-7 h-7 inline-flex items-center justify-center font-mono text-sm border transition-colors"
              style={{
                color: status === b.v ? "var(--paper)" : b.color,
                background: status === b.v ? b.color : "transparent",
                borderColor: status === b.v ? b.color : "var(--rule)",
              }}
            >
              {b.label}
            </button>
          ))}
        </div>
      </div>
    </li>
  );
}

function ModuleSection({ mod, state, onStatus }) {
  const c = cls(mod.theme);
  const counts = mod.checkpoints.reduce(
    (acc, cp) => {
      const s = state[cp.id];
      if (s === "pass") acc.pass++;
      else if (s === "gap") acc.gap++;
      else if (s === "review") acc.review++;
      return acc;
    },
    { pass: 0, gap: 0, review: 0, total: mod.checkpoints.length }
  );

  return (
    <article
      className="fade-up py-12 border-t"
      style={{ borderColor: "var(--rule)" }}
    >
      <div className="grid md:grid-cols-[140px_1fr] gap-6">
        <div>
          <div
            className="chapter-num text-5xl"
            style={{ color: c.accent }}
          >
            {mod.moduleNumber}
          </div>
          <div
            className="font-mono text-[10px] tracking-widest uppercase mt-2"
            style={{ color: c.accent }}
          >
            {c.label}
          </div>
        </div>
        <div className="space-y-6">
          <div>
            <h3
              className="font-display text-2xl sm:text-3xl font-normal leading-tight tracking-tight mb-2"
              style={{ fontVariationSettings: '"SOFT" 30' }}
            >
              {mod.title}
            </h3>
            <div className="font-mono text-[11px]" style={{ color: "var(--ink-3)" }}>
              {mod.tag}
            </div>
            <div className="mt-3 flex items-center gap-3 flex-wrap text-[11px]">
              {mod.primaryRefs.map((r) => (
                <span
                  key={r}
                  className="font-mono px-2 py-0.5"
                  style={{ background: c.tint, color: c.accent }}
                >
                  {r}
                </span>
              ))}
            </div>
          </div>

          {/* Status summary */}
          <div className="flex items-center gap-4 text-[11px] font-mono tabular-nums">
            <span style={{ color: "var(--success)" }}>✓ {counts.pass}</span>
            <span style={{ color: "var(--warning)" }}>? {counts.review}</span>
            <span style={{ color: "var(--danger)" }}>✗ {counts.gap}</span>
            <span style={{ color: "var(--ink-3)" }}>· {counts.total} total</span>
          </div>

          {/* Key metrics */}
          <details className="border-t pt-4" style={{ borderColor: "var(--rule)" }}>
            <summary
              className="smallcaps cursor-pointer hover:text-ink"
              style={{ color: "var(--ink-2)" }}
            >
              ¶ Key metrics — quick reference ({mod.keyMetrics.length})
            </summary>
            <dl className="mt-4 space-y-0">
              {mod.keyMetrics.map((m, i) => (
                <div
                  key={i}
                  className="grid md:grid-cols-[180px_1fr] gap-2 md:gap-6 py-2.5 border-t"
                  style={{ borderColor: "var(--rule-soft)" }}
                >
                  <dt className="smallcaps">{m.label}</dt>
                  <dd className="text-[14px] leading-relaxed" style={{ color: "var(--ink)" }}>
                    {m.value}
                  </dd>
                </div>
              ))}
            </dl>
          </details>

          {/* Checkpoints */}
          <div>
            <div className="smallcaps mb-2">¶ Checkpoints</div>
            <ol className="space-y-0">
              {mod.checkpoints.map((cp) => (
                <CheckpointRow
                  key={cp.id}
                  cp={cp}
                  status={state[cp.id]}
                  onStatus={(v) => onStatus(cp.id, v)}
                />
              ))}
            </ol>
          </div>
        </div>
      </div>
    </article>
  );
}

export default function ComplianceView() {
  const [state, setStatus, reset] = useCheckpointState();

  const allCheckpoints = useMemo(
    () => data.modules.flatMap((m) => m.checkpoints),
    []
  );
  const totals = allCheckpoints.reduce(
    (acc, cp) => {
      const s = state[cp.id];
      if (s === "pass") acc.pass++;
      else if (s === "gap") acc.gap++;
      else if (s === "review") acc.review++;
      return acc;
    },
    { pass: 0, gap: 0, review: 0, total: allCheckpoints.length }
  );
  const score = totals.total === 0 ? 0 : Math.round((totals.pass / totals.total) * 100);

  return (
    <div className="space-y-14">
      <section className="fade-up">
        <div className="smallcaps mb-3">§ VI — Inspection readiness</div>
        <h2
          className="font-display text-4xl sm:text-5xl md:text-6xl font-light leading-[0.95] tracking-tight"
          style={{ fontVariationSettings: '"SOFT" 50, "WONK" 1' }}
        >
          {data.meta.title}
        </h2>
        <p
          className="mt-4 max-w-3xl text-[16px] leading-relaxed"
          style={{ color: "var(--ink-2)" }}
        >
          {data.meta.subtitle}
        </p>

        {/* Sources */}
        <details className="mt-5 max-w-3xl">
          <summary
            className="smallcaps cursor-pointer"
            style={{ color: "var(--ink-2)" }}
          >
            ¶ Primary sources ({data.meta.primarySources.length})
          </summary>
          <ul className="mt-3 space-y-1.5 text-[13px]" style={{ color: "var(--ink-2)" }}>
            {data.meta.primarySources.map((s, i) => (
              <li key={i} className="flex gap-2">
                <span style={{ color: "var(--ink-3)" }}>·</span>
                <span>{s}</span>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-[12px] italic" style={{ color: "var(--ink-3)" }}>
            {data.meta.validationNote}
          </p>
        </details>

        <div className="rule-thick mt-8" style={{ background: "var(--ink)" }} />
      </section>

      {/* Score header */}
      <section className="fade-up-2 grid md:grid-cols-[1fr_auto] gap-6 items-end">
        <div>
          <div className="smallcaps mb-2">Readiness score</div>
          <div
            className="font-display leading-none tracking-tight"
            style={{
              fontSize: "clamp(72px, 12vw, 160px)",
              fontWeight: 200,
              fontVariationSettings: '"SOFT" 60, "WONK" 1',
              color: score >= 90 ? "var(--success)" : score >= 70 ? "var(--info)" : score >= 40 ? "var(--warning)" : "var(--danger)",
            }}
          >
            {score}
            <span className="text-[0.4em]" style={{ color: "var(--ink-3)" }}>%</span>
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-4 font-mono text-[12px] tabular-nums">
            <span style={{ color: "var(--success)" }}>✓ {totals.pass} pass</span>
            <span style={{ color: "var(--warning)" }}>? {totals.review} review</span>
            <span style={{ color: "var(--danger)" }}>✗ {totals.gap} gap</span>
            <span style={{ color: "var(--ink-3)" }}>· {totals.total - totals.pass - totals.review - totals.gap} unmarked</span>
            <span style={{ color: "var(--ink-3)" }}>· {totals.total} total</span>
          </div>
        </div>
        <div className="text-right space-y-2">
          <button
            onClick={() => {
              if (confirm("Clear all checkpoint statuses?")) reset();
            }}
            className="btn-ghost"
          >
            Reset
          </button>
          <div className="font-mono text-[11px]" style={{ color: "var(--ink-3)" }}>
            Statuses save locally
          </div>
        </div>
      </section>

      {/* Modules */}
      <section>
        {data.modules.map((mod) => (
          <ModuleSection
            key={mod.id}
            mod={mod}
            state={state}
            onStatus={setStatus}
          />
        ))}
        <div className="border-t" style={{ borderColor: "var(--rule)" }} />
      </section>

      {/* TJC index */}
      <section className="fade-up">
        <div className="smallcaps mb-3">¶ TJC standards index</div>
        <h3
          className="font-display text-3xl font-light leading-tight tracking-tight mb-6"
          style={{ fontVariationSettings: '"SOFT" 40, "WONK" 1' }}
        >
          Most-cited focus areas
        </h3>
        <dl className="grid md:grid-cols-2 gap-x-10">
          {data.tjcCrossReference.map((r, i) => (
            <div
              key={i}
              className="grid grid-cols-[100px_1fr] gap-3 py-3 border-t"
              style={{ borderColor: "var(--rule)" }}
            >
              <dt className="font-mono text-[12px]" style={{ color: "var(--ink)" }}>
                {r.code}
              </dt>
              <dd className="text-[14px] leading-relaxed" style={{ color: "var(--ink-2)" }}>
                {r.topic}
              </dd>
            </div>
          ))}
        </dl>
      </section>
    </div>
  );
}
