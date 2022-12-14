import slack from "../../slack.app.mjs";

export default {
  key: "slack-delete-reminder",
  name: "Delete Reminder",
  description: "Delete a reminder. [See docs here](https://api.slack.com/methods/reminders.delete)",
  version: "0.0.9",
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
