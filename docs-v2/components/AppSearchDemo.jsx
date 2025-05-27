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
        `/docs/api-demo-connect/apps?q=${encodeURIComponent(searchQuery)}&limit=5`,
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
      setApps(data.apps);
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
          <div className="mt-4 space-y-3">
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
                      className="w-10 h-10 rounded"
                    />
                  )}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1 flex-nowrap">
                      <p className="font-semibold text-base text-gray-800 dark:text-gray-200 flex-shrink-0 m-0">
                        {app.name}
                      </p>
                      <code className="text-sm px-2 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded flex-shrink-0">
                        {app.name_slug}
                      </code>
                      <button
                        onClick={() => copyToClipboard(app.name_slug)}
                        className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors flex-shrink-0"
                        title={copiedSlug === app.name_slug
                          ? "Copied!"
                          : "Copy app name slug"}
                      >
                        {copiedSlug === app.name_slug
                          ? (
                            <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          )
                          : (
                            <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                          )}
                      </button>
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
          <p className={styles.text.small}>
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
