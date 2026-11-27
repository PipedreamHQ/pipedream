import cavyro from "../../cavyro.app.mjs";
import { parseObject } from "../../common/utils.mjs";

export default {
  key: "cavyro-create-deal",
  name: "Create Deal",
  description: "Create a new deal in a Cavyro pipeline."
    + " Use **List Pipelines** to find `pipelineId`, then **Get Pipeline** to find a `stageId` in that pipeline."
    + " Link records with **List Companies**, **Find Contact** and **List Members**; use **List Custom Fields** for required custom fields."
    + " Use **Update Deal** to change the deal later."
    + " [See the documentation](https://developers.cavyro.com)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    cavyro,
    pipelineId: {
      propDefinition: [
        cavyro,
        "pipelineId",
      ],
    },
    stageId: {
      propDefinition: [
        cavyro,
        "stageId",
        (c) => ({
          pipelineId: c.pipelineId,
        }),
      ],
    },
    title: {
      propDefinition: [
        cavyro,
        "title",
      ],
    },
    value: {
      propDefinition: [
        cavyro,
        "value",
      ],
    },
    currency: {
      propDefinition: [
        cavyro,
        "currency",
      ],
    },
    companyId: {
      propDefinition: [
        cavyro,
        "companyId",
      ],
    },
    contactIds: {
      propDefinition: [
        cavyro,
        "contactIds",
      ],
    },
    assigneeIds: {
      propDefinition: [
        cavyro,
        "assigneeIds",
      ],
    },
    expectedCloseDate: {
      propDefinition: [
        cavyro,
        "expectedCloseDate",
      ],
    },
    description: {
      propDefinition: [
        cavyro,
        "description",
      ],
    },
    customFields: {
      propDefinition: [
        cavyro,
        "customFields",
      ],
    },
  },
  async run({ $ }) {
    const deal = await this.cavyro.createDeal({
      $,
      pipelineId: this.pipelineId,
      data: {
        deal: {
          title: this.title,
          pipeline_stage_id: this.stageId,
          value: this.value,
          currency: this.currency,
          company_id: this.companyId,
          contact_ids: this.contactIds,
          assignee_ids: this.assigneeIds,
          expected_close_date: this.expectedCloseDate,
          description: this.description,
          custom_fields: parseObject(this.customFields),
        },
      },
    });
    $.export("$summary", `Created deal ${deal.id}: ${deal.title} (${deal.stage?.name})`);
    return deal;
  },
};
