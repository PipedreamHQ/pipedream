import app from "../../retool.app.mjs";

export default {
  key: "retool-trigger-workflow",
  name: "Trigger Workflow",
  description: "Trigger a workflow. [See the documentation](https://docs.retool.com/workflows/guides/webhooks#send-a-webhook-event).",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
    idempotentHint: false,
  },
  props: {
    app,
    workflowId: {
      type: "string",
      label: "Workflow ID",
      description: "The unique identifier for the workflow you want to trigger.",
    },
    apiKey: {
      type: "string",
      label: "API Key",
      description: "The API key of the workflow you want to trigger. You can find it in the webhook settings of the workflow.",
    },
    data: {
      type: "object",
      label: "Input Parameters",
      description: "The input parameters to pass to the workflow, if any.",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      app,
      ...data
    } = this;

    const response = await app.triggerWorkflow({
      $,
      ...data,
    });

    $.export("$summary", "Successfully triggered workflow");
    return response;
  },
};
