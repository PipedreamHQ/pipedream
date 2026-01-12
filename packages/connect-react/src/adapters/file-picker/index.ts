import type { FilePickerAdapter } from "./types";
import { sharepointAdapter } from "./sharepoint";

export * from "./types";
export { sharepointAdapter } from "./sharepoint";

const adapters: Record<string, FilePickerAdapter> = {
  sharepoint: sharepointAdapter,
};

/**
 * Get the file picker adapter for a given app
 * @param app - App slug (e.g., "sharepoint", "dropbox")
 * @returns The adapter for the app
 * @throws Error if no adapter exists for the app
 */
export function getFilePickerAdapter(app: string): FilePickerAdapter {
  const adapter = adapters[app];
  if (!adapter) {
    throw new Error(
      `No file picker adapter found for app: ${app}. ` +
        `Supported apps: ${Object.keys(adapters).join(", ")}`
    );
  }
  return adapter;
}

/**
 * Register a custom file picker adapter
 * @param adapter - The adapter to register
 */
export function registerFilePickerAdapter(adapter: FilePickerAdapter): void {
  adapters[adapter.app] = adapter;
}

/**
 * Get list of supported apps for file picker
 */
export function getSupportedFilePickerApps(): string[] {
  return Object.keys(adapters);
}
