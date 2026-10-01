import { ConfigurationError } from "@pipedream/platform";
import cavyro from "../../cavyro.app.mjs";

export default {
  key: "cavyro-update-deal",
  name: "Update Deal",
  description: "Update a deal in Cavyro, including its status or pipeline stage. [See the documentation](https://developers.cavyro.com)",
  version: "0.0.1",
  type: "action",
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
      description: "The deal status. `lost` requires a lost reason.",
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
      description: "Why the deal was lost. Required when status is `lost`.",
      optional: true,
    },
    pipelineId: {
      propDefinition: [
        cavyro,
        "pipelineId",
      ],
      description: "The deal's pipeline. Select it to choose a new stage.",
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
      description: "Move the deal to this stage. The stage must be in the deal's current pipeline.",
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
      custom_fields: this.customFields,
    };
    if (Object.values(fields).some((field) => field !== undefined)) {
      deal = await this.cavyro.updateDeal({
        $,
        dealId: this.dealId,
        data: {
          deal: fields,
        },
      });
    }
    if (!deal) {
      throw new ConfigurationError("Provide at least one field to update.");
    }
    $.export("$summary", `Updated deal ${deal.id}: ${deal.title} (${deal.status}, ${deal.stage?.name})`);
    return deal;
  },
};
