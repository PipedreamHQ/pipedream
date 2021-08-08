const slack = require("../../slack.app.js");

module.exports = {
  key: "slack-set-channel-topic",
  name: "Set Channel Topic",
  description: "Set the topic on a selected channel",
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
    topic: {
      propDefinition: [
        slack,
        "topic",
      ],
    },
  },
  async run() {
    return await this.slack.sdk().conversations.setTopic({
      channel: this.conversation,
      topic: this.topic,
    });
  },
};
