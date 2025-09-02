import { parseObject } from "../../common/utils.mjs";
import hubspot from "../../hubspot.app.mjs";

export default {
  key: "hubspot-update-workflow",
  name: "Update a Workflow",
  description: "Update an existing workflow. [See the documentation](https://developers.hubspot.com/docs/api-reference/automation-automation-v4-v4/workflows/put-automation-v4-flows-flowId)",
  version: "0.0.1",
  type: "action",
  props: {
    hubspot,
    workflowId: {
      propDefinition: [
        hubspot,
        "workflow",
      ],
      description: "The ID of the workflow to update",
    },
    name: {
      type: "string",
      label: "Workflow Name",
      description: "The new name of the workflow",
      optional: true,
    },
    type: {
      propDefinition: [
        hubspot,
        "type",
      ],
    },
    isEnabled: {
      propDefinition: [
        hubspot,
        "isEnabled",
      ],
    },
    actions: {
      propDefinition: [
        hubspot,
        "actions",
      ],
    },
    enrollmentCriteria: {
      propDefinition: [
        hubspot,
        "enrollmentCriteria",
      ],
    },
    revisionId: {
      type: "string",
      label: "Revision ID",
      description: "The revision ID of the workflow",
      optional: true,
    },
  },
  async run({ $ }) {
    const data = {};

    if (this.name) data.name = this.name;
    if (this.type) data.type = this.type;
    if (Object.hasOwn(this, "isEnabled")) data.isEnabled = this.isEnabled;
    if (this.actions) data.actions = parseObject(this.actions);
    if (this.enrollmentCriteria) data.enrollmentCriteria = parseObject(this.enrollmentCriteria);
    if (!this.revisionId) {
      const workflow = await this.hubspot.getWorkflowDetails({
        workflowId: this.workflowId,
      });
      data.revisionId = workflow.revisionId + 1;
    } else {
      data.revisionId = this.revisionId;
    }

    const response = await this.hubspot.updateWorkflow({
      workflowId: this.workflowId,
      data,
      $,
    });

    $.export("$summary", `Successfully updated workflow ${this.workflowId}`);
    return response;
  },
};
