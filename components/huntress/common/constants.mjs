const BASE_URL = "https://api.huntress.io";
const VERSION_PATH = "/v1";
const DEFAULT_LIMIT = 50;

const INDICATOR_TYPE_OPTIONS = [
  "footholds",
  "monitored_files",
  "ransomware_canaries",
  "antivirus_detections",
  "process_detections",
  "managed_identity",
  "mde_detections",
  "siem_detections",
  "favicon_detections",
  "behavioral_detections",
  "email_security_detections",
  "app_control",
  "ai_misuse",
];

const INCIDENT_STATUS_OPTIONS = [
  "sent",
  "closed",
  "dismissed",
  "auto_remediating",
  "deleting",
  "partner_dismissed",
];

const SEVERITY_OPTIONS = [
  "low",
  "high",
  "critical",
];

const INCIDENT_PLATFORM_OPTIONS = [
  "windows",
  "darwin",
  "microsoft_365",
  "google",
  "linux",
  "email_security",
  "other",
];

const AGENT_PLATFORM_OPTIONS = [
  "windows",
  "darwin",
  "linux",
];

const ESCALATION_STATUS_OPTIONS = [
  "open",
  "overdue",
  "resolved",
];

const RISK_LEVEL_OPTIONS = [
  "none",
  "low",
  "medium",
  "high",
];

const TENANT_TYPE_OPTIONS = [
  "microsoft_365",
  "google_workspace",
];

export default {
  BASE_URL,
  VERSION_PATH,
  DEFAULT_LIMIT,
  INDICATOR_TYPE_OPTIONS,
  INCIDENT_STATUS_OPTIONS,
  SEVERITY_OPTIONS,
  INCIDENT_PLATFORM_OPTIONS,
  AGENT_PLATFORM_OPTIONS,
  ESCALATION_STATUS_OPTIONS,
  RISK_LEVEL_OPTIONS,
  TENANT_TYPE_OPTIONS,
};
