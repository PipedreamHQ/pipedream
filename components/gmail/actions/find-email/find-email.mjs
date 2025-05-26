import gmail from "../../gmail.app.mjs";

export default {
  key: "gmail-find-email",
  name: "Find Email",
  description: "Find an email using Google's Search Engine. [See the docs](https://developers.google.com/gmail/api/reference/rest/v1/users.messages/list)",
  version: "0.1.0",
  type: "action",
  props: {
    gmail,
    q: {
      propDefinition: [
        gmail,
        "q",
      ],
    },
    withPayload: {
      type: "boolean",
      label: "With Payload",
      description: "Whether or not to return the full content of the email message. If set to `true`, the action will return the full content of the email message, including headers and body. `Setting to true may make the response size larger and slower`.",
      default: false,
    },
    labels: {
      propDefinition: [
        gmail,
        "label",
      ],
      type: "string[]",
      label: "Labels",
      description: "Only return messages with labels that match all of the specified labels.",
      optional: true,
    },
    includeSpamTrash: {
      type: "boolean",
      label: "Include Spam and Trash?",
      description: "Include messages from `SPAM` and `TRASH` in the results. Defaults to `false`.",
      optional: true,
      default: false,
    },
    maxResults: {
      type: "integer",
      label: "Max Results",
      description: "Maximum number of messages to return. Defaults to `100`.",
      default: 100,
      optional: true,
    },
  },
  async run({ $ }) {
    const { messages = [] } = await this.gmail.listMessages({
      q: this.q,
      labelIds: this.labels,
      includeSpamTrash: this.includeSpamTrash,
      maxResults: this.maxResults,
    });
    const messageIds = messages.map(({ id }) => id);
    let messagesToEmit = await this.gmail.getMessages(messageIds);

    if (this.withPayload) {
      for await (const message of messagesToEmit) {
        for (const part of message.payload?.parts || []) {
          if (part.body.data) {
            part.body.text = Buffer.from(part.body.data, "base64").toString("utf-8");
          }
        }
      }
    } else {
      messagesToEmit = messagesToEmit.map((message) => {
        delete message.payload;
        return message;
      });
    }

    const suffix = messagesToEmit.length === 1
      ? ""
      : "s";
    $.export("$summary", `Successfully found ${messagesToEmit.length} message${suffix}`);
    return messagesToEmit;
  },
};
