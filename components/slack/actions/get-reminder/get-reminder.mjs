import slack from "../../slack.app.mjs";

export default {
  key: "slack-get-reminder",
  name: "Get Reminder",
  description: "Return information about a reminder. [See docs here](https://api.slack.com/methods/reminders.info)",
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
    return await this.slack.sdk().reminders.info({
      reminder: this.reminder,
    });
  },
};
