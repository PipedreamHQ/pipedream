const slack = require("../../slack.app.js");

module.exports = {
  key: "slack-list-reminders",
  name: "List Reminders",
  description: "List all reminders for a given user",
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
    return await this.slack.sdk().reminders.list({
      team_id: this.team_id,
    });
  },
};
