import roboflow from "../../roboflow.app.mjs";

export default {
  key: "roboflow-list-project-id-options",
  name: "List Project Options",
  description: "Retrieves available options for the Project field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    roboflow,
  },
  async run({ $ }) {
    const options = await roboflow.propDefinitions.projectId.options.call(this.roboflow);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
