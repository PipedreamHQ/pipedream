export const DEFAULT_MAX_ITEMS = 100;

// Ceiling on in-flight requests when a traversal must fan out per workspace.
export const MAX_CONCURRENT_REQUESTS = 5;

// Optional elements GET /sheets/{sheetId} can fold into the response. `filters` is the only
// way to discover a saved filter's ID — there is no filters endpoint.
export const SHEET_INCLUDE_OPTIONS = [
  "attachments",
  "columnType",
  "crossSheetReferences",
  "discussions",
  "filters",
  "filterDefinitions",
  "format",
  "ganttConfig",
  "objectValue",
  "ownerInfo",
  "proofs",
  "rowPermalink",
  "source",
  "writerInfo",
];

// Sheet permalinks look like `https://app.smartsheet.com/sheets/<token>`, where the
// token is opaque and is NOT the numeric sheet ID. Resolving one to an ID means
// matching the permalink returned by List Sheets.
export const SHEET_URL_PATTERN = /^https?:\/\/[^/]*smartsheet\.com\//i;

export const COLUMN_TYPES = [
  "TEXT_NUMBER",
  "DATE",
  "DATETIME",
  "CONTACT_LIST",
  "CHECKBOX",
  "PICKLIST",
  "DURATION",
  "PREDECESSOR",
  "ABSTRACT_DATETIME",
];

export const DESTINATION_TYPES = [
  "workspace",
  "folder",
  "home",
];

export const EMAIL_FORMATS = [
  "PDF",
  "EXCEL",
  "PDF_GANTT",
];
