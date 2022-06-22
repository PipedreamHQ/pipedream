// legacy_hash_id: a_poizYA
import { axios } from "@pipedream/platform";

export default {
  key: "zoho_crm-list-fields",
  name: "List Fields",
  description: "Gets the field metadata for the specified module",
  version: "0.1.2",
  type: "action",
  props: {
    zoho_crm: {
      type: "app",
      app: "zoho_crm",
    },
    module: {
      type: "string",
      description: "Module name to get the field metadata for.",
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
  },
  async run({ $ }) {
  //See Zoho CRM API docs at: https://www.zoho.com/crm/developer/docs/api/v2/field-meta.html

    if (!this.module) {
      throw new Error("Must provide module parameter.");
    }

    return await axios($, {
      url: `${this.zoho_crm.$auth.api_domain}/crm/v2/settings/fields`,
      params: {
        module: this.module,
      },
      headers: {
        "Authorization": `Zoho-oauthtoken ${this.zoho_crm.$auth.oauth_access_token}`,
      },
    });
  },
};
