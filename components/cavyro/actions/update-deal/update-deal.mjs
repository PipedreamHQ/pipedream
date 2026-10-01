import { ConfigurationError } from "@pipedream/platform";
import cavyro from "../../cavyro.app.mjs";
import { parseObject } from "../../common/utils.mjs";

export default {
  key: "cavyro-update-deal",
  name: "Update Deal",
  description: "Update a deal in Cavyro: its fields, its status (`open`, `won`, `lost`), and/or its stage."
    + " Use **List Deals** to find `dealId`. To move the deal, give its current pipeline in `pipelineId` and a stage from **Get Pipeline** in `stageId`; a deal cannot move to another pipeline."
    + " A stage move and a field update are two separate requests: if the field update fails after the move, the error says so and the move stays applied."
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
    dealId: {
      propDefinition: [
        cavyro,
        "dealId",
      ],
    },
    title: {
      propDefinition: [
        cavyro,
        "title",
      ],
      optional: true,
    },
    value: {
      propDefinition: [
        cavyro,
        "value",
      ],
    },
    status: {
      type: "string",
      label: "Status",
      description: "The deal status. One of `open`, `won`, `lost`, e.g. `won`. `lost` requires `lostReason`.",
      optional: true,
      options: [
        "open",
        "won",
        "lost",
      ],
    },
    lostReason: {
      type: "string",
      label: "Lost Reason",
      description: "Why the deal was lost, e.g. `Chose a competitor`. Required when status is `lost`.",
      optional: true,
    },
    pipelineId: {
      propDefinition: [
        cavyro,
        "pipelineId",
      ],
      description: "The ID of the deal's current pipeline, e.g. `3`. Needed only to pick `stageId`. Use **List Pipelines** to find it (the `id` field).",
      optional: true,
    },
    stageId: {
      propDefinition: [
        cavyro,
        "stageId",
        (c) => ({
          pipelineId: c.pipelineId,
        }),
      ],
      description: "The ID of the stage to move the deal to, e.g. `42`. Must belong to the pipeline given in `pipelineId`. Use **Get Pipeline** to find it (the `id` field of an item in `stages`).",
      optional: true,
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
    if (this.status === "lost" && !this.lostReason) {
      throw new ConfigurationError("Provide a lost reason when setting the status to `lost`.");
    }
    let deal;
    if (this.stageId) {
      deal = await this.cavyro.moveDeal({
        $,
        dealId: this.dealId,
        data: {
          deal: {
            pipeline_stage_id: this.stageId,
          },
        },
      });
    }
    const fields = {
      title: this.title,
      value: this.value,
      status: this.status,
      lost_reason: this.lostReason,
      expected_close_date: this.expectedCloseDate,
      description: this.description,
      custom_fields: parseObject(this.customFields),
    };
    if (Object.values(fields).some((field) => field !== undefined)) {
      try {
        deal = await this.cavyro.updateDeal({
          $,
          dealId: this.dealId,
          data: {
            deal: fields,
          },
        });
      } catch (error) {
        if (!deal) {
          throw error;
        }
        throw new Error(`Moved deal ${this.dealId} to stage ${this.stageId}, but updating its fields failed; the stage move is kept. Re-run without \`stageId\` to retry only the field update. Cause: ${error.message}`);
      }
    }
    if (!deal) {
      throw new ConfigurationError("Provide at least one field to update.");
    }
    $.export("$summary", `Updated deal ${deal.id}: ${deal.title} (${deal.status}, ${deal.stage?.name})`);
    return deal;
  },
};
