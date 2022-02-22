// legacy_hash_id: a_RAiabk
import { axios } from "@pipedream/platform";

export default {
  key: "webflow-create-live-collection-item",
  name: "Create Live Item",
  description: "Create new live collection item",
  version: "0.2.1",
  type: "action",
  props: {
    webflow: {
      type: "app",
      app: "webflow",
    },
    collection_id: {
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
      optional: true,
    },
    _draft: {
      type: "boolean",
      optional: true,
    },
  },
  async run({ $ }) {

    return await axios($, {
      method: "post",
      url: `https://api.webflow.com/collections/${this.collection_id}/items?live=true`,

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
          _archived: this._archived || false,
          _draft: this._draft || false,
        },
      },
    });
  },
};
