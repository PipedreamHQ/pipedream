// legacy_hash_id: a_vgipdq
import { axios } from "@pipedream/platform";

export default {
  key: "mautic-get-campaign",
  name: "Get Campaign",
  description: "Gets an individual campaign by ID.",
  version: "0.1.1",
  type: "action",
  props: {
    mautic: {
      type: "app",
      app: "mautic",
    },
    campaign_id: {
      type: "string",
      description: "ID of the campaign to get details.",
    },
  },
  async run({ $ }) {
  //See the API docs: https://developer.mautic.org/#get-campaign

    if (!this.campaign_id) {
      throw new Error("Must provide campaign_id parameter.");
    }

    return await axios($, {
      method: "get",
      url: `${this.mautic.$auth.mautic_url}/api/campaigns/${this.campaign_id}`,
      headers: {
        Authorization: `Bearer ${this.mautic.$auth.oauth_access_token}`,
      },
    });
  },
};
