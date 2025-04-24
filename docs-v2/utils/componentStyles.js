// Shared component style utilities for Connect demo components

export const styles = {
  // Container styles
  container: "border border-gray-200 dark:border-gray-700 rounded-md overflow-hidden mt-4",

  // Header styles
  header: "bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-2 font-medium text-sm text-gray-800 dark:text-gray-200",

  // Form control styles
  label: "font-medium text-sm text-gray-800 dark:text-gray-200",
  select: "ml-2 p-1 border border-gray-300 dark:border-gray-600 rounded text-sm bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200",

  // Button styles
  primaryButton: "px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors disabled:opacity-50 font-medium text-sm",
  secondaryButton: "px-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors font-medium text-sm inline-flex items-center",

  // Code display
  codeDisplay: "p-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-md",
  codeText: "text-sm break-all text-gray-800 dark:text-gray-200",

  // Text styles
  text: {
    normal: "text-sm text-gray-600 dark:text-gray-400",
    muted: "text-sm text-gray-500 dark:text-gray-400",
    small: "text-xs text-gray-500 dark:text-gray-400",
    strong: "text-gray-800 dark:text-gray-200",
    strongMuted: "text-gray-700 dark:text-gray-300",
  },

  // Status messages
  statusBox: {
    error: "mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 text-red-800 dark:text-red-400 rounded-md",
    success: "mt-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 text-green-800 dark:text-green-400 rounded-md",
  },
};
