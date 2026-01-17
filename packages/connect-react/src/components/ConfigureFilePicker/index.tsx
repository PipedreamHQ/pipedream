import {
  useState, useCallback, useEffect, useRef, type FC, type CSSProperties, type ReactNode,
} from "react";
import { useQuery } from "@tanstack/react-query";
import { useFrontendClient } from "../../hooks/frontend-client-context";
import { useCustomize } from "../../hooks/customization-context";
import { sanitizeOption } from "../../utils/type-guards";
import type { Theme } from "../../theme";

/**
 * Represents an item (file or folder) in the file picker
 */
export interface FilePickerItem {
  id: string;
  label: string;
  value: unknown;
  isFolder?: boolean;
  size?: number;
  raw?: unknown;
}

/**
 * Represents a navigation level in the picker hierarchy
 */
export interface NavigationLevel {
  propName: string;
  label: string;
  value: unknown;
}

/**
 * Icon configuration for the file picker
 */
export interface FilePickerIcons {
  /** Icon for folders (string emoji or ReactNode) */
  folder?: ReactNode;
  /** Icon for files (string emoji or ReactNode) */
  file?: ReactNode;
}

/**
 * Default icons used when none are specified
 */
const DEFAULT_ICONS: FilePickerIcons = {
  folder: "📁",
  file: "📄",
};

// ============================================================================
// Styles - defined outside component for performance
// ============================================================================

const createStyles = (theme: Theme, selectedItemsCount: number) => ({
  container: {
    display: "flex",
    flexDirection: "column",
    backgroundColor: theme.colors.neutral0,
    borderRadius: "8px",
    overflow: "hidden",
    border: `1px solid ${theme.colors.neutral20}`,
    height: "100%",
    minHeight: "300px",
  } as CSSProperties,

  header: {
    padding: "12px 16px",
    borderBottom: `1px solid ${theme.colors.neutral10}`,
    display: "flex",
    alignItems: "center",
    gap: "8px",
    flexWrap: "wrap",
  } as CSSProperties,

  breadcrumb: {
    display: "flex",
    alignItems: "center",
    gap: "4px",
    fontSize: "13px",
  } as CSSProperties,

  breadcrumbItem: {
    color: theme.colors.primary,
    cursor: "pointer",
    padding: "2px 4px",
    borderRadius: "4px",
  } as CSSProperties,

  breadcrumbSeparator: {
    color: theme.colors.neutral40,
  } as CSSProperties,

  list: {
    flex: 1,
    overflowY: "auto",
    listStyle: "none",
    margin: 0,
    padding: 0,
  } as CSSProperties,

  item: {
    display: "flex",
    alignItems: "center",
    padding: "10px 16px",
    cursor: "pointer",
    borderBottom: `1px solid ${theme.colors.neutral10}`,
    transition: "background-color 0.1s",
  } as CSSProperties,

  itemIcon: {
    marginRight: "10px",
    fontSize: "16px",
    display: "flex",
    alignItems: "center",
  } as CSSProperties,

  itemName: {
    flex: 1,
    fontSize: "14px",
    color: theme.colors.neutral80,
  } as CSSProperties,

  checkbox: {
    marginRight: "10px",
    width: "16px",
    height: "16px",
    cursor: "pointer",
    accentColor: theme.colors.primary,
  } as CSSProperties,

  chevron: {
    color: theme.colors.neutral30,
    marginLeft: "8px",
  } as CSSProperties,

  footer: {
    padding: "12px 16px",
    borderTop: `1px solid ${theme.colors.neutral10}`,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  } as CSSProperties,

  selectionCount: {
    fontSize: "13px",
    color: theme.colors.neutral60,
  } as CSSProperties,

  buttonGroup: {
    display: "flex",
    gap: "8px",
  } as CSSProperties,

  buttonBase: {
    padding: "8px 16px",
    fontSize: "14px",
    borderRadius: "6px",
    cursor: "pointer",
    border: "none",
    transition: "background-color 0.15s, opacity 0.15s",
  } as CSSProperties,

  cancelButton: {
    padding: "8px 16px",
    fontSize: "14px",
    borderRadius: "6px",
    cursor: "pointer",
    border: "none",
    transition: "background-color 0.15s, opacity 0.15s",
    backgroundColor: theme.colors.neutral10,
    color: theme.colors.neutral80,
  } as CSSProperties,

  confirmButton: {
    padding: "8px 16px",
    fontSize: "14px",
    borderRadius: "6px",
    cursor: "pointer",
    border: "none",
    transition: "background-color 0.15s, opacity 0.15s",
    backgroundColor: theme.colors.primary,
    color: "#fff",
    opacity: selectedItemsCount === 0
      ? 0.5
      : 1,
  } as CSSProperties,

  loading: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: theme.colors.neutral40,
    fontSize: "14px",
  } as CSSProperties,

  error: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: theme.colors.danger || "#dc2626",
    fontSize: "14px",
    padding: "20px",
    textAlign: "center",
  } as CSSProperties,

  empty: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: theme.colors.neutral40,
    fontSize: "14px",
  } as CSSProperties,
});

