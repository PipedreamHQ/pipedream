// Shared constants for Writer list/search actions.

// Page size and hard cap for auto-paginated list endpoints
// (`/v1/applications`, `/v1/graphs`).
export const PAGE_LIMIT = 50;
export const MAX_RESULTS = 200;

// Curated default `fields` returned per record when the caller doesn't narrow
// the output. `id` is always added by `pluck`, so it is not listed here.
export const APPLICATION_DEFAULT_FIELDS = [
  "name",
  "type",
  "status",
];

export const GRAPH_DEFAULT_FIELDS = [
  "name",
  "description",
  "type",
];
