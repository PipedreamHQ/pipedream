import slack_v2 from "../../slack_v2.app.mjs";

export default {
  key: "slack_v2-list-reminder-options",
  name: "List Reminder Options",
  description: "Retrieves available options for the Reminder field.",
  version: "0.0.1",
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
    const options = await slack_v2.propDefinitions.reminder.options.call(this.slack_v2);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
