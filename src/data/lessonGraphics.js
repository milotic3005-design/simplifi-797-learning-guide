// Map lesson ID → array of graphic IDs to render in the Lesson tab
// (after objectives, before sections). Order is preserved.

export const lessonGraphics = {
  // Module 1 — Fundamentals
  "1-1": ["mfr-vs-cr", "documentation-chain"],
  "1-2": ["csp-label", "documentation-chain"],
  "1-3": [],
  "1-4": ["release-checklist"],
  "1-5": ["sop-lifecycle"],
  "1-6": ["transport-chain"],

  // Module 2 — Engineering Controls
  "2-1": ["pec-types", "pressure-differentials"],
  "2-2": ["iso-cleanroom-layout", "sca-vs-cleanroom", "ach-requirements"],

  // Module 3 — Personnel Sampling
  "3-1": ["gfs-sampling", "media-fill-timeline", "qualification-pathway"],

  // Module 4 — Viable Facility Sampling
  "4-1": ["em-sample-map", "action-alert-levels"],
  "4-2": ["capa-workflow", "action-alert-levels"],

  // Module 5 — Sanitization
  "5-1": ["cleaning-hierarchy", "cleaning-sequence"],
  "5-2": ["laf-wipe-pattern", "pec-cleaning-frequency"],
  "5-3": ["cleaning-sequence"],

  // Module 6 — Aseptic Technique
  "6-1": ["garbing-order", "critical-site", "shadowing"],
  "6-2": ["critical-site"],
  "6-3": [],
  "6-4": ["immediate-use-rule", "bud-decision-tree"],
  "6-5": ["release-checklist"],

  // Module 7 — Sterilization
  "7-1": ["sterilization-matrix"],
  "7-2": ["filter-mechanism", "sterilization-matrix"],
  "7-3": ["endotoxin-limits"],
  "7-4": ["sterility-test-timeline", "bud-decision-tree"],

  // Module 8 — Hazardous Drugs
  "8-1": ["niosh-groups"],
  "8-2": ["cpec-vs-pec", "pressure-differentials"],
  "8-3": ["ppe-layering"],
  "8-4": ["hd-handling-chain"],
  "8-5": ["deactivation-flow"],
};
