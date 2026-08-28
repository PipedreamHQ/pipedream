// Bulk action names -- use BULK_ACTION_RUN (8.8+); fall back to BULK_ACTION_ENABLE
// for older 8.x stacks that do not expose a direct manual-execute action.
export const BULK_ACTION_RUN = "run";
export const BULK_ACTION_ENABLE = "enable";

export const ALERT_STATUSES = [
  "open",
  "acknowledged",
  "closed",
];

export const SEVERITIES = [
  "low",
  "medium",
  "high",
  "critical",
];

export const RULE_TYPES = [
  "query",
  "eql",
  "saved_query",
  "threshold",
  "threat_match",
  "machine_learning",
  "new_terms",
  "esql",
];

export const CASE_STATUSES = [
  "open",
  "in-progress",
  "closed",
];

export const OBJECT_TYPES = [
  "case",
  "detection-rule",
];

// Fields Kibana returns on a rule read but rejects (or ignores) on a PUT update.
export const RULE_READ_ONLY_FIELDS = [
  "created_at",
  "created_by",
  "updated_at",
  "updated_by",
  "revision",
  "execution_summary",
  "related_integrations",
  "required_fields",
  "setup",
];

export const CASE_OWNER = "securitySolution";

export const DEFAULT_CASE_CONNECTOR = {
  id: "none",
  name: "none",
  type: ".none",
  fields: null,
};

export const CASE_COMMENT_TYPE_USER = "user";

export const KBN_XSRF_VALUE = "true";

// Minimum for `page` and `perPage`/`per_page` on GET /api/cases/_find and
// GET /api/detection_engine/rules/_find.
export const MIN_LIMIT = 1;

// GET /api/cases/_find documents a hard cap of 100 on `perPage`. GET
// /api/detection_engine/rules/_find doesn't document a cap, but 100 is enforced
// here too for consistency across both list tools.
export const PER_PAGE_MAX = 100;
