import type { FileItem, ProxyRequestFn } from "../../adapters/file-picker/types";

/**
 * Props for the FilePicker component
 */
export interface FilePickerProps {
  /** App slug (e.g., "sharepoint", "dropbox", "google_drive") */
  app: string;
  /** Connected account ID */
  accountId: string;
  /** External user ID for the Pipedream Connect session */
  externalUserId: string;
  /** Function to make proxy requests (typically a server action) */
  proxyRequest: ProxyRequestFn;
  /** Callback when user confirms their selection */
  onSelect: (items: FileItem[]) => void;
  /** Callback when user cancels */
  onCancel?: () => void;
  /** Allow selecting multiple items (default: true) */
  multiSelect?: boolean;
  /** Allow selecting folders (default: true) */
  selectFolders?: boolean;
  /** Allow selecting files (default: true) */
  selectFiles?: boolean;
  /** Whether to show checkboxes (default: true) */
  showCheckboxes?: boolean;
  /** Root label for breadcrumbs */
  rootLabel?: string;
  /** Confirm button text */
  confirmText?: string;
  /** Cancel button text */
  cancelText?: string;
  /** Optional: Filter files by extension (e.g., [".pdf", ".docx"]) */
  allowedExtensions?: string[];
  /** Optional: Custom class name for the container */
  className?: string;
}

/**
 * Internal state for the file picker
 */
export interface FilePickerState {
  /** Current navigation path */
  path: FileItem[];
  /** Items at current level */
  items: FileItem[];
  /** Currently selected items */
  selectedItems: FileItem[];
  /** Loading state */
  loading: boolean;
  /** Error state */
  error: Error | null;
  /** Token for next page */
  nextPageToken?: string;
}
