import workflow_max from "../../workflow_max.app.mjs";

export default {
  key: "workflow_max-list-client-group-uuid-options",
  name: "List Client Group Options",
  description: "Retrieves available options for the Client Group field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    workflow_max,
  },
  async run({ $ }) {
    const options = await workflow_max.propDefinitions.clientGroupUuid.options
      .call(this.workflow_max);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
