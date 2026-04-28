import data from "../data/bud-and-iso.json";

const colorFor = (color) => {
  switch (color) {
    case "info":    return { accent: "var(--info)",    accent2: "var(--info-2)",    tint: "var(--info-tint)" };
    case "success": return { accent: "var(--success)", accent2: "var(--success-2)", tint: "var(--success-tint)" };
    case "warning": return { accent: "var(--warning)", accent2: "var(--warning-2)", tint: "var(--warning-tint)" };
    default:        return { accent: "var(--ink)",     accent2: "var(--ink-2)",     tint: "rgba(15,17,35,0.06)" };
  }
};

function IsoTile({ klass, idx }) {
  const c = colorFor(klass.color);
  return (
    <article
      className="glass bento-tile b-2 p-5 sm:p-7 fade-up flex flex-col"
      style={{
        animationDelay: `${idx * 0.05}s`,
        background: `radial-gradient(at 100% 0%, ${c.tint}, transparent 60%), var(--glass-bg)`,
      }}
    >
      <div className="flex items-baseline justify-between mb-4">
        <div>
          <div
            className="text-[10px] font-bold tracking-widest uppercase mb-1"
            style={{ color: "var(--ink-3)" }}
          >
            {klass.commonName}
          </div>
          <div
            className="font-display font-bold leading-none tracking-tight"
            style={{
              fontSize: "clamp(64px, 8vw, 96px)",
              background: `linear-gradient(135deg, ${c.accent2}, ${c.accent})`,
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            {klass.isoLevel}
          </div>
          <div
            className="text-[11px] font-medium mt-1"
            style={{ color: "var(--ink-3)" }}
          >
            ISO Class
          </div>
        </div>
      </div>

      <dl className="space-y-3 text-[13.5px]">
        <Row label="Examples">
          <ul className="space-y-0.5">
            {klass.examples.map((e, i) => (
              <li key={i} style={{ color: "var(--ink)" }}>
                · {e}
              </li>
            ))}
          </ul>
        </Row>
        <Row label="Particle limit">
          <span className="font-num" style={{ color: "var(--ink)" }}>
            {klass.particleLimit}
          </span>
        </Row>
        <Row label="HVAC">{klass.hvac}</Row>
        <Row label="Role">{klass.role}</Row>
        {klass.certificationFrequency && (
          <Row label="Cert">{klass.certificationFrequency}</Row>
        )}
      </dl>
    </article>
  );
}

function Row({ label, children }) {
  return (
    <div className="grid grid-cols-[100px_1fr] gap-3 hairline-t pt-2.5">
      <dt
        className="text-[10px] font-bold tracking-widest uppercase"
        style={{ color: "var(--ink-3)" }}
      >
        {label}
      </dt>
      <dd style={{ color: "var(--ink)" }}>{children}</dd>
    </div>
  );
}

export default function IsoView() {
  const iso = data.isoClassification;
  const cmp = iso.scaVsCleanroom;

  return (
    <div className="space-y-6 sm:space-y-8">
      <section className="glass p-6 sm:p-8 fade-up">
        <div className="eyebrow mb-3">§ Reference</div>
        <h2
          className="font-display text-3xl sm:text-4xl md:text-5xl font-semibold leading-[1.05] tracking-tight"
          style={{ color: "var(--ink)" }}
        >
          {iso.title}
        </h2>
        <p
          className="mt-3 max-w-2xl text-[15px] leading-relaxed"
          style={{ color: "var(--ink-2)" }}
        >
          Three classes anchor every cleanroom decision: where compounding
          happens, what BUDs are achievable, and how the program is certified.
        </p>
      </section>

      <section className="bento" data-bento-stagger>
        {iso.classes.map((k, i) => (
          <IsoTile key={k.isoLevel} klass={k} idx={i} />
        ))}
      </section>

      {/* SCA vs Cleanroom */}
      <section>
        <div className="mb-5">
          <div className="eyebrow mb-2">¶ Comparison</div>
          <h3
            className="font-display text-2xl sm:text-3xl font-semibold leading-tight tracking-tight"
            style={{ color: "var(--ink)" }}
          >
            {cmp.title}
          </h3>
        </div>
        <div className="bento">
          <article
            className="glass b-2 p-6 fade-up"
            style={{
              background: `radial-gradient(at 0% 0%, var(--warning-tint), transparent 60%), var(--glass-bg)`,
            }}
          >
            <div
              className="text-[10px] font-bold tracking-widest uppercase mb-2"
              style={{ color: "var(--warning)" }}
            >
              ◦ Limited
            </div>
            <h4
              className="font-display text-xl font-semibold mb-2 tracking-tight"
              style={{ color: "var(--ink)" }}
            >
              {cmp.sca.label}
            </h4>
            <p
              className="text-[14px] leading-relaxed mb-4"
              style={{ color: "var(--ink-2)" }}
            >
              {cmp.sca.description}
            </p>
            <dl className="space-y-2 text-[13.5px]">
              <Row label="Max BUD">{cmp.sca.maxBUD}</Row>
              <Row label="Cert">{cmp.sca.certificationRequired}</Row>
            </dl>
            <div
              className="mt-4 p-3.5 r-md text-[13px] leading-relaxed"
              style={{
                background: "var(--danger-tint)",
                border: "1px solid rgba(244,63,94,0.2)",
              }}
            >
              <div
                className="text-[10px] font-bold tracking-widest uppercase mb-1.5"
                style={{ color: "var(--danger)" }}
              >
                ※ Common mistake
              </div>
              <span style={{ color: "var(--ink)" }}>{cmp.sca.commonMistake}</span>
            </div>
          </article>
          <article
            className="glass b-2 p-6 fade-up"
            style={{
              background: `radial-gradient(at 100% 0%, var(--success-tint), transparent 60%), var(--glass-bg)`,
              animationDelay: "0.06s",
            }}
          >
            <div
              className="text-[10px] font-bold tracking-widest uppercase mb-2"
              style={{ color: "var(--success)" }}
            >
              ◦ Eligible
            </div>
            <h4
              className="font-display text-xl font-semibold mb-2 tracking-tight"
              style={{ color: "var(--ink)" }}
            >
              {cmp.cleanroom.label}
            </h4>
            <p
              className="text-[14px] leading-relaxed mb-4"
              style={{ color: "var(--ink-2)" }}
            >
              {cmp.cleanroom.description}
            </p>
            <dl className="space-y-2 text-[13.5px]">
              <Row label="Max BUD">{cmp.cleanroom.maxBUD}</Row>
              <Row label="Cert">{cmp.cleanroom.certificationRequired}</Row>
            </dl>
          </article>
        </div>
      </section>
    </div>
  );
}
