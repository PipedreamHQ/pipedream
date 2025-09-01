import hubspot from "../../hubspot.app.mjs";

export default {
  key: "hubspot-retrieve-migrated-workflow-mappings",
  name: "Retrieve Migrated Workflow Mappings",
  description: "Retrieve mappings for migrated workflows. [See the documentation](https://developers.hubspot.com/docs/api-reference/legacy/create-manage-workflows-v3/get-automation-v3-workflows)",
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
  },
  async run({ $ }) {
    const response = await this.hubspot.getMigratedWorkflowMappings({
      workflowId: this.workflowId,
      $,
    });

    $.export("$summary", `Successfully retrieved migrated workflow mappings for ${this.workflowId}`);
    return response;
  },
};
