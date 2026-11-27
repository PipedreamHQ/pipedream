// Turn a stored MailKite message into the exact `email.received` event body the webhook
// delivers, so a backfilled event and a live one are the same shape (AUDIT-2026-08-03 finding
// B3: "webhook sources should fetch existing events in the deploy() hook").
//
// The target is `buildWebhookPayload()` in MailKite's api/src/index.ts, published as
// sdks/spec/schemas/email-received-event.json. That schema is `additionalProperties: false` on
// the event AND on each attachment, so mapping is a matter of dropping fields as much as
// renaming them: the REST detail response carries API-only extras (`user_id`, `route_id`,
// `direction`, `webhook_status`, `contentId`, `disposition`) that the webhook never sends and
// the schema forbids.

/** Every field the published event schema defines, in the order buildWebhookPayload emits them. */
export const EVENT_FIELDS = [
  "id",
  "type",
  "from",
  "to",
  "subject",
  "text",
  "html",
  "threadId",
  "receivedAt",
  "receivedAtIso",
  "auth",
  "attachments",
];

/** The only attachment fields the schema allows; `GET /api/messages/:id` returns two more. */
export const EVENT_ATTACHMENT_FIELDS = [
  "id",
  "filename",
  "contentType",
  "size",
  "url",
  "content",
];

/**
 * Normalize one address to the event's `{ address, name? }` shape.
 *
 * `name` is OMITTED, never null, when unknown — the schema and the API both treat an absent
 * display name as "the MIME header did not name this exact address" rather than "empty name".
 *
 * @param {object|string} addr - A structured address from the API, or a bare address string.
 * @returns {{address: string, name?: string}} The event address.
 */
export function toEventAddress(addr) {
  const address = typeof addr === "string"
    ? addr
    : addr?.address;
  if (typeof address !== "string" || !address) {
    throw new TypeError("cannot map an address with no `address`");
  }
  const name = typeof addr === "object"
    ? addr?.name
    : undefined;
  return typeof name === "string" && name
    ? {
      address,
      name,
    }
    : {
      address,
    };
}

/**
 * Map one attachment from `GET /api/messages/:id` onto the webhook's attachment shape.
 *
 * Drops `contentId` and `disposition`: `attachmentPayload()` returns them on the REST detail
 * response, the webhook does not send them, and the schema's `additionalProperties: false`
 * rejects them. Keeps whichever of `url` / `content` is present — the schema requires exactly
 * one (a signed link normally; inlined base64 on zero-retention domains).
 *
 * @param {object} att - An attachment as the detail endpoint returns it.
 * @returns {object} The attachment as the webhook sends it.
 */
export function toEventAttachment(att) {
  const out = {
    filename: att?.filename ?? null,
    contentType: att?.contentType ?? null,
    size: Number(att?.size ?? 0),
  };
  // Optional keys are added only when actually present: `id` is absent for inlined bytes, and
  // url/content are mutually exclusive, so writing `undefined` would break the schema's oneOf.
  if (typeof att?.id === "string" && att.id) out.id = att.id;
  if (typeof att?.url === "string" && att.url) out.url = att.url;
  else if (typeof att?.content === "string") out.content = att.content;
  return out;
}

/**
 * Build an `email.received` event from a stored message plus its attachments.
 *
 * Accepts the `message` object from `GET /api/messages/:id` (a full row, with the structured
 * `from`/`to` the API adds) and falls back to the raw `from_addr`/`to_addr` columns when the
 * structured pair is absent, so a list row maps too — minus the bodies and attachments the
 * list query deliberately omits.
 *
 * @param {object} message - The stored message row.
 * @param {object[]} [attachments=[]] - Its attachments, from the same detail response.
 * @returns {object} An event body matching sdks/spec/schemas/email-received-event.json.
 */
export function toEmailReceivedEvent(message, attachments = []) {
  if (!message?.id) {
    throw new TypeError("cannot map a message with no `id`");
  }
  // `Number(null)` is 0, not NaN — a null timestamp must be rejected, not silently mapped to
  // the epoch, or the event would claim the mail arrived in 1970.
  const rawTs = message.received_at;
  const receivedAt = typeof rawTs === "number"
    ? rawTs
    : typeof rawTs === "string" && rawTs.trim()
      ? Number(rawTs)
      : NaN;
  if (!Number.isFinite(receivedAt)) {
    throw new TypeError(`message ${message.id} has no usable \`received_at\``);
  }
  // One `to` entry per event: an inbound row's `to_addr` is the single RCPT this delivery is
  // for, which is what the live webhook sends. The structured `to` is an array because the
  // same helper serves outbound rows, whose `to_addr` can hold several recipients.
  const to = (Array.isArray(message.to) && message.to.length
    ? message.to
    : [
      message.to_addr,
    ]).map(toEventAddress);
  return {
    id: message.id,
    type: "email.received",
    from: toEventAddress(message.from ?? message.from_addr),
    to,
    subject: message.subject ?? null,
    text: message.text_body ?? null,
    html: message.html_body ?? null,
    threadId: message.thread_id ?? null,
    receivedAt,
    // The RFC 3339 rendering of the same instant, never a re-read of the clock.
    receivedAtIso: new Date(receivedAt).toISOString(),
    // All four keys always present; null means "not scored", which is not the same as "pass".
    auth: {
      spf: message.spf ?? null,
      dkim: message.dkim ?? null,
      dmarc: message.dmarc ?? null,
      spam: message.spam ?? null,
    },
    attachments: (attachments ?? []).map(toEventAttachment),
  };
}

export default toEmailReceivedEvent;
