import lemlist from "../../lemlist.app.mjs";

export default {
  key: "lemlist-mark-lead-from-one-campaigns-as-notinterested",
  name: "Mark Lead From One Campaigns As Not Interested",
  description: "This action marks a specific lead as not interested using its email in a specific campaign. [See the docs here](https://developer.lemlist.com/#mark-as-not-interested-a-lead-in-a-specific-campaign)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    lemlist,
    campaignId: {
      propDefinition: [
        lemlist,
        "campaignId",
      ],
      withLabel: true,
    },
    campaignEmail: {
      propDefinition: [
        lemlist,
        "campaignEmail",
        (c) => ({
          campaignId: c.campaignId.value,
        }),
      ],
    },
  },
  async run({ $ }) {
    const response = await this.lemlist.markLeadInOneCampaign({
      $,
      email: this.campaignEmail,
      campaignId: this.campaignId.value,
      action: "notinterested",
    });

    $.export("$summary", `Successfully added ${this.campaignEmail} lead as not interested in ${this.campaignId.label} campaign!`);
    return response;
  },
};

