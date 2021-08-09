const slack = require("../../slack.app.js");

module.exports = {
  key: "slack-list-users",
  name: "List Users",
  description: "Return a list of all users in a workspace",
  version: "0.0.1",
  type: "action",
  props: {
    slack,
    team_id: {
      propDefinition: [
        slack,
        "team_id",
      ],
      optional: true,
    },
  },
  async run() {
    return await this.slack.sdk().users.list();
  },
};
