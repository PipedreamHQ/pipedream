import skyvern from "../../skyvern.app.mjs";

export default {
  key: "skyvern-get-workflow",
  name: "Get Workflow Run Details",
  description: "Retrieve details of runs of a specific Skyvern workflow. Useful for checking the status and result of a run. [See the documentation](https://docs.skyvern.com/workflows/getting-workflows)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    skyvern,
    workflowId: {
      propDefinition: [
        skyvern,
        "workflowId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.skyvern.getWorkflowRunDetails({
      $,
      workflowId: this.workflowId,
    });
    $.export("$summary", `Successfully retrieved run details for workflow: ${this.workflowId}`);
    return response;
  },
};
