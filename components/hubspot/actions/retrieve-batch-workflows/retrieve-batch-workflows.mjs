import { parseObject } from "../../common/utils.mjs";
import hubspot from "../../hubspot.app.mjs";

export default {
  key: "hubspot-retrieve-batch-workflows",
  name: "Retrieve a Batch of Workflows",
  description: "Retrieve multiple workflows by their IDs. [See the documentation](https://developers.hubspot.com/docs/api-reference/legacy/create-manage-workflows-v3/get-automation-v3-workflows)",
  version: "0.0.1",
  type: "action",
  props: {
    hubspot,
    workflowIds: {
      propDefinition: [
        hubspot,
        "workflowId",
      ],
      type: "string[]",
      label: "Workflow IDs",
      description: "A list of workflow IDs to retrieve",
    },
  },
  async run({ $ }) {
    const workflows = [];
    const parsedWorkflowIds = parseObject(this.workflowIds);

    for (const workflowId of parsedWorkflowIds) {
      const response = await this.hubspot.getWorkflowDetails({
        workflowId,
        $,
      });
      workflows.push(response);
    }

    $.export("$summary", `Successfully retrieved ${parsedWorkflowIds.length} workflows`);
    return {
      workflows,
    };
  },
};
