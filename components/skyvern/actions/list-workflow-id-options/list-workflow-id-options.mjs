import skyvern from "../../skyvern.app.mjs";

export default {
  key: "skyvern-list-workflow-id-options",
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
    skyvern,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await skyvern.propDefinitions.workflowId.options.call(this.skyvern, {
      page: this.page,
    });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
