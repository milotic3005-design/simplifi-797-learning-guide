// SVG diagrams for lesson content.
// Conventions:
//  - Each diagram exports a default-less named component.
//  - Use Tailwind classes on wrappers; SVG strokes/fills use currentColor where they should
//    follow the active text theme. Accent colors use Tailwind palette via classNames.
//  - Diagrams are responsive: full width up to a max, height set via aspect-ratio.

const TEXT = "fill-ink";
const SUB = "fill-ink-2";
const STROKE = "stroke-rule";
const STROKE_DARK = "stroke-ink";

function Wrap({ vw = 600, vh = 360, children }) {
  return (
    <svg
      viewBox={`0 0 ${vw} ${vh}`}
      className="w-full max-w-3xl mx-auto block"
      style={{ height: "auto" }}
    >
      <defs>
        <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" className="fill-ink-2" />
        </marker>
        <marker id="arrow-info" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" className="fill-info" />
        </marker>
        <marker id="arrow-danger" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" className="fill-danger" />
        </marker>
        <marker id="arrow-success" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" className="fill-success" />
        </marker>
        <marker id="arrow-warning" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" className="fill-warning" />
        </marker>
      </defs>
      {children}
    </svg>
  );
}

// ------------------- MODULE 1 -------------------

export function MfrVsCr() {
  const items = (x, items, title, subtitle) => (
    <g transform={`translate(${x}, 30)`}>
      <rect width="270" height="280" rx="10" className="fill-info-tint stroke-info" strokeWidth="1.5" />
      <text x="135" y="32" textAnchor="middle" className={`${TEXT} font-bold`} fontSize="16">{title}</text>
      <text x="135" y="50" textAnchor="middle" className={SUB} fontSize="11">{subtitle}</text>
      <line x1="20" y1="64" x2="250" y2="64" className="stroke-info dark:stroke-info" strokeWidth="1" />
      {items.map((it, i) => (
        <g key={i} transform={`translate(20, ${82 + i * 28})`}>
          <circle cx="6" cy="6" r="3" className="fill-info" />
          <text x="18" y="10" className={TEXT} fontSize="12">{it}</text>
        </g>
      ))}
    </g>
  );
  return (
    <Wrap vw={600} vh={340}>
      {items(10, [
        "Approved formula (template)",
        "Ingredients & sources",
        "Equipment required",
        "Stability data & BUD basis",
        "Storage & labeling rules",
        "QC procedures",
        "NEVER changed at the bench",
      ], "MFR", "Master Formulation Record")}
      {items(320, [
        "Lot-specific batch record",
        "Date / time / personnel",
        "Actual lots used",
        "Calculations performed",
        "Deviations & resolutions",
        "Assigned BUD",
        "Pharmacist final sign-off",
      ], "CR", "Compounding Record")}
    </Wrap>
  );
}

export function DocumentationChain() {
  const Step = ({ x, label, sub }) => (
    <g transform={`translate(${x}, 60)`}>
      <rect width="120" height="80" rx="8" className="fill-paper-2 stroke-rule" strokeWidth="1.5" />
      <text x="60" y="38" textAnchor="middle" className={`${TEXT} font-semibold`} fontSize="14">{label}</text>
      <text x="60" y="58" textAnchor="middle" className={SUB} fontSize="11">{sub}</text>
    </g>
  );
  return (
    <Wrap vw={600} vh={200}>
      <text x="300" y="30" textAnchor="middle" className={`${TEXT} font-semibold`} fontSize="13">Every CSP must trace forward and backward through this chain</text>
      <Step x={10} label="MFR" sub="approved template" />
      <Step x={150} label="CR" sub="batch record" />
      <Step x={290} label="QA Release" sub="pharmacist verifies" />
      <Step x={430} label="Patient" sub="dispense + transport" />
      {[130, 270, 410].map((x, i) => (
        <line key={i} x1={x} y1={100} x2={x + 20} y2={100} className="stroke-ink-2" strokeWidth="2" markerEnd="url(#arrow)" />
      ))}
      <text x="300" y="180" textAnchor="middle" className={SUB} fontSize="11" fontStyle="italic">If it wasn't documented, it didn't happen.</text>
    </Wrap>
  );
}

export function CspLabel() {
  const Field = ({ x, y, label, value, w = 250 }) => (
    <g transform={`translate(${x}, ${y})`}>
      <rect width={w} height="42" rx="4" className="fill-paper-3 stroke-rule" strokeWidth="1" />
      <text x="8" y="14" className={SUB} fontSize="9">{label}</text>
      <text x="8" y="32" className={`${TEXT} font-mono`} fontSize="12">{value}</text>
    </g>
  );
  return (
    <Wrap vw={600} vh={300}>
      <rect x="40" y="20" width="520" height="260" rx="12" className="fill-paper-2 stroke-rule" strokeWidth="2" />
      <text x="300" y="42" textAnchor="middle" className={`${TEXT} font-bold`} fontSize="13">CSP LABEL — required elements</text>
      <Field x={60} y={60} label="Patient" value="Smith, John · MRN 123456" />
      <Field x={320} y={60} label="Drug + Amount" value="Vancomycin 1.25 g" w={220} />
      <Field x={60} y={112} label="Diluent + Volume" value="0.9% NaCl 250 mL" />
      <Field x={320} y={112} label="Route" value="IV infusion" w={220} />
      <Field x={60} y={164} label="BUD" value="2026-04-30 18:00" />
      <Field x={320} y={164} label="Storage" value="Refrigerate 2–8°C" w={220} />
      <Field x={60} y={216} label="Lot Number" value="20260426-001" />
      <Field x={320} y={216} label="Auxiliary" value="Protect from light" w={220} />
    </Wrap>
  );
}

export function TransportChain() {
  const Step = ({ x, label, sub, color }) => (
    <g transform={`translate(${x}, 70)`}>
      <rect width="100" height="80" rx="10" className={color} strokeWidth="1.5" />
      <text x="50" y="36" textAnchor="middle" className={`${TEXT} font-semibold`} fontSize="13">{label}</text>
      <text x="50" y="56" textAnchor="middle" className={SUB} fontSize="10">{sub}</text>
    </g>
  );
  return (
    <Wrap vw={600} vh={220}>
      <text x="300" y="30" textAnchor="middle" className={`${TEXT} font-semibold`} fontSize="13">Maintain integrity from prep to patient</text>
      <Step x={20} label="Prepare" sub="ISO 5 PEC" color="fill-info-tint stroke-info" />
      <Step x={140} label="Stage" sub="anteroom" color="fill-info-tint stroke-info" />
      <Step x={260} label="Label + QA" sub="release" color="fill-success-tint stroke-success" />
      <Step x={380} label="Transport" sub="temp + tamper" color="fill-warning-tint stroke-warning" />
      <Step x={500} label="Patient" sub="bedside" color="fill-plum-tint stroke-plum" />
      {[120, 240, 360, 480].map((x, i) => (
        <line key={i} x1={x} y1={110} x2={x + 20} y2={110} className="stroke-ink-2" strokeWidth="2" markerEnd="url(#arrow)" />
      ))}
      <text x="300" y="200" textAnchor="middle" className={SUB} fontSize="11" fontStyle="italic">Temperature-controlled · tamper-evident · complete labeling throughout</text>
    </Wrap>
  );
}

export function ReleaseChecklist() {
  const items = [
    "Labeling — patient, drug, dose, BUD, route",
    "Identity — correct ingredients, correct lots",
    "Quantity — calculation matches CR",
    "Integrity — particulate-free, sealed, leak-free",
    "BUD — assigned per category & storage",
  ];
  return (
    <Wrap vw={600} vh={290}>
      <text x="300" y="28" textAnchor="middle" className={`${TEXT} font-semibold`} fontSize="14">5 things the pharmacist verifies before every release</text>
      <rect x="60" y="50" width="480" height="220" rx="10" className="fill-success-tint stroke-success" strokeWidth="1.5" />
      {items.map((it, i) => (
        <g key={i} transform={`translate(80, ${72 + i * 38})`}>
          <circle cx="14" cy="14" r="11" className="fill-success" />
          <text x="14" y="19" textAnchor="middle" className="fill-paper font-bold" fontSize="13">✓</text>
          <text x="38" y="19" className={`${TEXT} font-medium`} fontSize="13">{it}</text>
        </g>
      ))}
    </Wrap>
  );
}

