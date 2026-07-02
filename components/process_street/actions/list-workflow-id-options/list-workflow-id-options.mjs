import process_street from "../../process_street.app.mjs";

export default {
  key: "process_street-list-workflow-id-options",
  name: "List Workflow ID Options",
  description: "Retrieves available options for the Workflow ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    process_street,
  },
  async run({ $ }) {
    const options = await process_street.propDefinitions.workflowId.options
      .call(this.process_street, {});
    $.export("$summary", `Successfully retrieved ${options.length} option${
      options.length === 1
        ? ""
        : "s"
    }`);
    return options;
  },
};
