const slack = require("../../slack.app.js");

module.exports = {
  key: "slack-list-replies",
  name: "List Replies",
  description: "Retrieve a thread of messages posted to a conversation",
  version: "0.0.1",
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
