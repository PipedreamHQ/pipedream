import slack from "../../slack.app.mjs";

export default {
  key: "slack-get-reminder",
  name: "Get Reminder",
  description: "Return information about a reminder",
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
    return await this.slack.sdk().reminders.info({
      reminder: this.reminder,
    });
  },
};
