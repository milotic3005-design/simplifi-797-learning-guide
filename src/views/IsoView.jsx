import data from "../data/bud-and-iso.json";
import { cls } from "../themes";

function IsoCard({ klass }) {
  const c = cls(klass.color);
  return (
    <div className={`rounded-lg border ${c.border} bg-white dark:bg-slate-800 dark:border-slate-700 overflow-hidden`}>
      <div className={`${c.bg} ${c.text} px-4 py-5 flex items-center gap-4`}>
        <div className="text-5xl font-bold leading-none tabular-nums">
          ISO {klass.isoLevel}
        </div>
        <div className="text-sm font-semibold">{klass.commonName}</div>
      </div>
      <div className="p-4 space-y-3 text-sm">
        <div>
          <div className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-1">
            Examples
          </div>
          <ul className="list-disc list-inside text-slate-700 dark:text-slate-200 space-y-0.5">
            {klass.examples.map((e, i) => (
              <li key={i}>{e}</li>
            ))}
          </ul>
        </div>
        <div>
          <div className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-1">
            Particle limit
          </div>
          <div className="text-slate-800 dark:text-slate-100">{klass.particleLimit}</div>
        </div>
        <div>
          <div className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-1">
            HVAC
          </div>
          <div className="text-slate-800 dark:text-slate-100">{klass.hvac}</div>
        </div>
        <div>
          <div className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-1">
            Role in compounding
          </div>
          <div className="text-slate-800 dark:text-slate-100">{klass.role}</div>
        </div>
        {klass.certificationFrequency && (
          <div>
            <div className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-1">
              Certification frequency
            </div>
            <div className="text-slate-800 dark:text-slate-100">
              {klass.certificationFrequency}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function IsoView() {
  const iso = data.isoClassification;
  const cmp = iso.scaVsCleanroom;
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">
          {iso.title}
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {iso.classes.map((k) => (
          <IsoCard key={k.isoLevel} klass={k} />
        ))}
      </div>

      <div>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
          {cmp.title}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-lg border border-orange-300 dark:border-orange-700 bg-orange-50 dark:bg-orange-900/30 p-4 space-y-3">
            <div className="font-semibold text-orange-900 dark:text-orange-100">
              {cmp.sca.label}
            </div>
            <p className="text-sm text-slate-700 dark:text-slate-200">
              {cmp.sca.description}
            </p>
            <div>
              <div className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-1">
                Max BUD
              </div>
              <div className="text-sm font-medium text-slate-900 dark:text-white">
                {cmp.sca.maxBUD}
              </div>
            </div>
            <div>
              <div className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-1">
                Certification required
              </div>
              <div className="text-sm text-slate-800 dark:text-slate-100">
                {cmp.sca.certificationRequired}
              </div>
            </div>
            <div className="pt-2 border-t border-orange-200 dark:border-orange-800">
              <div className="text-xs uppercase tracking-wide text-red-700 dark:text-red-300 font-semibold mb-1">
                Common mistake
              </div>
              <div className="text-sm text-slate-800 dark:text-slate-100">
                {cmp.sca.commonMistake}
              </div>
            </div>
          </div>
          <div className="rounded-lg border border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-900/30 p-4 space-y-3">
            <div className="font-semibold text-green-900 dark:text-green-100">
              {cmp.cleanroom.label}
            </div>
            <p className="text-sm text-slate-700 dark:text-slate-200">
              {cmp.cleanroom.description}
            </p>
            <div>
              <div className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-1">
                Max BUD
              </div>
              <div className="text-sm font-medium text-slate-900 dark:text-white">
                {cmp.cleanroom.maxBUD}
              </div>
            </div>
            <div>
              <div className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-1">
                Certification required
              </div>
              <div className="text-sm text-slate-800 dark:text-slate-100">
                {cmp.cleanroom.certificationRequired}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
