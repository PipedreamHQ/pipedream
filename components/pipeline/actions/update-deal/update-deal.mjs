import pipeline from "../../pipeline.app.mjs";

export default {
  name: "Update Deal",
  key: "pipeline-update-deal",
  description: "Updates a deal in your Pipeline account. [See the docs here](https://app.pipelinecrm.com/api/docs#tag/Deals/paths/~1deals~1{id}/put)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    pipeline,
    dealId: {
      propDefinition: [
        pipeline,
        "dealId",
      ],
      optional: false,
    },
    name: {
      propDefinition: [
        pipeline,
        "name",
      ],
      description: "The name of the deal",
      optional: true,
    },
    userId: {
      propDefinition: [
        pipeline,
        "userId",
      ],
    },
    primaryContactId: {
      propDefinition: [
        pipeline,
        "personId",
      ],
    },
    dealStatusId: {
      propDefinition: [
        pipeline,
        "dealStatusId",
      ],
      optional: true,
    },
    dealStageId: {
      propDefinition: [
        pipeline,
        "dealStageId",
      ],
    },
    summary: {
      propDefinition: [
        pipeline,
        "summary",
      ],
    },
  },
  async run({ $ }) {
    const data = {
      deal: {
        name: this.name,
        user_id: this.userId,
        primary_contact_id: this.primaryContactId,
        status: this.dealStatusId,
        deal_stage_id: this.dealStageId,
        summary: this.summary,
      },
    };

    const response = await this.pipeline.updateDeal(this.dealId, {
      data,
      $,
    });

    $.export("$summary", `Successfully updated Deal with ID ${response.id}.`);

    return response;
  },
};
