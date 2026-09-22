import kadoa from "../../kadoa.app.mjs";

export default {
  key: "kadoa-list-workflow-id-options",
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
    kadoa,
  },
  async run({ $ }) {
    const options = await kadoa.propDefinitions.workflowId.options.call(this.kadoa, {});
    $.export("$summary", `Successfully retrieved ${options.length} option${
      options.length === 1
        ? ""
        : "s"
    }`);
    return options;
  },
};
