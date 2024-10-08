import the_magic_drip from "../../the_magic_drip.app.mjs";

export default {
  key: "the_magic_drip-add-lead-to-campaign",
  name: "Add Lead to Campaign",
  description: "Adds a single lead to a campaign. [See the documentation]()",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    the_magic_drip,
    campaignId: {
      propDefinition: [
        the_magic_drip,
        "campaignId",
      ],
    },
    company: {
      propDefinition: [
        the_magic_drip,
        "company",
      ],
      optional: true,
    },
    linkedinUrl: {
      propDefinition: [
        the_magic_drip,
        "linkedinUrl",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.the_magic_drip.addLeadToCampaign({
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
