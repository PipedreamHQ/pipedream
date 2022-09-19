import slack from "../../slack.app.mjs";

export default {
  key: "slack-list-replies",
  name: "List Replies",
  description: "Retrieve a thread of messages posted to a conversation. [See docs here](https://api.slack.com/methods/conversations.replies)",
  version: "0.0.5",
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
        "timestamp",
      ],
    },
  },
  async run() {
    return await this.slack.sdk().conversations.replies({
      channel: this.conversation,
      ts: this.timestamp,
    });
  },
};
