// legacy_hash_id: a_wdid0G
import { axios } from "@pipedream/platform";

export default {
  key: "zoho_crm-get-object",
  name: "Get Object",
  description: "Gets record data given its id.",
  version: "0.1.2",
  type: "action",
  props: {
    zoho_crm: {
      type: "app",
      app: "zoho_crm",
    },
    module: {
      type: "string",
      description: "Module where the record is located.",
      options: [
        "Leads",
        "Accounts",
        "Contacts",
        "Deals",
        "Campaigns",
        "Tasks",
        "Cases",
        "Events",
        "Calls",
        "Solutions",
        "Products",
        "Vendors",
        "Quotes",
        "Price_Books",
        "Quotes",
        "Sales_Orders",
        "Purchase_Orders",
        "Invoices",
        "Custom",
        "Activities",
      ],
    },
    record_id: {
      type: "string",
      description: "Id of the record to get.",
    },
  },
  async run({ $ }) {
  //See Zoho CRM API docs at: https://www.zoho.com/crm/developer/docs/api/v2/get-records.html

    if (!this.module || !this.record_id) {
      throw new Error("Must provide module, and record_id parameters.");
    }

    return await axios($, {
      url: `${this.zoho_crm.$auth.api_domain}/crm/v2/${this.module}/${this.record_id}`,
      headers: {
        "Authorization": `Zoho-oauthtoken ${this.zoho_crm.$auth.oauth_access_token}`,
      },
    });
  },
};
