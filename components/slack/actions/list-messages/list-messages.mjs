import slack from "../../slack.app.mjs";

export default {
  key: "slack-list-messages",
  name: "List Messages",
  description:
    "Retrieve messages from a Slack conversation, including reactions. [See the documentation](https://api.slack.com/methods/conversations.history)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    slack,
    conversation: {
      propDefinition: [
        slack,
        "conversation",
      ],
    },
    pageSize: {
      propDefinition: [
        slack,
        "pageSize",
      ],
    },
    numPages: {
      propDefinition: [
        slack,
        "numPages",
      ],
    },
  },
  async run({ $ }) {
    const messages = [];
    const params = {
      channel: this.conversation,
      limit: this.pageSize,
    };
    let page = 0;

    do {
      const response = await this.slack.conversationsHistory(params);
      const messagesPage = response.messages || [];
      const nextCursor = response.response_metadata?.next_cursor;
      messages.push(...messagesPage);
      params.cursor = nextCursor;
      page++;
    } while (params.cursor && page < this.numPages);

    $.export(
      "$summary",
      `Successfully retrieved ${messages.length} message${
        messages.length === 1
          ? ""
          : "s"
      }`,
    );
    return {
      messages,
    };
  },
};
