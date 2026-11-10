export const EXPAND_NOTEBOOK_OPTIONS = [
  "sections",
  "sectionGroups",
];

export const EXPAND_PAGE_OPTIONS = [
  "parentNotebook",
  "parentSection",
];

export const EXPAND_SECTION_OPTIONS = [
  "parentNotebook",
  "parentSectionGroup",
];

// OData $filter requires at least one comparison operator or filter function.
// Free-text like "dinner" or "title:dinner" has neither and will 400 at Graph.
export const ODATA_OPERATORS = [
  " eq ",
  " ne ",
  " gt ",
  " ge ",
  " lt ",
  " le ",
  " and ",
  " or ",
  " not ",
  " has ",
];

export const ODATA_FUNCTIONS = [
  "startswith(",
  "endswith(",
  "contains(",
  "tolower(",
  "toupper(",
  "length(",
  "indexof(",
  "substring(",
];

// How many sections the page-search fallback queries in parallel. OneNote allows
// five concurrent requests per user, so stay below that.
export const SECTION_BATCH_SIZE = 3;

// Backoff before each retry of a throttled (429) request during the fallback scan.
// OneNote sends no Retry-After header, so this is a fixed schedule.
export const THROTTLE_RETRY_DELAYS_MS = [
  2000,
  6000,
  18000,
];

// Options returned per page of the Page ID picker.
export const PAGE_OPTIONS_LIMIT = 100;
