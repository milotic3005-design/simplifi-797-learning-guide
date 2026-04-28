import data from "../data/bud-and-iso.json";

function tagFor(cat) {
  if (cat.id === "immediate-use")
    return { label: "Immediate-Use", accent: "var(--warning)", accent2: "var(--warning-2)", tint: "var(--warning-tint)" };
  if (cat.id === "category-1")
    return { label: "Cat 1", accent: "var(--warning)", accent2: "var(--warning-2)", tint: "var(--warning-tint)" };
  if (cat.id === "category-2-no-test")
    return { label: "Cat 2 · no test", accent: "var(--success)", accent2: "var(--success-2)", tint: "var(--success-tint)" };
  if (cat.id === "category-2-sterility-tested")
    return { label: "Cat 2 · sterility tested", accent: "var(--success)", accent2: "var(--success-2)", tint: "var(--success-tint)" };
  if (cat.id === "category-3")
    return { label: "Cat 3 · NEW 2023", accent: "var(--plum)", accent2: "var(--plum-2)", tint: "var(--plum-tint)" };
  return { label: "", accent: "var(--ink)", accent2: "var(--ink-2)", tint: "rgba(15,17,35,0.06)" };
}

function BudCell({ label, value, accent }) {
  const isNa = /not (applicable|permitted)/i.test(value);
  return (
    <div className="glass-flat px-3.5 py-3">
      <div
        className="text-[10px] font-bold tracking-widest uppercase mb-1.5"
        style={{ color: "var(--ink-3)" }}
      >
        {label}
      </div>
      <div
        className="font-display text-[20px] font-semibold leading-none tracking-tight font-num"
        style={{ color: isNa ? "var(--ink-3)" : "var(--ink)" }}
      >
        {value}
      </div>
    </div>
  );
}

function CategoryTile({ cat, idx, span }) {
  const c = tagFor(cat);
  const isCompound = cat.bud && (cat.bud.aqueous || cat.bud.nonaqueous);

  return (
    <article
      className={`glass bento-tile ${span} p-5 sm:p-6 fade-up`}
      style={{
        animationDelay: `${idx * 0.04}s`,
        background: `radial-gradient(at 0% 0%, ${c.tint}, transparent 60%), var(--glass-bg)`,
      }}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center font-display text-[14px] font-bold"
            style={{
              background: `linear-gradient(135deg, ${c.accent2}, ${c.accent})`,
              color: "#fff",
            }}
          >
            {(idx + 1).toString().padStart(2, "0")}
          </div>
          <span
            className="text-[10px] font-bold tracking-widest uppercase"
            style={{ color: c.accent }}
          >
            {c.label}
          </span>
        </div>
      </div>

      <h3
        className="font-display text-xl sm:text-2xl font-semibold leading-tight tracking-tight"
        style={{ color: "var(--ink)" }}
      >
        {cat.label}
      </h3>

      {cat.environmentRequired && (
        <p
          className="mt-2 text-[13.5px] leading-relaxed"
          style={{ color: "var(--ink-2)" }}
        >
          <span className="smallcaps mr-2">Environment</span>
          {cat.environmentRequired}
        </p>
      )}

      {cat.requirements && (
        <ul className="mt-4 space-y-1.5">
          {cat.requirements.map((r, i) => (
            <li
              key={i}
              className="text-[13.5px] flex gap-2"
              style={{ color: "var(--ink-2)" }}
            >
              <span style={{ color: c.accent }}>·</span>
              {r}
            </li>
          ))}
        </ul>
      )}

      <div className="mt-5 space-y-4">
        {isCompound ? (
          <>
            {cat.bud.aqueous && (
              <div>
                <div
                  className="text-[10px] font-bold tracking-widest uppercase mb-2"
                  style={{ color: c.accent }}
                >
                  Aqueous
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <BudCell label="Room temp" value={cat.bud.aqueous.roomTemp} />
                  <BudCell label="Refrigerated" value={cat.bud.aqueous.refrigerated} />
                  <BudCell label="Frozen" value={cat.bud.aqueous.frozen} />
                </div>
              </div>
            )}
            {cat.bud.nonaqueous && (
              <div>
                <div
                  className="text-[10px] font-bold tracking-widest uppercase mb-2"
                  style={{ color: c.accent }}
                >
                  Non-aqueous
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <BudCell label="Room temp" value={cat.bud.nonaqueous.roomTemp} />
                  <BudCell label="Refrigerated" value={cat.bud.nonaqueous.refrigerated} />
                  <BudCell label="Frozen" value={cat.bud.nonaqueous.frozen} />
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="grid grid-cols-3 gap-2">
            <BudCell label="Room temp" value={cat.bud.roomTemp} />
            <BudCell label="Refrigerated" value={cat.bud.refrigerated} />
            <BudCell label="Frozen" value={cat.bud.frozen} />
          </div>
        )}
      </div>

      {cat.note && (
        <p
          className="mt-4 text-[12.5px] leading-relaxed italic"
          style={{ color: "var(--ink-3)" }}
        >
          {cat.note}
        </p>
      )}
    </article>
  );
}

const SPANS = ["b-2", "b-2", "b-2", "b-2", "b-4"]; // last (Cat 3) full width

export default function BudView() {
  const b = data.budReference;
  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Hero */}
      <section className="glass p-6 sm:p-8 fade-up">
        <div className="eyebrow mb-3">§ Reference</div>
        <h2
          className="font-display text-3xl sm:text-4xl md:text-5xl font-semibold leading-[1.05] tracking-tight"
          style={{ color: "var(--ink)" }}
        >
          {b.title}
        </h2>
        <p
          className="mt-3 max-w-2xl text-[15px] leading-relaxed"
          style={{ color: "var(--ink-2)" }}
        >
          {b.note}
        </p>
      </section>

      {/* Categories bento */}
      <section className="bento" data-bento-stagger>
        {b.categories.map((cat, i) => (
          <CategoryTile
            key={cat.id}
            cat={cat}
            idx={i}
            span={SPANS[i] || "b-2"}
          />
        ))}
      </section>

      {/* Critical distinctions */}
      <section className="glass p-6 sm:p-7 fade-up">
        <div
          className="text-[10px] font-bold tracking-widest uppercase mb-4"
          style={{ color: "var(--danger)" }}
        >
          ※ Critical distinctions — common mistakes
        </div>
        <ol className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
          {b.criticalDistinctions.map((d, i) => (
            <li
              key={i}
              className="glass-flat px-4 py-3 text-[13.5px] leading-relaxed flex gap-3"
              style={{
                borderLeft: "3px solid var(--danger)",
                color: "var(--ink)",
              }}
            >
              <span
                className="font-num text-[11px] font-bold shrink-0"
                style={{ color: "var(--danger)" }}
              >
                ※{(i + 1).toString().padStart(2, "0")}
              </span>
              <span>{d}</span>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
