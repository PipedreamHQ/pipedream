const slack = require("../../slack.app.js");

module.exports = {
  key: "slack-get-channel",
  name: "Get Channel",
  description: "Return information about a workspace channel",
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
    return await this.slack.sdk().conversations.info({
      channel: this.conversation,
    });
  },
};