export function SopLifecycle() {
  const stages = [
    { x: 80, label: "Draft", sub: "subject expert" },
    { x: 220, label: "Review", sub: "pharmacist + QA" },
    { x: 360, label: "Approve", sub: "PIC sign-off" },
    { x: 500, label: "In use", sub: "point-of-use access" },
  ];
  return (
    <Wrap vw={600} vh={240}>
      <text x="300" y="28" textAnchor="middle" className={`${TEXT} font-semibold`} fontSize="13">Versioned · dated · reviewed every 2 years</text>
      {stages.map((s) => (
        <g key={s.label} transform={`translate(${s.x - 50}, 70)`}>
          <rect width="100" height="70" rx="8" className="fill-paper-2 stroke-rule" strokeWidth="1.5" />
          <text x="50" y="32" textAnchor="middle" className={`${TEXT} font-semibold`} fontSize="13">{s.label}</text>
          <text x="50" y="52" textAnchor="middle" className={SUB} fontSize="10">{s.sub}</text>
        </g>
      ))}
      {[130, 270, 410].map((x, i) => (
        <line key={i} x1={x} y1={105} x2={x + 20} y2={105} className="stroke-ink-2" strokeWidth="2" markerEnd="url(#arrow)" />
      ))}
      <path d="M 540 140 Q 540 200 80 200 Q 80 165 80 140" className="stroke-warning fill-none" strokeWidth="2" strokeDasharray="4 3" markerEnd="url(#arrow)" />
      <text x="300" y="220" textAnchor="middle" className="fill-warning dark:fill-warning" fontSize="11">Re-review every 2 years (or sooner on change)</text>
    </Wrap>
  );
}

// ------------------- MODULE 2 -------------------

export function PecTypes() {
  const Card = ({ x, label, sub, badge, badgeClass, arrow }) => (
    <g transform={`translate(${x}, 30)`}>
      <rect width="170" height="220" rx="10" className="fill-paper-2 stroke-rule" strokeWidth="1.5" />
      <text x="85" y="34" textAnchor="middle" className={`${TEXT} font-bold`} fontSize="16">{label}</text>
      <text x="85" y="52" textAnchor="middle" className={SUB} fontSize="11">{sub}</text>
      <rect x="30" y="80" width="110" height="80" rx="6" className="fill-paper-2 stroke-rule" strokeDasharray="3 2" />
      {arrow}
      <rect x="30" y="180" width="110" height="22" rx="11" className={badgeClass} />
      <text x="85" y="195" textAnchor="middle" className="fill-paper font-semibold" fontSize="11">{badge}</text>
    </g>
  );
  return (
    <Wrap vw={600} vh={280}>
      <Card
        x={20}
        label="LAF"
        sub="laminar airflow"
        badge="non-HD only"
        badgeClass="fill-info"
        arrow={<>
          <line x1="55" y1="100" x2="55" y2="155" className="stroke-info" strokeWidth="2" markerEnd="url(#arrow-info)" />
          <line x1="85" y1="100" x2="85" y2="155" className="stroke-info" strokeWidth="2" markerEnd="url(#arrow-info)" />
          <line x1="115" y1="100" x2="115" y2="155" className="stroke-info" strokeWidth="2" markerEnd="url(#arrow-info)" />
          <text x="85" y="74" textAnchor="middle" className="fill-info font-semibold" fontSize="10">+ POSITIVE</text>
        </>}
      />
      <Card
        x={215}
        label="BSC II"
        sub="biological safety cabinet"
        badge="HD compatible"
        badgeClass="fill-danger"
        arrow={<>
          <line x1="55" y1="155" x2="55" y2="100" className="stroke-danger" strokeWidth="2" markerEnd="url(#arrow-danger)" />
          <line x1="115" y1="155" x2="115" y2="100" className="stroke-danger" strokeWidth="2" markerEnd="url(#arrow-danger)" />
          <line x1="85" y1="100" x2="85" y2="155" className="stroke-info" strokeWidth="2" markerEnd="url(#arrow-info)" />
          <text x="85" y="74" textAnchor="middle" className="fill-danger font-semibold" fontSize="10">− NEGATIVE</text>
        </>}
      />
      <Card
        x={410}
        label="CACI"
        sub="containment isolator"
        badge="HD · closed"
        badgeClass="fill-plum"
        arrow={<>
          <rect x="40" y="92" width="90" height="56" rx="4" className="fill-paper-3 stroke-ink-2" strokeWidth="1.5" />
          <text x="85" y="125" textAnchor="middle" className={SUB} fontSize="10">SEALED</text>
          <text x="85" y="74" textAnchor="middle" className="fill-plum font-semibold" fontSize="10">CLOSED SYSTEM</text>
        </>}
      />
    </Wrap>
  );
}

export function IsoCleanroomLayout() {
  return (
    <Wrap vw={600} vh={340}>
      {/* General pharmacy */}
      <rect x="20" y="40" width="100" height="240" rx="6" className="fill-paper-2 stroke-rule" strokeWidth="1.5" />
      <text x="70" y="60" textAnchor="middle" className={SUB} fontSize="11">General</text>
      <text x="70" y="76" textAnchor="middle" className={SUB} fontSize="11">pharmacy</text>
      <text x="70" y="270" textAnchor="middle" className={SUB} fontSize="10" fontStyle="italic">unclassified</text>
      {/* Anteroom */}
      <rect x="140" y="40" width="140" height="240" rx="6" className="fill-warning-tint stroke-warning" strokeWidth="1.5" />
      <text x="210" y="60" textAnchor="middle" className={`${TEXT} font-bold`} fontSize="14">ISO 8</text>
      <text x="210" y="78" textAnchor="middle" className={SUB} fontSize="11">Anteroom</text>
      <text x="210" y="100" textAnchor="middle" className={SUB} fontSize="10">garbing + staging</text>
      {/* Buffer room */}
      <rect x="300" y="40" width="170" height="240" rx="6" className="fill-success-tint stroke-success" strokeWidth="1.5" />
      <text x="385" y="60" textAnchor="middle" className={`${TEXT} font-bold`} fontSize="14">ISO 7</text>
      <text x="385" y="78" textAnchor="middle" className={SUB} fontSize="11">Buffer room</text>
      <text x="385" y="100" textAnchor="middle" className={SUB} fontSize="10">≥30 ACPH · ≥15 HEPA</text>
      {/* PEC inside buffer */}
      <rect x="345" y="150" width="80" height="80" rx="6" className="fill-info-tint stroke-info" strokeWidth="2" />
      <text x="385" y="180" textAnchor="middle" className={`${TEXT} font-bold`} fontSize="13">ISO 5</text>
      <text x="385" y="198" textAnchor="middle" className={SUB} fontSize="10">PEC</text>
      <text x="385" y="214" textAnchor="middle" className={SUB} fontSize="10">(LAF/BSC)</text>
      {/* Pass-through window */}
      <rect x="278" y="155" width="22" height="40" className="fill-paper-3 stroke-ink-2" strokeWidth="1" />
      <text x="289" y="148" textAnchor="middle" className={SUB} fontSize="9">pass-thru</text>
      {/* Pressure arrows */}
      <text x="120" y="305" textAnchor="middle" className={SUB} fontSize="10">→</text>
      <line x1="160" y1="300" x2="260" y2="300" className="stroke-info" strokeWidth="2" markerEnd="url(#arrow-info)" />
      <text x="210" y="316" textAnchor="middle" className="fill-info font-semibold" fontSize="10">+ pressure →</text>
      <line x1="320" y1="300" x2="450" y2="300" className="stroke-info" strokeWidth="2" markerEnd="url(#arrow-info)" />
      <text x="385" y="316" textAnchor="middle" className="fill-info font-semibold" fontSize="10">+ pressure →</text>
      {/* Outside arrow showing cleanest = highest pressure */}
      <text x="495" y="60" className={SUB} fontSize="10">cleanest</text>
      <text x="495" y="74" className={SUB} fontSize="10">↑</text>
      <text x="495" y="270" className={SUB} fontSize="10">dirtiest</text>
      <text x="495" y="284" className={SUB} fontSize="10">↓</text>
      {/* Air flow arrow into PEC */}
      <line x1="385" y1="135" x2="385" y2="148" className="stroke-info" strokeWidth="2" markerEnd="url(#arrow-info)" />
      <text x="385" y="130" textAnchor="middle" className="fill-info" fontSize="9">HEPA airflow</text>
    </Wrap>
  );
}

