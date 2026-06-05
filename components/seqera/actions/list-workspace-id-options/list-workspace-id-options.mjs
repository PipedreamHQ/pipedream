import seqera from "../../seqera.app.mjs";

export default {
  key: "seqera-list-workspace-id-options",
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
    seqera,
  },
  async run({ $ }) {
    const options = await seqera.propDefinitions.workspaceId.options.call(this.seqera);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
