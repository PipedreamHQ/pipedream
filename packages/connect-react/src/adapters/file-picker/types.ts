/**
 * Represents a file or folder item in the file picker
 */
export interface FileItem {
  /** Unique identifier for this item */
  id: string;
  /** Display name */
  name: string;
  /** Type of item */
  type: "file" | "folder" | "drive" | "site";
  /** MIME type for files */
  mimeType?: string;
  /** File size in bytes */
  size?: number;
  /** Last modified timestamp */
  modifiedAt?: string;
  /** Whether this item can be navigated into (has children) */
  canNavigateInto: boolean;
  /** Raw response data from the API (adapter-specific) */
  _raw?: unknown;
}

/**
 * Result from fetching items at a level
 */
export interface FilePickerLevel {
  /** Items at this level */
  items: FileItem[];
  /** Token for fetching next page, if more items exist */
  nextPageToken?: string;
}

/**
 * Options for a proxy request
 */
export interface ProxyRequestOptions {
  url: string;
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  body?: unknown;
  headers?: Record<string, string>;
}

/**
 * Function type for making proxy requests.
 * This can be implemented server-side to avoid CORS issues.
 */
export type ProxyRequestFn = (options: ProxyRequestOptions) => Promise<unknown>;

/**
 * Context passed to adapter methods
 */
export interface FilePickerContext {
  accountId: string;
  externalUserId: string;
  proxyRequest: ProxyRequestFn;
}

/**
 * Adapter interface for file picker integrations.
 * Each app (SharePoint, Dropbox, etc.) implements this interface.
 */
export interface FilePickerAdapter {
  /** App slug (e.g., "sharepoint", "dropbox") */
  app: string;

  /**
   * Get the root level items (e.g., sites for SharePoint, root folder for Dropbox)
   */
  getRootItems(
    ctx: FilePickerContext,
    pageToken?: string
  ): Promise<FilePickerLevel>;

  /**
   * Get children of an item (navigate into a folder, site, or drive)
   */
  getChildren(
    ctx: FilePickerContext,
    item: FileItem,
    pageToken?: string
  ): Promise<FilePickerLevel>;

  /**
   * Optional: Search for files/folders
   */
  search?(
    ctx: FilePickerContext,
    query: string,
    context?: FileItem
  ): Promise<FilePickerLevel>;
}
