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

// How many sections the page-search fallback queries in parallel.
export const SECTION_BATCH_SIZE = 5;
