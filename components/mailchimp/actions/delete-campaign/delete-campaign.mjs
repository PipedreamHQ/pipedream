import mailchimp from "../../mailchimp.app.mjs";

export default {
  key: "mailchimp-delete-campaign",
  name: "Delete Campaign",
  description: "Delete a specific campaign. [See docs here](https://mailchimp.com/developer/marketing/api/campaigns/delete-campaign/)",
  version: "0.0.3",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    mailchimp,
    campaignId: {
      propDefinition: [
        mailchimp,
        "campaignId",
      ],
    },
  },
  async run({ $ }) {
    await this.mailchimp.deleteCampaign($, this.campaignId);
    $.export("$summary", "Campaign deleted");
  },
};
