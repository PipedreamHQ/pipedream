import explorium from "../../explorium.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "explorium-enrich-business",
  name: "Enrich Business",
  description: "Enrich business data with comprehensive insights for lead generation, risk assessment, and business intelligence. [See the documentation](https://developers.explorium.ai/reference/businesses_enrichments)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    explorium,
    type: {
      type: "string",
      label: "Enrichment Type",
      description: "The type of enrichment to perform",
      options: constants.BUSINESS_ENRICHMENT_TYPES,
    },
    businessId: {
      type: "string",
      label: "Business ID",
      description: "The ID of the business to enrich",
    },
  },
  async run({ $ }) {
    const { data } = await this.explorium.enrichBusiness({
      $,
      type: this.type,
      data: {
        business_id: this.businessId,
      },
    });
    $.export("$summary", `Enriched business ${this.businessId} with ${this.type}`);
    return data;
  },
};
