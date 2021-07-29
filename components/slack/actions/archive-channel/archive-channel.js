const slack = require("../../slack.app.js");

module.exports = {
  key: "slack-archive-channel",
  name: "Archive Channel",
  description: "Archive a channel",
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
    return await this.slack.sdk().conversations.archive({
      channel: this.conversation,
    });
  },
};
