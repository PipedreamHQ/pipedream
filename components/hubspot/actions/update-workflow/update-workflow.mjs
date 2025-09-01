import hubspot from "../../hubspot.app.mjs";

export default {
  key: "hubspot-update-workflow",
  name: "Update a Workflow",
  description: "Update an existing workflow. [See the documentation](https://developers.hubspot.com/docs/api-reference/legacy/create-manage-workflows-v3/get-automation-v3-workflows)",
  version: "0.0.1",
  type: "action",
  props: {
    hubspot,
    workflowId: {
      propDefinition: [
        hubspot,
        "workflowId",
      ],
    },
    name: {
      type: "string",
      label: "Workflow Name",
      description: "The new name of the workflow",
      optional: true,
    },
    description: {
      type: "string",
      label: "Description",
      description: "The new description of the workflow",
      optional: true,
    },
    type: {
      type: "string",
      label: "Workflow Type",
      description: "The new type of workflow",
      optional: true,
      options: [
        {
          label: "DRIP",
          value: "DRIP",
        },
        {
          label: "SIMPLE",
          value: "SIMPLE",
        },
        {
          label: "COMPLEX",
          value: "COMPLEX",
        },
      ],
    },
    triggerType: {
      type: "string",
      label: "Trigger Type",
      description: "The new trigger type for the workflow",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      name, type, description, triggerType,
    } = this;

    const updateData = {};
    if (name) updateData.name = name;
    if (description) updateData.description = description;
    if (type) updateData.type = type;
    if (triggerType) updateData.triggerType = triggerType;

    const response = await this.hubspot.updateWorkflow({
      workflowId: this.workflowId,
      data: updateData,
      $,
    });

    $.export("$summary", `Successfully updated workflow ${this.workflowId}`);
    return response;
  },
};
