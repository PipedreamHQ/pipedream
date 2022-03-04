/**
 * This object specifies the fields to include as part of every webhook call
 * payload, and their mappings to Datadog webhook variables.
 *
 * See https://docs.datadoghq.com/integrations/webhooks/#usage for further
 * details.
 */
const payloadFormat = {
  aggregKey: "$AGGREG_KEY",
  alertCycleKey: "$ALERT_CYCLE_KEY",
  alertId: "$ALERT_ID",
  alertMetric: "$ALERT_METRIC",
  alertPriority: "$ALERT_PRIORITY",
  alertQuery: "$ALERT_QUERY",
  alertScope: "$ALERT_SCOPE",
  alertStatus: "$ALERT_STATUS",
  alertTitle: "$ALERT_TITLE",
  alertTransition: "$ALERT_TRANSITION",
  alertType: "$ALERT_TYPE",
  date: "$DATE",
  email: "$EMAIL",
  eventMsg: "$EVENT_MSG",
  eventTitle: "$EVENT_TITLE",
  eventType: "$EVENT_TYPE",
  hostname: "$HOSTNAME",
  id: "$ID",
  lastUpdated: "$LAST_UPDATED",
  link: "$LINK",
  logsSample: "$LOGS_SAMPLE",
  metricNamespace: "$METRIC_NAMESPACE",
  orgId: "$ORG_ID",
  orgName: "$ORG_NAME",
  priority: "$PRIORITY",
  snapshot: "$SNAPSHOT",
  tags: "$TAGS",
  textOnlyMsg: "$TEXT_ONLY_MSG",
  user: "$USER",
  username: "$USERNAME",
};

export {
  payloadFormat,
};
