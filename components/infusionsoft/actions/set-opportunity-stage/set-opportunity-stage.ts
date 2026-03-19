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
    const result = await this.infusionsoft.setOpportunityStage({
      $,
      opportunityId: String(this.opportunityId ?? ""),
      stageId: String(this.stageId ?? ""),
    });

    $.export(
      "$summary",
      `Successfully set opportunity ${this.opportunityId} to stage ${this.stageId}`,
    );

    return result;
  },
});
