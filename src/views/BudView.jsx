import data from "../data/bud-and-iso.json";

const colorMap = {
  warning: {
    border: "border-orange-400 dark:border-orange-600",
    bg: "bg-orange-50 dark:bg-orange-900/30",
    badge: "bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-200",
  },
  success: {
    border: "border-green-400 dark:border-green-700",
    bg: "bg-green-50 dark:bg-green-900/30",
    badge: "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200",
  },
};

function BudCell({ label, value }) {
  return (
    <div className="rounded border border-slate-200 dark:border-slate-700 bg-white/60 dark:bg-slate-900/40 p-3">
      <div className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-1">
        {label}
      </div>
      <div className="font-medium text-slate-900 dark:text-white">{value}</div>
    </div>
  );
}

function CategoryCard({ cat }) {
  const c = colorMap[cat.color] || colorMap.success;
  const isCompound = cat.bud && (cat.bud.aqueous || cat.bud.nonaqueous);

  return (
    <div className={`rounded-lg border ${c.border} ${c.bg} p-4`}>
      <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
        <h3 className="font-semibold text-slate-900 dark:text-white">{cat.label}</h3>
        <span className={`text-xs px-2 py-0.5 rounded-full ${c.badge}`}>
          {cat.id}
        </span>
      </div>

      {cat.environmentRequired && (
        <p className="text-sm text-slate-700 dark:text-slate-300 mb-3">
          <strong>Environment:</strong> {cat.environmentRequired}
        </p>
      )}
      {cat.requirements && (
        <ul className="text-sm text-slate-700 dark:text-slate-300 list-disc list-inside space-y-1 mb-3">
          {cat.requirements.map((r, i) => (
            <li key={i}>{r}</li>
          ))}
        </ul>
      )}

      {isCompound ? (
        <div className="space-y-3">
          {cat.bud.aqueous && (
            <div>
              <div className="text-sm font-semibold text-slate-800 dark:text-slate-100 mb-2">
                Aqueous
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <BudCell label="Room temp" value={cat.bud.aqueous.roomTemp} />
                <BudCell label="Refrigerated" value={cat.bud.aqueous.refrigerated} />
                <BudCell label="Frozen" value={cat.bud.aqueous.frozen} />
              </div>
            </div>
          )}
          {cat.bud.nonaqueous && (
            <div>
              <div className="text-sm font-semibold text-slate-800 dark:text-slate-100 mb-2">
                Nonaqueous
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <BudCell label="Room temp" value={cat.bud.nonaqueous.roomTemp} />
                <BudCell label="Refrigerated" value={cat.bud.nonaqueous.refrigerated} />
                <BudCell label="Frozen" value={cat.bud.nonaqueous.frozen} />
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <BudCell label="Room temp" value={cat.bud.roomTemp} />
          <BudCell label="Refrigerated" value={cat.bud.refrigerated} />
          <BudCell label="Frozen" value={cat.bud.frozen} />
        </div>
      )}
    </div>
  );
}

export default function BudView() {
  const b = data.budReference;
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">
          {b.title}
        </h2>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{b.note}</p>
      </div>

      <div className="space-y-4">
        {b.categories.map((cat) => (
          <CategoryCard key={cat.id} cat={cat} />
        ))}
      </div>

      <div className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4">
        <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
          Critical distinctions — common mistakes
        </h3>
        <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-200">
          {b.criticalDistinctions.map((d, i) => (
            <li
              key={i}
              className="pl-3 py-1.5 border-l-4 border-amber-400 bg-amber-50 dark:bg-amber-900/20 rounded-r"
            >
              {d}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