export function ScaVsCleanroom() {
  return (
    <Wrap vw={600} vh={300}>
      {/* SCA */}
      <g transform="translate(20, 40)">
        <rect width="270" height="220" rx="10" className="fill-warning-tint stroke-warning" strokeWidth="1.5" />
        <text x="135" y="28" textAnchor="middle" className={`${TEXT} font-bold`} fontSize="15">SCA</text>
        <text x="135" y="46" textAnchor="middle" className={SUB} fontSize="11">Segregated Compounding Area</text>
        <rect x="30" y="70" width="210" height="100" rx="6" className="fill-paper-2 stroke-rule" strokeDasharray="3 2" />
        <text x="135" y="92" textAnchor="middle" className={SUB} fontSize="11">non-classified room</text>
        <rect x="90" y="105" width="90" height="50" rx="4" className="fill-info-tint stroke-info" strokeWidth="1.5" />
        <text x="135" y="125" textAnchor="middle" className={`${TEXT} font-bold`} fontSize="11">ISO 5</text>
        <text x="135" y="142" textAnchor="middle" className={SUB} fontSize="10">PEC only</text>
        <rect x="30" y="185" width="210" height="22" rx="11" className="fill-warning" />
        <text x="135" y="200" textAnchor="middle" className="fill-paper font-semibold" fontSize="11">Category 1 only · 12h / 24h</text>
      </g>
      {/* Cleanroom suite */}
      <g transform="translate(310, 40)">
        <rect width="270" height="220" rx="10" className="fill-success-tint stroke-success" strokeWidth="1.5" />
        <text x="135" y="28" textAnchor="middle" className={`${TEXT} font-bold`} fontSize="15">Cleanroom suite</text>
        <text x="135" y="46" textAnchor="middle" className={SUB} fontSize="11">ISO 8 anteroom + ISO 7 buffer + ISO 5 PEC</text>
        <rect x="20" y="70" width="80" height="100" rx="4" className="fill-warning-tint stroke-warning" strokeWidth="1.5" />
        <text x="60" y="118" textAnchor="middle" className={`${TEXT} font-bold`} fontSize="11">ISO 8</text>
        <text x="60" y="136" textAnchor="middle" className={SUB} fontSize="9">anteroom</text>
        <rect x="105" y="70" width="140" height="100" rx="4" className="fill-success-tint stroke-success" strokeWidth="1.5" />
        <text x="175" y="100" textAnchor="middle" className={`${TEXT} font-bold`} fontSize="11">ISO 7 buffer</text>
        <rect x="135" y="115" width="80" height="40" rx="4" className="fill-info-tint stroke-info" strokeWidth="1.5" />
        <text x="175" y="140" textAnchor="middle" className={`${TEXT} font-bold`} fontSize="11">ISO 5 PEC</text>
        <rect x="20" y="185" width="225" height="22" rx="11" className="fill-success" />
        <text x="132" y="200" textAnchor="middle" className="fill-paper font-semibold" fontSize="11">Category 2 eligible · up to 90/180 d</text>
      </g>
    </Wrap>
  );
}

export function PressureDifferentials() {
  return (
    <Wrap vw={600} vh={280}>
      <g transform="translate(30, 40)">
        <rect width="240" height="200" rx="10" className="fill-info-tint stroke-info" strokeWidth="1.5" />
        <text x="120" y="28" textAnchor="middle" className={`${TEXT} font-bold`} fontSize="14">Positive pressure</text>
        <text x="120" y="46" textAnchor="middle" className={SUB} fontSize="11">non-HD buffer room</text>
        <rect x="40" y="70" width="160" height="100" rx="6" className="fill-paper-2 stroke-info" strokeWidth="1.5" />
        <text x="120" y="125" textAnchor="middle" className={SUB} fontSize="11">clean room</text>
        {[60, 90, 120, 150, 180].map((x) => (
          <line key={x} x1={x} y1="170" x2={x} y2="190" className="stroke-info" strokeWidth="2" markerEnd="url(#arrow-info)" />
        ))}
        <text x="120" y="195" textAnchor="middle" className="fill-info font-semibold" fontSize="10">push contaminants OUT</text>
      </g>
      <g transform="translate(330, 40)">
        <rect width="240" height="200" rx="10" className="fill-danger-tint stroke-danger" strokeWidth="1.5" />
        <text x="120" y="28" textAnchor="middle" className={`${TEXT} font-bold`} fontSize="14">Negative pressure</text>
        <text x="120" y="46" textAnchor="middle" className={SUB} fontSize="11">HD containment (C-SEC)</text>
        <rect x="40" y="70" width="160" height="100" rx="6" className="fill-paper-2 stroke-danger dark:stroke-danger" strokeWidth="1.5" />
        <text x="120" y="125" textAnchor="middle" className={SUB} fontSize="11">HD room</text>
        {[60, 90, 120, 150, 180].map((x) => (
          <line key={x} x1={x} y1="190" x2={x} y2="170" className="stroke-danger" strokeWidth="2" markerEnd="url(#arrow-danger)" />
        ))}
        <text x="120" y="205" textAnchor="middle" className="fill-danger font-semibold" fontSize="10">pull HD vapors IN · -0.01 to -0.03 in WC</text>
      </g>
    </Wrap>
  );
}

export function AchRequirements() {
  return (
    <Wrap vw={600} vh={260}>
      <text x="300" y="28" textAnchor="middle" className={`${TEXT} font-semibold`} fontSize="14">ISO 7 buffer room — air change requirements</text>
      <g transform="translate(40, 60)">
        <rect width="520" height="40" rx="4" className="fill-paper-2 stroke-rule" />
        <rect width="350" height="40" rx="4" className="fill-success-tint" />
        <text x="20" y="26" className={`${TEXT} font-semibold`} fontSize="12">≥30 ACPH total</text>
        <text x="500" y="26" textAnchor="end" className={SUB} fontSize="11">air changes / hour</text>
      </g>
      <g transform="translate(40, 130)">
        <rect width="520" height="40" rx="4" className="fill-paper-2 stroke-rule" />
        <rect width="175" height="40" rx="4" className="fill-info-tint" />
        <text x="20" y="26" className={`${TEXT} font-semibold`} fontSize="12">≥15 ACPH from HEPA</text>
        <text x="500" y="26" textAnchor="end" className={SUB} fontSize="11">filtered supply</text>
      </g>
      <text x="300" y="225" textAnchor="middle" className={SUB} fontSize="11" fontStyle="italic">The other 15+ ACPH may come from recirculation; HEPA portion is non-negotiable.</text>
    </Wrap>
  );
}

// ------------------- MODULE 3 -------------------

export function GfsSampling() {
  const Hand = ({ x, label }) => (
    <g transform={`translate(${x}, 50)`}>
      <text x="100" y="0" textAnchor="middle" className={`${TEXT} font-semibold`} fontSize="12">{label}</text>
      {/* Palm */}
      <ellipse cx="100" cy="135" rx="60" ry="55" className="fill-paper-2 stroke-rule" strokeWidth="1.5" />
      {/* Fingers (5 ovals) */}
      {[
        { cx: 50, cy: 70, rx: 10, ry: 24, label: "T" },
        { cx: 75, cy: 50, rx: 10, ry: 32, label: "1" },
        { cx: 100, cy: 42, rx: 10, ry: 38, label: "2" },
        { cx: 125, cy: 50, rx: 10, ry: 32, label: "3" },
        { cx: 150, cy: 65, rx: 10, ry: 26, label: "4" },
      ].map((f, i) => (
        <g key={i}>
          <ellipse cx={f.cx} cy={f.cy + 30} rx={f.rx} ry={f.ry} className="fill-paper-2 stroke-rule" strokeWidth="1.5" />
          <circle cx={f.cx} cy={f.cy} r="9" className="fill-info stroke-info" strokeWidth="1.5" />
          <text x={f.cx} y={f.cy + 4} textAnchor="middle" className="fill-paper font-bold" fontSize="10">{f.label}</text>
        </g>
      ))}
    </g>
  );
  return (
    <Wrap vw={600} vh={280}>
      <text x="300" y="28" textAnchor="middle" className={`${TEXT} font-semibold`} fontSize="14">Both hands · 5 digits each · contact plate impressions</text>
      <Hand x={50} label="LEFT HAND" />
      <Hand x={350} label="RIGHT HAND" />
      <g transform="translate(220, 240)">
        <rect width="160" height="32" rx="16" className="fill-danger-tint stroke-danger" strokeWidth="1.5" />
        <text x="80" y="20" textAnchor="middle" className="fill-danger font-semibold" fontSize="12">Action level: ≤1 CFU / hand</text>
      </g>
    </Wrap>
  );
}

