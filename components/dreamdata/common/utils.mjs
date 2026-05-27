import crypto from "crypto";

export function buildEvent({
  type, userId, anonymousId, messageId, timestamp, context, integrations, ...rest
}) {
  const event = {
    type,
    ...rest,
  };
  if (userId) event.userId = userId;
  if (anonymousId) event.anonymousId = anonymousId;
  if (messageId) event.messageId = messageId;
  if (timestamp) event.timestamp = timestamp;
  if (context) event.context = context;
  if (integrations) event.integrations = integrations;
  return event;
}

export function verifyHmacSignature({
  rawBody, signature, signingKey,
}) {
  if (!signature || !signingKey) return false;
  const computed = crypto
    .createHmac("sha256", signingKey)
    .update(typeof rawBody === "string"
      ? rawBody
      : JSON.stringify(rawBody))
    .digest("base64");
  const provided = Buffer.from(signature);
  const expected = Buffer.from(computed);
  if (provided.length !== expected.length) return false;
  return crypto.timingSafeEqual(provided, expected);
}
