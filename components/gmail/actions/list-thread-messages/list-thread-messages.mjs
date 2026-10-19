import utils, {
  MAX_RESPONSE_CHARS, MIN_BODY_CHARS,
} from "../../common/utils.mjs";
import gmail from "../../gmail.app.mjs";

const NOTE_RESERVE_CHARS = 500;

// Shares Find Emails' client-imposed ceiling (see utils.MAX_RESPONSE_CHARS). This action
// degrades before dropping (full -> text -> metadata -> tail), so it needs the cap rather
// than a `fields` projection.

export default {
  key: "gmail-list-thread-messages",
  name: "Get Thread",
  description:
    "Fetch an entire Gmail thread (conversation) by thread ID — returns every message in order with headers, decoded body text, and attachment metadata."
    + " Use this after **Find Emails** when the user wants the full conversation rather than a single message. Each result from **Find Emails** includes a `threadId` you can pass here."
    + " With `format: full` (default) each message includes decoded `text`/`html` bodies and attachment metadata. Use `format: metadata` to skip bodies and get only headers + labelIds — useful for large threads."
    + " Responses are capped. An oversized thread is served as `text`: each message keeps `subject`, `sender`, `recipient`, `date`, and a decoded plain-text `bodyText` in place of `payload` (attachment metadata is omitted), shortened toward a floor if needed (cut messages carry `bodyTruncated: true` and `bodyTotalChars`). Only if that still does not fit does it fall back to `metadata`, then drop messages from the tail. Every fallback sets `truncated`, `servedFormat`, and a `note`."
    + " Pass `includeLinks: false` to drop link URLs and images from the decoded text, which keeps notification and newsletter threads far smaller."
    + " [See the documentation](https://developers.google.com/gmail/api/reference/rest/v1/users.threads/get).",
  version: "0.3.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  ai: "optimized",
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
    includeLinks: {
      type: "boolean",
      label: "Include Links",
      description:
        "Keep link URLs and image URLs in decoded body text. Defaults to `true`."
        + " Set `false` to read what the messages say: links are often most of a newsletter's or notification's text, so more of the thread fits in one response."
        + " Keep `true` when you need a URL from the email, such as an unsubscribe, approval, or document link.",
      optional: true,
      default: true,
    },
  },
  methods: {
    decorateMessage(message, format, textOpts) {
      const headers = message.payload?.headers ?? [];
      message.subject = utils.getHeader(headers, "subject");
      message.sender = utils.getHeader(headers, "from");
      message.recipient = utils.getHeader(headers, "to");
      if (message.internalDate) {
        message.date = new Date(parseInt(message.internalDate)).toISOString();
      }
      if (format === "full") {
        utils.attachTextToPayload(message.payload, textOpts);
      }
      return message;
    },
    stripToMetadata(message) {
      delete message.payload;
      delete message.bodyText;
      delete message.bodyTruncated;
      delete message.bodyTotalChars;
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
    const textOpts = {
      includeLinks: this.includeLinks ?? true,
    };
    for (const message of messages) {
      this.decorateMessage(message, requested, textOpts);
    }

    let served = requested;
    let truncated = false;
    let droppedFromTail = 0;
    let bodyCap;
    const size = () => JSON.stringify(data).length;
    const budget = MAX_RESPONSE_CHARS - NOTE_RESERVE_CHARS;

    if (size() > MAX_RESPONSE_CHARS && requested === "full") {
      const bodies = new Map(messages.map((message) => [
        message.id,
        utils.getBodyText(message.payload, textOpts),
      ]));
      for (const message of messages) {
        delete message.payload;
      }
      const fullCap = Math.max(...[
        ...bodies.values(),
      ].map((body) => body.length), MIN_BODY_CHARS);
      bodyCap = utils.capBodies(messages, (message) => bodies.get(message.id), {
        cap: fullCap,
        floor: MIN_BODY_CHARS,
        maxChars: budget,
        measure: size,
      });
      served = "text";
      truncated = true;
    }

    if (served === "text" && size() > budget) {
      for (const message of messages) {
        this.stripToMetadata(message);
      }
      served = "metadata";
      bodyCap = undefined;
    }

    if (truncated || size() > MAX_RESPONSE_CHARS) {
      while (messages.length > 0 && size() > budget) {
        messages.pop();
        droppedFromTail += 1;
        truncated = true;
      }
    }

    if (truncated) {
      data.truncated = true;
      data.servedFormat = served;
      data.note = `[truncated] response exceeded ${MAX_RESPONSE_CHARS} chars, served as "${served}"${bodyCap && messages.some((message) => message.bodyTruncated)
        ? `, \`bodyText\` capped at ${bodyCap} chars per message`
        : ""}${droppedFromTail
        ? `, dropped ${droppedFromTail} message${droppedFromTail === 1
          ? ""
          : "s"} from the tail`
        : ""}. ${served === "text"
        ? "Attachment metadata is omitted; use **Find Emails** with `fields: [\"payload\"]` to get it. "
        : ""}${requested === "full" && textOpts.includeLinks
        ? "Pass `includeLinks: false` to fit more of the thread, or read"
        : "Read"} messages individually with **Find Emails**.`;
    }

    $.export("$summary", `Fetched thread ${data.id} with ${messages.length} message${messages.length === 1
      ? ""
      : "s"}${truncated
      ? " (truncated)"
      : ""}`);
    return data;
  },
};
