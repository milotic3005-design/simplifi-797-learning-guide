import * as Diagrams from "./diagrams";

const REGISTRY = {
  "mfr-vs-cr": { component: Diagrams.MfrVsCr, title: "MFR vs Compounding Record" },
  "documentation-chain": { component: Diagrams.DocumentationChain, title: "Documentation chain" },
  "csp-label": { component: Diagrams.CspLabel, title: "Required CSP label elements" },
  "transport-chain": { component: Diagrams.TransportChain, title: "Staging through transport" },
  "release-checklist": { component: Diagrams.ReleaseChecklist, title: "Quality release verification" },
  "sop-lifecycle": { component: Diagrams.SopLifecycle, title: "SOP lifecycle" },

  "pec-types": { component: Diagrams.PecTypes, title: "Primary Engineering Control types" },
  "iso-cleanroom-layout": { component: Diagrams.IsoCleanroomLayout, title: "ISO cleanroom suite — floor plan" },
  "sca-vs-cleanroom": { component: Diagrams.ScaVsCleanroom, title: "SCA vs full cleanroom suite" },
  "pressure-differentials": { component: Diagrams.PressureDifferentials, title: "Pressure differentials" },
  "ach-requirements": { component: Diagrams.AchRequirements, title: "ISO 7 air change requirements" },

  "gfs-sampling": { component: Diagrams.GfsSampling, title: "Gloved fingertip sampling" },
  "media-fill-timeline": { component: Diagrams.MediaFillTimeline, title: "Media fill — 14-day incubation" },
  "qualification-pathway": { component: Diagrams.QualificationPathway, title: "Personnel qualification pathway" },

  "em-sample-map": { component: Diagrams.EmSampleMap, title: "Environmental monitoring sample map" },
  "capa-workflow": { component: Diagrams.CapaWorkflow, title: "Excursion response — STOP·FIND·FIX·CHECK" },
  "action-alert-levels": { component: Diagrams.ActionAlertLevels, title: "Action vs alert levels" },

  "cleaning-hierarchy": { component: Diagrams.CleaningHierarchy, title: "Cleaning · disinfection · sterilization" },
  "cleaning-sequence": { component: Diagrams.CleaningSequence, title: "Cleaning direction — cleanest to dirtiest" },
  "laf-wipe-pattern": { component: Diagrams.LafWipePattern, title: "LAF hood wipe pattern" },
  "pec-cleaning-frequency": { component: Diagrams.PecCleaningFrequency, title: "PEC cleaning frequency" },

  "garbing-order": { component: Diagrams.GarbingOrder, title: "Garbing order" },
  "critical-site": { component: Diagrams.CriticalSite, title: "Critical site & first air" },
  "shadowing": { component: Diagrams.Shadowing, title: "Shadowing — what to watch for" },
  "immediate-use-rule": { component: Diagrams.ImmediateUseRule, title: "Immediate-use criteria" },
  "bud-decision-tree": { component: Diagrams.BudDecisionTree, title: "BUD category decision tree" },

  "sterilization-matrix": { component: Diagrams.SterilizationMatrix, title: "What each method actually kills" },
  "filter-mechanism": { component: Diagrams.FilterMechanism, title: "0.22 µm filter — bugs vs endotoxins" },
  "endotoxin-limits": { component: Diagrams.EndotoxinLimits, title: "BET limits by route" },
  "sterility-test-timeline": { component: Diagrams.SterilityTestTimeline, title: "USP <71> sterility test" },

  "niosh-groups": { component: Diagrams.NioshGroups, title: "NIOSH HD list — 3 groups" },
  "cpec-vs-pec": { component: Diagrams.CpecVsPec, title: "C-PEC vs standard PEC" },
  "deactivation-flow": { component: Diagrams.DeactivationFlow, title: "Deactivation → decontamination → disinfection" },
  "ppe-layering": { component: Diagrams.PpeLayering, title: "HD PPE layering" },
  "hd-handling-chain": { component: Diagrams.HdHandlingChain, title: "HD handling — receiving to patient" },
};

export default function Graphic({ id, accent }) {
  const entry = REGISTRY[id];
  if (!entry) return null;
  const { component: C, title } = entry;
  return (
    <figure className="glass overflow-hidden">
      <div
        className="flex items-baseline justify-between px-5 py-3"
        style={{ borderBottom: "1px solid var(--line)" }}
      >
        <figcaption
          className="text-[10px] font-bold tracking-widest uppercase"
          style={{ color: accent || "var(--ink-2)" }}
        >
          ¶ Figure · {title}
        </figcaption>
        <span
          className="font-num text-[10px] font-medium"
          style={{ color: "var(--ink-3)" }}
        >
          {id}
        </span>
      </div>
      <div className="px-4 py-5 overflow-x-auto">
        <C />
      </div>
    </figure>
  );
}
