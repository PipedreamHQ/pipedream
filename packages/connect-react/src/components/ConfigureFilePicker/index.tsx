import {
  useState, useCallback, useEffect, type FC, type CSSProperties,
} from "react";
import { useQuery } from "@tanstack/react-query";
import { useFrontendClient } from "../../hooks/frontend-client-context";
import { useCustomize } from "../../hooks/customization-context";
import { sanitizeOption } from "../../utils/type-guards";

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
interface NavigationLevel {
  propName: string;
  label: string;
  value: unknown;
}

/**
 * App-specific configuration for the file picker
 */
export interface FilePickerAppConfig {
  /** App slug (e.g., "sharepoint", "google_drive", "dropbox") */
  app: string;
  /** Prop hierarchy to navigate through (e.g., ["siteId", "driveId", "fileOrFolderId"]) */
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
    propHierarchy: ["siteId", "driveId", "fileOrFolderId"],
    propLabels: {
      siteId: "Sites",
      driveId: "Drives",
      fileOrFolderId: "Files & Folders",
    },
    fileOrFolderProp: "fileOrFolderId",
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
}) => {
  const client = useFrontendClient();
  const { theme } = useCustomize();

  // Get app configuration (custom or built-in)
  const appConfig = customAppConfig || FILE_PICKER_APPS[app];
  if (!appConfig) {
    throw new Error(`No configuration found for app "${app}". Provide appConfig prop or use a supported app.`);
  }

  const { propHierarchy, propLabels, fileOrFolderProp, folderProp } = appConfig;

  // Debug logger
  const log = debug ? console.log.bind(console, "[ConfigureFilePicker]") : () => {};

  // Current configured props state
  const [configuredProps, setConfiguredProps] = useState<Record<string, unknown>>(() => {
    const initial: Record<string, unknown> = {
      [app]: { authProvisionId: accountId },
    };
    if (initialConfiguredProps) {
      return { ...initial, ...initialConfiguredProps };
    }
    return initial;
  });

  // Navigation path (breadcrumbs)
  const [navigationPath, setNavigationPath] = useState<NavigationLevel[]>([]);

  // Currently selected items
  const [selectedItems, setSelectedItems] = useState<FilePickerItem[]>([]);

  // Current prop being browsed
  const [currentProp, setCurrentProp] = useState<string>(propHierarchy[0] || "");

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
  }, [configuredProps, propHierarchy, fileOrFolderProp]);

  // Fetch options for current prop
  const {
    data: optionsData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["configureFilePicker", componentKey, currentProp, configuredProps, externalUserId],
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

  // Parse options into FilePickerItem format
  const items: FilePickerItem[] = (optionsData?.options || []).map((opt) => {
    const sanitized = sanitizeOption(opt);
    const label = sanitized.label;
    const rawValue = typeof sanitized.value === "string" ? sanitized.value : JSON.stringify(sanitized.value);

    // Try to parse JSON value (fileOrFolderId returns JSON with {id, name, isFolder, size})
    let isFolder = false;
    let id = rawValue;
    let name = label.replace(/^📁\s*/, "").replace(/^📄\s*/, "");
    let size: number | undefined;

    try {
      const parsed = JSON.parse(rawValue);
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

    // Parse the value if it's JSON, otherwise keep as-is
    let parsedValue: unknown = rawValue;
    try {
      parsedValue = JSON.parse(rawValue);
    } catch {
      // Keep as string
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

      setNavigationPath((prev) => [...prev, newPath]);

      // Update folder prop to navigate into the folder
      setConfiguredProps((prev) => {
        const updated = { ...prev };
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

      setNavigationPath((prev) => [...prev, newPath]);
      setConfiguredProps((prev) => {
        const updated = { ...prev, [currentProp]: item.value };
        log("Updated configuredProps:", updated);
        return updated;
      });
      return;
    }

    // At file/folder level, clicking a file toggles selection
    if (multiSelect) {
      setSelectedItems((prev) => {
        const exists = prev.some((i) => i.id === item.id);
        return exists ? prev.filter((i) => i.id !== item.id) : [...prev, item];
      });
    } else {
      setSelectedItems([item]);
    }
  }, [currentProp, multiSelect, fileOrFolderProp, folderProp, log]);

  // Handle selection change (checkbox)
  const handleSelectionChange = useCallback((item: FilePickerItem, selected: boolean) => {
    setSelectedItems((prev) => {
      if (selected) {
        if (multiSelect) {
          // Add to selection if not already selected
          if (prev.some((i) => i.id === item.id)) {
            return prev;
          }
          return [...prev, item];
        }
        return [item]; // Single selection
      }
      return prev.filter((i) => i.id !== item.id);
    });
  }, [multiSelect]);

  // Navigate to a specific level in the path
  const navigateTo = useCallback((index: number) => {
    if (index < 0) {
      // Go to root
      setNavigationPath([]);
      setConfiguredProps({
        [app]: { authProvisionId: accountId },
      });
      setSelectedItems([]);
      return;
    }

    // Slice path to the clicked level
    const newPath = navigationPath.slice(0, index + 1);
    setNavigationPath(newPath);

    // Rebuild configured props up to this level
    const newConfiguredProps: Record<string, unknown> = {
      [app]: { authProvisionId: accountId },
    };
    for (const level of newPath) {
      // Use folderProp for folder navigation, otherwise use propName
      const propKey = level.propName === "folder" ? (folderProp || "folderId") : level.propName;
      newConfiguredProps[propKey] = level.value;
    }
    setConfiguredProps(newConfiguredProps);
    setSelectedItems([]);
  }, [navigationPath, accountId, app, folderProp]);

  // Confirm selection
  const handleConfirm = useCallback(() => {
    onSelect(selectedItems, configuredProps);
  }, [selectedItems, configuredProps, onSelect]);

  // Styles
  const containerStyles: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    backgroundColor: theme.colors.neutral0,
    borderRadius: "8px",
    overflow: "hidden",
    border: `1px solid ${theme.colors.neutral20}`,
    height: "400px",
  };

  const headerStyles: CSSProperties = {
    padding: "12px 16px",
    borderBottom: `1px solid ${theme.colors.neutral10}`,
    display: "flex",
    alignItems: "center",
    gap: "8px",
    flexWrap: "wrap",
  };

  const breadcrumbStyles: CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "4px",
    fontSize: "13px",
  };

  const breadcrumbItemStyles: CSSProperties = {
    color: theme.colors.primary,
    cursor: "pointer",
    padding: "2px 4px",
    borderRadius: "4px",
  };

  const breadcrumbSeparatorStyles: CSSProperties = {
    color: theme.colors.neutral40,
  };

  const listStyles: CSSProperties = {
    flex: 1,
    overflowY: "auto",
    listStyle: "none",
    margin: 0,
    padding: 0,
  };

  const itemStyles: CSSProperties = {
    display: "flex",
    alignItems: "center",
    padding: "10px 16px",
    cursor: "pointer",
    borderBottom: `1px solid ${theme.colors.neutral10}`,
    transition: "background-color 0.1s",
  };

  const itemIconStyles: CSSProperties = {
    marginRight: "10px",
    fontSize: "16px",
  };

  const itemNameStyles: CSSProperties = {
    flex: 1,
    fontSize: "14px",
    color: theme.colors.neutral80,
  };

  const checkboxStyles: CSSProperties = {
    marginRight: "10px",
    width: "16px",
    height: "16px",
    cursor: "pointer",
    accentColor: theme.colors.primary,
  };

  const chevronStyles: CSSProperties = {
    color: theme.colors.neutral30,
    marginLeft: "8px",
  };

  const footerStyles: CSSProperties = {
    padding: "12px 16px",
    borderTop: `1px solid ${theme.colors.neutral10}`,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  };

  const selectionCountStyles: CSSProperties = {
    fontSize: "13px",
    color: theme.colors.neutral60,
  };

  const buttonGroupStyles: CSSProperties = {
    display: "flex",
    gap: "8px",
  };

  const buttonBaseStyles: CSSProperties = {
    padding: "8px 16px",
    fontSize: "14px",
    borderRadius: "6px",
    cursor: "pointer",
    border: "none",
    transition: "background-color 0.15s, opacity 0.15s",
  };

  const cancelButtonStyles: CSSProperties = {
    ...buttonBaseStyles,
    backgroundColor: theme.colors.neutral10,
    color: theme.colors.neutral80,
  };

  const confirmButtonStyles: CSSProperties = {
    ...buttonBaseStyles,
    backgroundColor: theme.colors.primary,
    color: "#fff",
    opacity: selectedItems.length === 0 ? 0.5 : 1,
  };

  const loadingStyles: CSSProperties = {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: theme.colors.neutral40,
    fontSize: "14px",
  };

  const errorStyles: CSSProperties = {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: theme.colors.danger || "#dc2626",
    fontSize: "14px",
    padding: "20px",
    textAlign: "center",
  };

  const emptyStyles: CSSProperties = {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: theme.colors.neutral40,
    fontSize: "14px",
  };

  const labelStyles: CSSProperties = {
    fontSize: "11px",
    color: theme.colors.neutral50,
    marginBottom: "4px",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  };

  const isSelected = (item: FilePickerItem) => selectedItems.some((i) => i.id === item.id);

  // Show current prop being fetched in header
  const currentPropLabel = propLabels[currentProp] || currentProp;

  return (
    <div style={containerStyles}>
      {/* Header with breadcrumbs */}
      <div style={headerStyles}>
        <div style={labelStyles}>Browsing: {currentPropLabel}</div>
        <div style={breadcrumbStyles}>
          <span
            style={breadcrumbItemStyles}
            onClick={() => navigateTo(-1)}
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
            <span key={`${level.propName}-${index}`} style={{ display: "flex", alignItems: "center" }}>
              <span style={breadcrumbSeparatorStyles}>/</span>
              <span
                style={breadcrumbItemStyles}
                onClick={() => navigateTo(index)}
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
      {isLoading ? (
        <div style={loadingStyles}>Loading...</div>
      ) : error ? (
        <div style={errorStyles}>
          Failed to load items: {error instanceof Error ? error.message : "Unknown error"}
        </div>
      ) : items.length === 0 ? (
        <div style={emptyStyles}>No items found</div>
      ) : (
        <ul style={listStyles}>
          {items.map((item) => {
            const selected = isSelected(item);
            // Show checkbox at file/folder level for selectable items
            const canSelect = currentProp === fileOrFolderProp && (
              (item.isFolder && selectFolders) || (!item.isFolder && selectFiles)
            );

            return (
              <li
                key={item.id}
                style={{
                  ...itemStyles,
                  backgroundColor: selected ? theme.colors.primary25 : undefined,
                }}
                onClick={() => handleItemClick(item)}
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
                    style={checkboxStyles}
                    checked={selected}
                    onChange={(e) => {
                      e.stopPropagation();
                      handleSelectionChange(item, e.target.checked);
                    }}
                    onClick={(e) => e.stopPropagation()}
                  />
                )}
                <span style={itemIconStyles}>
                  {item.isFolder ? "📁" : "📄"}
                </span>
                <span style={itemNameStyles}>{item.label}</span>
                {(item.isFolder || currentProp !== fileOrFolderProp) && (
                  <span style={chevronStyles}>›</span>
                )}
              </li>
            );
          })}
        </ul>
      )}

      {/* Footer */}
      <div style={footerStyles}>
        <div style={selectionCountStyles}>
          {selectedItems.length > 0
            ? `${selectedItems.length} item${selectedItems.length > 1 ? "s" : ""} selected`
            : "No items selected"}
        </div>
        <div style={buttonGroupStyles}>
          {onCancel && (
            <button style={cancelButtonStyles} onClick={onCancel}>
              {cancelText}
            </button>
          )}
          <button
            style={confirmButtonStyles}
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
