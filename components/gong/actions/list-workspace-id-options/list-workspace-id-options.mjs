import gong from "../../gong.app.mjs";

export default {
  key: "gong-list-workspace-id-options",
  name: "List Workspace ID Options",
  description: "Retrieves available options for the Workspace ID field.",
  version: "0.0.2",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    gong,
  },
  async run({ $ }) {
    const options = await gong.propDefinitions.workspaceId.options.call(this.gong);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
