import slack from "../../slack_v2.app.mjs";

export default {
  key: "slack_v2-list-messages",
  name: "List Messages (Deprecated)",
  description:
    "DEPRECATED — do NOT use for reading a channel's or DM's messages. Use **Get Channel History** instead:"
    + " it resolves channel names, channel IDs, and direct messages (by user ID), supports `fields`"
    + " selection to keep responses small, and returns the same message data."
    + " This legacy tool remains only for existing workflows: it accepts a raw conversation ID and"
    + " returns full, untrimmed message objects. [See the documentation](https://api.slack.com/methods/conversations.history)",
  version: "0.0.9",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  ai: "optimized",
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
      const {
        messages: messagesPage,
        response_metadata: { next_cursor: nextCursor },
      } = await this.slack.conversationsHistory(params);
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