export function MediaFillTimeline() {
  const days = Array.from({ length: 14 }, (_, i) => i + 1);
  return (
    <Wrap vw={600} vh={260}>
      <text x="300" y="26" textAnchor="middle" className={`${TEXT} font-semibold`} fontSize="13">14-day incubation at TWO temperature ranges</text>
      <g transform="translate(40, 60)">
        <rect width="520" height="50" rx="6" className="fill-info-tint stroke-info" strokeWidth="1.5" />
        <text x="14" y="22" className={`${TEXT} font-semibold`} fontSize="11">20–25 °C</text>
        <text x="14" y="40" className={SUB} fontSize="10">cooler temp · day 1 → 14</text>
      </g>
      <g transform="translate(40, 130)">
        <rect width="520" height="50" rx="6" className="fill-warning-tint stroke-warning" strokeWidth="1.5" />
        <text x="14" y="22" className={`${TEXT} font-semibold`} fontSize="11">30–35 °C</text>
        <text x="14" y="40" className={SUB} fontSize="10">warmer temp · day 1 → 14</text>
      </g>
      <g transform="translate(40, 200)">
        {days.map((d, i) => (
          <text key={d} x={i * 38 + 20} y="14" textAnchor="middle" className={SUB} fontSize="9">{d}</text>
        ))}
      </g>
      <g transform="translate(40, 220)">
        <rect width="520" height="22" rx="11" className="fill-danger-tint stroke-danger" strokeWidth="1" />
        <text x="260" y="16" textAnchor="middle" className="fill-danger font-semibold" fontSize="11">ANY growth = failure → suspend compounder</text>
      </g>
    </Wrap>
  );
}

export function QualificationPathway() {
  return (
    <Wrap vw={600} vh={260}>
      <text x="300" y="26" textAnchor="middle" className={`${TEXT} font-semibold`} fontSize="13">From new hire to independent compounder</text>
      <g transform="translate(20, 60)">
        <rect width="120" height="80" rx="8" className="fill-paper-2 stroke-rule" strokeWidth="1.5" />
        <text x="60" y="32" textAnchor="middle" className={`${TEXT} font-semibold`} fontSize="12">Initial</text>
        <text x="60" y="50" textAnchor="middle" className={SUB} fontSize="10">3 GFS pass</text>
        <text x="60" y="65" textAnchor="middle" className={SUB} fontSize="10">3 media fill pass</text>
      </g>
      <g transform="translate(170, 60)">
        <rect width="160" height="80" rx="8" className="fill-success-tint stroke-success" strokeWidth="1.5" />
        <text x="80" y="32" textAnchor="middle" className={`${TEXT} font-semibold`} fontSize="12">Independent</text>
        <text x="80" y="50" textAnchor="middle" className={SUB} fontSize="10">compound on the floor</text>
        <text x="80" y="65" textAnchor="middle" className={SUB} fontSize="10">supervised release</text>
      </g>
      <g transform="translate(360, 60)">
        <rect width="220" height="80" rx="8" className="fill-info-tint stroke-info" strokeWidth="1.5" />
        <text x="110" y="32" textAnchor="middle" className={`${TEXT} font-semibold`} fontSize="12">Ongoing — every 6 months</text>
        <text x="110" y="50" textAnchor="middle" className={SUB} fontSize="10">repeat GFS + media fill</text>
        <text x="110" y="65" textAnchor="middle" className={SUB} fontSize="10">earlier if technique fails</text>
      </g>
      <line x1="140" y1="100" x2="170" y2="100" className="stroke-ink-2" strokeWidth="2" markerEnd="url(#arrow)" />
      <line x1="330" y1="100" x2="360" y2="100" className="stroke-ink-2" strokeWidth="2" markerEnd="url(#arrow)" />
      <g transform="translate(20, 180)">
        <rect width="560" height="50" rx="8" className="fill-danger-tint stroke-danger" strokeWidth="1.5" />
        <text x="280" y="22" textAnchor="middle" className="fill-danger font-semibold" fontSize="12">Media fill failure → suspended → 3 consecutive passing re-quals to return</text>
        <text x="280" y="40" textAnchor="middle" className={SUB} fontSize="10">Same applies to GFS excursion above action level</text>
      </g>
    </Wrap>
  );
}

// ------------------- MODULE 4 -------------------

export function EmSampleMap() {
  return (
    <Wrap vw={600} vh={300}>
      <text x="300" y="26" textAnchor="middle" className={`${TEXT} font-semibold`} fontSize="13">Pre-specified sample locations · monthly ISO 5/7 · quarterly ISO 8</text>
      {/* anteroom */}
      <rect x="40" y="60" width="170" height="200" rx="6" className="fill-warning-tint stroke-warning" strokeWidth="1.5" />
      <text x="125" y="80" textAnchor="middle" className={`${TEXT} font-semibold`} fontSize="11">ISO 8 Anteroom</text>
      {[{ cx: 70, cy: 110 }, { cx: 180, cy: 110 }, { cx: 70, cy: 220 }, { cx: 180, cy: 220 }].map((p, i) => (
        <g key={i}>
          <circle cx={p.cx} cy={p.cy} r="8" className="fill-warning" />
          <text x={p.cx} y={p.cy + 4} textAnchor="middle" className="fill-paper font-bold" fontSize="9">●</text>
        </g>
      ))}
      {/* buffer */}
      <rect x="230" y="60" width="200" height="200" rx="6" className="fill-success-tint stroke-success" strokeWidth="1.5" />
      <text x="330" y="80" textAnchor="middle" className={`${TEXT} font-semibold`} fontSize="11">ISO 7 Buffer</text>
      {[{ cx: 260, cy: 110 }, { cx: 400, cy: 110 }, { cx: 260, cy: 230 }, { cx: 400, cy: 230 }].map((p, i) => (
        <circle key={i} cx={p.cx} cy={p.cy} r="8" className="fill-success" />
      ))}
      {/* PEC */}
      <rect x="450" y="100" width="120" height="120" rx="6" className="fill-info-tint stroke-info" strokeWidth="1.5" />
      <text x="510" y="124" textAnchor="middle" className={`${TEXT} font-semibold`} fontSize="11">ISO 5 PEC</text>
      {[{ cx: 480, cy: 160 }, { cx: 540, cy: 160 }, { cx: 510, cy: 200 }].map((p, i) => (
        <circle key={i} cx={p.cx} cy={p.cy} r="8" className="fill-info" />
      ))}
      <g transform="translate(40, 275)">
        <circle cx="6" cy="6" r="5" className="fill-ink-2" />
        <text x="20" y="10" className={SUB} fontSize="10">● = sample point (settle plate · contact plate · active air)</text>
      </g>
    </Wrap>
  );
}

export function CapaWorkflow() {
  const steps = [
    { angle: -90, label: "STOP", sub: "halt compounding", color: "fill-danger" },
    { angle: 0, label: "FIND", sub: "root cause", color: "fill-warning" },
    { angle: 90, label: "FIX", sub: "CAPA · time-bound", color: "fill-info" },
    { angle: 180, label: "CHECK", sub: "re-sample · verify", color: "fill-success" },
  ];
  const cx = 300, cy = 150, r = 90;
  return (
    <Wrap vw={600} vh={300}>
      <text x="300" y="26" textAnchor="middle" className={`${TEXT} font-semibold`} fontSize="13">Action-level excursion response</text>
      <circle cx={cx} cy={cy} r={r} className="fill-none stroke-rule" strokeWidth="2" strokeDasharray="6 4" />
      {steps.map((s) => {
        const x = cx + r * Math.cos((s.angle * Math.PI) / 180);
        const y = cy + r * Math.sin((s.angle * Math.PI) / 180);
        return (
          <g key={s.label} transform={`translate(${x - 50}, ${y - 30})`}>
            <rect width="100" height="60" rx="8" className={`${s.color} fill-opacity-90`} />
            <text x="50" y="26" textAnchor="middle" className="fill-paper font-bold" fontSize="13">{s.label}</text>
            <text x="50" y="44" textAnchor="middle" className="fill-paper" fontSize="10">{s.sub}</text>
          </g>
        );
      })}
    </Wrap>
  );
}

export function ActionAlertLevels() {
  return (
    <Wrap vw={600} vh={260}>
      <text x="300" y="26" textAnchor="middle" className={`${TEXT} font-semibold`} fontSize="13">Two thresholds · two responses</text>
      {/* Alert */}
      <g transform="translate(40, 60)">
        <rect width="240" height="160" rx="10" className="fill-warning-tint stroke-warning" strokeWidth="1.5" />
        <text x="120" y="28" textAnchor="middle" className={`${TEXT} font-bold`} fontSize="14">Alert level</text>
        <text x="120" y="50" textAnchor="middle" className={SUB} fontSize="11">trend signal</text>
        <line x1="20" y1="64" x2="220" y2="64" className="stroke-warning" strokeWidth="1" />
        <text x="20" y="86" className={`${TEXT}`} fontSize="11">→ investigate cause</text>
        <text x="20" y="106" className={`${TEXT}`} fontSize="11">→ increase monitoring</text>
        <text x="20" y="126" className={`${TEXT}`} fontSize="11">→ document trend</text>
        <text x="20" y="146" className="fill-warning font-semibold" fontSize="11">compounding continues</text>
      </g>
      {/* Action */}
      <g transform="translate(320, 60)">
        <rect width="240" height="160" rx="10" className="fill-danger-tint stroke-danger" strokeWidth="1.5" />
        <text x="120" y="28" textAnchor="middle" className={`${TEXT} font-bold`} fontSize="14">Action level</text>
        <text x="120" y="50" textAnchor="middle" className={SUB} fontSize="11">immediate response</text>
        <line x1="20" y1="64" x2="220" y2="64" className="stroke-danger" strokeWidth="1" />
        <text x="20" y="86" className={`${TEXT}`} fontSize="11">→ STOP compounding</text>
        <text x="20" y="106" className={`${TEXT}`} fontSize="11">→ root cause + CAPA</text>
        <text x="20" y="126" className={`${TEXT}`} fontSize="11">→ re-sample to verify</text>
        <text x="20" y="146" className="fill-danger font-semibold" fontSize="11">do NOT resume blindly</text>
      </g>
    </Wrap>
  );
}

