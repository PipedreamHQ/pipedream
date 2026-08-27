// x-pd-ai: optimized
import slack_v2 from "../../slack_v2.app.mjs";

export default {
  key: "slack_v2-list-reminder-options",
  name: "List Reminder Options",
  description: "Retrieves available options for the Reminder field.",
  version: "0.0.4",
  type: "action",
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
