import slack from "../../slack.app.mjs";

export default {
  key: "slack-create-reminder",
  name: "Create Reminder",
  description: "Create a reminder. [See the documentation](https://api.slack.com/methods/reminders.add)",
  version: "0.0.21",
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
      type: "string",
      label: "Timestamp",
      description: "When this reminder should happen: the Unix timestamp (up to five years from now), the number of seconds until the reminder (if within 24 hours), or a natural language description (Ex. in 15 minutes, or every Thursday)",
    },
    team_id: {
      propDefinition: [
        slack,
        "team",
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
  async run({ $ }) {
    const response = await this.slack.sdk().reminders.add({
      text: this.text,
      team_id: this.team_id,
      time: this.timestamp,
      user: this.user,
    });
    $.export("$summary", `Successfully created reminder with ID ${response.reminder.id}`);
    return response;
  },
};
