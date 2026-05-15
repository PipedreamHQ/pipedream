import heartbeat from "../../heartbeat.app.mjs";

export default {
  key: "heartbeat-list-emails-options",
  name: "List Emails Options",
  description: "Retrieves available options for the Emails field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    heartbeat,
  },
  async run({ $ }) {
    const options = await heartbeat.propDefinitions.emails.options.call(this.heartbeat);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
