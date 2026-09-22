// Shared helpers for keeping list-tool outputs small enough for AI-agent (MCP)
// consumption. A single Ramp transaction is ~4k characters (nested line_items,
// accounting_field_selections, disputes), so an unfiltered page blows past the MCP
// output ceiling and the model never sees the data. List tools return a compact
// projection by default and expose a `fields` prop to opt into more; the full record
// is always available via the corresponding Get action.

// Return a new object containing only `keys` that are actually present on `obj`.
function pickFields(obj, keys) {
  if (!obj || typeof obj !== "object") return obj;
  const out = {};
  for (const key of keys) {
    if (obj[key] !== undefined) out[key] = obj[key];
  }
  return out;
}

// Project each record in an API list response to a compact field set, preserving the
// rest of the envelope (e.g. `page`). `requested` (from the tool's `fields` prop) is
// ADDITIVE — the named fields are returned in addition to the compact default, so the
// `id` and other summary fields the list->get workflow depends on are never dropped.
function projectList(response, defaultFields, requested) {
  const keys = requested?.length
    ? [
      ...new Set([
        ...defaultFields,
        ...requested,
      ]),
    ]
    : defaultFields;
  const data = Array.isArray(response?.data)
    ? response.data.map((item) => pickFields(item, keys))
    : response?.data;
  return {
    ...response,
    data,
  };
}

const TRANSACTION_COMPACT_FIELDS = [
  "id",
  "merchant_name",
  "amount",
  "merchant_amount",
  "sk_category_name",
  "state",
  "card_id",
  "limit_id",
  "accounting_date",
  "user_transaction_time",
  "memo",
];

const USER_COMPACT_FIELDS = [
  "id",
  "first_name",
  "last_name",
  "email",
  "role",
  "status",
  "department_id",
  "location_id",
  "manager_id",
  "is_manager",
];

const LIMIT_COMPACT_FIELDS = [
  "id",
  "display_name",
  "state",
  "balance",
  "spend_program_id",
  "created_at",
  "is_shareable",
];

const SPEND_PROGRAM_COMPACT_FIELDS = [
  "id",
  "display_name",
  "description",
  "icon",
  "is_shareable",
  "issue_physical_card_if_needed",
];

export default {
  pickFields,
  projectList,
  TRANSACTION_COMPACT_FIELDS,
  USER_COMPACT_FIELDS,
  LIMIT_COMPACT_FIELDS,
  SPEND_PROGRAM_COMPACT_FIELDS,
};
