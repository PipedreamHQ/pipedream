import robopost from "../../robopost.app.mjs";

export default {
  key: "robopost-list-task-id-options",
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
    robopost,
  },
  async run({ $ }) {
    const options = await robopost.propDefinitions.taskId.options.call(this.robopost);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
