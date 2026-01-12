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
  value: string;
  isFolder?: boolean;
  raw?: unknown;
}

/**
 * Represents a navigation level in the picker hierarchy
 */
interface NavigationLevel {
  propName: string;
  label: string;
  value: string;
}

/**
 * Props for the ConfigureFilePicker component
 */
export interface ConfigureFilePickerProps {
  /** Component key to use for the file picker (e.g., "sharepoint-select-file") */
  componentKey: string;
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
}

/**
 * Mapping of prop names to their hierarchical order
 */
const PROP_HIERARCHY = [
  "siteId",
  "driveId",
  "folderId",
  "fileOrFolderId",
];

/**
 * A file picker component that uses the Pipedream SDK's configure endpoint
 * to fetch options for component props, rendering them in a file browser UI.
 */
export const ConfigureFilePicker: FC<ConfigureFilePickerProps> = ({
  componentKey,
  accountId,
  externalUserId,
  onSelect,
  onCancel,
  initialConfiguredProps,
  confirmText = "Select",
  cancelText = "Cancel",
}) => {
  const client = useFrontendClient();
  const { theme } = useCustomize();

  // Current configured props state
  const [configuredProps, setConfiguredProps] = useState<Record<string, unknown>>(() => {
    const initial: Record<string, unknown> = {
      sharepoint: { authProvisionId: accountId },
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
  const [currentProp, setCurrentProp] = useState<string>("siteId");

  // Track if we should skip folderId (when it returns no options)
  const [skipFolderId, setSkipFolderId] = useState(false);

  // Determine which prop to fetch options for based on configured props
  useEffect(() => {
    for (const prop of PROP_HIERARCHY) {
      // Skip folderId if it returned no options (drive root has no subfolders)
      if (prop === "folderId" && skipFolderId) {
        continue;
      }
      const value = configuredProps[prop];
      if (!value) {
        setCurrentProp(prop);
        return;
      }
    }
    // All props configured, stay on last one
    setCurrentProp("fileOrFolderId");
  }, [configuredProps, skipFolderId]);

  // Fetch options for current prop
  const {
    data: optionsData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["configureFilePicker", componentKey, currentProp, configuredProps, externalUserId],
    queryFn: async () => {
      console.log("[ConfigureFilePicker] Fetching options for prop:", currentProp);
      console.log("[ConfigureFilePicker] configuredProps:", JSON.stringify(configuredProps, null, 2));

      const response = await client.components.configureProp({
        externalUserId,
        id: componentKey,
        propName: currentProp,
        configuredProps,
      });

      console.log("[ConfigureFilePicker] Response for", currentProp, ":", {
        optionsCount: response.options?.length || 0,
        stringOptionsCount: response.stringOptions?.length || 0,
        errors: response.errors,
        errorDetails: response.errors ? JSON.stringify(response.errors) : undefined,
        context: response.context,
        rawOptions: response.options?.slice(0, 3), // First 3 options for debugging
      });

      if (response.errors?.length) {
        console.error("[ConfigureFilePicker] API errors:", response.errors);
        // Try to parse and show more details
        response.errors.forEach((err: string, i: number) => {
          try {
            const parsed = JSON.parse(err);
            console.error(`[ConfigureFilePicker] Error ${i} details:`, parsed);
          } catch {
            console.error(`[ConfigureFilePicker] Error ${i} (raw):`, err);
          }
        });
      }

      return response;
    },
    enabled: !!accountId && !!currentProp,
  });

  // Parse options into FilePickerItem format
  const items: FilePickerItem[] = (optionsData?.options || []).map((opt, idx) => {
    // Use sanitizeOption to handle various option formats
    const sanitized = sanitizeOption(opt);
    const label = sanitized.label;
    const value = typeof sanitized.value === "string" ? sanitized.value : JSON.stringify(sanitized.value);

    if (idx < 3) {
      console.log("[ConfigureFilePicker] Parsing option", idx, ":", {
        raw: opt,
        sanitized,
        label,
        value,
      });
    }

    // Try to detect if it's a folder
    let isFolder = false;
    let parsedValue = value;
    try {
      const parsed = JSON.parse(value);
      if (parsed.isFolder !== undefined) {
        isFolder = parsed.isFolder;
        parsedValue = value;
      }
    } catch {
      // Not JSON, check label for folder indicators
      isFolder = label.startsWith("📁");
    }

    return {
      id: value,
      label: label.replace(/^📁\s*/, "").replace(/^📄\s*/, ""),
      value: parsedValue,
      isFolder,
      raw: opt,
    };
  });

  console.log("[ConfigureFilePicker] Parsed items count:", items.length, "for prop:", currentProp);

  // Auto-skip folderId when it returns no options (go straight to fileOrFolderId)
  useEffect(() => {
    if (currentProp === "folderId" && optionsData && !isLoading) {
      const hasOptions = (optionsData.options?.length || 0) > 0;
      if (!hasOptions && !optionsData.errors?.length) {
        console.log("[ConfigureFilePicker] folderId has no options, skipping to fileOrFolderId");
        setSkipFolderId(true);
      }
    }
  }, [currentProp, optionsData, isLoading]);

  // Handle item click (navigate into folder or select file)
  const handleItemClick = useCallback((item: FilePickerItem) => {
    console.log("[ConfigureFilePicker] Item clicked:", item, "currentProp:", currentProp);

    if (item.isFolder || currentProp !== "fileOrFolderId") {
      // Navigate into this item
      const newPath: NavigationLevel = {
        propName: currentProp,
        label: item.label,
        value: item.value,
      };

      setNavigationPath((prev) => [...prev, newPath]);

      // Update configured props - use raw value, not __lv wrapper
      // The /configure API expects raw values for prop dependencies
      setConfiguredProps((prev) => {
        const updated = {
          ...prev,
          [currentProp]: item.value,
        };
        console.log("[ConfigureFilePicker] Updated configuredProps:", updated);
        return updated;
      });

      // If it's a folder selection on fileOrFolderId, navigate into it
      if (currentProp === "fileOrFolderId" && item.isFolder) {
        try {
          const parsed = JSON.parse(item.value);
          setConfiguredProps((prev) => ({
            ...prev,
            folderId: parsed.id,
            fileOrFolderId: undefined,
          }));
        } catch {
          // Keep as is
        }
      }
    } else {
      // Select this file
      setSelectedItems([item]);
    }
  }, [currentProp]);

  // Handle selection change (checkbox)
  const handleSelectionChange = useCallback((item: FilePickerItem, selected: boolean) => {
    setSelectedItems((prev) => {
      if (selected) {
        return [item]; // Single selection for now
      }
      return prev.filter((i) => i.id !== item.id);
    });
  }, []);

  // Navigate to a specific level in the path
  const navigateTo = useCallback((index: number) => {
    if (index < 0) {
      // Go to root
      setNavigationPath([]);
      setConfiguredProps({
        sharepoint: { authProvisionId: accountId },
      });
      setSelectedItems([]);
      setSkipFolderId(false); // Reset skip state when going to root
      return;
    }

    // Slice path to the clicked level
    const newPath = navigationPath.slice(0, index + 1);
    setNavigationPath(newPath);

    // Rebuild configured props up to this level - use raw values, not __lv wrapper
    const newConfiguredProps: Record<string, unknown> = {
      sharepoint: { authProvisionId: accountId },
    };
    for (const level of newPath) {
      newConfiguredProps[level.propName] = level.value;
    }
    setConfiguredProps(newConfiguredProps);
    setSelectedItems([]);

    // Reset skipFolderId if navigating above driveId level
    const driveIdIndex = newPath.findIndex((l) => l.propName === "driveId");
    if (driveIdIndex === -1 || index < driveIdIndex) {
      setSkipFolderId(false);
    }
  }, [navigationPath, accountId]);

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
  const currentPropLabel = {
    siteId: "Sites",
    driveId: "Drives",
    folderId: "Folders",
    fileOrFolderId: "Files & Folders",
  }[currentProp] || currentProp;

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
            const showCheckbox = currentProp === "fileOrFolderId" && !item.isFolder;

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
                {showCheckbox && (
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
                {(item.isFolder || currentProp !== "fileOrFolderId") && (
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
