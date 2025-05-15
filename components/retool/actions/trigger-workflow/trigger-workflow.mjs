import app from "../../retool.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "retool-trigger-workflow",
  name: "Trigger Workflow",
  description: "Trigger a workflow. [See the documentation](https://docs.retool.com/workflows/guides/webhooks#send-a-webhook-event).",
  version: "0.0.1",
  type: "action",
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
  methods: {
    triggerWorkflow({
      workflowId, apiKey, ...args
    }) {
      return this.app.post({
        versionPath: constants.VERSION_PATH.V2,
        path: `/workflows/${workflowId}/startTrigger`,
        headers: {
          "Content-Type": "application/json",
          "X-Workflow-Api-Key": apiKey,
        },
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      triggerWorkflow,
      workflowId,
      apiKey,
      data,
    } = this;

    const response = await triggerWorkflow({
      $,
      workflowId,
      apiKey,
      data,
    });
    $.export("$summary", "Successfully triggered workflow");
    return response;
  },
};
