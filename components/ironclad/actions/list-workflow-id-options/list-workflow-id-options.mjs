import ironclad from "../../ironclad.app.mjs";

export default {
  key: "ironclad-list-workflow-id-options",
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
    ironclad,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await ironclad.propDefinitions.workflowId.options.call(this.ironclad, {
      page: this.page,
    });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
