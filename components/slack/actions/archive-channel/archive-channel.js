const slack = require("../../slack.app.js");
const { WebClient } = require("@slack/web-api");

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
    const web = new WebClient(this.slack.$auth.oauth_access_token);
    return await web.conversations.archive({
      channel: this.conversation,
    });
  },
};
