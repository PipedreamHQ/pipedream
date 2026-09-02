// x-pd-ai: optimized
import dify from "../../dify.app.mjs";

export default {
  key: "dify-run-workflow",
  name: "Run Workflow",
  description: "Run a Dify Workflow app's published workflow and return its outputs. Requires the workflow to be published — draft-only workflows return a `bad_request` error. This action uses `blocking` response mode, which waits for the run to finish before returning; long-running workflows on Dify Cloud risk being cut off by the platform's 100-second edge proxy timeout, in which case the run may still complete server-side but this action will not see the result. [See the documentation](https://docs.dify.ai/en/api-reference/workflow-runs/run-workflow)",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: false,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    dify,
    inputs: {
      propDefinition: [
        dify,
        "inputs",
      ],
    },
    user: {
      propDefinition: [
        dify,
        "user",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.dify.runWorkflow({
      $,
      data: {
        inputs: this.inputs ?? {},
        user: this.user,
        response_mode: "blocking",
      },
    });

    const { data } = response;
    $.export("$summary", `Workflow run ${data.id} finished with status "${data.status}"`);
    return response;
  },
};
