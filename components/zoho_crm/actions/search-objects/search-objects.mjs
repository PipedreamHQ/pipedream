// legacy_hash_id: a_LgiEW2
import { axios } from "@pipedream/platform";

export default {
  key: "zoho_crm-search-objects",
  name: "Search Objects",
  description: "Retrieves the records that match your search criteria.",
  version: "0.1.2",
  type: "action",
  props: {
    zoho_crm: {
      type: "app",
      app: "zoho_crm",
    },
    module: {
      type: "string",
      description: "Record objects will be search in this module.",
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
    criteria: {
      type: "string",
      description: "Performs search by this criteria.",
    },
  },
  async run({ $ }) {
  //See Zoho CRM API docs at: https://www.zoho.com/crm/developer/docs/api/v2/search-records.html

    if (!this.module || !this.criteria) {
      throw new Error("Must provide module, and criteria parameters.");
    }

    return await axios($, {
      url: `${this.zoho_crm.$auth.api_domain}/crm/v2/${this.module}/search`,
      params: {
        criteria: this.criteria,
      },
      headers: {
        "Authorization": `Zoho-oauthtoken ${this.zoho_crm.$auth.oauth_access_token}`,
      },
    });
  },
};
