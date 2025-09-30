import pipeline from "../../pipeline.app.mjs";

export default {
  name: "Find Deal",
  key: "pipeline-find-deal",
  description: "Find an existing deal in your Pipeline account. [See the docs here](https://app.pipelinecrm.com/api/docs#tag/Deals/paths/~1deals/get)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    pipeline,
    dealId: {
      propDefinition: [
        pipeline,
        "dealId",
      ],
    },
    name: {
      propDefinition: [
        pipeline,
        "name",
      ],
      description: "Returns records that match a LIKE query on the name field",
      optional: true,
    },
    stageId: {
      propDefinition: [
        pipeline,
        "dealStageId",
      ],
    },
  },
  async run({ $ }) {
    const data = {
      conditions: {
        deal_id: this.dealId,
        deal_name: this.name,
        deal_stage: this.stageId,
      },
    };

    const { results: deals } = await this.pipeline.paginate(this.pipeline.listDeals, {
      data,
      $,
    });

    $.export("$summary", `Found ${deals.length} matching deal${deals.length === 1
      ? ""
      : "s"}.`);

    return deals;
  },
};
