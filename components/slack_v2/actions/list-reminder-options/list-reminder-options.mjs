import slack_v2 from "../../slack_v2.app.mjs";

export default {
  key: "slack_v2-list-reminder-options",
  name: "List Reminder Options",
  description: "Retrieves available options for the Reminder field. [See the documentation](https://docs.slack.dev/reference/methods/reminders.list)",
  version: "0.0.7",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    slack_v2,
  },
  async run({ $ }) {
    const { reminders } = await this.slack_v2.remindersList({
      throwRateLimitError: true,
    });
    const options = reminders.map((r) => ({
      label: r.text,
      value: r.id,
    }));
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
