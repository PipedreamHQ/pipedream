// legacy_hash_id: a_67iL6R
import { axios } from "@pipedream/platform";

export default {
  key: "xero_accounting_api-get-contact",
  name: "Get Contact",
  description: "Gets details of a contact.",
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
      description: "Xero identifier of the contact to get. Possible values: \n* **ContactID** - The Xero identifier for a contact e.g. 297c2dc5-cc47-4afd-8ec8-74990b8761e9\n* **ContactNumber** -  A custom identifier specified from another system e.g. a CRM system has a contact number of CUST100",
    },
  },
  async run({ $ }) {
  //See the API docs: https://developer.xero.com/documentation/api/contacts

    if (!this.tenant_id || !this.contact_identifier) {
      throw new Error("Must provide tenant_id, contact_identifier parameters.");
    }

    return await axios($, {
      url: `https://api.xero.com/api.xro/2.0/Contacts/${this.contact_identifier}`,
      headers: {
        "Authorization": `Bearer ${this.xero_accounting_api.$auth.oauth_access_token}`,
        "xero-tenant-id": this.tenant_id,
      },
    });
  },
};
