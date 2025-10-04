import lemlist from "../../lemlist.app.mjs";

export default {
  key: "lemlist-unsubscribe-lead-from-a-campaign",
  name: "Unsubscribe Lead From Campaign",
  description: "This action will unsubscribe a lead from all campaigns if he belongs to the specified campaign. [See the docs here](https://developer.lemlist.com/#unsubscribe-a-lead-from-a-campaign)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
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
    const response = await this.lemlist.removeLeadFromACampaign({
      $,
      email: this.campaignEmail,
      campaignId: this.campaignId.value,
    });

    $.export("$summary", `Successfully unsubscribed ${this.campaignEmail} lead from ${this.campaignId.label} campaign!`);
    return response;
  },
};

