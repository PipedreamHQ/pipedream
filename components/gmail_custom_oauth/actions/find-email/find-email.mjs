import gmail from "../../gmail_custom_oauth.app.mjs";

export default {
  key: "gmail_custom_oauth-find-email",
  name: "Find Email",
  description: "Find an email using Google's Search Engine. [See the docs](https://developers.google.com/gmail/api/reference/rest/v1/users.messages/list)",
  version: "0.0.8",
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
  },
  async run({ $ }) {
    const messageIds = [];
    let pageToken;

    do {
      const {
        messages = [],
        nextPageToken,
      } = await this.gmail.listMessages({
        q: this.q,
        labelIds: this.labels,
        includeSpamTrash: this.includeSpamTrash,
        pageToken,
      });
      messageIds.push(...messages.map(({ id }) => id));
      pageToken = nextPageToken;
    } while (pageToken);

    const messages = await this.gmail.getMessages(messageIds);

    const suffix = messages.length === 1
      ? ""
      : "s";
    $.export("$summary", `Successfully found ${messages.length} message${suffix}`);
    return messages;
  },
};
