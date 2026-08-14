// Token-paginated endpoints document maxItems as a multiple of 100 up to 1000, and default
// to 100. Requesting the ceiling cuts round-trips tenfold on the workspace traversals, which
// already cost one request per workspace before pagination is counted.
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

// Optional elements GET /sheets/{sheetId} can fold into the response. `filters` is the only
// way to discover a saved filter's ID, since there is no filters endpoint.
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

// DATETIME is deliberately absent: it is reserved for system columns, and asking for it
// returns an ABSTRACT_DATETIME column instead of erroring (verified live), so offering it
// hands an agent a column type it did not request. MULTI_PICKLIST and MULTI_CONTACT_LIST
// are creatable and were missing.
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

// Column types that accept an `options` array and value validation. Verified live: the API
// applies both to MULTI_PICKLIST, not only PICKLIST.
export const PICKLIST_COLUMN_TYPES = [
  "PICKLIST",
  "MULTI_PICKLIST",
];

// Elements the row copy/move endpoints can carry across. Without one of these, only cell
// values and formatting move; attachments and comments do not. The two endpoints do NOT
// document the same enum: move omits `children` and `all`, and passing them is accepted and
// then silently ignored, so they are kept apart rather than shared.
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
