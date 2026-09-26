import orshot from "../../orshot.app.mjs";

export default {
  key: "orshot-run-workflow",
  name: "Run Workflow",
  description: "Queue a manual run of an Orshot workflow. Returns a `runId` to check with **Get Workflow Run**. Uses one automation credit. Enterprise plan. [See the documentation](https://orshot.com/docs/api-reference/workflow-run)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    orshot,
    workflowId: {
      propDefinition: [
        orshot,
        "workflowId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.orshot.runWorkflow({
      $,
      workflowId: this.workflowId,
    });
    $.export("$summary", `Queued run ${response?.runId} of workflow ${this.workflowId}`);
    return response;
  },
};
