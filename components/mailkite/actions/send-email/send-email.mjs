import mailkite from "../../mailkite.app.mjs";
import {
  normalizeHeaders,
  normalizeScheduledAt,
  normalizeTemplateData,
  parseAttachments,
  summarize,
} from "../../common/utils.mjs";

/**
 * Build the `POST /v1/send` body from the action's configured props. Only fields the user set
 * are included — omitting a field is meaningfully different from sending it, most sharply for
 * `trackOpens`/`trackClicks`, where omitted means "use the from-domain's default" and an
 * explicit `false` means "off for this send".
 *
 * @param {object} c - The bound component (`this` inside `run()`).
 * @returns {object} The send body.
 */
export function buildSendPayload(c) {
  const data = {
    from: c.from,
    to: c.to,
    subject: c.subject,
    html: c.html,
    text: c.text,
    cc: c.cc,
    bcc: c.bcc,
    replyTo: c.replyTo,
    inReplyTo: c.inReplyTo,
    attachments: parseAttachments(c.attachments),
    headers: normalizeHeaders(c.headers),
    templateId: c.templateId,
    templateData: normalizeTemplateData(c.templateData),
    scheduledAt: normalizeScheduledAt(c.scheduledAt),
    trackOpens: c.trackOpens,
    trackClicks: c.trackClicks,
  };
  // Only send the fields that were set. `=== undefined` and not a truthiness check: `false` is a
  // real value for the tracking flags, and dropping it would silently mean "domain default".
  for (const k of Object.keys(data)) {
    if (data[k] === undefined) delete data[k];
  }
  // An empty CC/BCC array is an unset prop, not "send to nobody".
  for (const k of [
    "cc",
    "bcc",
  ]) {
    if (Array.isArray(data[k]) && !data[k].length) delete data[k];
  }
  return data;
}

export default {
  key: "mailkite-send-email",
  name: "Send Email",
  description:
    "Send an email from a verified MailKite domain — immediately, or at a scheduled time. [See the documentation](https://mailkite.dev/docs?utm_source=pipedream&utm_medium=integration&utm_campaign=components).",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    mailkite,
    from: {
      type: "string",
      label: "From",
      description: "Sender address on a verified domain, e.g. `support@yourdomain.com`.",
    },
    to: {
      type: "string[]",
      label: "To",
      description:
        "One or more recipient addresses, e.g. `[\"jane@example.com\", \"joe@example.com\"]`.",
    },
    subject: {
      type: "string",
      label: "Subject",
      description:
        "Email subject, e.g. `Your receipt for order 1042`. Required unless you send a `Template ID`.",
      optional: true,
    },
    html: {
      type: "string",
      label: "HTML Body",
      description:
        "HTML content, e.g. `<p>Thanks, Jane — your order shipped.</p>`. Provide `HTML Body`, `Text Body`, or a `Template ID`.",
      optional: true,
    },
    text: {
      type: "string",
      label: "Text Body",
      description:
        "Plain-text content, e.g. `Thanks, Jane — your order shipped.`.",
      optional: true,
    },
    cc: {
      type: "string[]",
      label: "CC",
      description:
        "Carbon-copy recipients, e.g. `[\"manager@example.com\"]`.",
      optional: true,
    },
    bcc: {
      type: "string[]",
      label: "BCC",
      description:
        "Blind carbon-copy recipients, hidden from the other recipients, e.g. `[\"audit@example.com\"]`.",
      optional: true,
    },
    replyTo: {
      type: "string",
      label: "Reply-To",
      description:
        "Address replies should go to, e.g. `support@yourdomain.com`.",
      optional: true,
    },
    inReplyTo: {
      type: "string",
      label: "In-Reply-To",
      description:
        "The thread identifier of the message this one replies to — pass the `threadId` field from a **New Inbound Email (Instant)** event, or the `threadId` returned by **List Messages**, e.g. `<CABc123@mail.example.com>`. Both are null when the message had no threading id, in which case it cannot be replied to in-thread. Sets the `In-Reply-To` and `References` headers so the reply joins that conversation.",
      optional: true,
    },
    attachments: {
      type: "string[]",
      label: "Attachments",
      description:
        "Files to attach. Each entry is an object with `filename` plus **either** `url` (fetched at send time — preferred for anything large) **or** `content` (the file's bytes as base64), and an optional `contentType`. Example: `{\"filename\":\"invoice.pdf\",\"url\":\"https://…/invoice.pdf\"}`.",
      optional: true,
    },
    headers: {
      type: "object",
      label: "Extra Headers",
      description:
        "Extra raw MIME headers, applied after the threading headers so these win. Use for what the structured fields can't express — `List-Unsubscribe`, a dedup key (`X-Entity-Ref-ID`), or a tag header (`X-Tag`), e.g. `{\"X-Entity-Ref-ID\": \"order-1042\"}`.",
      optional: true,
    },
    templateId: {
      type: "string",
      label: "Template ID",
      description:
        "A saved (`tpl_…`) or base (`base_…`) template, e.g. `tpl_4f3c9a` or `base_1a2b3c`. When set, `Subject`/`HTML Body`/`Text Body` become optional. Use **List Templates** to find the template ID (the `id` field).",
      optional: true,
    },
    templateData: {
      type: "object",
      label: "Template Data",
      description:
        "Key/value pairs substituted into the template's `{{merge_tags}}`, e.g. `{\"firstname\": \"Jane\", \"orderId\": \"1042\"}`.",
      optional: true,
    },
    scheduledAt: {
      type: "string",
      label: "Schedule Send",
      description:
        "Send later instead of now. Accepts ISO 8601 (`2026-09-01T09:00:00Z`), simple relative language (`in 2 hours`), or a ms-epoch. The step then returns `status: \"scheduled\"` and an `ssnd_…` id, cancelable via `DELETE /v1/scheduled/{id}`. Note that open/click tracking is **not** applied to scheduled sends.",
      optional: true,
    },
    trackOpens: {
      type: "boolean",
      label: "Track Opens",
      description:
        "Open-tracking override for this send, e.g. `true`. Leave unset to use the sending domain's default. Applies to HTML sends only, and not to scheduled sends.",
      optional: true,
    },
    trackClicks: {
      type: "boolean",
      label: "Track Clicks",
      description:
        "Click-tracking override for this send, e.g. `true`: `http(s)` links are rewritten to a signed redirect that records the click, then forwards to the destination. Leave unset to use the sending domain's default. Applies to HTML sends only, and not to scheduled sends.",
      optional: true,
    },
  },
  async run({ $ }) {
    const data = buildSendPayload(this);

    const response = await this.mailkite.sendEmail({
      $,
      data,
    });
    $.export("$summary", summarize(response, this.to));
    return response;
  },
};
