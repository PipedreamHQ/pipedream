import {
  useEffect, useRef, type FC, type CSSProperties,
} from "react";

/**
 * Represents an item (file or folder) selected in the file picker
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
 * Props for the FilePickerIframe component
 */
export interface FilePickerIframeProps {
  /** Connect token for authentication */
  token: string;
  /** App slug (e.g., "sharepoint", "google_drive") */
  app: string;
  /** Connected account ID */
  accountId: string;
  /** External user ID (required for API calls) */
  externalUserId: string;
  /** Component key to use for the file picker (e.g., "~/sharepoint-select-file") */
  componentKey: string;
  /** Callback when user confirms their selection */
  onSelect: (items: FilePickerItem[], configuredProps: Record<string, unknown>) => void;
  /** Callback when user cancels */
  onCancel?: () => void;
  /** Callback when an error occurs */
  onError?: (message: string) => void;
  /** Allow selecting folders (default: true) */
  selectFolders?: boolean;
  /** Allow selecting files (default: true) */
  selectFiles?: boolean;
  /** Allow selecting multiple items (default: false) */
  multiSelect?: boolean;
  /** Confirm button text (default: "Select") */
  confirmText?: string;
  /** Cancel button text (default: "Cancel") */
  cancelText?: string;
  /** Frontend host URL (default: "pipedream.com") */
  frontendHost?: string;
  /** Project ID for API calls */
  projectId: string;
  /** Project environment for API calls */
  projectEnvironment: "development" | "production";
  /** Custom styles for the iframe container */
  style?: CSSProperties;
  /** Custom class name for the iframe container */
  className?: string;
}

/**
 * A file picker component that renders Pipedream's file picker in an iframe.
 * Communicates with the parent via postMessage.
 */
export const FilePickerIframe: FC<FilePickerIframeProps> = ({
  token,
  app,
  accountId,
  externalUserId,
  componentKey,
  onSelect,
  onCancel,
  onError,
  selectFolders = true,
  selectFiles = true,
  multiSelect = false,
  confirmText = "Select",
  cancelText = "Cancel",
  frontendHost = "pipedream.com",
  projectId,
  projectEnvironment,
  style,
  className,
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Handle messages from the iframe
  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      // Validate origin
      const expectedOrigin = `https://${frontendHost}`;
      if (e.origin !== expectedOrigin) {
        // Also check for localhost in development
        if (!e.origin.startsWith("http://localhost")) {
          return;
        }
      }

      switch (e.data?.type) {
      case "file-picker:select":
        onSelect(e.data.items, e.data.configuredProps);
        break;
      case "file-picker:cancel":
        onCancel?.();
        break;
      case "file-picker:error":
        onError?.(e.data.message);
        break;
      default:
        break;
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [onSelect, onCancel, onError, frontendHost]);

  // Build iframe URL with parameters
  const params = new URLSearchParams({
    token,
    app,
    accountId,
    externalUserId,
    componentKey,
    projectId,
    projectEnvironment,
    selectFolders: String(selectFolders),
    selectFiles: String(selectFiles),
    multiSelect: String(multiSelect),
    confirmText,
    cancelText,
  });

  const iframeSrc = `https://${frontendHost}/_static/file-picker.html?${params.toString()}`;

  const defaultStyle: CSSProperties = {
    border: 0,
    width: "100%",
    height: "100%",
  };

  return (
    <iframe
      ref={iframeRef}
      src={iframeSrc}
      style={{ ...defaultStyle, ...style }}
      className={className}
      title="Pipedream File Picker"
    />
  );
};

export default FilePickerIframe;
