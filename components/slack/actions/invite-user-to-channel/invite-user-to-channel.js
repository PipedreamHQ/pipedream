const slack = require("../../slack.app.js");
const { WebClient } = require("@slack/web-api");

module.exports = {
  key: "slack-invite-user-to-channel",
  name: "Invite User to Channel",
  description: "Invite a user to an existing channel.",
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
    user: {
      propDefinition: [
        slack,
        "user",
      ],
    },

  },
  async run() {
    const web = new WebClient(this.slack.$auth.oauth_access_token);
    return await web.conversations.invite({
      channel: this.conversation,
      users: this.user,
    });
  },
};
