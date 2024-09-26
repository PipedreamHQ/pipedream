import gmail from "../../gmail.app.mjs";

export default {
  key: "gmail-find-email",
  name: "Find Email",
  description: "Find an email using Google's Search Engine. [See the docs](https://developers.google.com/gmail/api/reference/rest/v1/users.messages/list)",
  version: "0.0.6",
  type: "action",
  props: {
    gmail,
    q: {
      propDefinition: [
        gmail,
        "q",
      ],
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
      description: "Maximum number of messages to return. This field defaults to 100. The maximum allowed value for this field is 500.",
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
    const messagesToEmit = await this.gmail.getMessages(messageIds);
    const suffix = messagesToEmit.length === 1
      ? ""
      : "s";
    $.export("$summary", `Successfully found ${messagesToEmit.length} message${suffix}`);
    return messagesToEmit;
  },
};
