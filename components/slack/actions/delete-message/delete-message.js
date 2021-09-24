const slack = require("../../slack.app.js");

module.exports = {
  key: "slack-delete-message",
  name: "Delete Message",
  description: "Delete a message",
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
    as_user: {
      propDefinition: [
        slack,
        "as_user",
      ],
      description: "Pass true to update the message as the authed user. Bot users in this context are considered authed users.",
    },
  },
  async run() {
    return await this.slack.sdk().chat.delete({
      channel: this.conversation,
      ts: this.timestamp,
      as_user: this.as_user,
    });
  },
};
