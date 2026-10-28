const DEFAULT_SEVERITY_OPTIONS = [
  {
    label: "Critical",
    value: "1",
  },
  {
    label: "High",
    value: "2",
  },
  {
    label: "Moderate",
    value: "3",
  },
  {
    label: "Low",
    value: "4",
  },
];

const INCIDENT_SEVERITY_OPTIONS = [
  ...DEFAULT_SEVERITY_OPTIONS,
  {
    label: "Planning",
    value: "5",
  },
];

const SERVICE_CATALOG_BASE_PATH = "/api/sn_sc/servicecatalog";
const KNOWLEDGE_BASE_PATH = "/api/sn_km_api/knowledge";
const KNOWLEDGE_ARTICLE_VIEW_PATH = "/kb_view.do";
const SYS_USER_TABLE = "sys_user";
const SC_REQUEST_TABLE = "sc_request";
const SC_REQ_ITEM_TABLE = "sc_req_item";
const CMDB_CI_TABLE = "cmdb_ci";
const QUESTION_CHOICE_TABLE = "question_choice";
const INCIDENT_TABLE = "incident";
const CATALOG_UI_POLICY_TABLE = "catalog_ui_policy";
const CATALOG_UI_POLICY_ACTION_TABLE = "catalog_ui_policy_action";
const KNOWLEDGE_BASE_TABLE = "kb_knowledge_base";
const MAX_LIMIT = 1000;

// Requested item (RITM) fields returned after an order. Approvals and stage
// live on the RITM, not on the parent request (REQ). `request.requested_for`
// covers instances whose RITMs have no `requested_for` of their own.
const REQUESTED_ITEM_FIELDS = [
  "sys_id",
  "number",
  "cat_item",
  "quantity",
  "state",
  "approval",
  "stage",
  "requested_for",
  "request.requested_for",
];

// The field guidance ServiceNow shows under a catalog variable. Kept only when
// set: most variables have none, and an empty string per field would undo the
// trim in `describeCatalogVariables`.
const DESCRIBED_TEXT_FIELDS = [
  "help_text",
];

export default {
  DEFAULT_SEVERITY_OPTIONS,
  INCIDENT_SEVERITY_OPTIONS,
  SERVICE_CATALOG_BASE_PATH,
  KNOWLEDGE_BASE_PATH,
  KNOWLEDGE_ARTICLE_VIEW_PATH,
  SYS_USER_TABLE,
  SC_REQUEST_TABLE,
  SC_REQ_ITEM_TABLE,
  CMDB_CI_TABLE,
  QUESTION_CHOICE_TABLE,
  INCIDENT_TABLE,
  CATALOG_UI_POLICY_TABLE,
  CATALOG_UI_POLICY_ACTION_TABLE,
  KNOWLEDGE_BASE_TABLE,
  MAX_LIMIT,
  REQUESTED_ITEM_FIELDS,
  DESCRIBED_TEXT_FIELDS,
};
