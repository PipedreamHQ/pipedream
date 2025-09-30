import pipeline from "../../pipeline.app.mjs";

export default {
  name: "Create Deal",
  key: "pipeline-create-deal",
  description: "Creates a new deal in your Pipeline account. [See the docs here](https://app.pipelinecrm.com/api/docs#tag/Deals/paths/~1deals/post)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    pipeline,
    name: {
      propDefinition: [
        pipeline,
        "name",
      ],
      description: "The name of the deal",
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

    const response = await this.pipeline.createDeal({
      data,
      $,
    });

    $.export("$summary", `Successfully created Deal with ID ${response.id}.`);

    return response;
  },
};
