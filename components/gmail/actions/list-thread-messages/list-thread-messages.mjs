import utils from "../../common/utils.mjs";
import gmail from "../../gmail.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "gmail-list-thread-messages",
  name: "Get Thread",
  description:
    "Fetch an entire Gmail thread (conversation) by thread ID — returns every message in order with headers, decoded body text, and attachment metadata."
    + " Use this after **Find Emails** when the user wants the full conversation rather than a single message. Each result from **Find Emails** includes a `threadId` you can pass here."
    + " With `format: full` (default) each message includes decoded `text`/`html` bodies and attachment metadata. Use `format: metadata` to skip bodies and get only headers + labelIds — useful for large threads."
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
  async run({ $ }) {
    const format = this.format || "full";
    const { data } = await this.gmail._client().users.threads.get({
      userId: constants.USER_ID,
      id: this.threadId,
      format,
    });

    const messages = data.messages ?? [];
    for (const message of messages) {
      const headers = message.payload?.headers ?? [];
      const getHeader = (name) => headers
        .find((h) => h.name.toLowerCase() === name.toLowerCase())?.value;
      message.subject = getHeader("subject");
      message.sender = getHeader("from");
      message.recipient = getHeader("to");
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
    }

    $.export("$summary", `Fetched thread ${data.id} with ${messages.length} message${messages.length === 1
      ? ""
      : "s"}`);
    return data;
  },
};
