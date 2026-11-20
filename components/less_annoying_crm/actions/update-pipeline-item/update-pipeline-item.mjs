import { ConfigurationError } from "@pipedream/platform";
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
      description: "The ID of the pipeline item (lead) to update (a long numeric string, e.g. `1234567890123456789012345678903`). Use **Search Pipeline Items** to find it (the `PipelineItemId` field).",
    },
    statusId: {
      propDefinition: [
        app,
        "statusId",
      ],
      description: "ID of the status to move the item to (a long numeric string, e.g. `1234567890123456789012345678905`). Must belong to the item's pipeline. Use **List Pipelines** to find it (the `StatusId` field of each entry in `Statuses`).",
      optional: true,
    },
    note: {
      propDefinition: [
        app,
        "pipelineItemNote",
      ],
      description: "Optional note shown in the item's history, e.g. the reason for the status change such as `Client approved the quote`.",
    },
    runStatusAutomation: {
      propDefinition: [
        app,
        "runStatusAutomation",
      ],
      description: "If the status changes, run the new status's automation, e.g. `true`. Defaults to false.",
    },
  },
  async run({ $ }) {
    if (!this.statusId && !this.note) {
      throw new ConfigurationError("Provide a status ID and/or a note to update.");
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
