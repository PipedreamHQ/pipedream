import { convert } from "html-to-text";
import gmail from "../../gmail.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "gmail-find-email",
  name: "Find Email",
  description: "Find an email using Google's Search Engine. [See the docs](https://developers.google.com/gmail/api/reference/rest/v1/users.messages/list)",
  version: "0.1.1",
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

    for await (const message of messagesToEmit) {
      let newPayload = "";

      const messageIdHeader = message.payload?.headers?.find(
        (h) => h.name.toLowerCase() === "message-id",
      );
      if (messageIdHeader) {
        message.message_id = messageIdHeader.value;
      }

      if (message.payload?.body?.data && !Array.isArray(message.payload.parts)) {
        const decodedBody = utils.decodeBase64Url(message.payload.body.data);
        if (this.withTextPayload) {
          newPayload += convert(decodedBody);
        } else {
          message.payload.body.text = decodedBody;
        }
      }

      if (Array.isArray(message.payload?.parts)) {
        if (this.withTextPayload) {
          newPayload += utils.extractTextFromParts(message.payload.parts);
        } else {
          utils.attachTextToParts(message.payload.parts);
        }
      }

      if (this.withTextPayload) {
        message.payload = newPayload;
      }
    }

    const suffix = messagesToEmit.length === 1
      ? ""
      : "s";
    $.export("$summary", `Successfully found ${messagesToEmit.length} message${suffix}`);
    return messagesToEmit;
  },
};
