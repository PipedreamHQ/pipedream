"use client";

import {
  useState, useEffect, useCallback,
} from "react";
import { styles } from "../utils/componentStyles";
import { generateRequestToken } from "./api";

// Debounce hook
function useDebounce(value, delay) {
  const [
    debouncedValue,
    setDebouncedValue,
  ] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [
    value,
    delay,
  ]);

  return debouncedValue;
}

// Custom scrollbar styles
const scrollbarStyles = `
  .custom-scrollbar::-webkit-scrollbar {
    width: 6px;
  }
  .custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background-color: rgba(156, 163, 175, 0.5);
    border-radius: 3px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background-color: rgba(156, 163, 175, 0.8);
  }
  .dark .custom-scrollbar::-webkit-scrollbar-thumb {
    background-color: rgba(75, 85, 99, 0.5);
  }
  .dark .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background-color: rgba(75, 85, 99, 0.8);
  }
`;

export default function AppSearchDemo() {
  const [
    searchQuery,
    setSearchQuery,
  ] = useState("");
  const [
    apps,
    setApps,
  ] = useState([]);
  const [
    isLoading,
    setIsLoading,
  ] = useState(false);
  const [
    error,
    setError,
  ] = useState("");
  const [
    copiedSlug,
    setCopiedSlug,
  ] = useState("");

  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  const searchApps = useCallback(async (query) => {
    if (!query || query.length < 2) {
      setApps([]);
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const requestToken = generateRequestToken();
      // Convert spaces to underscores for name_slug searching
      const searchQuery = query.replace(/\s+/g, "_");
      const response = await fetch(
        `/docs/api-demo-connect/apps?q=${encodeURIComponent(searchQuery)}`,
        {
          headers: {
            "Content-Type": "application/json",
            "X-Request-Token": requestToken,
          },
        },
      );

      if (!response.ok) {
        throw new Error("Failed to search apps");
      }

      const data = await response.json();
      console.log("App icons:", data.apps.map((app) => ({
        name: app.name,
        icon: app.icon,
      })));
      // Sort apps by featured_weight in descending order
      const sortedApps = [...data.apps].sort((a, b) => (b.featured_weight || 0) - (a.featured_weight || 0));
      setApps(sortedApps);
    } catch (err) {
      console.error("Error searching apps:", err);
      setError("Failed to search apps. Please try again.");
      setApps([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    searchApps(debouncedSearchQuery);
  }, [
    debouncedSearchQuery,
    searchApps,
  ]);

  async function copyToClipboard(nameSlug) {
    try {
      await navigator.clipboard.writeText(nameSlug);
      setCopiedSlug(nameSlug);
      setTimeout(() => setCopiedSlug(""), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  }

  return (
    <div className={styles.container}>
      <style jsx>{scrollbarStyles}</style>
      <div className={styles.header}>Search for an app</div>
      <div className="p-4">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search for an app (e.g., slack, notion, gmail)"
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500"
        />

        {searchQuery.length > 0 && searchQuery.length < 2 && (
          <p className={styles.text.muted + " mt-2"}>
            Type at least 2 characters to search
          </p>
        )}

        {isLoading && (
          <div className="mt-4 text-center">
            <p className={styles.text.normal}>Searching...</p>
          </div>
        )}

        {error && (
          <div className={styles.statusBox.error}>
            <p className="text-sm">{error}</p>
          </div>
        )}

        {apps.length > 0 && !isLoading && (
          <div className="mt-4">
            <div className="relative">
              <div className="max-h-[500px] overflow-y-auto space-y-3 pr-2 custom-scrollbar">
                {apps.map((app) => (
                  <div
                    key={app.id}
                    className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-gray-300 dark:hover:border-gray-600 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      {app.icon && (
                        <img
                          src={app.icon}
                          alt={app.name}
                          className="w-10 h-10 rounded bg-white border border-gray-200 dark:border-gray-600 p-1"
                        />
                      )}
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1 flex-wrap">
                          <p className="font-semibold text-base text-gray-800 dark:text-gray-200 m-0">
                            {app.name}
                          </p>
                          <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 rounded px-2 py-0.5">
                            <div className={styles.codeText + " text-xs"}>
                              {app.name_slug}
                            </div>
                            <button
                              onClick={() => copyToClipboard(app.name_slug)}
                              className="p-0.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors ml-1"
                              title={copiedSlug === app.name_slug
                                ? "Copied!"
                                : "Copy app name slug"}
                            >
                              {copiedSlug === app.name_slug
                                ? (
                                  <svg className="w-3.5 h-3.5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                  </svg>
                                )
                                : (
                                  <svg className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                  </svg>
                                )}
                            </button>
                          </div>
                        </div>
                        <p className={styles.text.muted + " line-clamp-2"}>
                          {app.description}
                        </p>
                        {app.categories.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-1">
                            {app.categories.map((category) => (
                              <span
                                key={category}
                                className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded"
                              >
                                {category}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {apps.length > 5 && (
                <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white dark:from-gray-900 to-transparent pointer-events-none"></div>
              )}
            </div>
            {apps.length > 5 && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
                Scroll to see more
              </p>
            )}
          </div>
        )}

        {debouncedSearchQuery.length >= 2 &&
          apps.length === 0 &&
          !isLoading &&
          !error && (
          <div className="mt-4 text-center">
            <p className={styles.text.muted}>
                No apps found for "{debouncedSearchQuery}"
            </p>
          </div>
        )}

        <div className="mt-4">
          <p className={styles.text.muted}>
            Browse all available apps at{" "}
            <a
              href="https://mcp.pipedream.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:text-blue-600"
            >
              mcp.pipedream.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