// ------------------- MODULE 5 -------------------

export function CleaningHierarchy() {
  return (
    <Wrap vw={600} vh={260}>
      <text x="300" y="26" textAnchor="middle" className={`${TEXT} font-semibold`} fontSize="13">Three distinct steps · always in this order</text>
      {[
        { x: 30, label: "1. Cleaning", sub: "remove debris physically", detail: "soap/detergent + water", color: "fill-info-tint stroke-info" },
        { x: 215, label: "2. Disinfection", sub: "reduce microbes", detail: "sterile 70% IPA · sporicidal", color: "fill-success-tint stroke-success" },
        { x: 400, label: "3. Sterilization", sub: "complete kill", detail: "autoclave · dry heat · filtration", color: "fill-plum-tint stroke-plum" },
      ].map((s) => (
        <g key={s.label} transform={`translate(${s.x}, 60)`}>
          <rect width="170" height="160" rx="10" className={s.color} strokeWidth="1.5" />
          <text x="85" y="32" textAnchor="middle" className={`${TEXT} font-bold`} fontSize="14">{s.label}</text>
          <text x="85" y="60" textAnchor="middle" className={SUB} fontSize="11">{s.sub}</text>
          <line x1="20" y1="80" x2="150" y2="80" className="stroke-rule" strokeWidth="1" />
          <text x="85" y="106" textAnchor="middle" className={TEXT} fontSize="11">{s.detail}</text>
        </g>
      ))}
      {[200, 385].map((x, i) => (
        <line key={i} x1={x} y1="140" x2={x + 15} y2="140" className="stroke-ink-2" strokeWidth="2" markerEnd="url(#arrow)" />
      ))}
      <text x="300" y="240" textAnchor="middle" className="fill-danger font-semibold" fontSize="11">Skipping cleaning → organic debris neutralizes disinfectant → both fail</text>
    </Wrap>
  );
}

export function CleaningSequence() {
  return (
    <Wrap vw={600} vh={260}>
      <text x="300" y="26" textAnchor="middle" className={`${TEXT} font-semibold`} fontSize="13">Always cleanest → dirtiest · top → bottom</text>
      <g transform="translate(60, 70)">
        <rect width="120" height="120" rx="6" className="fill-info-tint stroke-info" strokeWidth="1.5" />
        <text x="60" y="40" textAnchor="middle" className={`${TEXT} font-bold`} fontSize="13">PEC</text>
        <text x="60" y="60" textAnchor="middle" className={SUB} fontSize="10">interior</text>
        <rect x="20" y="80" width="80" height="22" rx="11" className="fill-info" />
        <text x="60" y="95" textAnchor="middle" className="fill-paper font-semibold" fontSize="10">cleanest 1st</text>
      </g>
      <g transform="translate(240, 70)">
        <rect width="120" height="120" rx="6" className="fill-success-tint stroke-success" strokeWidth="1.5" />
        <text x="60" y="40" textAnchor="middle" className={`${TEXT} font-bold`} fontSize="13">Buffer</text>
        <text x="60" y="60" textAnchor="middle" className={SUB} fontSize="10">ISO 7</text>
      </g>
      <g transform="translate(420, 70)">
        <rect width="120" height="120" rx="6" className="fill-warning-tint stroke-warning" strokeWidth="1.5" />
        <text x="60" y="40" textAnchor="middle" className={`${TEXT} font-bold`} fontSize="13">Anteroom</text>
        <text x="60" y="60" textAnchor="middle" className={SUB} fontSize="10">ISO 8</text>
        <rect x="20" y="80" width="80" height="22" rx="11" className="fill-warning" />
        <text x="60" y="95" textAnchor="middle" className="fill-paper font-semibold" fontSize="10">dirtiest last</text>
      </g>
      {[180, 360].map((x, i) => (
        <line key={i} x1={x} y1="130" x2={x + 60} y2="130" className="stroke-ink-2" strokeWidth="2" markerEnd="url(#arrow)" />
      ))}
      <text x="300" y="225" textAnchor="middle" className={SUB} fontSize="11" fontStyle="italic">Never wipe back into a freshly cleaned area · top-to-bottom within each room</text>
    </Wrap>
  );
}

export function LafWipePattern() {
  return (
    <Wrap vw={600} vh={300}>
      <text x="300" y="26" textAnchor="middle" className={`${TEXT} font-semibold`} fontSize="13">LAF hood — top-down view · sterile 70% IPA · low-lint wipe</text>
      <rect x="100" y="60" width="400" height="220" rx="8" className="fill-paper-3 stroke-rule" strokeWidth="2" />
      <text x="105" y="82" className={SUB} fontSize="11">back panel</text>
      <text x="105" y="265" className={SUB} fontSize="11">work surface (last)</text>
      {/* Side panel arrows */}
      {[1, 2, 3].map((i) => (
        <line key={`l${i}`} x1="120" y1={80 + i * 25} x2="120" y2={100 + i * 25} className="stroke-info" strokeWidth="2" markerEnd="url(#arrow-info)" />
      ))}
      <text x="120" y="180" textAnchor="middle" className="fill-info font-semibold" fontSize="10" transform="rotate(-90 120 180)">side</text>
      {[1, 2, 3].map((i) => (
        <line key={`r${i}`} x1="480" y1={80 + i * 25} x2="480" y2={100 + i * 25} className="stroke-info" strokeWidth="2" markerEnd="url(#arrow-info)" />
      ))}
      {/* Back panel arrow */}
      <line x1="160" y1="120" x2="440" y2="120" className="stroke-success" strokeWidth="2" markerEnd="url(#arrow-success)" />
      <text x="300" y="113" textAnchor="middle" className="fill-success font-semibold" fontSize="10">back panel · overlapping strokes one direction</text>
      {/* Work surface arrows */}
      {[1, 2, 3, 4].map((i) => (
        <line key={`w${i}`} x1="160" y1={180 + i * 14} x2="440" y2={180 + i * 14} className="stroke-warning" strokeWidth="2" markerEnd="url(#arrow)" />
      ))}
      <text x="300" y="252" textAnchor="middle" className="fill-warning font-semibold" fontSize="10">work surface — same direction · don't return over cleaned area</text>
    </Wrap>
  );
}

export function PecCleaningFrequency() {
  const items = [
    { label: "Start of shift", color: "fill-info" },
    { label: "Every ~30 min of continuous use", color: "fill-info" },
    { label: "After any contamination event", color: "fill-danger" },
    { label: "End of shift", color: "fill-info" },
    { label: "Sporicidal: monthly minimum", color: "fill-plum" },
  ];
  return (
    <Wrap vw={600} vh={260}>
      <text x="300" y="26" textAnchor="middle" className={`${TEXT} font-semibold`} fontSize="13">When the PEC must be cleaned</text>
      {items.map((it, i) => (
        <g key={i} transform={`translate(80, ${60 + i * 36})`}>
          <circle cx="14" cy="14" r="10" className={it.color} />
          <text x="14" y="19" textAnchor="middle" className="fill-paper font-bold" fontSize="11">✓</text>
          <text x="40" y="19" className={`${TEXT} font-medium`} fontSize="13">{it.label}</text>
        </g>
      ))}
    </Wrap>
  );
}

// ------------------- MODULE 6 -------------------

export function GarbingOrder() {
  const steps = [
    { label: "Shoes", sub: "covers" },
    { label: "Hair", sub: "+ beard" },
    { label: "Face", sub: "mask" },
    { label: "Wash", sub: "30s · to elbows" },
    { label: "Gown", sub: "non-shedding" },
    { label: "Gloves", sub: "sterile · LAST" },
  ];
  return (
    <Wrap vw={600} vh={220}>
      <text x="300" y="26" textAnchor="middle" className={`${TEXT} font-semibold`} fontSize="13">Order matters: dirtiest item first · sterile gloves LAST</text>
      {steps.map((s, i) => (
        <g key={i} transform={`translate(${20 + i * 95}, 70)`}>
          <circle cx="40" cy="40" r="32" className={i === steps.length - 1 ? "fill-success-tint stroke-success" : "fill-paper-2 stroke-rule"} strokeWidth="1.5" />
          <text x="40" y="36" textAnchor="middle" className={`${TEXT} font-bold`} fontSize="11">{i + 1}</text>
          <text x="40" y="52" textAnchor="middle" className={`${TEXT} font-semibold`} fontSize="11">{s.label}</text>
          <text x="40" y="100" textAnchor="middle" className={SUB} fontSize="10">{s.sub}</text>
        </g>
      ))}
      {steps.slice(0, -1).map((_, i) => (
        <line key={i} x1={i * 95 + 80} y1="110" x2={i * 95 + 102} y2="110" className="stroke-ink-2" strokeWidth="2" markerEnd="url(#arrow)" />
      ))}
    </Wrap>
  );
}

