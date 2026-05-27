import retable from "../../retable.app.mjs";

export default {
  key: "retable-list-workspace-id-options",
  name: "List Workspace Options",
  description: "Retrieves available options for the Workspace field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    retable,
  },
  async run({ $ }) {
    const options = await retable.propDefinitions.workspaceId.options.call(this.retable);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
