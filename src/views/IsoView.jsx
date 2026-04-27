import data from "../data/bud-and-iso.json";

const colorFor = (color) => {
  switch (color) {
    case "info":    return { accent: "var(--info)",    tint: "var(--info-tint)" };
    case "success": return { accent: "var(--success)", tint: "var(--success-tint)" };
    case "warning": return { accent: "var(--warning)", tint: "var(--warning-tint)" };
    default:        return { accent: "var(--ink)",     tint: "var(--paper-3)" };
  }
};

function IsoCard({ klass, idx }) {
  const c = colorFor(klass.color);
  return (
    <article
      className="fade-up py-12 border-t grid md:grid-cols-[260px_1fr] gap-8"
      style={{
        borderColor: "var(--rule)",
        animationDelay: `${idx * 0.06}s`,
      }}
    >
      {/* Display number */}
      <div>
        <div className="smallcaps mb-3">{klass.commonName}</div>
        <div
          className="font-display leading-[0.85] tracking-[-0.04em]"
          style={{
            fontSize: "clamp(120px, 16vw, 200px)",
            fontWeight: 200,
            fontVariationSettings: '"SOFT" 60, "WONK" 1',
            color: c.accent,
          }}
        >
          {klass.isoLevel}
        </div>
        <div
          className="font-mono text-xs mt-2"
          style={{ color: "var(--ink-3)" }}
        >
          ISO Class
        </div>
      </div>

      {/* Detail rows */}
      <dl className="space-y-0">
        <Row label="Examples" value={
          <ul className="space-y-1">
            {klass.examples.map((e, i) => (
              <li key={i} className="text-[15px]" style={{ color: "var(--ink)" }}>· {e}</li>
            ))}
          </ul>
        } />
        <Row label="Particle limit" value={
          <span className="font-mono text-[15px]">{klass.particleLimit}</span>
        } />
        <Row label="HVAC" value={klass.hvac} />
        <Row label="Role" value={klass.role} />
        {klass.certificationFrequency && (
          <Row label="Certification" value={klass.certificationFrequency} />
        )}
      </dl>
    </article>
  );
}

function Row({ label, value }) {
  return (
    <div
      className="grid md:grid-cols-[140px_1fr] gap-2 md:gap-6 py-4 border-t"
      style={{ borderColor: "var(--rule)" }}
    >
      <dt className="smallcaps">{label}</dt>
      <dd className="text-[15.5px] leading-relaxed" style={{ color: "var(--ink)" }}>
        {value}
      </dd>
    </div>
  );
}

export default function IsoView() {
  const iso = data.isoClassification;
  const cmp = iso.scaVsCleanroom;

  return (
    <div className="space-y-14">
      {/* Header */}
      <section className="fade-up">
        <div className="smallcaps mb-3">§ III — Reference</div>
        <h2
          className="font-display text-4xl sm:text-5xl md:text-6xl font-light leading-[0.95] tracking-tight"
          style={{ fontVariationSettings: '"SOFT" 50, "WONK" 1' }}
        >
          {iso.title}
        </h2>
        <p
          className="mt-4 max-w-2xl text-[16px] leading-relaxed"
          style={{ color: "var(--ink-2)" }}
        >
          Three classes anchor every cleanroom decision: where compounding happens,
          what BUDs are achievable, and how the program is certified.
        </p>
        <div className="rule-thick mt-8" style={{ background: "var(--ink)" }} />
      </section>

      {/* ISO classes */}
      <section>
        {iso.classes.map((k, i) => (
          <IsoCard key={k.isoLevel} klass={k} idx={i} />
        ))}
        <div className="border-t" style={{ borderColor: "var(--rule)" }} />
      </section>

      {/* SCA vs Cleanroom comparison */}
      <section className="fade-up">
        <div className="smallcaps mb-3">¶ Comparison</div>
        <h3
          className="font-display text-3xl font-light leading-tight tracking-tight mb-8"
          style={{ fontVariationSettings: '"SOFT" 40, "WONK" 1' }}
        >
          {cmp.title}
        </h3>
        <div className="grid md:grid-cols-2 gap-0 md:gap-12">
          <div
            className="border-t pt-6"
            style={{ borderColor: "var(--warning)", borderTopWidth: "3px" }}
          >
            <div className="smallcaps mb-3" style={{ color: "var(--warning)" }}>
              ◦ Limited
            </div>
            <h4
              className="font-display text-2xl mb-3"
              style={{ fontVariationSettings: '"SOFT" 30' }}
            >
              {cmp.sca.label}
            </h4>
            <p className="text-[15px] leading-relaxed mb-5" style={{ color: "var(--ink-2)" }}>
              {cmp.sca.description}
            </p>
            <Row label="Max BUD" value={cmp.sca.maxBUD} />
            <Row label="Cert" value={cmp.sca.certificationRequired} />
            <div
              className="mt-5 px-5 py-4 text-[14px] leading-relaxed"
              style={{
                background: "var(--danger-tint)",
                borderLeft: "3px solid var(--danger)",
              }}
            >
              <div className="smallcaps mb-2" style={{ color: "var(--danger)" }}>
                ※ Common mistake
              </div>
              {cmp.sca.commonMistake}
            </div>
          </div>
          <div
            className="border-t pt-6 mt-10 md:mt-0"
            style={{ borderColor: "var(--success)", borderTopWidth: "3px" }}
          >
            <div className="smallcaps mb-3" style={{ color: "var(--success)" }}>
              ◦ Eligible
            </div>
            <h4
              className="font-display text-2xl mb-3"
              style={{ fontVariationSettings: '"SOFT" 30' }}
            >
              {cmp.cleanroom.label}
            </h4>
            <p className="text-[15px] leading-relaxed mb-5" style={{ color: "var(--ink-2)" }}>
              {cmp.cleanroom.description}
            </p>
            <Row label="Max BUD" value={cmp.cleanroom.maxBUD} />
            <Row label="Cert" value={cmp.cleanroom.certificationRequired} />
          </div>
        </div>
      </section>
    </div>
  );
}
