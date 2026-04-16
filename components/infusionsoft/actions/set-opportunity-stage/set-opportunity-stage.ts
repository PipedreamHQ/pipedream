import infusionsoft from "../../app/infusionsoft.app";
import { defineAction } from "@pipedream/types";

export default defineAction({
  name: "Set Opportunity Stage",
  description:
    "Set the stage of an opportunity in Keap CRM. [See the documentation](https://developer.infusionsoft.com/docs/rest/#tag/Opportunity/operation/updatePropertiesOnOpportunity)",
  key: "infusionsoft-set-opportunity-stage",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    infusionsoft,
    opportunityId: {
      propDefinition: [
        infusionsoft,
        "opportunityId",
      ],
    },
    stageId: {
      propDefinition: [
        infusionsoft,
        "stageId",
      ],
    },
  },
  async run({ $ }): Promise<object> {
    const opportunityId = String(this.opportunityId ?? "").trim();
    const stageId = String(this.stageId ?? "").trim();

    if (!opportunityId) {
      throw new Error("Opportunity ID is required");
    }
    if (!stageId) {
      throw new Error("Stage ID is required");
    }

    const result = await this.infusionsoft.setOpportunityStage({
      $,
      opportunityId,
      stageId,
    });

    $.export(
      "$summary",
      `Successfully set opportunity ${opportunityId} to stage ${stageId}`,
    );

    return result;
  },
});
