const BASE_URL = "https://api.pagerduty.com";
const WEBHOOK_ID = "webhookId";
const ONCALL_USERS_BY_ESCALATION_POLICY = "onCallUsersByEscalationPolicy";

const API_HEADERS = {
  "user-agent": "@PipedreamHQ/pipedream v0.1",
  "accept": "application/vnd.pagerduty+json;version=2",
};

export default {
  BASE_URL,
  API_HEADERS,
  WEBHOOK_ID,
  ONCALL_USERS_BY_ESCALATION_POLICY,
};
