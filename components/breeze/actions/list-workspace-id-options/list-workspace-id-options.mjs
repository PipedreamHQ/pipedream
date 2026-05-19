import breeze from "../../breeze.app.mjs";

export default {
  key: "breeze-list-workspace-id-options",
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
    breeze,
  },
  async run({ $ }) {
    const options = await breeze.propDefinitions.workspaceId.options.call(this.breeze);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
