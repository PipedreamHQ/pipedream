import aero_workflow from "../../aero_workflow.app.mjs";

export default {
  key: "aero_workflow-list-assigned-to-options",
  name: "List Assigned To Options",
  description: "Retrieves available options for the Assigned To field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    aero_workflow,
  },
  async run({ $ }) {
    const options = await aero_workflow.propDefinitions.assignedTo.options
      .call(this.aero_workflow);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
