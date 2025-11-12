import burstyai from "../../burstyai.app.mjs";

export default {
  key: "burstyai-run-workflow",
  name: "Run Workflow",
  description: "Triggers an AI workflow on BurstyAI. [See the documentation](https://burstyai.readme.io/reference)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    burstyai,
    workflow: {
      type: "string",
      label: "Workflow ID",
      description: "The ID of the specific workflow to run. When viewing the workflow in BurstyAI, the ID is the last part of the URL. Example: `65e1cd00141fdc000195cb88`",
    },
    params: {
      type: "object",
      label: "Parameters",
      description: "Optional parameters for the workflow",
      optional: true,
    },
    waitForCompletion: {
      type: "boolean",
      label: "Wait For Completion",
      description: "Set to `true` to poll the API in 3-second intervals until the workflow is completed",
      optional: true,
    },
  },
  async run({ $ }) {
    let response = await this.burstyai.triggerWorkflow({
      $,
      workflow: this.workflow,
      data: {
        params: this.params || {},
      },
    });

    const jobId = response;

    if (this.waitForCompletion) {
      const timer = (ms) => new Promise((res) => setTimeout(res, ms));
      while (response?.jobStatus !== "END" && response?.jobStatus !== "ERROR") {
        response = await this.burstyai.getWorkflowExecutionResult({
          $,
          jobId,
        });
        await timer(3000);
      }
    }

    if (response?.status === "END") {
      $.export("$summary", `Successfully triggered workflow ${this.workflow}`);
    }

    return response;
  },
};
