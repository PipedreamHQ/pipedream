export const BASE_URL = "https://api.featherless.ai/v1";
export const MAX_PER_PAGE = 1000;

// The API returns the ENTIRE catalog (~22k models, ~7.8 MB) when `per_page` is
// omitted, and floors small values at 100 per page. Default to one bounded page
// so a "list models" call never overflows the agent's context.
export const DEFAULT_PER_PAGE = 100;

// Each model object carries many fields; 100 full objects still overflow the
// tool-output cap. Project to the keys an agent needs to pick a model. Callers
// can override via the `fields` prop.
export const COMPACT_MODEL_FIELDS = Object.freeze([
  "id",
  "name",
  "model_class",
  "context_length",
  "max_completion_tokens",
  "available_on_current_plan",
]);
