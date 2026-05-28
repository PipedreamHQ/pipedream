import typeflowai from "../../typeflowai.app.mjs";

export default {
  key: "typeflowai-list-workflow-ids-options",
  name: "List Workflow IDs Options",
  description: "Retrieves available options for the Workflow IDs field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    typeflowai,
  },
  async run({ $ }) {
    const options = await typeflowai.propDefinitions.workflowIds.options.call(this.typeflowai);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
