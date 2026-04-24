import utils from "../../common/utils.mjs";
import gmail from "../../gmail.app.mjs";

const DEFAULT_MAX_RESULTS = 25;
const MAX_RESPONSE_CHARS = 100_000;
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
    + " `format` defaults to `metadata` (headers + snippet only) to keep the response small; set it to `full` only when you actually need body text or attachment IDs."
    + " Responses are hard-capped at 100k characters — anything beyond is truncated with a `[truncated]` marker so the caller knows to narrow the query."
    + " [See the documentation](https://developers.google.com/gmail/api/reference/rest/v1/users.messages/list) and [Gmail search operators](https://support.google.com/mail/answer/7190).",
  version: "0.2.0",
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
    const { messages = [] } = await this.gmail.listMessages({
      q: this.q,
      labelIds,
      includeSpamTrash: this.includeSpamTrash,
      maxResults: this.maxResults ?? DEFAULT_MAX_RESULTS,
    });

    const getOpts = format === "metadata"
      ? {
        format: "metadata",
        metadataHeaders: METADATA_HEADERS,
      }
      : {
        format: "full",
      };

    const results = [];
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

      if (format === "metadata") {
        delete message.payload;
      } else {
        if (message.payload?.body?.data && !Array.isArray(message.payload.parts)) {
          message.payload.body.text = utils.decodeBase64Url(message.payload.body.data);
        }
        if (Array.isArray(message.payload?.parts)) {
          utils.attachTextToParts(message.payload.parts);
        }
      }

      results.push(message);
    }

    let kept = results;
    let truncated = false;
    while (kept.length > 0 && JSON.stringify(kept).length > MAX_RESPONSE_CHARS) {
      kept = kept.slice(0, -1);
      truncated = true;
    }
    const payload = truncated
      ? {
        messages: kept,
        truncated: true,
        note: `[truncated] response exceeded ${MAX_RESPONSE_CHARS} chars — dropped ${results.length - kept.length} of ${results.length} messages from the tail. Narrow the query, lower maxResults, or keep format:"metadata".`,
      }
      : results;

    $.export("$summary", `Found ${results.length} message${results.length === 1
      ? ""
      : "s"}${this.q
      ? ` matching "${this.q}"`
      : ""}${truncated
      ? ` (truncated to ${kept.length})`
      : ""}`);
    return payload;
  },
};
