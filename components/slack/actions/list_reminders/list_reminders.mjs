import slack from "../../slack.app.mjs";

export default {
  key: "slack-list-reminders",
  name: "List Reminders",
  description: "List all reminders for a given user",
  version: "0.0.2",
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
