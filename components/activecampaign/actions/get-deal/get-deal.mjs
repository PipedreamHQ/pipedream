// legacy_hash_id: a_l0i8kA
import { axios } from "@pipedream/platform";

export default {
  key: "activecampaign-get-deal",
  name: "Get Deal",
  description: "Retrieves an existing deal.",
  version: "0.1.2",
  type: "action",
  props: {
    activecampaign: {
      type: "app",
      app: "activecampaign",
    },
    deal_id: {
      type: "string",
      description: "ID of the deal to retrieve.",
    },
  },
  async run({ $ }) {
  // See the API docs: https://developers.activecampaign.com/reference#retrieve-a-deal

    if (!this.deal_id) {
      throw new Error("Must provide deal_id parameter.");
    }

    const config = {
      url: `${this.activecampaign.$auth.base_url}/api/3/deals/${this.deal_id}`,
      headers: {
        "Api-Token": `${this.activecampaign.$auth.api_key}`,
      },
    };

    return await axios($, config);
  },
};
