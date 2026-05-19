import zenkit from "../../zenkit.app.mjs";

export default {
  key: "zenkit-list-workspace-id-options",
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
    zenkit,
  },
  async run({ $ }) {
    const options = await zenkit.propDefinitions.workspaceId.options.call(this.zenkit);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
