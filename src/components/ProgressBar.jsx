export default function ProgressBar({ value, total }) {
  const pct = total === 0 ? 0 : Math.round((value / total) * 100);
  let bar = "bar-danger";
  if (pct === 100) bar = "bar-success";
  else if (pct >= 67) bar = "bar-info";
  else if (pct >= 34) bar = "bar-warning";

  return (
    <div className="w-full">
      <div className="flex items-baseline justify-between mb-2">
        <span className="smallcaps">Reading progress</span>
        <span className="font-mono text-xs tabular-nums" style={{ color: "var(--ink-2)" }}>
          {value} / {total} · {pct}%
        </span>
      </div>
      <div
        className="h-[3px] w-full"
        style={{ background: "var(--rule)" }}
      >
        <div
          className={`h-full ${bar} transition-all duration-500`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
