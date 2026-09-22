import jibble from "../../jibble.app.mjs";

export default {
  key: "jibble-list-activity-id-options",
  name: "List Activity ID Options",
  description: "Retrieves available options for the Activity ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    jibble,
  },
  async run({ $ }) {
    const options = await jibble.propDefinitions.activityId.options.call(this.jibble);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
