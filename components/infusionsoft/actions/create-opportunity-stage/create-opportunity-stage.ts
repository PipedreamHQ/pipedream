import infusionsoft from "../../app/infusionsoft.app";
import { defineAction } from "@pipedream/types";
import { CreateOpportunityStageParams } from "../../types/requestParams";

export default defineAction({
  name: "Create Opportunity Stage",
  description:
    "Create a new opportunity stage in Keap CRM. [See the documentation](https://developer.infusionsoft.com/docs/restv2/#tag/Opportunity/operation/createOpportunityStage)",
  key: "infusionsoft-create-opportunity-stage",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    infusionsoft,
    name: {
      type: "string",
      label: "Stage Name",
      description: "The name of the opportunity stage",
      optional: false,
    },
    order: {
      type: "string",
      label: "Order",
      description: "The display order of the stage in the pipeline (integer)",
      optional: false,
    },
    probability: {
      type: "string",
      label: "Probability (%)",
      description: "The probability percentage of closing a deal at this stage (0-100)",
      optional: false,
    },
    targetNumberDays: {
      type: "string",
      label: "Target Number of Days",
      description: "The target number of days an opportunity should spend in this stage",
      optional: false,
    },
    checklistItems: {
      type: "string",
      label: "Checklist Items",
      description:
        "Optional: JSON array of checklist items. Example: [{\"description\": \"Send proposal\", \"order\": 1, \"required\": true}]",
      optional: true,
    },
  },
  async run({ $ }): Promise<object> {
    const stageOrder = parseInt(String(this.order), 10);
    if (isNaN(stageOrder)) throw new Error("Order must be a valid integer");

    const stageProbability = parseInt(String(this.probability), 10);
    if (isNaN(stageProbability) || stageProbability < 0 || stageProbability > 100) {
      throw new Error("Probability must be between 0 and 100");
    }

    const targetDays = parseInt(String(this.targetNumberDays), 10);
    if (isNaN(targetDays) || targetDays < 0) {
      throw new Error("Target number of days must be a valid non-negative integer");
    }

    const params: CreateOpportunityStageParams = {
      $,
      name: this.name,
      order: this.order,
      probability: this.probability,
      targetNumberDays: this.targetNumberDays,
      checklistItems: this.checklistItems,
    };

    const result = await this.infusionsoft.createOpportunityStage(params);

    $.export(
      "$summary",
      `Successfully created opportunity stage "${this.name}"`,
    );

    return result;
  },
});
