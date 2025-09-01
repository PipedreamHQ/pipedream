import hubspot from "../../hubspot.app.mjs";

export default {
  key: "hubspot-create-workflow",
  name: "Create a New Workflow",
  description: "Create a new workflow. [See the documentation](https://developers.hubspot.com/docs/api-reference/legacy/create-manage-workflows-v3/get-automation-v3-workflows)",
  version: "0.0.21",
  type: "action",
  props: {
    hubspot,
    name: {
      type: "string",
      label: "Workflow Name",
      description: "The name of the workflow to create",
    },
    type: {
      type: "string",
      label: "Workflow Type",
      description: "The type of workflow to create",
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
    description: {
      type: "string",
      label: "Description",
      description: "Description of the workflow",
      optional: true,
    },
    triggerType: {
      type: "string",
      label: "Trigger Type",
      description: "The type of trigger for the workflow",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      name, type, description, triggerType,
    } = this;

    const workflowData = {
      name,
      type,
      ...(description && {
        description,
      }),
      ...(triggerType && {
        triggerType,
      }),
    };

    const response = await this.hubspot.createWorkflow({
      data: workflowData,
      $,
    });

    $.export("$summary", `Successfully created workflow: ${name}`);
    return response;
  },
};
