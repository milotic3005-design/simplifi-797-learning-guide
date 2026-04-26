export default function ProgressBar({ value, total }) {
  const pct = total === 0 ? 0 : Math.round((value / total) * 100);
  let color = "bg-red-500";
  if (pct === 100) color = "bg-green-500";
  else if (pct >= 67) color = "bg-blue-500";
  else if (pct >= 34) color = "bg-yellow-500";

  return (
    <div className="w-full">
      <div className="flex items-center justify-between text-sm mb-1.5">
        <span className="font-medium text-slate-700 dark:text-slate-200">
          Overall progress
        </span>
        <span className="text-slate-600 dark:text-slate-300 tabular-nums">
          {value} / {total} completed · {pct}%
        </span>
      </div>
      <div className="h-2.5 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
        <div
          className={`h-full ${color} transition-all duration-300`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
