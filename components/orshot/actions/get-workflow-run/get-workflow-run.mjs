import orshot from "../../orshot.app.mjs";

export default {
  key: "orshot-get-workflow-run",
  name: "Get Workflow Run",
  description: "Get one Orshot workflow run with per-step detail, to check progress or see which step failed. Enterprise plan. [See the documentation](https://orshot.com/docs/api-reference/workflow-run-get)",
  version: "0.0.1",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
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
    runId: {
      propDefinition: [
        orshot,
        "workflowRunId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.orshot.getWorkflowRun({
      $,
      workflowId: this.workflowId,
      runId: this.runId,
    });
    $.export("$summary", `Workflow run ${this.runId} is ${response?.run?.status}`);
    return response;
  },
};
