import app from "../../the_magic_drip.app.mjs";

export default {
  key: "the_magic_drip-add-lead-to-campaign",
  name: "Add Lead to Campaign",
  description: "Adds a single lead to a campaign. [See the documentation]()",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    app,
    campaignId: {
      propDefinition: [
        app,
        "campaignId",
      ],
    },
    company: {
      propDefinition: [
        app,
        "company",
      ],
      optional: true,
    },
    linkedinUrl: {
      propDefinition: [
        app,
        "linkedinUrl",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.app.addLeadToCampaign({
      campaignId: this.campaignId,
      company: this.company,
      linkedinUrl: this.linkedinUrl,
    });
    $.export(
      "$summary",
      `Added ${response.totalLeadsAddedToWorkflow} lead(s) to campaign ${this.campaignId}`,
    );
    return response;
  },
};
