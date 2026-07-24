import utils from "../../common/utils.mjs";
import gmail from "../../gmail.app.mjs";

const DEFAULT_MAX_RESULTS = 25;
// Sized to stay under a typical MCP client's per-result token ceiling (Claude Code
// truncates at 25k tokens; message JSON runs ~1.7 chars/token, so 100k chars was ~2.4x
// over). An oversized result is not merely verbose — the client may spill it to a file
// and hand the model a path, so the model sees NOTHING. Measured: a 56-message search
// returned 42k chars and was spilled.
const MAX_RESPONSE_CHARS = 30_000;
// Applied only when a response busts the budget AND the caller named no `fields` of its
// own: keeps every message but strips it to what callers reason about, so counts stay
// correct. Never applied over an explicit `fields` choice — see utils.fitToBudget.
const COMPACT_FIELDS = [
  "labelIds",
  "subject",
  "sender",
  "recipient",
  "date",
  "snippet",
];
const DEFAULT_BODY_CHARS = 2000;
// Bodies shrink toward this floor before whole messages are dropped. Truncation is only
// acceptable because it announces itself per message (`bodyTruncated`), so the caller can
// re-fetch the one message it cares about; below this a body is too clipped to reason from.
const MIN_BODY_CHARS = 400;
// Gmail snippets are a fixed ~200-char prefix. At this length the body is longer than
// what was returned, and the caller cannot tell that from the snippet alone.
const SNIPPET_TRUNCATED_AT = 190;
const METADATA_HEADERS = [
  "From",
  "To",
  "Cc",
  "Subject",
  "Date",
  "Message-ID",
];

