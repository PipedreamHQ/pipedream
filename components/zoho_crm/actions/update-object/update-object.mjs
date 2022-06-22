// legacy_hash_id: a_m8ij5b
import { axios } from "@pipedream/platform";

export default {
  key: "zoho_crm-update-object",
  name: "Update Object",
  description: "Updates existing entities in the module.",
  version: "0.2.2",
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
    object_id: {
      type: "string",
      description: "Id of the record object to update.",
    },
    object: {
      type: "object",
      description: "The  record object with fields to update.",
    },
  },
  async run({ $ }) {
  //See Zoho CRM API docs at: https://www.zoho.com/crm/developer/docs/api/v2/update-records.html

    if (!this.module || !this.object_id || !this.object) {
      throw new Error("Must provide module, object_id, and object parameters.");
    }

    return await axios($, {
      method: "put",
      url: `${this.zoho_crm.$auth.api_domain}/crm/v2/${this.module}`,
      data: {
        data: [
          {
            ...this.object,
            id: this.object_id,
          },
        ],
      },
      headers: {
        "Authorization": `Zoho-oauthtoken ${this.zoho_crm.$auth.oauth_access_token}`,
      },
    });
  },
};
