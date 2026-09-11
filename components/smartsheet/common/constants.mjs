// Token-paginated endpoints default to 100 and cap at 1000; the ceiling cuts round-trips.
export const DEFAULT_MAX_ITEMS = 1000;

// Ceiling on in-flight requests when a traversal must fan out per workspace.
export const MAX_CONCURRENT_REQUESTS = 5;

// Elements GET /sheets/{sheetId} can omit, to trim large payloads.
export const SHEET_EXCLUDE_OPTIONS = [
  "filteredOutRows",
  "linkInFromCellDetails",
  "linksOutToCellsDetails",
  "nonexistentCells",
];

// `filters` is the only way to discover a saved filter ID; there is no filters endpoint.
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

// A permalink carries an opaque token, not the sheet ID, so it resolves only by matching
// List Sheets. The host boundary stops `evilsmartsheet.com` matching.
export const SHEET_URL_PATTERN = /^https?:\/\/(?:[^/]+\.)?smartsheet\.com(?::\d+)?(?:\/|$)/i;

// DATETIME omitted: it silently yields ABSTRACT_DATETIME.
export const COLUMN_TYPES = [
  "TEXT_NUMBER",
  "DATE",
  "ABSTRACT_DATETIME",
  "CONTACT_LIST",
  "MULTI_CONTACT_LIST",
  "CHECKBOX",
  "PICKLIST",
  "MULTI_PICKLIST",
  "DURATION",
  "PREDECESSOR",
];

export const PICKLIST_COLUMN_TYPES = [
  "PICKLIST",
  "MULTI_PICKLIST",
];

// Move omits `children` and `all`, which copy accepts, so the enums are kept apart.
export const ROW_COPY_INCLUDE_OPTIONS = [
  "all",
  "attachments",
  "children",
  "discussions",
];

export const ROW_MOVE_INCLUDE_OPTIONS = [
  "attachments",
  "discussions",
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
