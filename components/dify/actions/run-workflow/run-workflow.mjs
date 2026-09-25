import dify from "../../dify.app.mjs";

export default {
  key: "dify-run-workflow",
  name: "Run Workflow",
  description: "Run the published workflow of the Dify app that the connected API key belongs to, and return its outputs. Only works for **Workflow**-type apps: a Chatflow, Chatbot, Agent, or Text Generator app's key returns a `not_workflow_app` error. Requires the workflow to be published; an unpublished workflow returns an `invalid_param` error. Use **Get App Parameters** first to learn the input variable names. Example: `Inputs` `{ \"city\": \"San Francisco\" }`, `User` `user-123` → `{ workflow_run_id, data: { id, status: \"succeeded\", outputs: { result: \"...\" }, total_tokens, elapsed_time } }`. This action uses `blocking` response mode, which waits for the run to finish before returning; long-running workflows on Dify Cloud risk being cut off by the platform's 100-second edge proxy timeout, in which case the run may still complete server-side but this action will not see the result. [See the documentation](https://docs.dify.ai/en/api-reference/workflow-runs/run-workflow)",
  version: "0.0.1",
  ai: "optimized",
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