export default {
  key: "gmail-find-email",
  name: "Find Emails",
  description:
    "Search the user's Gmail mailbox with Gmail's native query syntax and return matching messages (headers + snippet by default; full bodies when requested)."
    + " Use this tool for every \"find\", \"search\", \"list my\", or \"show me\" email intent."
    + " The `q` parameter accepts the full Gmail search operator set — combine operators freely: `from:alan@ingen.com is:unread newer_than:7d has:attachment subject:\"DNA sequences\"`. Common operators: `from:`, `to:`, `subject:`, `has:attachment`, `filename:pdf`, `is:unread`, `is:starred`, `label:INBOX`, `newer_than:7d`, `older_than:1m`, `after:2025/01/01`, `before:2025/12/31`, `category:primary`."
    + " `labelIds` accepts either raw label IDs (`INBOX`, `STARRED`) or user-visible names (`Clients/Acme`) — names are resolved server-side via **List Labels**."
    + " Each returned message carries `id`, `threadId`, `labelIds`, the decoded `subject`/`sender`/`recipient`/`date`, and a `snippet`. With `format: \"full\"` the decoded body text and `payload.parts[].body.attachmentId` + `filename` + `mimeType` are also included — feed those into **Download Attachment**, or feed `threadId` into **Get Thread** for the whole conversation."
    + " **Set `fields` on every call** to name just what you need — message records are large, and a wide search returns tens of thousands of characters that crowd out the rest of the task. `id` and `threadId` are always returned."
    + " To BROWSE or COUNT, use `[\"subject\", \"sender\", \"date\"]`. **To READ or SUMMARISE — \"catch me up\", \"what did X say about Y\", \"is there anything I need to reply to\" — use `[\"subject\", \"sender\", \"date\", \"bodyText\"]`.**"
    + " `bodyText` is the decoded plain-text body (HTML converted, MIME scaffolding and attachments stripped), about half the size of the raw `payload`, and requesting it fetches full messages for you."
    + " **Never answer a question about what an email SAYS from `snippet`** — it is a fixed ~200-character prefix, so the sentence you need is usually past its end, and nothing in a snippet indicates that it was cut. Where the snippet is all you asked for and content was likely cut, the message carries `snippetTruncated: true`."
    + " `format` stays `metadata` unless you need the raw MIME tree for **Download Attachment**, in which case pass `format: \"full\"` and request `payload`."
    + " Responses are capped. Over the cap: if you named `fields`, whole messages are dropped rather than your chosen fields being removed, and the note says how many of how many are shown — narrow `q` and retry. If you named none, messages are compacted instead so counts stay accurate. `bodyText` shrinks toward a floor before anything is dropped, flagging each cut message with `bodyTruncated: true`."
    + " [See the documentation](https://developers.google.com/gmail/api/reference/rest/v1/users.messages/list) and [Gmail search operators](https://support.google.com/mail/answer/7190).",
  version: "0.3.0",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    gmail,
    q: {
      type: "string",
      label: "Search Query",
      description:
        "Gmail search query using [standard search operators](https://support.google.com/mail/answer/7190)."
        + " Examples: `is:unread newer_than:7d`, `from:noreply@github.com has:attachment`, `subject:\"Eval-Thread-Test\"`, `label:INBOX is:starred`."
        + " Leave blank to return the most recent messages across the mailbox.",
      optional: true,
    },
    labelIds: {
      type: "string[]",
      label: "Label IDs or Names",
      description:
        "Only return messages that carry **all** of these labels."
        + " Accepts either raw label IDs (e.g. `INBOX`, `STARRED`, `UNREAD`, `TRASH`, `SPAM`) or user-visible label names (e.g. `Clients/Acme`) — names are resolved against **List Labels** before the request is sent.",
      optional: true,
    },
    includeSpamTrash: {
      type: "boolean",
      label: "Include Spam and Trash",
      description: "Include messages from `SPAM` and `TRASH` in results. Defaults to `false`.",
      optional: true,
      default: false,
    },
    maxResults: {
      type: "integer",
      label: "Max Results",
      description: `Maximum number of messages to return. Default ${DEFAULT_MAX_RESULTS}, Gmail API max 500. Lower this for large/busy inboxes to keep responses under the token cap.`,
      optional: true,
      default: DEFAULT_MAX_RESULTS,
    },
    format: {
      type: "string",
      label: "Format",
      description:
        "`metadata` (default) — headers + snippet only, much smaller responses. Use this for every \"find\", \"count\", \"which\" query."
        + " `full` — includes decoded body text and attachment IDs. Use only when you need to read message contents or download an attachment.",
      options: [
        "metadata",
        "full",
      ],
      default: "metadata",
      optional: true,
    },
    fields: {
      type: "string[]",
      label: "Fields",
      description:
        "Return only these fields on each message, instead of the full record. **Always set this** unless you genuinely need every field — message records are large, and a wide search can return tens of thousands of characters that crowd out the rest of the task."
        + " `id` and `threadId` are always included so results can be fed into **Get Thread**, **Modify Labels**, or **Download Attachment**."
        + "\n\nChoose by what you are doing:"
        + "\n- **Browsing, counting, \"which emails…\"** → `[\"subject\", \"sender\", \"date\"]`. Add `labelIds` to check read/starred state."
        + "\n- **Reading, summarising, \"catch me up\", \"what did X say\"** → `[\"subject\", \"sender\", \"date\", \"bodyText\"]`. **`bodyText` is a derived field**: the decoded plain-text body, HTML converted, attachments and MIME scaffolding stripped. It is roughly half the size of `payload` and is what you want for any question about what an email SAYS. Requesting it fetches full messages automatically — you do not also need `format: \"full\"`."
        + "\n- **Downloading an attachment** → `[\"payload\"]` with `format: \"full\"`, then read `payload.parts[].body.attachmentId`."
        + "\n\nDo NOT try to answer a content question from `snippet`: it is a fixed ~200-character prefix, so the sentence you need is usually past its end, and a snippet gives no sign that anything was cut. Ask for `bodyText` instead."
        + " Omit `fields` entirely to return the complete message record, exactly as this tool has always done.",
      optional: true,
    },
    bodyChars: {
      type: "integer",
      label: "Body Characters",
      description:
        `Maximum characters of \`bodyText\` to return per message. Default ${DEFAULT_BODY_CHARS}, which covers a normal one-page email in full.`
        + " Only applies when `bodyText` is requested in `fields`. Any message whose body is cut comes back with `bodyTruncated: true` and `bodyTotalChars` (its real length) — re-fetch that single message with a higher limit, or use **Get Thread**, to read the rest."
        + " Raise it for long newsletters or threads; lower it to fit more messages in one response.",
      optional: true,
      default: DEFAULT_BODY_CHARS,
    },
  },
  async run({ $ }) {
    let labelIds = this.labelIds;
    if (labelIds?.length) {
      const { labels = [] } = await this.gmail.listLabels();
      const byName = new Map(labels.map((l) => [
        l.name,
        l.id,
      ]));
      const byId = new Set(labels.map((l) => l.id));
      labelIds = labelIds.map((l) => {
        if (!l) return l;
        if (byId.has(l)) return l;
        return byName.get(l) ?? l;
      });
    }

    const format = this.format || "metadata";
    const fields = this.fields;
    // `bodyText` is derived from the decoded body, which only a full fetch carries, so
    // asking for it upgrades the fetch. The caller shouldn't have to know that.
    const wantsBodyText = Boolean(fields?.includes("bodyText"));
    const wantsPayload = format === "full" || Boolean(fields?.includes("payload"));
    const fetchFull = wantsBodyText || format === "full";

    const { messages = [] } = await this.gmail.listMessages({
      q: this.q,
      labelIds,
      includeSpamTrash: this.includeSpamTrash,
      maxResults: this.maxResults ?? DEFAULT_MAX_RESULTS,
    });

    const getOpts = fetchFull
      ? {
        format: "full",
      }
      : {
        format: "metadata",
        metadataHeaders: METADATA_HEADERS,
      };

    const results = [];
    const fullBodies = new Map();
    for await (const message of this.gmail.getAllMessages(messages.map(({ id }) => id), getOpts)) {
      const headers = message.payload?.headers ?? [];
      const messageIdHeader = utils.getHeader(headers, "message-id");
      if (messageIdHeader) {
        message.message_id = messageIdHeader.replace(/[<>]/g, "");
      }
      if (message.internalDate) {
        message.date = new Date(parseInt(message.internalDate)).toISOString();
      }
      message.subject = utils.getHeader(headers, "subject");
      message.sender = utils.getHeader(headers, "from");
      message.recipient = utils.getHeader(headers, "to");

      if (fetchFull) {
        if (message.payload?.body?.data && !Array.isArray(message.payload.parts)) {
          message.payload.body.text = utils.decodeBase64Url(message.payload.body.data);
        }
        if (Array.isArray(message.payload?.parts)) {
          utils.attachTextToParts(message.payload.parts);
        }
        if (wantsBodyText) {
          fullBodies.set(message.id, utils.getBodyText(message.payload));
        }
      }
      // Drop the payload unless it was actually asked for — a `bodyText` request that
      // had to fetch full messages must not return the MIME tree as a side effect.
      if (!wantsPayload) {
        delete message.payload;
      }
      // `format: "full"` is a request the pluck must honor.
      const always = [
        "id",
        "threadId",
        ...wantsPayload
          ? [
            "payload",
          ]
          : [],
      ];
      const plucked = utils.pluckFields(message, fields, always);

      // A ~200-char snippet with no body alongside it is the shape that produces
      // confidently wrong summaries: the caller cannot tell that the sentence it needs
      // was cut off. Say so. Flagged after the pluck so it appears exactly when the
      // snippet actually survives into the output, and skipped when a body is present
      // (then it's noise).
      if (!wantsBodyText && !wantsPayload
        && (plucked.snippet?.length ?? 0) >= SNIPPET_TRUNCATED_AT) {
        plucked.snippetTruncated = true;
      }
      results.push(plucked);
    }

    // Bodies were requested and the response is too big: shrink them toward a floor
    // BEFORE dropping whole messages, because a per-message `bodyTruncated` flag is
    // recoverable (re-fetch that one message) while a missing message is not.
    let bodyCap = this.bodyChars ?? DEFAULT_BODY_CHARS;
    if (wantsBodyText) {
      const applyCap = (cap) => {
        for (const message of results) {
          const body = fullBodies.get(message.id) ?? "";
          message.bodyText = body.slice(0, cap);
          if (body.length > cap) {
            message.bodyTruncated = true;
            // Deliberately NOT `bodyChars` — that is the INPUT prop (the cap). This is
            // the body's true length, so the caller can see how much it is missing.
            message.bodyTotalChars = body.length;
          } else {
            delete message.bodyTruncated;
            delete message.bodyTotalChars;
          }
        }
      };
      applyCap(bodyCap);
      while (JSON.stringify(results).length > MAX_RESPONSE_CHARS && bodyCap > MIN_BODY_CHARS) {
        bodyCap = Math.max(MIN_BODY_CHARS, Math.floor(bodyCap / 2));
        applyCap(bodyCap);
      }
    }

    const {
      messages: kept, compacted, dropped,
    } = utils.fitToBudget(results, MAX_RESPONSE_CHARS, {
      compactFields: COMPACT_FIELDS,
      callerChoseFields: Boolean(fields?.length),
    });

    const shrunk = wantsBodyText && bodyCap < (this.bodyChars ?? DEFAULT_BODY_CHARS);
    const payload = (compacted || dropped || shrunk)
      ? {
        messages: kept,
        matchCount: results.length,
        truncated: true,
        note: `[truncated] response exceeded ${MAX_RESPONSE_CHARS} chars. `
          + `${compacted
            ? `Every message was reduced to ${COMPACT_FIELDS.join(", ")}; all ${results.length} matches are still listed, so counts remain accurate. `
            : ""}`
          + `${shrunk
            ? `\`bodyText\` was capped at ${bodyCap} chars per message (messages cut this way carry \`bodyTruncated: true\`). `
            : ""}`
          + `${dropped
            ? `${dropped} of ${results.length} messages were dropped from the tail — THIS LIST IS INCOMPLETE, ${kept.length} of ${results.length} matches are shown. Narrow \`q\`, lower \`maxResults\`, or request fewer fields, then retry. `
            : ""}`,
      }
      : results;

    $.export("$summary", `Found ${results.length} message${results.length === 1
      ? ""
      : "s"}${this.q
      ? ` matching "${this.q}"`
      : ""}${dropped
      ? ` (showing ${kept.length}, ${dropped} dropped to fit)`
      : (compacted || shrunk)
        ? " (trimmed to fit)"
        : ""}`);
    return payload;
  },
};
