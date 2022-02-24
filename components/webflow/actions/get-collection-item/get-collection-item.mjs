// legacy_hash_id: a_A6iPGB
import { axios } from "@pipedream/platform";

export default {
  key: "webflow-get-collection-item",
  name: "Get a collection item",
  version: "0.1.2",
  type: "action",
  props: {
    webflow: {
      type: "app",
      app: "webflow",
    },
    collection_id: {
      type: "string",
    },
    item_id: {
      type: "string",
    },
  },
  async run({ $ }) {
    const request = {
      method: "get",
      url: `https://api.webflow.com/collections/${this.collection_id}/items/${this.item_id}`,

      headers: {
        "Authorization": `Bearer ${this.webflow.$auth.oauth_access_token}`,
        "Content-Type": "application/json",
        "accept-version": "1.0.0",
      },
    };
    $.export("request", request);
    const response = await axios($, request);
    $.export("response", response);
    $.export("item", response.items[0]);
  },
};
