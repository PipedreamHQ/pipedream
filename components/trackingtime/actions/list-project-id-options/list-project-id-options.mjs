import trackingtime from "../../trackingtime.app.mjs";

export default {
  key: "trackingtime-list-project-id-options",
  name: "List Project ID Options",
  description: "Retrieves available options for the Project ID field.",
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
    const options = await trackingtime.propDefinitions.projectId.options.call(this.trackingtime);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
