import heartbeat from "../../heartbeat.app.mjs";

export default {
  key: "heartbeat-list-group-id-options",
  name: "List Group ID Options",
  description: "Retrieves available options for the Group ID field.",
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
    const options = await heartbeat.propDefinitions.groupID.options.call(this.heartbeat);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
