import mailchimp from "../../mailchimp.app.mjs";

export default {
  key: "mailchimp-send-campaign",
  name: "Send a Campaign",
  description: "Sends a campaign draft to the audience signed up for the campaign. [See docs here](https://mailchimp.com/developer/marketing/api/campaigns/send-campaign/)",
  version: "0.2.2",
  type: "action",
  props: {
    mailchimp,
    campaignId: {
      label: "Campaign ID",
      type: "string",
      description: "The unique ID for the campaign.",
    },
  },
  async run({ $ }) {
    return await this.mailchimp.sendCampaign($, this.campaignId);
  },
};
