// legacy_hash_id: a_bKirl1
import { axios } from "@pipedream/platform";

export default {
  key: "mautic-clone-campaign",
  name: "Clone Campaign",
  description: "Clones an existing campaign.",
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
  //See the API docs: https://developer.mautic.org/#clone-a-campaign

    if (!this.campaign_id) {
      throw new Error("Must provide campaign_id parameter.");
    }

    return await axios($, {
      method: "post",
      url: `${this.mautic.$auth.mautic_url}/api/campaigns/clone/${this.campaign_id}`,
      headers: {
        Authorization: `Bearer ${this.mautic.$auth.oauth_access_token}`,
      },
    });
  },
};
