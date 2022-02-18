// legacy_hash_id: a_Q3iRxL
import { axios } from "@pipedream/platform";

export default {
  key: "mautic-add-contact-to-campaign",
  name: "Add Contact to a Campaign",
  description: "Adds a contact to a specific campaign.",
  version: "0.1.1",
  type: "action",
  props: {
    mautic: {
      type: "app",
      app: "mautic",
    },
    campaign_id: {
      type: "string",
      description: "ID of the campaign to add a contact to.",
    },
    contact_id: {
      type: "string",
      description: "ID of the contact being added to the campaign.",
    },
  },
  async run({ $ }) {
  //See the API docs: https://developer.mautic.org/#add-contact-to-a-campaign

    if (!this.campaign_id || !this.contact_id) {
      throw new Error("Must provide campaign_id, and contact_id parameters.");
    }

    return await axios($, {
      method: "post",
      url: `${this.mautic.$auth.mautic_url}/api/campaigns/${this.campaign_id}/contact/${this.contact_id}/add`,
      headers: {
        Authorization: `Bearer ${this.mautic.$auth.oauth_access_token}`,
      },
    });
  },
};
