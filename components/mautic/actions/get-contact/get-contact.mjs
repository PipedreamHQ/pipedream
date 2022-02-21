// legacy_hash_id: a_A6iWWa
import { axios } from "@pipedream/platform";

export default {
  key: "mautic-get-contact",
  name: "Get Contact",
  description: "Gets an individual contact by ID.",
  version: "0.1.1",
  type: "action",
  props: {
    mautic: {
      type: "app",
      app: "mautic",
    },
    contact_id: {
      type: "string",
      description: "ID of the contact to get details.",
    },
  },
  async run({ $ }) {
  //See the API docs: https://developer.mautic.org/#get-contact

    if (!this.contact_id) {
      throw new Error("Must provide contact_id parameter.");
    }

    return await axios($, {
      method: "get",
      url: `${this.mautic.$auth.mautic_url}/api/contacts/${this.contact_id}`,
      headers: {
        Authorization: `Bearer ${this.mautic.$auth.oauth_access_token}`,
      },
    });
  },
};
