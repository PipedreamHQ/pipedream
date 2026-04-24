import utils from "../../common/utils.mjs";
import gmail from "../../gmail.app.mjs";

const MAX_RESPONSE_CHARS = 100_000;

export default {
  key: "gmail-list-thread-messages",
  name: "Get Thread",
  description:
    "Fetch an entire Gmail thread (conversation) by thread ID — returns every message in order with headers, decoded body text, and attachment metadata."
    + " Use this after **Find Emails** when the user wants the full conversation rather than a single message. Each result from **Find Emails** includes a `threadId` you can pass here."
    + " With `format: full` (default) each message includes decoded `text`/`html` bodies and attachment metadata. Use `format: metadata` to skip bodies and get only headers + labelIds — useful for large threads."
    + " Responses are hard-capped at 100k characters — oversized threads fall back to `metadata`-level detail (or are further truncated from the tail) with a `[truncated]` marker so the caller knows to narrow the request."
    + " [See the documentation](https://developers.google.com/gmail/api/reference/rest/v1/users.threads/get).",
  version: "0.1.0",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    gmail,
    threadId: {
      type: "string",
      label: "Thread ID",
      description: "The thread identifier. Obtain this from the `threadId` field on a message returned by **Find Emails**.",
    },
    format: {
      type: "string",
      label: "Format",
      description:
        "`full` (default) returns each message with headers and decoded bodies."
        + " `metadata` returns only headers + labelIds (no body, no attachments) — use when the thread is long and you only need to enumerate its messages.",
      options: [
        "full",
        "metadata",
      ],
      default: "full",
      optional: true,
    },
  },
  methods: {
    decorateMessage(message, format) {
      const headers = message.payload?.headers ?? [];
      message.subject = utils.getHeader(headers, "subject");
      message.sender = utils.getHeader(headers, "from");
      message.recipient = utils.getHeader(headers, "to");
      if (message.internalDate) {
        message.date = new Date(parseInt(message.internalDate)).toISOString();
      }
      if (format === "full") {
        if (message.payload?.body?.data && !Array.isArray(message.payload.parts)) {
          message.payload.body.text = utils.decodeBase64Url(message.payload.body.data);
        }
        if (Array.isArray(message.payload?.parts)) {
          utils.attachTextToParts(message.payload.parts);
        }
      }
      return message;
    },
    stripToMetadata(message) {
      delete message.payload;
      return message;
    },
  },
  async run({ $ }) {
    const requested = this.format || "full";
    const data = await this.gmail.getThread({
      threadId: this.threadId,
      format: requested,
    });

    const messages = data.messages ?? [];
    for (const message of messages) {
      this.decorateMessage(message, requested);
    }

    let served = requested;
    let truncated = false;
    let droppedFromTail = 0;

    if (JSON.stringify(data).length > MAX_RESPONSE_CHARS && requested === "full") {
      for (const message of messages) {
        this.stripToMetadata(message);
      }
      served = "metadata";
      truncated = true;
    }

    while (
      messages.length > 0
      && JSON.stringify(data).length > MAX_RESPONSE_CHARS
    ) {
      messages.pop();
      droppedFromTail += 1;
      truncated = true;
    }

    if (truncated) {
      data.truncated = true;
      data.servedFormat = served;
      data.note = `[truncated] response exceeded ${MAX_RESPONSE_CHARS} chars — served as "${served}"${droppedFromTail
        ? `, dropped ${droppedFromTail} message${droppedFromTail === 1
          ? ""
          : "s"} from the tail`
        : ""}. Request \`format: "metadata"\` or fetch messages individually for the full conversation.`;
    }

    $.export("$summary", `Fetched thread ${data.id} with ${messages.length} message${messages.length === 1
      ? ""
      : "s"}${truncated
      ? " (truncated)"
      : ""}`);
    return data;
  },
};
