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
const SYS_USER_TABLE = "sys_user";
const SC_REQUEST_TABLE = "sc_request";
const KNOWLEDGE_BASE_TABLE = "kb_knowledge_base";
const MAX_LIMIT = 1000;

export default {
  DEFAULT_SEVERITY_OPTIONS,
  INCIDENT_SEVERITY_OPTIONS,
  SERVICE_CATALOG_BASE_PATH,
  KNOWLEDGE_BASE_PATH,
  SYS_USER_TABLE,
  SC_REQUEST_TABLE,
  KNOWLEDGE_BASE_TABLE,
  MAX_LIMIT,
};
