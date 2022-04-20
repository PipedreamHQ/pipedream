// legacy_hash_id: a_67iLjr
import { axios } from "@pipedream/platform";

export default {
  key: "activecampaign-get-all-lists",
  name: "Get All Lists",
  description: "Retrieves all contact lists.",
  version: "0.1.2",
  type: "action",
  props: {
    activecampaign: {
      type: "app",
      app: "activecampaign",
    },
  },
  async run({ $ }) {
  // See the API docs: https://developers.activecampaign.com/reference#retrieve-all-lists

    const config = {
      url: `${this.activecampaign.$auth.base_url}/api/3/lists`,
      headers: {
        "Api-Token": `${this.activecampaign.$auth.api_key}`,
      },
    };

    return await axios($, config);
  },
};
