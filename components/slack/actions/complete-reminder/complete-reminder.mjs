import slack from "../../slack.app.mjs";

export default {
  key: "slack-complete-reminder",
  name: "Complete Reminder",
  description: "Complete a reminder. [See docs here](https://api.slack.com/methods/reminders.complete)",
  version: "0.0.7",
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
    return await this.slack.sdk().reminders.complete({
      reminder: this.reminder,
    });
  },
};
