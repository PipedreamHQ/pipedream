import { parseObject } from "../../common/utils.mjs";
import hubspot from "../../hubspot.app.mjs";

export default {
  key: "hubspot-create-workflow",
  name: "Create a New Workflow",
  description: "Create a new workflow. [See the documentation](https://developers.hubspot.com/docs/api-reference/automation-automation-v4-v4/workflows/post-automation-v4-flows)",
  version: "0.0.1",
  type: "action",
  props: {
    hubspot,
    name: {
      type: "string",
      label: "Workflow Name",
      description: "The name of the workflow to create",
    },
    isEnabled: {
      propDefinition: [
        hubspot,
        "isEnabled",
      ],
    },
    type: {
      propDefinition: [
        hubspot,
        "type",
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
  },
  async run({ $ }) {
    const response = await this.hubspot.createWorkflow({
      data: {
        name: this.name,
        type: this.type,
        isEnabled: this.isEnabled,
        objectTypeId: "0-1",
        flowType: "WORKFLOW",
        actions: parseObject(this.actions),
        enrollmentCriteria: parseObject(this.enrollmentCriteria),
      },
      $,
    });

    $.export("$summary", `Successfully created workflow: ${this.name}`);
    return response;
  },
};
