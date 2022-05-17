// legacy_hash_id: a_bKilPw
import { axios } from "@pipedream/platform";

export default {
  key: "activecampaign-find-contact",
  name: "Find Contact",
  description: "Finds a contact by email address.",
  version: "0.1.2",
  type: "action",
  props: {
    activecampaign: {
      type: "app",
      app: "activecampaign",
    },
    email: {
      type: "string",
      description: "Email address of the contact you want to get.",
    },
  },
  async run({ $ }) {
  // See the API docs: https://developers.activecampaign.com/reference#list-all-contacts

    if (!this.email) {
      throw new Error("Must provide email parameter.");
    }

    const config = {
      url: `${this.activecampaign.$auth.base_url}/api/3/contacts`,
      headers: {
        "Api-Token": `${this.activecampaign.$auth.api_key}`,
      },
      params: {
        "email": this.email,
      },
    };

    return await axios($, config);
  },
};
