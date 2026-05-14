import nocodb from "../../nocodb.app.mjs";

export default {
  key: "nocodb-list-workspace-id-options",
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
    nocodb,
  },
  async run({ $ }) {
    const options = await nocodb.propDefinitions.workspaceId.options.call(this.nocodb);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
