export const themeColors = {
  info: "blue",
  success: "green",
  warning: "yellow",
  danger: "red",
  neutral: "gray",
};

export const themeClasses = {
  info: {
    border: "border-blue-500",
    borderL: "border-l-4 border-blue-500",
    bg: "bg-blue-50 dark:bg-blue-900/30",
    text: "text-blue-700 dark:text-blue-200",
    badge: "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-200",
    dot: "bg-blue-500",
  },
  success: {
    border: "border-green-500",
    borderL: "border-l-4 border-green-500",
    bg: "bg-green-50 dark:bg-green-900/30",
    text: "text-green-700 dark:text-green-200",
    badge: "bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-200",
    dot: "bg-green-500",
  },
  warning: {
    border: "border-yellow-500",
    borderL: "border-l-4 border-yellow-500",
    bg: "bg-yellow-50 dark:bg-yellow-900/30",
    text: "text-yellow-800 dark:text-yellow-200",
    badge: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-200",
    dot: "bg-yellow-500",
  },
  danger: {
    border: "border-red-500",
    borderL: "border-l-4 border-red-500",
    bg: "bg-red-50 dark:bg-red-900/30",
    text: "text-red-700 dark:text-red-200",
    badge: "bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-200",
    dot: "bg-red-500",
  },
  neutral: {
    border: "border-gray-400",
    borderL: "border-l-4 border-gray-400",
    bg: "bg-gray-50 dark:bg-gray-800",
    text: "text-gray-700 dark:text-gray-200",
    badge: "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200",
    dot: "bg-gray-500",
  },
};

export const cls = (theme) => themeClasses[theme] || themeClasses.neutral;
