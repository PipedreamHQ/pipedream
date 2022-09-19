// legacy_hash_id: a_G1iLx4
import { axios } from "@pipedream/platform";

export default {
  key: "activecampaign-get-contact",
  name: "Get Contact",
  description: "Retrieves an existing contact.",
  version: "0.1.2",
  type: "action",
  props: {
    activecampaign: {
      type: "app",
      app: "activecampaign",
    },
    contact_id: {
      type: "string",
      description: "ID of the contact to retrieve.",
    },
  },
  async run({ $ }) {
  // See the API docs: https://developers.activecampaign.com/reference#get-contact

    if (!this.contact_id) {
      throw new Error("Must provide contact_id parameter.");
    }

    const config = {
      url: `${this.activecampaign.$auth.base_url}/api/3/contacts/${this.contact_id}`,
      headers: {
        "Api-Token": `${this.activecampaign.$auth.api_key}`,
      },
    };

    return await axios($, config);
  },
};
