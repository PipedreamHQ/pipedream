// legacy_hash_id: a_OOiaG4
import { axios } from "@pipedream/platform";

export default {
  key: "webflow-update-collection-item",
  name: "Update Item",
  description: "Update collection item",
  version: "0.1.1",
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
    name: {
      type: "string",
    },
    slug: {
      type: "string",
    },
    _archived: {
      type: "boolean",
    },
    _draft: {
      type: "boolean",
    },
  },
  async run({ $ }) {

    return await axios($, {
      method: "put",
      url: `https://api.webflow.com/collections/${this.collection_id}/items/${this.item_id}`,

      headers: {
        "Authorization": `Bearer ${this.webflow.$auth.oauth_access_token}`,
        "Content-Type": "application/json",
        "Accept": "application/json",
        "accept-version": "1.0.0",
      },
      data: {
        fields: {
          name: this.name,
          slug: this.slug,
          _archived: this._archived,
          _draft: this._draft,
        },
      },
    });
  },
};
