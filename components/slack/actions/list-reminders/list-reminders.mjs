import slack from "../../slack.app.mjs";

export default {
  key: "slack-list-reminders",
  name: "List Reminders",
  description: "List all reminders for a given user. [See docs here](https://api.slack.com/methods/reminders.list)",
  version: "0.0.8",
  type: "action",
  props: {
    slack,
    team_id: {
      propDefinition: [
        slack,
        "team",
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
