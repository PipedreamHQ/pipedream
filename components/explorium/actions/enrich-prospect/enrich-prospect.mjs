import explorium from "../../explorium.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "explorium-enrich-prospect",
  name: "Enrich Prospect",
  description: "Enrich prospect records with comprehensive professional and contact information to enhance outreach and engagement strategies. [See the documentation](https://developers.explorium.ai/reference/prospects_enrichments)",
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
      options: constants.PROSPECT_ENRICHMENT_TYPES,
    },
    prospectId: {
      type: "string",
      label: "Prospect ID",
      description: "The ID of the prospect to enrich",
    },
  },
  async run({ $ }) {
    const { data } = await this.explorium.enrichProspect({
      $,
      type: this.type,
      data: {
        prospect_id: this.prospectId,
      },
    });
    $.export("$summary", `Enriched prospect ${this.prospectId} with ${this.type}`);
    return data;
  },
};
