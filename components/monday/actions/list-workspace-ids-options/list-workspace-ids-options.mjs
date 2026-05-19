import monday from "../../monday.app.mjs";

export default {
  key: "monday-list-workspace-ids-options",
  name: "List Workspace IDs Options",
  description: "Retrieves available options for the Workspace IDs field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    monday,
  },
  async run({ $ }) {
    const options = await monday.propDefinitions.workspaceIds.options.call(this.monday);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
