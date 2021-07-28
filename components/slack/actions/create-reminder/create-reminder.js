const slack = require("../../slack.app.js");

module.exports = {
  key: "slack-create-reminder",
  name: "Create Reminder",
  description: "Create a reminder",
  version: "0.0.1",
  type: "action",
  props: {
    slack,
    text: {
      propDefinition: [
        slack,
        "text",
      ],
    },
    timestamp: {
      propDefinition: [
        slack,
        "timestamp",
      ],
      description: "When this reminder should happen: the Unix timestamp (up to five years from now), the number of seconds until the reminder (if within 24 hours), or a natural language description (Ex. in 15 minutes, or every Thursday)",
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
    return await this.slack.sdk().reminders.add({
      text: this.text,
      team_id: this.team_id,
      time: this.timestamp,
      user: this.user,
    });
  },
};
