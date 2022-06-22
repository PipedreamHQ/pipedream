// legacy_hash_id: a_EVi70k
import { axios } from "@pipedream/platform";

export default {
  key: "zoho_crm-list-objects",
  name: "List Objects",
  description: "Gets the list of available records from a module.",
  version: "0.1.2",
  type: "action",
  props: {
    zoho_crm: {
      type: "app",
      app: "zoho_crm",
    },
    module: {
      type: "string",
      description: "Module to get the list of available records from.",
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
    fields: {
      type: "string",
      description: "To retrieve specific field values. Comma separated field API names.",
      optional: true,
    },
    ids: {
      type: "string",
      description: "To retrieve specific records based on their unique ID.",
      optional: true,
    },
    sort_order: {
      type: "string",
      description: "To sort the list of records in either ascending or descending order.",
      optional: true,
      options: [
        "asc",
        "desc",
      ],
    },
    sort_by: {
      type: "string",
      description: "Specify the API name of the field based on which the records must be sorted.",
      optional: true,
    },
    converted: {
      type: "string",
      description: "To retrieve the list of converted records.",
      optional: true,
      options: [
        "false",
        "true",
        "both",
      ],
    },
    approved: {
      type: "string",
      description: "To retrieve the list of approved records.",
      optional: true,
      options: [
        "false",
        "true",
        "both",
      ],
    },
    page: {
      type: "string",
      description: "To get the list of records from the respective pages.",
      optional: true,
    },
    per_page: {
      type: "string",
      description: "To get the list of records available per page.",
      optional: true,
    },
    cvid: {
      type: "string",
      description: "To get the list of records in a custom view.",
      optional: true,
    },
    territory_id: {
      type: "string",
      description: "To get the list of records in a territory.",
      optional: true,
    },
    include_child: {
      type: "boolean",
      description: "To include records from the child territories",
      optional: true,
    },
  },
  async run({ $ }) {
  //See Zoho CRM API docs at: https://www.zoho.com/crm/developer/docs/api/v2/get-records.html

    if (!this.module) {
      throw new Error("Must provide module parameter.");
    }

    return await axios($, {
      url: `${this.zoho_crm.$auth.api_domain}/crm/v2/${this.module}`,
      params: {
        fields: this.fields,
        ids: this.ids,
        sort_order: this.sort_order,
        sort_by: this.sort_by,
        converted: this.converted,
        approved: this.approved,
        page: this.page,
        per_page: this.per_page,
        cvid: this.cvid,
        territory_id: this.territory_id,
        include_child: this.include_child,
      },
      headers: {
        "Authorization": `Zoho-oauthtoken ${this.zoho_crm.$auth.oauth_access_token}`,
      },
    });
  },
};
