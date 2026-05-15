import trackingtime from "../../trackingtime.app.mjs";

export default {
  key: "trackingtime-list-task-id-options",
  name: "List Task ID Options",
  description: "Retrieves available options for the Task ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    trackingtime,
  },
  async run({ $ }) {
    const options = await trackingtime.propDefinitions.taskId.options.call(this.trackingtime);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
