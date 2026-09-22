// Per https://developers.google.com/workspace/drive/api/guides/ref-export-formats,
// only six Google Workspace types have documented export MIME mappings.
// The defaults below prefer Microsoft Office equivalents where one exists.
export const defaultExportMimeBySource = {
  "application/vnd.google-apps.document":
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.google-apps.spreadsheet":
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.google-apps.presentation":
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "application/vnd.google-apps.drawing": "image/png",
  "application/vnd.google-apps.script":
    "application/vnd.google-apps.script+json",
};

// Workspace types with no export path via `files.export`.
// Source: the absence of these types from
// https://developers.google.com/workspace/drive/api/guides/ref-export-formats.
export const unsupportedWorkspaceMimes = {
  "application/vnd.google-apps.folder":
    "Folders can't be downloaded as files. Use a folder-zip action or list the folder's contents instead.",
  "application/vnd.google-apps.form":
    "Google Forms can't be exported via the Drive API. Use the Google Forms API to fetch form content or responses.",
  "application/vnd.google-apps.map":
    "My Maps can't be exported via the Drive API. Export manually from the My Maps UI as KMZ if needed.",
};

// Used to append a file extension when deriving a default filePath from the
// file's name. Covers every MIME in google-workspace-export-formats.mjs plus
// the Office defaults above.
export const extensionByMime = {
  "application/epub+zip": "epub",
  "application/pdf": "pdf",
  "application/rtf": "rtf",
  "application/vnd.google-apps.script+json": "json",
  "application/vnd.oasis.opendocument.presentation": "odp",
  "application/vnd.oasis.opendocument.spreadsheet": "ods",
  "application/vnd.oasis.opendocument.text": "odt",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation": "pptx",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "xlsx",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
  "application/x-vnd.oasis.opendocument.spreadsheet": "ods",
  "application/zip": "zip",
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/svg+xml": "svg",
  "text/csv": "csv",
  "text/html": "html",
  "text/markdown": "md",
  "text/plain": "txt",
  "text/tab-separated-values": "tsv",
  "text/x-markdown": "md",
};
