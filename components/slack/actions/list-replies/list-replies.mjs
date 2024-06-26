import slack from "../../slack.app.mjs";

export default {
  key: "slack-list-replies",
  name: "List Replies",
  description: "Retrieve a thread of messages posted to a conversation. [See the documentation](https://api.slack.com/methods/conversations.replies)",
  version: "0.0.18",
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
        (c) => ({
          channel: c.conversation,
        }),
      ],
    },
  },
  async run({ $ }) {
    const response = await this.slack.sdk().conversations.replies({
      channel: this.conversation,
      ts: this.timestamp,
    });
    $.export("$summary", `Successfully retrieved ${response.messages.length} reply message${response.messages.length === 1
      ? ""
      : "s"}`);
    return response;
  },
};
