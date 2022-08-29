import gmail from "../../gmail.app.mjs";

export default {
  key: "gmail-find-email",
  name: "Find Email",
  description: "Find an email using Google's Search Engine. [See the docs](https://developers.google.com/gmail/api/reference/rest/v1/users.messages/list)",
  version: "0.0.1",
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
      optional: true,
    },
    includeSpamTrash: {
      type: "boolean",
      label: "Include Spam and Trash?",
      description: "Include messages from `SPAM` and `TRASH` in the results. Defaults to `false`.",
      optional: true,
    },
  },
  async run({ $ }) {
    const allMessages = [];
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
      allMessages.push(...messages);
      pageToken = nextPageToken;
    } while (pageToken);

    const suffix = allMessages.length === 1
      ? ""
      : "s";
    $.export("$summary", `Successfully found ${allMessages.length} message${suffix}`);
    return allMessages;
  },
};
