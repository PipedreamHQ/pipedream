const slack = require("../../slack.app.js");

module.exports = {
  key: "slack-unarchive-channel",
  name: "Unarchive Channel",
  description: "Unarchive a channel",
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
  },
  async run() {
    return await this.slack.sdk().conversations.unarchive({
      channel: this.conversation,
    });
  },
};
