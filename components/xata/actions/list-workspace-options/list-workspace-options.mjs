import xata from "../../xata.app.mjs";

export default {
  key: "xata-list-workspace-options",
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
    xata,
  },
  async run({ $ }) {
    const options = await xata.propDefinitions.workspace.options.call(this.xata);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
