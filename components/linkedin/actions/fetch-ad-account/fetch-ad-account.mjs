// legacy_hash_id: a_zNiO0V
import { axios } from "@pipedream/platform";

export default {
  key: "linkedin-fetch-ad-account",
  name: "Fetch Ad Account",
  description: "Fetches an individual adAccount given its id.",
  version: "0.1.1",
  type: "action",
  props: {
    linkedin: {
      type: "app",
      app: "linkedin",
    },
    ad_account_id: {
      type: "string",
      description: "ID of the adAccount to fetch.",
    },
  },
  async run({ $ }) {
  //See the API docs here: https://docs.microsoft.com/en-us/linkedin/marketing/integrations/ads/account-structure/create-and-manage-accounts#fetch-ad-account

    if (!this.ad_account_id) {
      throw new Error("Must provide ad_account_id parameter.");
    }

    return await axios($, {
      url: `https://api.linkedin.com/v2/adAccountsV2/${this.ad_account_id}`,
      headers: {
        Authorization: `Bearer ${this.linkedin.$auth.oauth_access_token}`,
      },
    });
  },
};
