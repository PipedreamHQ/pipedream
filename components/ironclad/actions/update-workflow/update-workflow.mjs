import ironclad from "../../ironclad.app.mjs";

export default {
  key: "ironclad-update-workflow",
  name: "Update Workflow Metadata",
  description: "Updates the metadata of an existing workflow. [See the documentation]()/",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    ironclad,
    workflowId: {
      propDefinition: [
        "ironclad",
        "workflowId",
      ],
    },
    updatedMetadata: {
      propDefinition: [
        "ironclad",
        "updatedMetadata",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.ironclad.updateWorkflowMetadata(
      this.workflowId,
      this.updatedMetadata,
    );
    $.export("$summary", `Workflow ${this.workflowId} updated successfully`);
    return response;
  },
};
