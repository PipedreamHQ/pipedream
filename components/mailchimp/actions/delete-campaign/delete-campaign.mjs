import mailchimp from "../../mailchimp.app.mjs";

export default {
  key: "mailchimp-delete-campaign",
  name: "Delete Campaign",
  description: "Delete a specific campaign. [See docs here](https://mailchimp.com/developer/marketing/api/campaigns/delete-campaign/)",
  version: "0.0.1",
  type: "action",
  props: {
    mailchimp,
    campaignId: {
      type: "string",
      label: "Campaign ID",
      description: "The unique id for the campaign",
    },
  },
  async run({ $ }) {
    const {  campaignId } = this;
    const response = await this.mailchimp.deleteCampaign($, campaignId);
    response && $.export("$summary", "Campaign deleted");
    return response;
  },
};
