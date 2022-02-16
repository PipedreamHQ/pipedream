// legacy_hash_id: a_RAiXXm
import { axios } from "@pipedream/platform";

export default {
  key: "mautic-delete-company",
  name: "Delete Company",
  description: "Deletes a company.",
  version: "0.1.1",
  type: "action",
  props: {
    mautic: {
      type: "app",
      app: "mautic",
    },
    company_id: {
      type: "string",
      description: "ID of the company to get details.",
    },
  },
  async run({ $ }) {
  //See the API docs: https://developer.mautic.org/#delete-company

    if (!this.company_id) {
      throw new Error("Must provide company_id parameter.");
    }

    return await axios($, {
      method: "delete",
      url: `${this.mautic.$auth.mautic_url}/api/companies/${this.company_id}/delete`,
      headers: {
        Authorization: `Bearer ${this.mautic.$auth.oauth_access_token}`,
      },
    });
  },
};
