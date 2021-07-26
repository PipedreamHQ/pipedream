const slack = require("../../slack.app.js");
const { WebClient } = require("@slack/web-api");

module.exports = {
  key: "slack-update-message",
  name: "Update Message",
  description: "Update a message.",
  version: "0.0.3",
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
    text: {
      propDefinition: [
        slack,
        "text",
      ],
    },
    as_user: {
      propDefinition: [
        slack,
        "as_user",
      ],
      description: "Pass true to update the message as the authed user. Bot users in this context are considered authed users.",
    },
    attachments: {
      propDefinition: [
        slack,
        "attachments",
      ],
    },
  },
  async run() {
    const web = new WebClient(this.slack.$auth.oauth_access_token);
    return await web.chat.update({
      ts: this.timestamp,
      text: this.text,
      channel: this.conversation,
      as_user: this.as_user,
      attachments: this.attachments,
    });
  },
};
