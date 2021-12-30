const BASE_URL = "https://api.pagerduty.com";
const WEBHOOK_ID = "webhookId";
const ONCALL_USERS_BY_ESCALATION_POLICY = "onCallUsersByEscalationPolicy";

const API_KEY = "u+VDLxdskdVRByYHt_4Q";

const API_HEADERS = {
  "Accept": "application/vnd.pagerduty+json;version=2",
  "Content-Type": "application/json",
};

/**
 * https://developer.pagerduty.com/docs/ZG9jOjExMDI5NTkw-v3-overview#event-types
 * https://support.pagerduty.com/docs/webhooks#supported-resources-and-event-types
 */
const INCIDENT_EVENT_TYPES = [
  "incident.acknowledged",
  "incident.annotated",
  "incident.delegated",
  "incident.escalated",
  "incident.reassigned",
  "incident.reopened",
  "incident.resolved",
  "incident.status_update_published",
  "incident.triggered",
  "incident.unacknowledged",
  "incident.responder.added",
  "incident.responder.replied",
  "incident.priority_updated",
  "service.created",
  "service.deleted",
  "service.updated",
];

const INCIDENT_URGENCIES = [
  {
    label: "High",
    value: "high",
  },
  {
    label: "Low",
    value: "low",
  },
];

const REFERENCE = {
  SERVICE: "service_reference",
  INCIDENT: "incident_reference",
  PRIORITY: "priority_reference",
  USER: "user_reference",
  ESCALATION_POLICY: "escalation_policy_reference",
};

const INCIDENT_TYPE = "incident";
const INCIDENT_BODY_TYPE = "incident_body";

export default {
  BASE_URL,
  API_HEADERS,
  WEBHOOK_ID,
  ONCALL_USERS_BY_ESCALATION_POLICY,
  INCIDENT_EVENT_TYPES,
  INCIDENT_URGENCIES,
  API_KEY,
  REFERENCE,
  INCIDENT_TYPE,
  INCIDENT_BODY_TYPE,
};
