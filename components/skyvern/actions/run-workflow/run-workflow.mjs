import skyvern from "../../skyvern.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "skyvern-run-workflow",
  name: "Run Workflow",
  description: "Trigger a predefined workflow in Skyvern, allowing the execution of complex routines from Pipedream. [See the documentation](https://docs.skyvern.com/workflows/running-workflows)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    skyvern,
    workflowId: {
      propDefinition: [
        skyvern,
        "workflowId",
      ],
    },
    data: {
      type: "object",
      label: "Data",
      description: "The data field is used to pass in required and optional parameters that a workflow accepts",
      optional: true,
    },
    proxyLocation: {
      type: "string",
      label: "Proxy Location",
      description: "Proxy location for the web browser. Please pass 'RESIDENTIAL'.",
      optional: true,
    },
    webhookCallbackUrl: {
      type: "string",
      label: "Webhook Callback URL",
      description: "URL where system will send callback once it finishes executing the workflow run.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.skyvern.triggerWorkflow({
      workflowId: this.workflowId,
      data: this.data,
      proxyLocation: this.proxyLocation,
      webhookCallbackUrl: this.webhookCallbackUrl,
    });

    $.export("$summary", `Successfully triggered workflow with ID ${response.workflow_id}`);
    return response;
  },
};