export function CriticalSite() {
  return (
    <Wrap vw={600} vh={320}>
      <text x="300" y="26" textAnchor="middle" className={`${TEXT} font-semibold`} fontSize="13">Critical site = any opening into the sterile system</text>
      {/* HEPA airstream arrows */}
      {[160, 220, 280, 340, 400, 460].map((x, i) => (
        <line key={i} x1={x} y1="50" x2={x} y2="80" className="stroke-info" strokeWidth="1.5" markerEnd="url(#arrow-info)" />
      ))}
      <text x="300" y="44" textAnchor="middle" className="fill-info font-semibold" fontSize="11">FIRST AIR — unidirectional HEPA</text>
      {/* Vial */}
      <rect x="200" y="120" width="80" height="120" rx="8" className="fill-paper-2 stroke-ink-2" strokeWidth="1.5" />
      <rect x="225" y="100" width="30" height="20" rx="2" className="fill-danger-tint stroke-danger" strokeWidth="1" />
      <text x="240" y="180" textAnchor="middle" className={SUB} fontSize="11">vial</text>
      <circle cx="240" cy="100" r="5" className="fill-danger" />
      <text x="290" y="103" className="fill-danger font-semibold" fontSize="11">vial septum</text>
      {/* Syringe */}
      <line x1="380" y1="200" x2="450" y2="170" className="stroke-ink-2" strokeWidth="6" strokeLinecap="round" />
      <line x1="450" y1="170" x2="475" y2="155" className={STROKE_DARK} strokeWidth="2" />
      <circle cx="478" cy="153" r="4" className="fill-danger" />
      <text x="370" y="155" textAnchor="end" className="fill-danger font-semibold" fontSize="11">needle tip</text>
      {/* Bag port */}
      <rect x="100" y="230" width="60" height="50" rx="4" className="fill-paper-2 stroke-ink-2" strokeWidth="1.5" />
      <line x1="130" y1="230" x2="130" y2="216" className="stroke-ink-2" strokeWidth="3" />
      <circle cx="130" cy="214" r="4" className="fill-danger" />
      <text x="170" y="218" className="fill-danger font-semibold" fontSize="11">bag port</text>
      <text x="300" y="295" textAnchor="middle" className={SUB} fontSize="11" fontStyle="italic">Every red dot must remain in the airstream · never blocked, never touched</text>
    </Wrap>
  );
}

export function Shadowing() {
  return (
    <Wrap vw={600} vh={280}>
      <text x="300" y="26" textAnchor="middle" className={`${TEXT} font-semibold`} fontSize="13">Shadowing — body part blocks first air to a critical site</text>
      {/* Good */}
      <g transform="translate(20, 50)">
        <rect width="270" height="200" rx="10" className="fill-success-tint stroke-success" strokeWidth="1.5" />
        <text x="135" y="28" textAnchor="middle" className={`${TEXT} font-bold`} fontSize="13">CORRECT</text>
        {[60, 120, 180, 220].map((x, i) => (
          <line key={i} x1={x} y1="50" x2={x} y2="100" className="stroke-info" strokeWidth="1.5" markerEnd="url(#arrow-info)" />
        ))}
        <rect x="100" y="120" width="60" height="60" className="fill-paper-3 stroke-ink-2" strokeWidth="1.5" />
        <circle cx="130" cy="120" r="4" className="fill-danger" />
        <text x="135" y="195" textAnchor="middle" className="fill-success font-semibold" fontSize="11">first air reaches critical site</text>
      </g>
      {/* Bad */}
      <g transform="translate(310, 50)">
        <rect width="270" height="200" rx="10" className="fill-danger-tint stroke-danger" strokeWidth="1.5" />
        <text x="135" y="28" textAnchor="middle" className={`${TEXT} font-bold`} fontSize="13">SHADOWING</text>
        {[60, 120, 180, 220].map((x, i) => (
          <line key={i} x1={x} y1="50" x2={x} y2="80" className="stroke-info" strokeWidth="1.5" />
        ))}
        <ellipse cx="135" cy="100" rx="80" ry="14" className="fill-warning-tint stroke-warning" strokeWidth="1.5" />
        <text x="135" y="105" textAnchor="middle" className={`${TEXT} font-semibold`} fontSize="10">hand crosses over</text>
        <rect x="100" y="135" width="60" height="55" className="fill-paper-3 stroke-ink-2" strokeWidth="1.5" />
        <circle cx="130" cy="135" r="4" className="fill-danger" />
        <text x="135" y="195" textAnchor="middle" className="fill-danger font-semibold" fontSize="11">airstream blocked → contamination risk</text>
      </g>
    </Wrap>
  );
}

export function ImmediateUseRule() {
  return (
    <Wrap vw={600} vh={260}>
      <text x="300" y="26" textAnchor="middle" className={`${TEXT} font-semibold`} fontSize="13">Immediate-use CSP — strict criteria, not a convenience</text>
      <g transform="translate(40, 60)">
        <rect width="520" height="180" rx="10" className="fill-warning-tint stroke-warning" strokeWidth="1.5" />
        {[
          "Single patient · single dose",
          "No antimicrobial preservatives",
          "Administration MUST start ≤ 1 hour from prep start",
          "NOT for batch convenience or stockpiling",
        ].map((s, i) => (
          <g key={i} transform={`translate(20, ${30 + i * 32})`}>
            <circle cx="14" cy="14" r="10" className="fill-warning" />
            <text x="14" y="19" textAnchor="middle" className="fill-paper font-bold" fontSize="11">!</text>
            <text x="38" y="19" className={`${TEXT}`} fontSize="13">{s}</text>
          </g>
        ))}
        <line x1="20" y1="160" x2="500" y2="160" className="stroke-warning" strokeWidth="1" strokeDasharray="3 2" />
      </g>
    </Wrap>
  );
}

export function BudDecisionTree() {
  return (
    <Wrap vw={600} vh={360}>
      <text x="300" y="26" textAnchor="middle" className={`${TEXT} font-semibold`} fontSize="13">Where was it compounded? → Which BUD applies?</text>
      <rect x="240" y="50" width="120" height="46" rx="8" className="fill-paper-2 stroke-rule" strokeWidth="1.5" />
      <text x="300" y="78" textAnchor="middle" className={`${TEXT} font-semibold`} fontSize="13">CSP prepared</text>
      <line x1="300" y1="96" x2="160" y2="130" className="stroke-ink-2" strokeWidth="2" markerEnd="url(#arrow)" />
      <line x1="300" y1="96" x2="450" y2="130" className="stroke-ink-2" strokeWidth="2" markerEnd="url(#arrow)" />
      <rect x="80" y="130" width="160" height="46" rx="8" className="fill-warning-tint stroke-warning" strokeWidth="1.5" />
      <text x="160" y="158" textAnchor="middle" className={`${TEXT} font-semibold`} fontSize="13">SCA</text>
      <rect x="370" y="130" width="160" height="46" rx="8" className="fill-success-tint stroke-success" strokeWidth="1.5" />
      <text x="450" y="158" textAnchor="middle" className={`${TEXT} font-semibold`} fontSize="13">Cleanroom suite</text>
      <line x1="160" y1="176" x2="160" y2="200" className="stroke-ink-2" strokeWidth="2" markerEnd="url(#arrow)" />
      <line x1="450" y1="176" x2="450" y2="200" className="stroke-ink-2" strokeWidth="2" markerEnd="url(#arrow)" />
      <rect x="60" y="200" width="200" height="120" rx="8" className="fill-warning-tint stroke-warning" strokeWidth="1.5" />
      <text x="160" y="226" textAnchor="middle" className={`${TEXT} font-bold`} fontSize="13">Category 1</text>
      <text x="160" y="252" textAnchor="middle" className={SUB} fontSize="11">12 h room temp</text>
      <text x="160" y="272" textAnchor="middle" className={SUB} fontSize="11">24 h refrigerated</text>
      <text x="160" y="298" textAnchor="middle" className="fill-danger font-semibold" fontSize="11">no frozen · no extension</text>
      <rect x="350" y="200" width="200" height="120" rx="8" className="fill-success-tint stroke-success" strokeWidth="1.5" />
      <text x="450" y="226" textAnchor="middle" className={`${TEXT} font-bold`} fontSize="13">Category 2</text>
      <text x="450" y="252" textAnchor="middle" className={SUB} fontSize="11">aqueous: 45 d / 60 d / 365 d</text>
      <text x="450" y="272" textAnchor="middle" className={SUB} fontSize="11">+ sterility test → 90 / 120 / 365</text>
      <text x="450" y="298" textAnchor="middle" className={SUB} fontSize="11">RT · refrig · frozen</text>
    </Wrap>
  );
}

