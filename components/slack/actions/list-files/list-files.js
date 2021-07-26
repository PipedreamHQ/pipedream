const slack = require("../../slack.app.js");
const { WebClient } = require("@slack/web-api");

module.exports = {
  key: "slack-list-files",
  name: "List Files",
  description: "Return a list of files within a team",
  version: "0.0.28",
  type: "action",
  props: {
    slack,
    conversation: {
      propDefinition: [
        slack,
        "conversation",
      ],
    },
    count: {
      propDefinition: [
        slack,
        "count",
      ],
      optional: true,
    },
    team_id: {
      propDefinition: [
        slack,
        "count",
      ],
      optional: true,
    },
    user: {
      propDefinition: [
        slack,
        "user",
      ],
      optional: true,
    },
  },
  async run() {
    const web = new WebClient(this.slack.$auth.oauth_access_token);
    return await web.files.list({
      channel: this.conversation,
      count: this.count,
      user: this.user,
      team_id: this.team_id,
    });
  },
};
