import data from "../data/bud-and-iso.json";

const colorMap = {
  warning: { accent: "var(--warning)", tint: "var(--warning-tint)", label: "CAT 1 / IMMEDIATE" },
  success: { accent: "var(--success)", tint: "var(--success-tint)", label: "CAT 2" },
};

function BudCell({ label, value }) {
  const isNa = /not (applicable|permitted)/i.test(value);
  return (
    <div
      className="border-t pt-3 pb-1"
      style={{ borderColor: "var(--rule)" }}
    >
      <div className="smallcaps mb-1">{label}</div>
      <div
        className="font-display text-2xl leading-none tracking-tight"
        style={{
          fontVariationSettings: '"SOFT" 0, "WONK" 1',
          color: isNa ? "var(--ink-3)" : "var(--ink)",
        }}
      >
        {value}
      </div>
    </div>
  );
}

function CategoryCard({ cat, idx }) {
  const c = colorMap[cat.color] || colorMap.success;
  const isCompound = cat.bud && (cat.bud.aqueous || cat.bud.nonaqueous);

  return (
    <article
      className="fade-up border-t pt-8 pb-10"
      style={{
        borderColor: "var(--rule)",
        animationDelay: `${idx * 0.05}s`,
      }}
    >
      <div className="grid md:grid-cols-[140px_1fr] gap-6">
        <div>
          <div
            className="chapter-num text-5xl"
            style={{ color: c.accent }}
          >
            {(idx + 1).toString().padStart(2, "0")}
          </div>
          <div
            className="font-mono text-[10px] tracking-widest uppercase mt-3"
            style={{ color: c.accent }}
          >
            {c.label}
          </div>
        </div>
        <div className="space-y-6">
          <div>
            <h3
              className="font-display text-3xl font-normal leading-tight tracking-tight"
              style={{ fontVariationSettings: '"SOFT" 30, "WONK" 0' }}
            >
              {cat.label}
            </h3>
            {cat.environmentRequired && (
              <p
                className="mt-2 text-[15px] leading-relaxed"
                style={{ color: "var(--ink-2)" }}
              >
                <span className="smallcaps mr-2">Environment</span>
                {cat.environmentRequired}
              </p>
            )}
          </div>

          {cat.requirements && (
            <ul className="space-y-1.5">
              {cat.requirements.map((r, i) => (
                <li
                  key={i}
                  className="text-[15px] flex gap-3"
                  style={{ color: "var(--ink-2)" }}
                >
                  <span style={{ color: c.accent }}>·</span>
                  {r}
                </li>
              ))}
            </ul>
          )}

          {isCompound ? (
            <div className="space-y-6">
              {cat.bud.aqueous && (
                <div>
                  <div className="smallcaps mb-3" style={{ color: c.accent }}>
                    § Aqueous
                  </div>
                  <div className="grid grid-cols-3 gap-x-6 gap-y-2">
                    <BudCell label="Room temp" value={cat.bud.aqueous.roomTemp} />
                    <BudCell label="Refrigerated" value={cat.bud.aqueous.refrigerated} />
                    <BudCell label="Frozen" value={cat.bud.aqueous.frozen} />
                  </div>
                </div>
              )}
              {cat.bud.nonaqueous && (
                <div>
                  <div className="smallcaps mb-3" style={{ color: c.accent }}>
                    § Non-aqueous
                  </div>
                  <div className="grid grid-cols-3 gap-x-6 gap-y-2">
                    <BudCell label="Room temp" value={cat.bud.nonaqueous.roomTemp} />
                    <BudCell label="Refrigerated" value={cat.bud.nonaqueous.refrigerated} />
                    <BudCell label="Frozen" value={cat.bud.nonaqueous.frozen} />
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-x-6 gap-y-2">
              <BudCell label="Room temp" value={cat.bud.roomTemp} />
              <BudCell label="Refrigerated" value={cat.bud.refrigerated} />
              <BudCell label="Frozen" value={cat.bud.frozen} />
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

export default function BudView() {
  const b = data.budReference;
  return (
    <div className="space-y-12">
      <section className="fade-up">
        <div className="smallcaps mb-3">§ II — Reference</div>
        <h2
          className="font-display text-4xl sm:text-5xl md:text-6xl font-light leading-[0.95] tracking-tight"
          style={{ fontVariationSettings: '"SOFT" 50, "WONK" 1' }}
        >
          {b.title}
        </h2>
        <p
          className="mt-4 max-w-2xl text-[16px] leading-relaxed"
          style={{ color: "var(--ink-2)" }}
        >
          {b.note}
        </p>
        <div className="rule-thick mt-8" style={{ background: "var(--ink)" }} />
      </section>

      <section>
        {b.categories.map((cat, i) => (
          <CategoryCard key={cat.id} cat={cat} idx={i} />
        ))}
        <div className="border-t" style={{ borderColor: "var(--rule)" }} />
      </section>

      <section className="fade-up">
        <div className="smallcaps mb-4" style={{ color: "var(--danger)" }}>
          ※ Critical distinctions — common mistakes
        </div>
        <ul className="space-y-3">
          {b.criticalDistinctions.map((d, i) => (
            <li
              key={i}
              className="px-5 py-4 text-[15px] leading-relaxed"
              style={{
                background: "var(--danger-tint)",
                borderLeft: "3px solid var(--danger)",
              }}
            >
              <span
                className="font-mono text-[11px] tabular-nums mr-3"
                style={{ color: "var(--danger)" }}
              >
                ※ {(i + 1).toString().padStart(2, "0")}
              </span>
              {d}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
