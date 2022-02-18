// legacy_hash_id: a_Jmi5vk
import { axios } from "@pipedream/platform";

export default {
  key: "zoho_crm-create-object",
  name: "Create Object",
  description: "Adds new object to a module.",
  version: "0.2.1",
  type: "action",
  props: {
    zoho_crm: {
      type: "app",
      app: "zoho_crm",
    },
    module: {
      type: "string",
      description: "Module where the record will be created.",
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
    object: {
      type: "object",
      description: "The new object data.",
    },
  },
  async run({ $ }) {
  //See Zoho CRM API docs at: https://www.zoho.com/crm/developer/docs/api/v2/insert-records.html

    if (!this.module || !this.object) {
      throw new Error("Must provide module, and object parameters.");
    }

    return await axios($, {
      method: "post",
      url: `https://www.zohoapis.com/crm/v2/${this.module}`,
      data: {
        data: [
          {
            ...this.object,
          },
        ],
      },
      headers: {
        "Authorization": `Zoho-oauthtoken ${this.zoho_crm.$auth.oauth_access_token}`,
      },
    });
  },
};
