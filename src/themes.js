// Maps module theme names to editorial palette helpers.
// All values resolve to CSS custom properties defined in index.css,
// so dark mode follows automatically.

export const cls = (theme) => {
  switch (theme) {
    case "info":
      return {
        accent: "var(--info)",
        tint: "var(--info-tint)",
        ink: "ink-info",
        bar: "bar-info",
        tintBg: "tint-info",
        borderL: { borderLeft: "3px solid var(--info)" },
        label: "INFO",
      };
    case "success":
      return {
        accent: "var(--success)",
        tint: "var(--success-tint)",
        ink: "ink-success",
        bar: "bar-success",
        tintBg: "tint-success",
        borderL: { borderLeft: "3px solid var(--success)" },
        label: "PRACTICE",
      };
    case "warning":
      return {
        accent: "var(--warning)",
        tint: "var(--warning-tint)",
        ink: "ink-warning",
        bar: "bar-warning",
        tintBg: "tint-warning",
        borderL: { borderLeft: "3px solid var(--warning)" },
        label: "CAUTION",
      };
    case "danger":
      return {
        accent: "var(--danger)",
        tint: "var(--danger-tint)",
        ink: "ink-danger",
        bar: "bar-danger",
        tintBg: "tint-danger",
        borderL: { borderLeft: "3px solid var(--danger)" },
        label: "HAZARD",
      };
    case "neutral":
    default:
      return {
        accent: "var(--ink)",
        tint: "var(--paper-3)",
        ink: "text-ink",
        bar: "bar-ink",
        tintBg: "tint-neutral",
        borderL: { borderLeft: "3px solid var(--ink)" },
        label: "FOUNDATION",
      };
  }
};
