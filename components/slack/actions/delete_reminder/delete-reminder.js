const slack = require("../../slack.app.js");

module.exports = {
  key: "slack-delete-reminder",
  name: "Delete Reminder",
  description: "Delete a reminder",
  version: "0.0.1",
  type: "action",
  props: {
    slack,
    reminder: {
      propDefinition: [
        slack,
        "reminder",
      ],
    },
  },
  async run() {
    return await this.slack.sdk().reminders.delete({
      reminder: this.reminder,
    });
  },
};
