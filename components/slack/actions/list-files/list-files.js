const slack = require("../../slack.app.js");

module.exports = {
  key: "slack-list-files",
  name: "List Files",
  description: "Return a list of files within a team",
  version: "0.0.29",
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
        "team_id",
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
    return await this.slack.sdk().files.list({
      channel: this.conversation,
      count: this.count,
      user: this.user,
      team_id: this.team_id,
    });
  },
};
