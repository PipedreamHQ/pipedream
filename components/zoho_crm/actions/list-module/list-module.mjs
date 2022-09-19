// legacy_hash_id: a_a4ivj1
import { axios } from "@pipedream/platform";

export default {
  key: "zoho_crm-list-module",
  name: "List Modules",
  description: "Retrieves a list of all the modules available in your CRM account.",
  version: "0.1.2",
  type: "action",
  props: {
    zoho_crm: {
      type: "app",
      app: "zoho_crm",
    },
  },
  async run({ $ }) {
  //See Zoho CRM API docs at: https://www.zoho.com/crm/developer/docs/api/v2/modules-api.html

    return await axios($, {
      url: `${this.zoho_crm.$auth.api_domain}/crm/v2/settings/modules`,
      headers: {
        "Authorization": `Zoho-oauthtoken ${this.zoho_crm.$auth.oauth_access_token}`,
      },
    });
  },
};
