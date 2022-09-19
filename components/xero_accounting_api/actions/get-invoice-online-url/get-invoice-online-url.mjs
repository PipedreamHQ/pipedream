// legacy_hash_id: a_gniWnr
import { axios } from "@pipedream/platform";

export default {
  key: "xero_accounting_api-get-invoice-online-url",
  name: "Get Sales Invoice Online URL",
  description: "Retrieves the online sales invoice URL.",
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
    invoice_id: {
      type: "string",
      description: "Xero generated unique identifier for the invoice to retrieve its online url.",
    },
  },
  async run({ $ }) {
  //See the API docs: https://developer.xero.com/documentation/api/invoices#onlineinvoice

    if (!this.tenant_id || !this.invoice_id) {
      throw new Error("Must provide tenant_id, invoice_id parameters.");
    }

    return await axios($, {
      url: `https://api.xero.com/api.xro/2.0/Invoices/${this.invoice_id}/OnlineInvoice`,
      headers: {
        "Authorization": `Bearer ${this.xero_accounting_api.$auth.oauth_access_token}`,
        "xero-tenant-id": this.tenant_id,
      },
    });
  },
};
