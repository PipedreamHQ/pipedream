import visualping from "../../app/visualping.app.mjs";

export default {
  key: "visualping-list-workspace-id-options",
  name: "List Workspace ID Options",
  description: "Retrieves available options for the Workspace ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    visualping,
  },
  async run({ $ }) {
    const options = await visualping.propDefinitions.workspaceId.options.call(this.visualping);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
