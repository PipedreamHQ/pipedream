import app from "../../current_rms.app.mjs";

export default {
  key: "current_rms-get-opportunity",
  name: "Get Opportunity",
  description: "Get one opportunity with its charge totals, and optionally its line items, assets and participants."
    + " Use **List Opportunities** to find the opportunity."
    + " [See the documentation](https://api.current-rms.com/doc#opportunities-opportunity-v2.1-releasing-june-15th-2026-get)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    app,
    opportunityId: {
      propDefinition: [
        app,
        "opportunityId",
      ],
    },
    include: {
      type: "string[]",
      label: "Include",
      description: "Related records to return, e.g. `[\"member\", \"opportunity_items\"]`.",
      options: [
        "owner",
        "member",
        "billing_address",
        "destination",
        "collection",
        "venue",
        "opportunity_surcharges",
        "participants",
        "opportunity_items",
        "item_assets",
        "return_item_assets",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const { opportunity } = await this.app.getOpportunity({
      $,
      opportunityId: this.opportunityId,
      params: {
        include: this.include,
      },
    });
    $.export("$summary", `Retrieved opportunity ${opportunity.number}: ${opportunity.subject}`);
    return opportunity;
  },
};