// ------------------- MODULE 7 -------------------

export function SterilizationMatrix() {
  const headers = ["Bacteria", "Spores", "Viruses", "Endotoxins"];
  const rows = [
    { method: "Steam autoclave (121°C)", marks: ["✓", "✓", "✓", "✗"] },
    { method: "Dry heat (160–180°C)", marks: ["✓", "✓", "✓", "✗"] },
    { method: "Dry heat depyrogenation (250°C)", marks: ["✓", "✓", "✓", "✓"] },
    { method: "0.22 µm filtration", marks: ["✓", "✗", "✗", "✗"] },
  ];
  const colW = 100;
  return (
    <Wrap vw={600} vh={280}>
      <text x="300" y="26" textAnchor="middle" className={`${TEXT} font-semibold`} fontSize="13">What each sterilization method actually destroys</text>
      <g transform="translate(20, 50)">
        {/* Header */}
        <rect width="560" height="32" rx="4" className="fill-paper-2" />
        <text x="14" y="20" className={`${TEXT} font-semibold`} fontSize="11">Method</text>
        {headers.map((h, i) => (
          <text key={h} x={170 + i * colW + colW / 2} y="20" textAnchor="middle" className={`${TEXT} font-semibold`} fontSize="11">{h}</text>
        ))}
        {/* Rows */}
        {rows.map((r, i) => (
          <g key={r.method} transform={`translate(0, ${36 + i * 38})`}>
            <rect width="560" height="36" rx="4" className={i % 2 ? "fill-paper-3" : "fill-paper-2"} />
            <text x="14" y="22" className={`${TEXT}`} fontSize="11">{r.method}</text>
            {r.marks.map((m, j) => (
              <text
                key={j}
                x={170 + j * colW + colW / 2}
                y="24"
                textAnchor="middle"
                className={m === "✓" ? "fill-success font-bold" : "fill-danger font-bold"}
                fontSize="16"
              >
                {m}
              </text>
            ))}
          </g>
        ))}
      </g>
      <text x="300" y="270" textAnchor="middle" className="fill-danger font-semibold" fontSize="11">Filter does NOT remove endotoxins · Autoclave does NOT depyrogenate</text>
    </Wrap>
  );
}

export function FilterMechanism() {
  return (
    <Wrap vw={600} vh={300}>
      <text x="300" y="26" textAnchor="middle" className={`${TEXT} font-semibold`} fontSize="13">0.22 µm membrane — bugs are stopped, endotoxins pass</text>
      {/* Membrane */}
      <rect x="280" y="60" width="20" height="200" className="fill-rule stroke-ink-2" strokeWidth="1" />
      <text x="290" y="50" textAnchor="middle" className={SUB} fontSize="10">0.22 µm</text>
      {/* Pre-filter side */}
      <text x="140" y="60" textAnchor="middle" className={`${TEXT} font-semibold`} fontSize="12">Drug solution (before)</text>
      {/* Bacteria (large red dots) on left side */}
      {[
        { cx: 100, cy: 130 }, { cx: 180, cy: 110 }, { cx: 140, cy: 170 },
        { cx: 220, cy: 150 }, { cx: 90, cy: 200 }, { cx: 200, cy: 230 },
      ].map((p, i) => (
        <g key={i}>
          <circle cx={p.cx} cy={p.cy} r="9" className="fill-danger stroke-danger dark:stroke-danger" strokeWidth="1.5" />
        </g>
      ))}
      {/* Endotoxins (tiny dots) crossing through */}
      {[100, 130, 160, 190, 220].map((y, i) => (
        <g key={i}>
          <circle cx={120 + i * 10} cy={y + 10} r="2" className="fill-plum" />
          <circle cx={400 + i * 10} cy={y + 10} r="2" className="fill-plum" />
        </g>
      ))}
      {/* Post-filter */}
      <text x="450" y="60" textAnchor="middle" className={`${TEXT} font-semibold`} fontSize="12">Filtered (after)</text>
      <line x1="240" y1="180" x2="340" y2="180" className="stroke-ink-2" strokeWidth="2" markerEnd="url(#arrow)" />
      {/* Legend */}
      <g transform="translate(40, 275)">
        <circle cx="6" cy="6" r="6" className="fill-danger stroke-danger" strokeWidth="1" />
        <text x="20" y="10" className={SUB} fontSize="10">bacteria — caught</text>
        <circle cx="180" cy="6" r="2" className="fill-plum" />
        <text x="190" y="10" className={SUB} fontSize="10">endotoxins — pass through</text>
      </g>
    </Wrap>
  );
}

export function EndotoxinLimits() {
  const data = [
    { route: "Intrathecal", limit: 0.2, w: 30, color: "fill-danger" },
    { route: "Intravenous (cardio)", limit: 5, w: 100, color: "fill-warning" },
    { route: "Intravenous (general)", limit: 5, w: 100, color: "fill-warning" },
    { route: "Intramuscular", limit: 5, w: 100, color: "fill-warning" },
    { route: "Inhalation", limit: 20, w: 200, color: "fill-info" },
  ];
  return (
    <Wrap vw={600} vh={300}>
      <text x="300" y="26" textAnchor="middle" className={`${TEXT} font-semibold`} fontSize="13">USP &lt;85&gt; bacterial endotoxin limits — by route (EU/kg/hr)</text>
      {data.map((d, i) => (
        <g key={d.route} transform={`translate(20, ${60 + i * 42})`}>
          <text x="0" y="20" className={`${TEXT}`} fontSize="11">{d.route}</text>
          <rect x="170" y="6" width="380" height="24" rx="4" className="fill-paper-2" />
          <rect x="170" y="6" width={d.w} height="24" rx="4" className={d.color} />
          <text x={170 + d.w + 8} y="22" className={`${TEXT} font-mono`} fontSize="11">{d.limit} EU/kg/hr</text>
        </g>
      ))}
      <text x="300" y="280" textAnchor="middle" className="fill-danger font-semibold" fontSize="11">Intrathecal = 25× stricter than IV — fever, seizures, death on failure</text>
    </Wrap>
  );
}

export function SterilityTestTimeline() {
  return (
    <Wrap vw={600} vh={240}>
      <text x="300" y="26" textAnchor="middle" className={`${TEXT} font-semibold`} fontSize="13">USP &lt;71&gt; — extends Category 2 BUD only</text>
      <g transform="translate(40, 60)">
        <rect width="520" height="50" rx="6" className="fill-info-tint stroke-info" strokeWidth="1.5" />
        <text x="14" y="22" className={`${TEXT} font-semibold`} fontSize="11">Direct inoculation OR membrane filtration</text>
        <text x="14" y="40" className={SUB} fontSize="10">14 days incubation · 20–25°C and 30–35°C</text>
      </g>
      <g transform="translate(40, 130)">
        <rect width="250" height="50" rx="6" className="fill-success-tint stroke-success" strokeWidth="1.5" />
        <text x="125" y="22" textAnchor="middle" className={`${TEXT} font-semibold`} fontSize="11">PASS → release batch</text>
        <text x="125" y="40" textAnchor="middle" className={SUB} fontSize="10">90 d RT · 120 d refrig · 365 d frozen</text>
      </g>
      <g transform="translate(310, 130)">
        <rect width="250" height="50" rx="6" className="fill-danger-tint stroke-danger" strokeWidth="1.5" />
        <text x="125" y="22" textAnchor="middle" className="fill-danger font-semibold" fontSize="11">ANY GROWTH → fail</text>
        <text x="125" y="40" textAnchor="middle" className={SUB} fontSize="10">batch quarantined · investigate</text>
      </g>
      <text x="300" y="220" textAnchor="middle" className={SUB} fontSize="11" fontStyle="italic">Sterility test does nothing for Category 1 — that's a category cap, not a method gap</text>
    </Wrap>
  );
}

// ------------------- MODULE 8 -------------------

