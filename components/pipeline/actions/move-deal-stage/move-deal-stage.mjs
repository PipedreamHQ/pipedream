import pipeline from "../../pipeline.app.mjs";

export default {
  name: "Move Deal Stage",
  key: "pipeline-move-deal-stage",
  description: "Moves a deal to another stage Pipeline account. [See the docs here](https://app.pipelinecrm.com/api/docs#tag/Deals/paths/~1deals~1{id}/put)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
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
    dealStageId: {
      propDefinition: [
        pipeline,
        "dealStageId",
      ],
      optional: false,
    },
  },
  async run({ $ }) {
    const data = {
      deal: {
        deal_stage_id: this.dealStageId,
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
