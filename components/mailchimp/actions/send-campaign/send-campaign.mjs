// legacy_hash_id: a_Xzi2bx
import { axios } from "@pipedream/platform";

export default {
  key: "mailchimp-send-campaign",
  name: "Send a Campaign",
  description: "Sends a campaign draft to the audience signed up for the campaign.",
  version: "0.2.1",
  type: "action",
  props: {
    mailchimp: {
      type: "app",
      app: "mailchimp",
    },
    campaign_id: {
      type: "string",
      description: "The unique id for the campaign.",
    },
  },
  async run({ $ }) {
    let campaignId = this.campaign_id;

    return await axios($, {
      url: `https://${this.mailchimp.$auth.dc}.api.mailchimp.com/3.0/campaigns/${campaignId}/actions/send`,
      headers: {
        Authorization: `Bearer ${this.mailchimp.$auth.oauth_access_token}`,
      },
      method: "POST",
    });
  },
};
