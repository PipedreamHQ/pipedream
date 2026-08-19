import crypto from "crypto";

export function defaultMessageId() {
  return crypto.randomUUID();
}

export function addDefaultEventFields(event) {
  const normalized = {
    ...event,
  };
  if (!normalized.messageId) normalized.messageId = defaultMessageId();
  if (!normalized.timestamp) normalized.timestamp = new Date().toISOString();
  return normalized;
}

export function buildEvent({
  type, userId, anonymousId, messageId, timestamp, context, integrations, ...rest
}) {
  const event = addDefaultEventFields({
    type,
    ...rest,
    messageId,
    timestamp,
  });
  if (userId) event.userId = userId;
  if (anonymousId) event.anonymousId = anonymousId;
  if (context) event.context = context;
  if (integrations) event.integrations = integrations;
  return event;
}
