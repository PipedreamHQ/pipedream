const slack = require("../../slack.app.js");

module.exports = {
  key: "slack-list-members-in-channel",
  name: "List Members in Channel",
  description: "Retrieve members of a channel",
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
    return await this.slack.sdk().conversations.members({
      channel: this.conversation,
    });
  },
};
