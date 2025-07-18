import slack from "../../slack.app.mjs";

export default {
  key: "slack-list-replies",
  name: "List Replies",
  description: "Retrieve a thread of messages posted to a conversation. [See the documentation](https://api.slack.com/methods/conversations.replies)",
  version: "0.0.23",
  type: "action",
  props: {
    slack,
    conversation: {
      propDefinition: [
        slack,
        "conversation",
      ],
    },
    timestamp: {
      propDefinition: [
        slack,
        "messageTs",
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
    const replies = [];
    const params = {
      channel: this.conversation,
      ts: this.timestamp,
      limit: this.pageSize,
    };
    let page = 0;

    do {
      const {
        messages, response_metadata: { next_cursor: nextCursor },
      } = await this.slack.getConversationReplies(params);
      replies.push(...messages);
      params.cursor = nextCursor;
      page++;
    } while (params.cursor && page < this.numPages);

    $.export("$summary", `Successfully retrieved ${replies.length} reply message${replies.length === 1
      ? ""
      : "s"}`);
    return {
      messages: replies,
    };
  },
};
