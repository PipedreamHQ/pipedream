const slack = require("../../slack.app.js");

module.exports = {
  key: "slack-leave-channel",
  name: "Leave Channel",
  description: "Leave an existing channel",
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
    return await this.slack.sdk().conversations.leave({
      channel: this.conversation,
    });
  },
};