/** Minimum time to show loading state to prevent flicker (ms) */
const LOADING_DEBOUNCE_MS = 150;

/**
 * App-specific configuration for the file picker
 */
export interface FilePickerAppConfig {
  /** App slug (e.g., "sharepoint", "google_drive", "dropbox") */
  app: string;
  /** Prop hierarchy to navigate through (e.g., ["siteId", "driveId", "fileOrFolderIds"]) */
  propHierarchy: string[];
  /** Prop labels for display (e.g., { siteId: "Sites", driveId: "Drives" }) */
  propLabels: Record<string, string>;
  /** The prop name that shows selectable files/folders */
  fileOrFolderProp: string;
  /** The prop name used for folder navigation (set when drilling into folders) */
  folderProp?: string;
}

/**
 * Pre-built app configurations
 */
export const FILE_PICKER_APPS: Record<string, FilePickerAppConfig> = {
  sharepoint: {
    app: "sharepoint",
    propHierarchy: [
      "siteId",
      "driveId",
      "fileOrFolderIds",
    ],
    propLabels: {
      siteId: "Sites",
      driveId: "Drives",
      fileOrFolderIds: "Files & Folders",
    },
    fileOrFolderProp: "fileOrFolderIds",
    folderProp: "folderId",
  },
  // Future apps can be added here:
  // google_drive: { ... },
  // dropbox: { ... },
  // box: { ... },
};

/**
 * Props for the ConfigureFilePicker component
 */
export interface ConfigureFilePickerProps {
  /** Component key to use for the file picker (e.g., "sharepoint-select-file") */
  componentKey: string;
  /** App slug (e.g., "sharepoint") - used for app-specific config */
  app: string;
  /** Connected account ID */
  accountId: string;
  /** External user ID for the Pipedream Connect session */
  externalUserId: string;
  /** Callback when user confirms their selection */
  onSelect: (items: FilePickerItem[], configuredProps: Record<string, unknown>) => void;
  /** Callback when user cancels */
  onCancel?: () => void;
  /** Initial configured props (for restoring previous selection) */
  initialConfiguredProps?: Record<string, unknown>;
  /** Confirm button text */
  confirmText?: string;
  /** Cancel button text */
  cancelText?: string;
  /** Allow selecting folders (default: true) */
  selectFolders?: boolean;
  /** Allow selecting files (default: true) */
  selectFiles?: boolean;
  /** Allow selecting multiple items (default: false) */
  multiSelect?: boolean;
  /** Custom app configuration (overrides built-in config for the app) */
  appConfig?: FilePickerAppConfig;
  /** Enable debug logging (default: false) */
  debug?: boolean;
  /** Whether to show file/folder icons (default: true) */
  showIcons?: boolean;
  /** Custom icons for files and folders. Can be strings (emoji) or ReactNodes. */
  icons?: FilePickerIcons;
}

/**
 * A file picker component that uses the Pipedream SDK's configure endpoint
 * to fetch options for component props, rendering them in a file browser UI.
 */
