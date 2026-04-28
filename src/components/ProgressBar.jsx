export default function ProgressBar({ value, total, compact = false }) {
  const pct = total === 0 ? 0 : Math.round((value / total) * 100);
  let bar = "bar-danger";
  if (pct === 100) bar = "bar-success";
  else if (pct >= 67) bar = "bar-info";
  else if (pct >= 34) bar = "bar-warning";

  return (
    <div className="w-full">
      {!compact && (
        <div className="flex items-baseline justify-between mb-2">
          <span className="smallcaps">Reading progress</span>
          <span
            className="font-num text-[12px] font-medium"
            style={{ color: "var(--ink-2)" }}
          >
            {value} / {total} · {pct}%
          </span>
        </div>
      )}
      <div
        className="h-1.5 w-full rounded-full overflow-hidden"
        style={{ background: "rgba(15,17,35,0.08)" }}
      >
        <div
          className={`h-full ${bar} transition-all duration-500 rounded-full`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
