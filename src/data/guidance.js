// Derived guidance helpers — pre-flight, pacing, and after-flow data
// computed from the course/lesson source files. Keeps lesson and module
// JSON files unchanged.

import courses from "./courses.json";
import studyPath from "./study-path-and-exam-prep.json";

const ORDER = courses.modules.map((m) => m.id);

// Map module id → its phase metadata (phase number, label, theme).
const PHASE_BY_MODULE = {};
studyPath.studyPath.phases.forEach((p) => {
  p.modules.forEach((mid) => {
    PHASE_BY_MODULE[mid] = {
      phase: p.phase,
      label: p.label,
      theme: p.theme,
      rationale: p.rationale,
      estimatedHours: p.estimatedHours,
      moduleNames: p.moduleNames,
      moduleIds: p.modules,
    };
  });
});

// Modules suggested as prerequisites for a given module — modules in
// earlier phases or earlier in the same phase.
export function modulePrereqs(moduleId) {
  const phase = PHASE_BY_MODULE[moduleId];
  if (!phase) return [];
  const earlierPhases = studyPath.studyPath.phases
    .filter((p) => p.phase < phase.phase)
    .flatMap((p) => p.modules);
  const samePhaseEarlier = phase.moduleIds.filter(
    (id) => phase.moduleIds.indexOf(id) < phase.moduleIds.indexOf(moduleId)
  );
  const ids = [...earlierPhases, ...samePhaseEarlier];
  return ids
    .map((id) => courses.modules.find((m) => m.id === id))
    .filter(Boolean);
}

// Phase metadata for a module (which Phase I/II/III it belongs to).
export function modulePhase(moduleId) {
  return PHASE_BY_MODULE[moduleId] || null;
}

// Build module-level guide.
export function buildModuleGuide(module) {
  const totalCourses = module.courses.length;
  const phase = modulePhase(module.id);
  const prereqs = modulePrereqs(module.id);
  const minutesPerCourse = 16; // ~12-20 min reading + self-check
  const estMinutes = totalCourses * minutesPerCourse;

  return {
    estMinutes,
    courseCount: totalCourses,
    phase,
    prereqs,
    sequence: module.courses.map((c, i) => ({
      ord: i + 1,
      id: c.id,
      title: c.title,
    })),
    learningGoals: module.mustKnow,
    afterChapter: [
      "Skim the Key Concepts panel — confirm you can speak each definition aloud.",
      "Re-read Must Know in one pass; mark any item that surprised you.",
      "Take the lesson-level Self-Check questions; aim to reveal answers without guessing.",
      "Tick the chapter complete in the Modules grid.",
    ],
  };
}

// Build lesson-level guide.
export function buildLessonGuide(lesson, module) {
  const totalSections = lesson.sections.length;
  const minutesPerSection = 2.5; // average reading time
  const readingMin = Math.max(6, Math.round(totalSections * minutesPerSection));
  const sectionPreviews = lesson.sections.map((s, i) => {
    const firstSentence = s.body.split(/\.\s/)[0];
    return {
      ord: i + 1,
      heading: s.heading,
      preview: firstSentence.length > 140
        ? firstSentence.slice(0, 137) + "…"
        : firstSentence + ".",
    };
  });
  const phase = module ? modulePhase(module.id) : null;

  return {
    readingMin,
    totalSections,
    keyTermsCount: lesson.keyTerms.length,
    selfCheckCount: lesson.selfCheck.length,
    objectives: lesson.objectives,
    sectionPreviews,
    phase,
    moduleNumber: module?.number,
    moduleTitle: module?.title,
    pacing: [
      { label: "Read", detail: `Work through all ${totalSections} sections — about ${readingMin} min` },
      { label: "Pause", detail: "Stop and recall the bullet you found most surprising before moving on" },
      { label: "Review", detail: "Skim Key Terms — verbalize each definition without looking" },
      { label: "Apply", detail: "Read the Clinical scenario, then state your own analysis before reading mine" },
      { label: "Check", detail: `Take all ${lesson.selfCheck.length} Self-Check questions; reveal one at a time` },
    ],
  };
}
