import infusionsoft from "../../app/infusionsoft.app";
import { defineAction } from "@pipedream/types";

export default defineAction({
  name: "Set Opportunity Stage",
  description:
    "Set the stage of an opportunity in Keap CRM. [See the documentation](https://developer.infusionsoft.com/docs/rest/#tag/Opportunity)",
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
      type: "string",
      label: "Opportunity ID",
      description: "The ID of the opportunity to update.",
      optional: false,
    },
    stageId: {
      type: "string",
      label: "Stage ID",
      description: "The ID of the opportunity stage to set.",
      optional: false,
    },
  },
  async run({ $ }): Promise<object> {
    const result = await this.infusionsoft.setOpportunityStage({
      $,
      opportunityId: this.opportunityId,
      stageId: this.stageId,
    });

    $.export(
      "$summary",
      `Successfully set opportunity ${this.opportunityId} to stage ${this.stageId}`,
    );

    return result;
  },
});
