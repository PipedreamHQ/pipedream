import utils from "../../common/utils.mjs";
import gmail from "../../gmail.app.mjs";

export default {
  key: "gmail-find-email",
  name: "Find Email",
  description: "Find an email using Google's Search Engine. [See the docs](https://developers.google.com/gmail/api/reference/rest/v1/users.messages/list)",
  version: "0.1.7",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    gmail,
    q: {
      propDefinition: [
        gmail,
        "q",
      ],
    },
    withTextPayload: {
      type: "boolean",
      label: "Return payload as plaintext",
      description: "Convert the payload response into a single text field. **This reduces the size of the payload and makes it easier for LLMs work with.**",
      default: false,
    },
    metadataOnly: {
      type: "boolean",
      label: "Metadata Only",
      description: "Only return metadata for the messages. This reduces the size of the payload and makes it easier for LLMs work with.",
      optional: true,
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
      description: "Maximum number of messages to return. Defaults to `20`.",
      default: 20,
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
    const messagesToEmit = [];
    for await (let message of this.gmail.getAllMessages(messageIds)) {
      messagesToEmit.push(message);

      const messageIdHeader = message.payload?.headers?.find(
        (h) => h.name.toLowerCase() === "message-id",
      );
      if (messageIdHeader) {
        message.message_id = messageIdHeader.value.replace(/[<>]/g, "");
      }

      if (message.internalDate) {
        message.date = new Date(parseInt(message.internalDate)).toISOString();
      }

      const senderHeader = message.payload?.headers?.find(
        (h) => h.name.toLowerCase() === "from",
      );
      if (senderHeader) {
        message.sender = senderHeader.value;
      }

      const recipientHeader = message.payload?.headers?.find(
        (h) => h.name.toLowerCase() === "to",
      );
      if (recipientHeader) {
        message.recipient = recipientHeader.value;
      }

      const subjectHeader = message.payload?.headers?.find(
        (h) => h.name.toLowerCase() === "subject",
      );
      if (subjectHeader) {
        message.subject = subjectHeader.value;
      }

      if (this.metadataOnly) {
        delete message.payload;
        delete message.snippet;
      } else {
        const parsedMessage = utils.validateTextPayload(message, this.withTextPayload);
        if (parsedMessage) {
          message = parsedMessage;
        } else {
          if (message.payload?.body?.data && !Array.isArray(message.payload.parts)) {
            message.payload.body.text = utils.decodeBase64Url(message.payload.body.data);
          }
          if (Array.isArray(message.payload?.parts)) {
            utils.attachTextToParts(message.payload.parts);
          }
        }
      }
    }

    const suffix = messagesToEmit.length === 1
      ? ""
      : "s";
    $.export("$summary", `Successfully found ${messagesToEmit.length} message${suffix}`);
    return messagesToEmit;
  },
};
