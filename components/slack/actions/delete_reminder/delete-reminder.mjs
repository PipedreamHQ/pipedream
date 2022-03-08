import slack from "../../slack.app.mjs";

export default {
  key: "slack-delete-reminder",
  name: "Delete Reminder",
  description: "Delete a reminder",
  version: "0.0.2",
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
