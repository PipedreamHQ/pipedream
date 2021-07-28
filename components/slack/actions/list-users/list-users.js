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
        "timestamp",
      ],
      optional: true,
    },
  },
  async run() {
    return await slack.sdk().users.list();
  },
};
