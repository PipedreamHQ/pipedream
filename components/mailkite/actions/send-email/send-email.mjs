import { ConfigurationError } from "@pipedream/platform";
import mailkite from "../../mailkite.app.mjs";

/**
 * Coerce a value that may arrive as a JSON string into the object/array it encodes. Pipedream
 * hands `object` and `string[]` props through as strings when they are set from an expression
 * (e.g. `{{steps.trigger.event.attachments}}`), so every structured prop below has to accept
 * both shapes.
 *
 * @param {*} value - The raw prop value.
 * @param {string} label - Prop label, used in the error message.
 * @returns {*} The parsed value, or `value` unchanged when it is not a string.
 * @throws {ConfigurationError} When a string is not valid JSON.
 */
function maybeParseJson(value, label) {
  if (typeof value !== "string") return value;
  try {
    return JSON.parse(value);
  } catch {
    throw new ConfigurationError(`${label} must be valid JSON — could not parse: ${value}`);
  }
}

/**
 * Normalize the Attachments prop into the `[{ filename, url | content, contentType }]` array
 * `POST /v1/send` accepts. Entries may be objects or JSON strings, and the whole prop may be a
 * single JSON string encoding the array.
 *
 * @param {*} value - The raw `attachments` prop value.
 * @returns {object[]|undefined} The attachment array, or `undefined` when nothing was set.
 * @throws {ConfigurationError} When an entry is not an object or has no `filename`.
 */
export function parseAttachments(value) {
  if (value == null) return undefined;
  const parsed = maybeParseJson(value, "Attachments");
  const list = Array.isArray(parsed)
    ? parsed
    : [
      parsed,
    ];
  const out = list
    .filter((entry) => entry != null && entry !== "")
    .map((entry, i) => {
      const a = maybeParseJson(entry, `Attachment ${i + 1}`);
      if (typeof a !== "object" || Array.isArray(a)) {
        throw new ConfigurationError(
          `Attachment ${i + 1} must be an object with a \`filename\` and either \`url\` or \`content\`.`,
        );
      }
      if (typeof a.filename !== "string" || !a.filename.trim()) {
        throw new ConfigurationError(`Attachment ${i + 1} is missing \`filename\`.`);
      }
      return a;
    });
  return out.length
    ? out
    : undefined;
}

/**
 * Normalize the Extra Headers prop into the `Record<string, string>` the API expects. Values are
 * coerced to strings (a Pipedream expression readily yields a number or a boolean); blank values
 * are dropped so an unresolved expression does not emit an empty header.
 *
 * @param {*} value - The raw `headers` prop value.
 * @returns {object|undefined} The header map, or `undefined` when nothing usable was set.
 * @throws {ConfigurationError} When the prop is not an object, or a value is not a scalar.
 */
export function normalizeHeaders(value) {
  if (value == null) return undefined;
  const parsed = maybeParseJson(value, "Extra Headers");
  if (typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new ConfigurationError("Extra Headers must be an object of header name → value.");
  }
  const out = {};
  for (const [
    name,
    v,
  ] of Object.entries(parsed)) {
    if (!name.trim() || v == null || v === "") continue;
    if (typeof v === "object") {
      throw new ConfigurationError(
        `Header \`${name}\` must be a string — got ${Array.isArray(v)
          ? "an array"
          : "an object"}.`,
      );
    }
    out[name] = String(v);
  }
  return Object.keys(out).length
    ? out
    : undefined;
}

/**
 * Normalize the Schedule Send prop. The API's parser takes an ISO 8601 string, simple relative
 * language ("in 2 hours"), or a ms-epoch **number** — a ms-epoch sent as a *string* is rejected
 * with `bad_schedule`, because it falls through to `Date.parse()`. Pipedream props are strings,
 * so an all-digits value is converted here rather than 400ing at the API.
 *
 * @param {*} value - The raw `scheduledAt` prop value.
 * @returns {string|number|undefined} The value to send, or `undefined` when nothing was set.
 */
export function normalizeScheduledAt(value) {
  if (value == null) return undefined;
  if (typeof value === "number") {
    return Number.isFinite(value)
      ? value
      : undefined;
  }
  const s = String(value).trim();
  if (!s) return undefined;
  return /^\d+$/.test(s)
    ? Number(s)
    : s;
}

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
    templateData: c.templateData,
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

/**
 * Human-readable step summary. A future `scheduledAt` returns `status: "scheduled"` and an
 * `ssnd_…` id instead of a sent `msg_…`, so the summary reads the response rather than assuming
 * the message went out.
 *
 * @param {object} response - The `POST /v1/send` response body.
 * @param {string|string[]} to - The configured recipient(s).
 * @returns {string} The `$summary` line.
 */
export function summarize(response, to) {
  const recipients = [].concat(to ?? []).join(", ");
  const id = response?.id;
  if (response?.status === "scheduled") {
    const when = Number.isFinite(response.scheduledAt)
      ? new Date(response.scheduledAt).toISOString()
      : "a scheduled time";
    return `Scheduled email to ${recipients} for ${when} (id: ${id})`;
  }
  if (response?.status === "sent") {
    return `Sent email to ${recipients} (id: ${id})`;
  }
  return `Email to ${recipients} accepted with status "${response?.status}" (id: ${id})`;
}

export default {
  key: "mailkite-send-email",
  name: "Send Email",
  description:
    "Send an email from a verified MailKite domain — immediately, or at a scheduled time. [See the documentation](https://mailkite.dev/docs?utm_source=pipedream&utm_medium=integration&utm_campaign=components).",
  version: "0.0.1",
  type: "action",
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
      description: "One or more recipient addresses.",
    },
    subject: {
      type: "string",
      label: "Subject",
      description: "Email subject. Required unless you send a `Template ID`.",
      optional: true,
    },
    html: {
      type: "string",
      label: "HTML Body",
      description: "HTML content. Provide `HTML Body`, `Text Body`, or a `Template ID`.",
      optional: true,
    },
    text: {
      type: "string",
      label: "Text Body",
      description: "Plain-text content.",
      optional: true,
    },
    cc: {
      type: "string[]",
      label: "CC",
      optional: true,
    },
    bcc: {
      type: "string[]",
      label: "BCC",
      optional: true,
    },
    replyTo: {
      type: "string",
      label: "Reply-To",
      optional: true,
    },
    inReplyTo: {
      type: "string",
      label: "In-Reply-To",
      description:
        "The `Message-ID` of the message this one replies to (e.g. `<abc@mail.example.com>`). Sets the `In-Reply-To` and `References` headers so mail clients thread the reply.",
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
        "Extra raw MIME headers, applied after the threading headers so these win. Use for what the structured fields can't express — `List-Unsubscribe`, a dedup key (`X-Entity-Ref-ID`), or a tag header (`X-Tag`).",
      optional: true,
    },
    templateId: {
      type: "string",
      label: "Template ID",
      description: "A saved (`tpl_…`) or base (`base_…`) template. When set, `Subject`/`HTML Body`/`Text Body` become optional.",
      optional: true,
    },
    templateData: {
      type: "object",
      label: "Template Data",
      description: "Key/value pairs substituted into the template's `{{merge_tags}}`.",
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
        "Open-tracking override for this send. Leave unset to use the sending domain's default. Applies to HTML sends only, and not to scheduled sends.",
      optional: true,
    },
    trackClicks: {
      type: "boolean",
      label: "Track Clicks",
      description:
        "Click-tracking override for this send: `http(s)` links are rewritten to a signed redirect that records the click, then forwards to the destination. Leave unset to use the sending domain's default. Applies to HTML sends only, and not to scheduled sends.",
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