export const ConfigureFilePicker: FC<ConfigureFilePickerProps> = ({
  componentKey,
  app,
  accountId,
  externalUserId,
  onSelect,
  onCancel,
  initialConfiguredProps,
  confirmText = "Select",
  cancelText = "Cancel",
  selectFolders = true,
  selectFiles = true,
  multiSelect = false,
  appConfig: customAppConfig,
  debug = false,
  showIcons = true,
  icons: customIcons,
}) => {
  const client = useFrontendClient();
  const { theme } = useCustomize();

  // Merge custom icons with defaults
  const icons = {
    ...DEFAULT_ICONS,
    ...customIcons,
  };

  // Get app configuration (custom or built-in) with safe defaults
  const appConfig = customAppConfig || FILE_PICKER_APPS[app];
  const hasValidConfig = !!appConfig;

  // Log missing config error (but don't early return to preserve hook order)
  if (!hasValidConfig) {
    console.error(`[ConfigureFilePicker] No configuration found for app "${app}". Provide appConfig prop or use a supported app.`);
  }

  // Extract config values with safe defaults to ensure hooks run unconditionally
  const {
    propHierarchy = [],
    fileOrFolderProp = "",
    folderProp = "",
  } = appConfig || {};

  // Debug logger (memoized to maintain stable reference)
  const log = useCallback(
    debug
      // eslint-disable-next-line no-console
      ? (...args: unknown[]) => console.log("[ConfigureFilePicker]", ...args)
      : () => {},
    [
      debug,
    ],
  );

  // Current configured props state
  const [
    configuredProps,
    setConfiguredProps,
  ] = useState<Record<string, unknown>>(() => {
    const initial: Record<string, unknown> = {
      [app]: {
        authProvisionId: accountId,
      },
    };
    if (initialConfiguredProps) {
      return {
        ...initial,
        ...initialConfiguredProps,
      };
    }
    return initial;
  });

  // Navigation path (breadcrumbs)
  const [
    navigationPath,
    setNavigationPath,
  ] = useState<NavigationLevel[]>([]);

  // Currently selected items
  const [
    selectedItems,
    setSelectedItems,
  ] = useState<FilePickerItem[]>([]);

  // Current prop being browsed
  const [
    currentProp,
    setCurrentProp,
  ] = useState<string>(propHierarchy[0] || "");

  // Debounced loading state to prevent flicker on fast responses
  const [
    showLoading,
    setShowLoading,
  ] = useState(false);
  const loadingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Determine which prop to fetch options for based on configured props
  useEffect(() => {
    for (const prop of propHierarchy) {
      const value = configuredProps[prop];
      if (!value) {
        setCurrentProp(prop);
        return;
      }
    }
    // All props configured, stay on last one
    setCurrentProp(fileOrFolderProp);
  }, [
    configuredProps,
    propHierarchy,
    fileOrFolderProp,
  ]);

  // Fetch options for current prop
  const {
    data: optionsData,
    isLoading,
    error,
  } = useQuery({
    queryKey: [
      "configureFilePicker",
      componentKey,
      currentProp,
      configuredProps,
      externalUserId,
    ],
    queryFn: async () => {
      log("Fetching options for prop:", currentProp);
      log("configuredProps:", JSON.stringify(configuredProps, null, 2));

      const response = await client.components.configureProp({
        externalUserId,
        id: componentKey,
        propName: currentProp,
        configuredProps,
      });

      log("Response for", currentProp, ":", {
        optionsCount: response.options?.length || 0,
        errors: response.errors,
      });

      if (response.errors?.length) {
        console.error("[ConfigureFilePicker] API errors:", response.errors);
      }

      return response;
    },
    enabled: !!accountId && !!currentProp,
  });

  // Debounce loading state to prevent flicker
  useEffect(() => {
    if (isLoading) {
      // Start a timer to show loading after debounce period
      loadingTimerRef.current = setTimeout(() => {
        setShowLoading(true);
      }, LOADING_DEBOUNCE_MS);
    } else {
      // Clear timer and hide loading immediately when done
      if (loadingTimerRef.current) {
        clearTimeout(loadingTimerRef.current);
        loadingTimerRef.current = null;
      }
      setShowLoading(false);
    }

    return () => {
      if (loadingTimerRef.current) {
        clearTimeout(loadingTimerRef.current);
      }
    };
  }, [
    isLoading,
  ]);

  // Parse options into FilePickerItem format
  const items: FilePickerItem[] = (optionsData?.options || []).map((opt) => {
    const sanitized = sanitizeOption(opt);
    const label = sanitized.label;
    const rawValue = typeof sanitized.value === "string"
      ? sanitized.value
      : JSON.stringify(sanitized.value);

    // Try to parse JSON value once (fileOrFolderIds returns JSON with {id, name, isFolder, size})
    let isFolder = false;
    let id = rawValue;
    let name = label.replace(/^📁\s*/, "").replace(/^📄\s*/, "");
    let size: number | undefined;
    let parsedValue: unknown = rawValue;

    try {
      const parsed = JSON.parse(rawValue);
      parsedValue = parsed;
      if (parsed && typeof parsed === "object") {
        id = parsed.id || rawValue;
        name = parsed.name || name;
        isFolder = !!parsed.isFolder;
        size = parsed.size;
      }
    } catch {
      // Not JSON, check label for folder indicators
      isFolder = label.startsWith("📁");
    }

    return {
      id,
      label: name,
      value: parsedValue,
      isFolder,
      size,
      raw: opt,
    };
  });

  log("Parsed items:", items.length, "for prop:", currentProp);

  // Handle item click (navigate into folder or select file/folder)
  const handleItemClick = useCallback((item: FilePickerItem) => {
    log("Item clicked:", item, "currentProp:", currentProp);

    // At file/folder level, clicking a folder navigates into it
    if (currentProp === fileOrFolderProp && item.isFolder) {
      const newPath: NavigationLevel = {
        propName: "folder",
        label: item.label,
        value: item.id,
      };

      setNavigationPath((prev) => [
        ...prev,
        newPath,
      ]);

      // Update folder prop to navigate into the folder
      setConfiguredProps((prev) => {
        const updated = {
          ...prev,
        };
        if (folderProp) {
          updated[folderProp] = item.id;
        }
        // Remove file/folder prop to trigger re-fetch
        delete (updated as Record<string, unknown>)[fileOrFolderProp];
        log("Navigating into folder:", updated);
        return updated;
      });
      return;
    }

    // For navigation props (not file/folder level), navigate to next level
    if (currentProp !== fileOrFolderProp) {
      const newPath: NavigationLevel = {
        propName: currentProp,
        label: item.label,
        value: item.value,
      };

      setNavigationPath((prev) => [
        ...prev,
        newPath,
      ]);
      setConfiguredProps((prev) => {
        const updated = {
          ...prev,
          [currentProp]: item.value,
        };
        log("Updated configuredProps:", updated);
        return updated;
      });
      return;
    }

    // At file/folder level, clicking a file toggles selection
    // Skip selection if file selection is disabled and item is a file
    if (!item.isFolder && !selectFiles) {
      return;
    }

    // Skip selection if folder selection is disabled and item is a folder
    if (item.isFolder && !selectFolders) {
      return;
    }

    if (multiSelect) {
      setSelectedItems((prev) => {
        const exists = prev.some((i) => i.id === item.id);
        return exists
          ? prev.filter((i) => i.id !== item.id)
          : [
            ...prev,
            item,
          ];
      });
    } else {
      setSelectedItems([
        item,
      ]);
    }
  }, [
    currentProp,
    multiSelect,
    fileOrFolderProp,
    folderProp,
    selectFiles,
    selectFolders,
    log,
  ]);

  // Handle selection change (checkbox)
  const handleSelectionChange = useCallback((item: FilePickerItem, selected: boolean) => {
    setSelectedItems((prev) => {
      if (selected) {
        if (multiSelect) {
          // Add to selection if not already selected
          if (prev.some((i) => i.id === item.id)) {
            return prev;
          }
          return [
            ...prev,
            item,
          ];
        }
        return [
          item,
        ]; // Single selection
      }
      return prev.filter((i) => i.id !== item.id);
    });
  }, [
    multiSelect,
  ]);

  // Navigate to a specific level in the path
  const navigateTo = useCallback((index: number) => {
    if (index < 0) {
      // Go to root
      setNavigationPath([]);
      setConfiguredProps({
        [app]: {
          authProvisionId: accountId,
        },
      });
      setSelectedItems([]);
      return;
    }

    // Slice path to the clicked level
    const newPath = navigationPath.slice(0, index + 1);
    setNavigationPath(newPath);

    // Rebuild configured props up to this level
    const newConfiguredProps: Record<string, unknown> = {
      [app]: {
        authProvisionId: accountId,
      },
    };
    for (const level of newPath) {
      // Use folderProp for folder navigation, otherwise use propName
      const propKey = level.propName === "folder"
        ? (folderProp || "folderId")
        : level.propName;
      newConfiguredProps[propKey] = level.value;
    }
    setConfiguredProps(newConfiguredProps);
    setSelectedItems([]);
  }, [
    navigationPath,
    accountId,
    app,
    folderProp,
  ]);

  // Confirm selection
  const handleConfirm = useCallback(() => {
    onSelect(selectedItems, configuredProps);
  }, [
    selectedItems,
    configuredProps,
    onSelect,
  ]);

  // Generate styles with current theme and selection count
  const styles = createStyles(theme, selectedItems.length);

  const isSelected = (item: FilePickerItem) => selectedItems.some((i) => i.id === item.id);

  // Show error UI if app configuration is missing
  if (!hasValidConfig) {
    return (
      <div style={{
        padding: "16px",
        color: "#dc2626",
        backgroundColor: "#fef2f2",
        borderRadius: "8px",
        fontSize: "14px",
      }}>
        Configuration error: No configuration found for app &quot;{app}&quot;.
        Please provide an appConfig prop or use a supported app.
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Header with breadcrumbs */}
      <div style={styles.header}>
        <div style={styles.breadcrumb}>
          <span
            role="button"
            tabIndex={0}
            style={styles.breadcrumbItem}
            onClick={() => navigateTo(-1)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                navigateTo(-1);
              }
            }}
            onMouseEnter={(e) => {
              (e.target as HTMLElement).style.backgroundColor = theme.colors.neutral10 || "";
            }}
            onMouseLeave={(e) => {
              (e.target as HTMLElement).style.backgroundColor = "";
            }}
          >
            Home
          </span>
          {navigationPath.map((level, index) => (
            <span key={`${level.propName}-${index}`} style={{
              display: "flex",
              alignItems: "center",
            }}>
              <span style={styles.breadcrumbSeparator}>/</span>
              <span
                role="button"
                tabIndex={0}
                style={styles.breadcrumbItem}
                onClick={() => navigateTo(index)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    navigateTo(index);
                  }
                }}
                onMouseEnter={(e) => {
                  (e.target as HTMLElement).style.backgroundColor = theme.colors.neutral10 || "";
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLElement).style.backgroundColor = "";
                }}
              >
                {level.label}
              </span>
            </span>
          ))}
        </div>
      </div>

      {/* Content */}
      {showLoading
        ? (
          <div style={styles.loading}>Loading...</div>
        )
        : error
          ? (
            <div style={styles.error}>
              Failed to load items: {error instanceof Error
                ? error.message
                : "Unknown error"}
            </div>
          )
          : items.length === 0
            ? (
              <div style={styles.empty}>No items found</div>
            )
            : (
              <ul style={styles.list}>
                {items.map((item) => {
                  const selected = isSelected(item);
                  // Show checkbox at file/folder level for selectable items
                  const canSelect = currentProp === fileOrFolderProp && (
                    (item.isFolder && selectFolders) || (!item.isFolder && selectFiles)
                  );

                  return (
                    <li
                      key={item.id}
                      role="button"
                      tabIndex={0}
                      style={{
                        ...styles.item,
                        backgroundColor: selected
                          ? theme.colors.primary25
                          : undefined,
                      }}
                      onClick={() => handleItemClick(item)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          handleItemClick(item);
                        }
                      }}
                      onMouseEnter={(e) => {
                        if (!selected) {
                          (e.currentTarget as HTMLElement).style.backgroundColor = theme.colors.neutral5 || "";
                        }
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.backgroundColor = selected
                          ? theme.colors.primary25 || ""
                          : "";
                      }}
                    >
                      {canSelect && (
                        <input
                          type="checkbox"
                          style={styles.checkbox}
                          checked={selected}
                          onChange={(e) => {
                            e.stopPropagation();
                            handleSelectionChange(item, e.target.checked);
                          }}
                          onClick={(e) => e.stopPropagation()}
                        />
                      )}
                      {showIcons && (
                        <span style={styles.itemIcon}>
                          {item.isFolder
                            ? icons.folder
                            : icons.file}
                        </span>
                      )}
                      <span style={styles.itemName}>{item.label}</span>
                      {(item.isFolder || currentProp !== fileOrFolderProp) && (
                        <span style={styles.chevron}>›</span>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}

      {/* Footer */}
      <div style={styles.footer}>
        <div style={styles.selectionCount}>
          {selectedItems.length > 0
            ? `${selectedItems.length} item${selectedItems.length > 1
              ? "s"
              : ""} selected`
            : "No items selected"}
        </div>
        <div style={styles.buttonGroup}>
          {onCancel && (
            <button type="button" style={styles.cancelButton} onClick={onCancel}>
              {cancelText}
            </button>
          )}
          <button
            type="button"
            style={styles.confirmButton}
            onClick={handleConfirm}
            disabled={selectedItems.length === 0}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfigureFilePicker;
