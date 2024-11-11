import skyvern from "../../skyvern.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "skyvern-get-workflow-run-details",
  name: "Get Workflow Run Details",
  description: "Retrieve details of a specific Skyvern workflow run. Useful for checking the status and result of a run. [See the documentation](https://docs.skyvern.com/workflows/getting-workflows)",
  version: "0.0.1",
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
      workflowId: this.workflowId,
    });
    $.export("$summary", `Successfully retrieved details for workflow run with ID: ${this.workflowId}`);
    return response;
  },
};
