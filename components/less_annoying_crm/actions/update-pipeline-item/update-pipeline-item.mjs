import app from "../../less_annoying_crm.app.mjs";

export default {
  key: "less_annoying_crm-update-pipeline-item",
  name: "Update Pipeline Item",
  description: "Moves a pipeline item (lead, deal, etc.) to a new status in Less Annoying CRM and/or adds a history note. Use for \"mark the Acme lead as won\" or \"move X to Contacted\" requests."
    + " Get `pipelineItemId` from **Search Pipeline Items** (or **Get Contact Activities** with `include: [\"pipelineItems\"]`), and the target `statusId` from **List Pipelines** (statuses are specific to each pipeline)."
    + " Set `runStatusAutomation` only if the user wants the new status's automation to fire. Returns a confirmation."
    + " Example: `pipelineItemId: \"1234567890123456789012345678903\", statusId: \"1234567890123456789012345678907\", note: \"Signed contract\"` returns `{\"success\": true, \"PipelineItemId\": \"1234567890123456789012345678903\"}`."
    + " [See the documentation](https://account.lessannoyingcrm.com/api_docs/v2/Core_Functions/Pipeline_Items#Goto-EditPipelineItem)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    pipelineItemId: {
      type: "string",
      label: "Pipeline Item ID",
      description: "The ID of the pipeline item (lead) to update. Use **Search Pipeline Items** to find it.",
    },
    statusId: {
      propDefinition: [
        app,
        "statusId",
      ],
      description: "ID of the status to move the item to. Must belong to the item's pipeline. Use **List Pipelines** to find it.",
      optional: true,
    },
    note: {
      type: "string",
      label: "Note",
      description: "Optional note shown in the item's history, e.g. the reason for the status change.",
      optional: true,
    },
    runStatusAutomation: {
      type: "boolean",
      label: "Run Status Automation",
      description: "If the status changes, run the new status's automation. Defaults to false.",
      optional: true,
    },
  },
  async run({ $ }) {
    if (!this.statusId && !this.note) {
      throw new Error("Provide a status ID and/or a note to update.");
    }

    await this.app.editPipelineItem({
      $,
      parameters: {
        PipelineItemId: this.pipelineItemId,
        StatusId: this.statusId,
        Note: this.note,
        RunStatusAutomation: this.runStatusAutomation ?? false,
      },
    });

    $.export("$summary", this.statusId
      ? `Moved pipeline item ${this.pipelineItemId} to status ${this.statusId}`
      : `Updated pipeline item ${this.pipelineItemId}`);
    return {
      success: true,
      PipelineItemId: this.pipelineItemId,
    };
  },
};
