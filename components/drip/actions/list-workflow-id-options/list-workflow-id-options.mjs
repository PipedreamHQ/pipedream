import drip from "../../drip.app.mjs";

export default {
  key: "drip-list-workflow-id-options",
  name: "List Workflow Id Options",
  description: "Retrieves available options for the Workflow Id field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    drip,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await drip.propDefinitions.workflowId.options.call(this.drip, {
      page: this.page,
    });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
