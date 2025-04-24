"use client";

export default function SDKButton({
  onClick,
  disabled = false,
  loading = false,
  children,
  className = "",
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors disabled:opacity-50 font-medium text-sm ${className}`}
    >
      {loading
        ? "Processing..."
        : children}
    </button>
  );
}
