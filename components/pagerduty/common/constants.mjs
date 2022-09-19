const SUBDOMAIN_PLACEHOLDER = "{subdomain}";
const BASE_URL_V1 = `https://${SUBDOMAIN_PLACEHOLDER}.pagerduty.com`;
const VERSION_PATH_V1 = "/api/v1";

const BASE_URL = "https://api.pagerduty.com";
const WEBHOOK_ID = "webhookId";
const EXTENSION_ID = "extensionId";
const GENERIC_V2_WEBHOOK_OUTBOUND_INTEGRATION_ID = "PJFWPEP";
const ONCALL_USERS_BY_ESCALATION_POLICY = "onCallUsersByEscalationPolicy";

const API_HEADERS = {
  "Accept": "application/vnd.pagerduty+json;version=2",
  "Content-Type": "application/json",
};

/**
 * https://developer.pagerduty.com/docs/ZG9jOjQ1MTg4ODQ0-v3-overview#event-types
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
  EXTENSION_SCHEMA: "extension_schema_reference",
};

const INCIDENT_TYPE = "incident";
const INCIDENT_BODY_TYPE = "incident_body";
const WEBHOOK_TYPE = "webhook_subscription";
const HTTP_DELIVERY_METHOD_TYPE = "http_delivery_method";

const INCIDENT_STATUS = {
  TRIGGERED: "triggered",
  ACKNOWLEDGED: "acknowledged",
  RESOLVED: "resolved",
};

export default {
  BASE_URL,
  BASE_URL_V1,
  VERSION_PATH_V1,
  SUBDOMAIN_PLACEHOLDER,
  API_HEADERS,
  WEBHOOK_ID,
  EXTENSION_ID,
  GENERIC_V2_WEBHOOK_OUTBOUND_INTEGRATION_ID,
  ONCALL_USERS_BY_ESCALATION_POLICY,
  INCIDENT_EVENT_TYPES,
  INCIDENT_URGENCIES,
  REFERENCE,
  INCIDENT_TYPE,
  INCIDENT_BODY_TYPE,
  INCIDENT_STATUS,
  WEBHOOK_TYPE,
  HTTP_DELIVERY_METHOD_TYPE,
};
