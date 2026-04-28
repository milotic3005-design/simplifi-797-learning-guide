// Maps module theme names to bento color tokens.
export const cls = (theme) => {
  switch (theme) {
    case "info":
      return {
        accent: "var(--info)",
        accent2: "var(--info-2)",
        tint: "var(--info-tint)",
        ink: "ink-info",
        bar: "bar-info",
        tintBg: "bg-tint-info",
        label: "INFO",
      };
    case "success":
      return {
        accent: "var(--success)",
        accent2: "var(--success-2)",
        tint: "var(--success-tint)",
        ink: "ink-success",
        bar: "bar-success",
        tintBg: "bg-tint-success",
        label: "PRACTICE",
      };
    case "warning":
      return {
        accent: "var(--warning)",
        accent2: "var(--warning-2)",
        tint: "var(--warning-tint)",
        ink: "ink-warning",
        bar: "bar-warning",
        tintBg: "bg-tint-warning",
        label: "CAUTION",
      };
    case "danger":
      return {
        accent: "var(--danger)",
        accent2: "var(--danger-2)",
        tint: "var(--danger-tint)",
        ink: "ink-danger",
        bar: "bar-danger",
        tintBg: "bg-tint-danger",
        label: "HAZARD",
      };
    case "neutral":
    default:
      return {
        accent: "var(--ink)",
        accent2: "var(--ink-2)",
        tint: "rgba(15,17,35,0.06)",
        ink: "text-ink",
        bar: "bar-ink",
        tintBg: "",
        label: "FOUNDATION",
      };
  }
};
