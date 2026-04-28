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
  const set = (id, val) => setState((s) => ({ ...s, [id]: val }));
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
      className="chip"
      style={{ color: cur.color, background: cur.bg, borderColor: cur.color + "33" }}
    >
      {cur.label}
    </span>
  );
}

function StatusButtons({ status, onStatus }) {
  const buttons = [
    { v: "pass", label: "✓", color: "var(--success)" },
    { v: "review", label: "?", color: "var(--warning)" },
    { v: "gap", label: "✗", color: "var(--danger)" },
  ];
  return (
    <div className="flex items-center gap-1.5">
      {buttons.map((b) => (
        <button
          key={b.v}
          onClick={() => onStatus(status === b.v ? null : b.v)}
          className="w-8 h-8 inline-flex items-center justify-center rounded-full text-[13px] font-bold transition-all"
          style={{
            color: status === b.v ? "#fff" : b.color,
            background: status === b.v ? b.color : "transparent",
            border: `1.5px solid ${status === b.v ? b.color : "var(--line-strong)"}`,
            boxShadow:
              status === b.v
                ? `0 4px 14px -4px ${b.color}80`
                : "none",
          }}
        >
          {b.label}
        </button>
      ))}
    </div>
  );
}

function CheckpointTile({ cp, status, onStatus }) {
  const [open, setOpen] = useState(false);
  return (
    <article className="glass-flat p-4 sm:p-5 fade-in">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className="font-num text-[10px] font-bold uppercase tracking-wider"
            style={{ color: "var(--ink-3)" }}
          >
            {cp.id}
          </span>
          <StatusPill status={status} />
          <span
            className="text-[10px] font-bold tracking-widest uppercase"
            style={{ color: "var(--ink-3)" }}
          >
            TJC · {cp.tjcFocus}
          </span>
        </div>
        <StatusButtons status={status} onStatus={onStatus} />
      </div>
      <button
        onClick={() => setOpen((v) => !v)}
        className="text-left w-full"
      >
        <p
          className="font-display text-[15.5px] sm:text-[16.5px] leading-snug font-semibold tracking-tight"
          style={{ color: "var(--ink)" }}
        >
          {cp.objective}
        </p>
        <span
          className="text-[11px] font-medium mt-1.5 inline-block"
          style={{ color: "var(--ink-2)" }}
        >
          {open ? "Hide details ↑" : "Show criterion + evidence ↓"}
        </span>
      </button>
      {open && (
        <div className="mt-3 space-y-3 fade-in">
          <div>
            <div
              className="text-[10px] font-bold tracking-widest uppercase mb-1"
              style={{ color: "var(--ink-3)" }}
            >
              Acceptance criterion
            </div>
            <p
              className="text-[13.5px] leading-relaxed"
              style={{ color: "var(--ink)" }}
            >
              {cp.criterion}
            </p>
          </div>
          <div>
            <div
              className="text-[10px] font-bold tracking-widest uppercase mb-1.5"
              style={{ color: "var(--ink-3)" }}
            >
              Evidence to produce
            </div>
            <ul className="space-y-1 text-[13px]">
              {cp.evidence.map((e, i) => (
                <li
                  key={i}
                  className="flex gap-2"
                  style={{ color: "var(--ink-2)" }}
                >
                  <span style={{ color: "var(--ink-3)" }}>·</span>
                  <span>{e}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </article>
  );
}

function ModuleCard({ mod, state, onStatus, span = "b-2" }) {
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
      className={`glass bento-tile ${span} p-5 sm:p-6 fade-up flex flex-col`}
      style={{
        background: `radial-gradient(at 100% 0%, ${c.tint}, transparent 60%), var(--glass-bg)`,
      }}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center font-display text-[14px] font-bold"
            style={{
              background: `linear-gradient(135deg, ${c.accent2 || c.accent}, ${c.accent})`,
              color: "#fff",
            }}
          >
            {mod.moduleNumber}
          </div>
          <span
            className="text-[10px] font-bold tracking-widest uppercase"
            style={{ color: c.accent }}
          >
            {c.label}
          </span>
        </div>
        <div
          className="font-num text-[11px] font-bold flex items-center gap-2.5"
          style={{ color: "var(--ink-2)" }}
        >
          <span style={{ color: "var(--success)" }}>✓{counts.pass}</span>
          <span style={{ color: "var(--warning)" }}>?{counts.review}</span>
          <span style={{ color: "var(--danger)" }}>✗{counts.gap}</span>
        </div>
      </div>
      <h3
        className="font-display text-xl sm:text-2xl font-semibold leading-tight tracking-tight"
        style={{ color: "var(--ink)" }}
      >
        {mod.title}
      </h3>
      <div
        className="text-[12px] mt-1.5 mb-4"
        style={{ color: "var(--ink-3)" }}
      >
        {mod.tag}
      </div>

      <div className="flex flex-wrap gap-1.5 mb-4">
        {mod.primaryRefs.map((r) => (
          <span
            key={r}
            className="chip font-num"
            style={{ background: c.tint, color: c.accent, borderColor: "transparent" }}
          >
            {r}
          </span>
        ))}
      </div>

      <details className="mb-4">
        <summary
          className="text-[11px] font-bold tracking-widest uppercase cursor-pointer hover:text-ink"
          style={{ color: "var(--ink-2)" }}
        >
          ¶ Key metrics ({mod.keyMetrics.length})
        </summary>
        <dl className="mt-3 space-y-1.5">
          {mod.keyMetrics.map((m, i) => (
            <div
              key={i}
              className="glass-flat px-3 py-2 grid md:grid-cols-[140px_1fr] gap-2"
            >
              <dt
                className="text-[10px] font-bold tracking-widest uppercase"
                style={{ color: c.accent }}
              >
                {m.label}
              </dt>
              <dd className="text-[12.5px] leading-relaxed" style={{ color: "var(--ink)" }}>
                {m.value}
              </dd>
            </div>
          ))}
        </dl>
      </details>

      <div className="space-y-2">
        {mod.checkpoints.map((cp) => (
          <CheckpointTile
            key={cp.id}
            cp={cp}
            status={state[cp.id]}
            onStatus={(v) => onStatus(cp.id, v)}
          />
        ))}
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
  const score =
    totals.total === 0 ? 0 : Math.round((totals.pass / totals.total) * 100);

  const scoreColor =
    score >= 90
      ? "var(--success)"
      : score >= 70
      ? "var(--info)"
      : score >= 40
      ? "var(--warning)"
      : "var(--danger)";

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Hero bento */}
      <section className="bento" data-bento-stagger>
        <article className="glass b-2 p-6 sm:p-8 fade-up">
          <div className="eyebrow mb-3">§ Inspection readiness</div>
          <h2
            className="font-display text-3xl sm:text-4xl md:text-5xl font-semibold leading-[1.05] tracking-tight"
            style={{ color: "var(--ink)" }}
          >
            {data.meta.title}
          </h2>
          <p
            className="mt-3 text-[14.5px] leading-relaxed"
            style={{ color: "var(--ink-2)" }}
          >
            {data.meta.subtitle}
          </p>
          <details className="mt-4">
            <summary
              className="text-[11px] font-bold tracking-widest uppercase cursor-pointer hover:text-ink"
              style={{ color: "var(--ink-2)" }}
            >
              ¶ Primary sources ({data.meta.primarySources.length})
            </summary>
            <ul
              className="mt-2 space-y-1 text-[12px]"
              style={{ color: "var(--ink-2)" }}
            >
              {data.meta.primarySources.map((s, i) => (
                <li key={i} className="flex gap-2">
                  <span style={{ color: "var(--ink-3)" }}>·</span>
                  <span>{s}</span>
                </li>
              ))}
            </ul>
            <p
              className="mt-2 text-[11.5px] italic"
              style={{ color: "var(--ink-3)" }}
            >
              {data.meta.validationNote}
            </p>
          </details>
        </article>

        {/* Score tile */}
        <article
          className="glass b-2 p-6 sm:p-7 fade-up flex flex-col justify-between min-h-[260px]"
          style={{
            background: `radial-gradient(at 100% 100%, ${scoreColor}26, transparent 60%), var(--glass-bg)`,
          }}
        >
          <div>
            <div className="eyebrow mb-3">Readiness score</div>
            <div
              className="font-display font-bold leading-none tracking-tight font-num"
              style={{
                fontSize: "clamp(72px, 11vw, 132px)",
                background: `linear-gradient(135deg, ${scoreColor}, var(--ink))`,
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {score}
              <span style={{ fontSize: "0.4em", color: "var(--ink-3)" }}>%</span>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-3 font-num text-[12px] font-medium flex-wrap">
              <span style={{ color: "var(--success)" }}>✓ {totals.pass} pass</span>
              <span style={{ color: "var(--warning)" }}>? {totals.review} review</span>
              <span style={{ color: "var(--danger)" }}>✗ {totals.gap} gap</span>
              <span style={{ color: "var(--ink-3)" }}>
                · {totals.total - totals.pass - totals.review - totals.gap} unmarked
              </span>
            </div>
            <button
              onClick={() => {
                if (confirm("Clear all checkpoint statuses?")) reset();
              }}
              className="btn-ghost"
            >
              Reset matrix
            </button>
          </div>
        </article>
      </section>

      {/* Modules bento */}
      <section className="bento" data-bento-stagger>
        {data.modules.map((mod, i) => (
          <ModuleCard
            key={mod.id}
            mod={mod}
            state={state}
            onStatus={setStatus}
            span={i === 4 ? "b-4" : "b-2"}
          />
        ))}
      </section>

      {/* TJC index */}
      <section className="glass p-6 sm:p-8 fade-up">
        <div className="eyebrow mb-3">¶ TJC standards</div>
        <h3
          className="font-display text-2xl sm:text-3xl font-semibold leading-tight tracking-tight mb-5"
          style={{ color: "var(--ink)" }}
        >
          Most-cited focus areas
        </h3>
        <dl className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {data.tjcCrossReference.map((r, i) => (
            <div
              key={i}
              className="glass-flat px-4 py-3 grid grid-cols-[110px_1fr] gap-3"
            >
              <dt
                className="font-num text-[12px] font-bold"
                style={{ color: "var(--info)" }}
              >
                {r.code}
              </dt>
              <dd
                className="text-[13px] leading-relaxed"
                style={{ color: "var(--ink-2)" }}
              >
                {r.topic}
              </dd>
            </div>
          ))}
        </dl>
      </section>
    </div>
  );
}
