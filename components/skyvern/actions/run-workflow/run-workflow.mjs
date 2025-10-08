import { parseObject } from "../../common/utils.mjs";
import skyvern from "../../skyvern.app.mjs";

export default {
  key: "skyvern-run-workflow",
  name: "Run Workflow",
  description: "Trigger a predefined workflow in Skyvern, allowing the execution of complex routines from Pipedream. [See the documentation](https://docs.skyvern.com/workflows/running-workflows)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
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
    data: {
      type: "object",
      label: "Data",
      description: "The data field is used to pass in required and optional parameters that a workflow accepts. [See the documentation](https://docs.skyvern.com/workflows/running-workflows) for further information.",
      optional: true,
    },
    webhookCallbackUrl: {
      propDefinition: [
        skyvern,
        "webhookCallbackUrl",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.skyvern.triggerWorkflow({
      $,
      workflowId: this.workflowId,
      data: {
        data: parseObject(this.data),
        proxy_location: "RESIDENTIAL",
        webhook_callback_url: this.webhookCallbackUrl,
      },
    });

    $.export("$summary", `Successfully triggered workflow with ID ${response.workflow_id}`);
    return response;
  },
};