export function NioshGroups() {
  const groups = [
    { id: "1", label: "Antineoplastics", sub: "highest occupational risk", detail: "carcinogenic, teratogenic, reproductive", color: "fill-danger-tint stroke-danger", badge: "fill-danger" },
    { id: "2", label: "Non-antineoplastics", sub: "special handling", detail: "still meet ≥1 NIOSH criterion", color: "fill-warning-tint stroke-warning", badge: "fill-warning" },
    { id: "3", label: "Reproductive only", sub: "men + women of repro potential", detail: "hazard limited to repro effects", color: "fill-warning-tint stroke-warning", badge: "fill-warning" },
  ];
  return (
    <Wrap vw={600} vh={260}>
      <text x="300" y="26" textAnchor="middle" className={`${TEXT} font-semibold`} fontSize="13">NIOSH HD list — three risk groups</text>
      {groups.map((g, i) => (
        <g key={g.id} transform={`translate(${20 + i * 195}, 60)`}>
          <rect width="180" height="170" rx="10" className={g.color} strokeWidth="1.5" />
          <circle cx="35" cy="38" r="20" className={g.badge} />
          <text x="35" y="44" textAnchor="middle" className="fill-paper font-bold" fontSize="18">{g.id}</text>
          <text x="65" y="32" className={`${TEXT} font-bold`} fontSize="13">{g.label}</text>
          <text x="65" y="50" className={SUB} fontSize="10">{g.sub}</text>
          <text x="14" y="100" className={`${TEXT}`} fontSize="11" >
            <tspan x="14" dy="0">{g.detail.split(',')[0]}</tspan>
            <tspan x="14" dy="14">{g.detail.split(',').slice(1).join(',').trim()}</tspan>
          </text>
        </g>
      ))}
    </Wrap>
  );
}

export function CpecVsPec() {
  return (
    <Wrap vw={600} vh={280}>
      <text x="300" y="26" textAnchor="middle" className={`${TEXT} font-semibold`} fontSize="13">Standard PEC vs Containment PEC (HD)</text>
      <g transform="translate(20, 60)">
        <rect width="270" height="200" rx="10" className="fill-info-tint stroke-info" strokeWidth="1.5" />
        <text x="135" y="28" textAnchor="middle" className={`${TEXT} font-bold`} fontSize="14">PEC (non-HD)</text>
        <text x="135" y="46" textAnchor="middle" className={SUB} fontSize="11">LAF · positive pressure</text>
        <rect x="40" y="80" width="190" height="80" rx="6" className="fill-paper-2 stroke-info" strokeWidth="1.5" />
        {[80, 120, 160, 200].map((x) => (
          <line key={x} x1={x} y1="160" x2={x} y2="180" className="stroke-info" strokeWidth="2" markerEnd="url(#arrow-info)" />
        ))}
        <text x="135" y="186" textAnchor="middle" className="fill-info font-semibold" fontSize="11">+ pressure → push out</text>
      </g>
      <g transform="translate(310, 60)">
        <rect width="270" height="200" rx="10" className="fill-danger-tint stroke-danger" strokeWidth="1.5" />
        <text x="135" y="28" textAnchor="middle" className={`${TEXT} font-bold`} fontSize="14">C-PEC (HD)</text>
        <text x="135" y="46" textAnchor="middle" className={SUB} fontSize="11">BSC II type B2 · CACI</text>
        <rect x="40" y="80" width="190" height="80" rx="6" className="fill-paper-2 stroke-danger" strokeWidth="1.5" />
        {[80, 120, 160, 200].map((x) => (
          <line key={x} x1={x} y1="180" x2={x} y2="160" className="stroke-danger" strokeWidth="2" markerEnd="url(#arrow-danger)" />
        ))}
        <text x="135" y="186" textAnchor="middle" className="fill-danger font-semibold" fontSize="11">− pressure → contain inward</text>
      </g>
    </Wrap>
  );
}

export function DeactivationFlow() {
  const steps = [
    { label: "Deactivate", sub: "neutralize HD chemically", agent: "sodium hypochlorite", color: "fill-danger-tint stroke-danger" },
    { label: "Decontaminate", sub: "physically remove residue", agent: "detergent + water", color: "fill-warning-tint stroke-warning" },
    { label: "Disinfect", sub: "reduce microbial load", agent: "sterile 70% IPA", color: "fill-info-tint stroke-info" },
  ];
  return (
    <Wrap vw={600} vh={280}>
      <text x="300" y="26" textAnchor="middle" className={`${TEXT} font-semibold`} fontSize="13">The 3 D's — order is NOT interchangeable</text>
      {steps.map((s, i) => (
        <g key={s.label} transform={`translate(${30 + i * 195}, 60)`}>
          <rect width="170" height="180" rx="10" className={s.color} strokeWidth="1.5" />
          <text x="85" y="32" textAnchor="middle" className={`${TEXT} font-bold`} fontSize="14">{i + 1}. {s.label}</text>
          <line x1="20" y1="48" x2="150" y2="48" className="stroke-rule" />
          <text x="85" y="80" textAnchor="middle" className={SUB} fontSize="11">
            <tspan x="85" dy="0">{s.sub.split(' ').slice(0, 3).join(' ')}</tspan>
            <tspan x="85" dy="14">{s.sub.split(' ').slice(3).join(' ')}</tspan>
          </text>
          <rect x="20" y="125" width="130" height="40" rx="6" className="fill-paper-2 stroke-rule" />
          <text x="85" y="142" textAnchor="middle" className={SUB} fontSize="9">typical agent</text>
          <text x="85" y="158" textAnchor="middle" className={`${TEXT} font-medium`} fontSize="11">{s.agent}</text>
        </g>
      ))}
      {[200, 395].map((x, i) => (
        <line key={i} x1={x} y1="150" x2={x + 25} y2="150" className="stroke-ink-2" strokeWidth="2" markerEnd="url(#arrow)" />
      ))}
    </Wrap>
  );
}

export function PpeLayering() {
  const layers = [
    { y: 60, label: "Inner glove (chemo-rated)", spec: "ASTM D6978" },
    { y: 100, label: "Gown", spec: "AAMI PB70 Level 2 minimum" },
    { y: 140, label: "Outer glove (chemo-rated)", spec: "over gown cuff · ASTM D6978" },
    { y: 180, label: "Eye + face protection", spec: "for splash risk" },
    { y: 220, label: "Respirator", spec: "N95 / P100 for volatile HDs" },
  ];
  return (
    <Wrap vw={600} vh={300}>
      <text x="300" y="26" textAnchor="middle" className={`${TEXT} font-semibold`} fontSize="13">HD compounding PPE — every layer · every batch</text>
      {layers.map((l, i) => (
        <g key={l.label} transform={`translate(40, ${l.y})`}>
          <circle cx="14" cy="14" r="10" className="fill-danger" />
          <text x="14" y="18" textAnchor="middle" className="fill-paper font-bold" fontSize="11">{i + 1}</text>
          <text x="40" y="14" className={`${TEXT} font-semibold`} fontSize="12">{l.label}</text>
          <text x="40" y="28" className={SUB} fontSize="10">{l.spec}</text>
        </g>
      ))}
      <text x="300" y="275" textAnchor="middle" className="fill-danger font-semibold" fontSize="11">Outer glove goes on AFTER gown · over the cuff</text>
    </Wrap>
  );
}

export function HdHandlingChain() {
  const steps = [
    { label: "Receiving", sub: "delivery clerk · PPE · sealed transport", color: "fill-warning-tint stroke-warning" },
    { label: "Storage", sub: "negative-pressure room · separated", color: "fill-warning-tint stroke-warning" },
    { label: "Compounding", sub: "C-PEC inside C-SEC · HD PPE", color: "fill-danger-tint stroke-danger" },
    { label: "Transport", sub: "labeled · tamper-evident · trained handler", color: "fill-plum-tint stroke-plum" },
    { label: "Patient", sub: "nursing · USP 800 trained", color: "fill-info-tint stroke-info" },
  ];
  return (
    <Wrap vw={600} vh={240}>
      <text x="300" y="26" textAnchor="middle" className={`${TEXT} font-semibold`} fontSize="13">USP 800 covers the entire chain — not pharmacy alone</text>
      {steps.map((s, i) => (
        <g key={s.label} transform={`translate(${10 + i * 116}, 60)`}>
          <rect width="106" height="120" rx="8" className={s.color} strokeWidth="1.5" />
          <text x="53" y="32" textAnchor="middle" className={`${TEXT} font-semibold`} fontSize="12">{s.label}</text>
          <text x="53" y="60" textAnchor="middle" className={SUB} fontSize="10">
            <tspan x="53" dy="0">{s.sub.split(' · ')[0]}</tspan>
            <tspan x="53" dy="14">{(s.sub.split(' · ')[1] || '').replace(/^./, c => c.toLowerCase())}</tspan>
            <tspan x="53" dy="14">{s.sub.split(' · ')[2] || ''}</tspan>
          </text>
        </g>
      ))}
    </Wrap>
  );
}
