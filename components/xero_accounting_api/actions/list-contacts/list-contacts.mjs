// legacy_hash_id: a_Q3ixRN
import { axios } from "@pipedream/platform";

export default {
  key: "xero_accounting_api-list-contacts",
  name: "List Contacts",
  description: "Lists information from contacts in the given tenant id as per filter parameters.",
  version: "0.1.1",
  type: "action",
  props: {
    xero_accounting_api: {
      type: "app",
      app: "xero_accounting_api",
    },
    tenant_id: {
      type: "string",
      description: "Id of the organization tenant to use on the Xero Accounting API. See [Get Tenant Connections](https://pipedream.com/@sergio/xero-accounting-api-get-tenant-connections-p_OKCzOgn/edit) for a workflow example on how to pull this data.",
    },
    contact_identifier: {
      type: "string",
      description: "A contact identifier. Possible values: \n* **ContactID** - The Xero identifier for a contact e.g. 297c2dc5-cc47-4afd-8ec8-74990b8761e9\n* **ContactNumber** -  A custom identifier specified from another system e.g. a CRM system has a contact number of CUST100",
      optional: true,
    },
    modified_after: {
      type: "string",
      optional: true,
    },
    ids: {
      type: "string",
      description: "Filter by a comma-separated list of ContactIDs. Allows you to retrieve a specific set of contacts in a single call. See [details.](https://developer.xero.com/documentation/api/contacts#optimised-queryparameters)",
      optional: true,
    },
    where: {
      type: "string",
      description: "Filter using the where parameter. We recommend you limit filtering to the [optimised elements](https://developer.xero.com/documentation/api/contacts#optimised-parameters) only.",
      optional: true,
    },
    order: {
      type: "string",
      description: "Order by any element returned ([*see Order By.*](https://developer.xero.com/documentation/api/requests-and-responses#ordering))",
      optional: true,
    },
    page: {
      type: "string",
      description: "Up to 100 contacts will be returned per call when the page parameter is used e.g. page=1.",
      optional: true,
    },
    includeArchived: {
      type: "boolean",
      description: "e.g. includeArchived=true - Contacts with a status of ARCHIVED will be included in the response.",
      optional: true,
    },
  },
  async run({ $ }) {
  //See the API docs: https://developer.xero.com/documentation/api/contacts

    if (!this.tenant_id) {
      throw new Error("Must provide tenant_id parameter.");
    }

    const contactIdentifier = this.contact_identifier || "";

    var headers = {
      "Authorization": `Bearer ${this.xero_accounting_api.$auth.oauth_access_token}`,
      "xero-tenant-id": this.tenant_id,
    };

    if (this.modified_after) {
      headers["If-Modified-Since"] = this.modified_after;
    }

    return await axios($, {
      url: `https://api.xero.com/api.xro/2.0/Contacts/${contactIdentifier}`,
      headers,
      params: {
        IDs: this.ids,
        Where: this.where,
        order: this.order,
        page: this.page,
        includeArchived: this.includeArchived,
      },
    });
  },
};
