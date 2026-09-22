import opnform from "../../opnform.app.mjs";

export default {
  key: "opnform-list-workspace-id-options",
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
    opnform,
  },
  async run({ $ }) {
    const options = await opnform.propDefinitions.workspaceId.options.call(this.opnform);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
